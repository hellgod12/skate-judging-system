export interface User {
  id: string;
  organization_id?: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name?: string;
  avatar_url?: string;
  phone?: string;
  date_of_birth?: string;
  nationality_code?: string;
  is_active: boolean;
  is_verified: boolean;
  last_login_at?: string;
  preferences?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  organization_id?: string;
  name: string;
  slug: string;
  description?: string;
  is_system: boolean;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  name: string;
  slug: string;
  description?: string;
  resource: string;
  action: string;
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  assigned_by?: string;
  assigned_at: string;
  expires_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  display_name?: string;
  organization_id?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}
