import { supabase } from './supabase';
import type { User, LoginCredentials, RegisterData, AuthResponse, ForgotPasswordData, ResetPasswordData } from './types/auth';

export class AuthService {
  /**
   * Login user with email and password
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user || !data.session) {
        throw new Error('Login failed');
      }

      // Fetch user profile from database
      let userProfile;
      let profileError;

      const { data: existingProfile, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      if (fetchError) {
        throw new Error(`Failed to fetch user profile: ${fetchError.message}`);
      }

      // If profile doesn't exist, create it automatically
      if (!existingProfile) {
        console.log("=== CREATE USER PROFILE (LOGIN) ===");
        console.log("Auth user id:", data.user.id);
        console.log("Auth user email:", data.user.email);
        console.log("Auth user metadata:", data.user.user_metadata);

        const insertPayload = {
          id: data.user.id,
          email: data.user.email || '',
          password_hash: '', // Hashed by Supabase
          first_name: data.user.user_metadata?.first_name || '',
          last_name: data.user.user_metadata?.last_name || '',
          display_name: data.user.user_metadata?.display_name || data.user.user_metadata?.full_name || '',
          is_active: true,
          is_verified: data.user.email_confirmed_at != null,
        };

        console.log("Insert payload:", insertPayload);

        const { data: newProfile, error: createError } = await supabase
          .from('users')
          .insert(insertPayload)
          .select()
          .single();

        if (createError) {
          console.log("=== CREATE PROFILE ERROR (LOGIN) ===");
          console.log("Error object:", createError);
          console.log("Error JSON:", JSON.stringify(createError, null, 2));
          console.log("Error code:", createError.code);
          console.log("Error message:", createError.message);
          console.log("Error details:", createError.details);
          console.log("Error hint:", createError.hint);
          throw new Error(`Failed to create user profile: ${createError.message} (Code: ${createError.code})`);
        }

        console.log("Profile created successfully:", newProfile);
        userProfile = newProfile;
      } else {
        userProfile = existingProfile;
      }

      return {
        user: userProfile as User,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in: data.session.expires_in || 3600,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register new user
   */
  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
            display_name: data.display_name,
          },
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Registration failed');
      }

      // Create user profile in database
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          organization_id: data.organization_id,
          email: data.email,
          password_hash: '', // Hashed by Supabase
          first_name: data.first_name,
          last_name: data.last_name,
          display_name: data.display_name,
          is_active: true,
          is_verified: false,
        })
        .select()
        .single();

      if (profileError) {
        throw new Error('Failed to create user profile');
      }

      // Assign default role (if organization provided)
      if (data.organization_id) {
        const { data: defaultRole } = await supabase
          .from('roles')
          .select('id')
          .eq('slug', 'member')
          .eq('organization_id', data.organization_id)
          .single();

        if (defaultRole) {
          await supabase.from('user_roles').insert({
            user_id: authData.user.id,
            role_id: defaultRole.id,
          });
        }
      }

      // Get session
      const { data: sessionData } = await supabase.auth.getSession();

      return {
        user: userProfile as User,
        access_token: sessionData.session?.access_token || '',
        refresh_token: sessionData.session?.refresh_token || '',
        expires_in: sessionData.session?.expires_in || 3600,
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user || !data.session) {
        throw new Error('Token refresh failed');
      }

      // Fetch user profile from database
      let userProfile;

      const { data: existingProfile, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      if (fetchError) {
        throw new Error(`Failed to fetch user profile: ${fetchError.message}`);
      }

      // If profile doesn't exist, create it automatically
      if (!existingProfile) {
        const { data: newProfile, error: createError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email || '',
            password_hash: '', // Hashed by Supabase
            first_name: data.user.user_metadata?.first_name || '',
            last_name: data.user.user_metadata?.last_name || '',
            display_name: data.user.user_metadata?.display_name || data.user.user_metadata?.full_name || '',
            is_active: true,
            is_verified: data.user.email_confirmed_at != null,
          })
          .select()
          .single();

        if (createError) {
          throw new Error(`Failed to create user profile: ${createError.message}`);
        }

        userProfile = newProfile;
      } else {
        userProfile = existingProfile;
      }

      return {
        user: userProfile as User,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in: data.session.expires_in || 3600,
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Request password reset
   */
  static async forgotPassword(data: ForgotPasswordData): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(data: ResetPasswordData): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return null;
      }

      // Fetch user profile from database
      let userProfile;

      const { data: existingProfile, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Failed to fetch user profile:', fetchError);
        return null;
      }

      // If profile doesn't exist, create it automatically
      if (!existingProfile) {
        console.log("=== CREATE USER PROFILE (GET CURRENT USER) ===");
        console.log("Auth user id:", user.id);
        console.log("Auth user email:", user.email);
        console.log("Auth user metadata:", user.user_metadata);

        const insertPayload = {
          id: user.id,
          email: user.email || '',
          password_hash: '', // Hashed by Supabase
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          display_name: user.user_metadata?.display_name || user.user_metadata?.full_name || '',
          is_active: true,
          is_verified: user.email_confirmed_at != null,
        };

        console.log("Insert payload:", insertPayload);

        const { data: newProfile, error: createError } = await supabase
          .from('users')
          .insert(insertPayload)
          .select()
          .single();

        if (createError) {
          console.log("=== CREATE PROFILE ERROR (GET CURRENT USER) ===");
          console.log("Error object:", createError);
          console.log("Error JSON:", JSON.stringify(createError, null, 2));
          console.log("Error code:", createError.code);
          console.log("Error message:", createError.message);
          console.log("Error details:", createError.details);
          console.log("Error hint:", createError.hint);
          console.error('Failed to create user profile:', createError);
          return null;
        }

        console.log("Profile created successfully:", newProfile);
        userProfile = newProfile;
      } else {
        userProfile = existingProfile;
      }

      return userProfile as User;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as User;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Check if user has specific permission
   */
  static async hasPermission(userId: string, permissionSlug: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('roles!inner(*)')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        return false;
      }

      // Check if role has the permission
      const role = data as any;
      return role.permissions?.includes(permissionSlug) || false;
    } catch (error) {
      console.error('Check permission error:', error);
      return false;
    }
  }

  /**
   * Get user roles
   */
  static async getUserRoles(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('roles(*)')
        .eq('user_id', userId);

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Get user roles error:', error);
      throw error;
    }
  }
}
