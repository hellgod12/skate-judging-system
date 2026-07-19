import { supabase } from './supabase';
import type { Role, Permission, UserRole, CreateRoleData, UpdateRoleData, AssignRoleData } from './types/rbac';

export class RBACService {
  /**
   * Get all permissions
   */
  static async getPermissions(): Promise<Permission[]> {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('resource', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data as Permission[];
    } catch (error) {
      console.error('Get permissions error:', error);
      throw error;
    }
  }

  /**
   * Get permission by ID
   */
  static async getPermissionById(id: string): Promise<Permission> {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Permission;
    } catch (error) {
      console.error('Get permission error:', error);
      throw error;
    }
  }

  /**
   * Get all roles for an organization
   */
  static async getRoles(organizationId?: string): Promise<Role[]> {
    try {
      let query = supabase
        .from('roles')
        .select('*')
        .order('name', { ascending: true });

      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      } else {
        query = query.is('organization_id', null);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data as Role[];
    } catch (error) {
      console.error('Get roles error:', error);
      throw error;
    }
  }

  /**
   * Get role by ID
   */
  static async getRoleById(id: string): Promise<Role> {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Role;
    } catch (error) {
      console.error('Get role error:', error);
      throw error;
    }
  }

  /**
   * Create new role
   */
  static async createRole(data: CreateRoleData): Promise<Role> {
    try {
      const { data: role, error } = await supabase
        .from('roles')
        .insert({
          organization_id: data.organization_id,
          name: data.name,
          slug: data.slug,
          description: data.description,
          permissions: data.permissions,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Assign permissions to role
      if (data.permissions.length > 0) {
        const permissionAssignments = data.permissions.map(permissionId => ({
          role_id: role.id,
          permission_id: permissionId,
        }));

        await supabase.from('role_permissions').insert(permissionAssignments);
      }

      return role as Role;
    } catch (error) {
      console.error('Create role error:', error);
      throw error;
    }
  }

  /**
   * Update role
   */
  static async updateRole(id: string, data: UpdateRoleData): Promise<Role> {
    try {
      const updates: any = {};
      if (data.name) updates.name = data.name;
      if (data.description !== undefined) updates.description = data.description;
      if (data.permissions !== undefined) updates.permissions = data.permissions;

      const { data: role, error } = await supabase
        .from('roles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Update permissions if provided
      if (data.permissions !== undefined) {
        // Delete existing permissions
        await supabase
          .from('role_permissions')
          .delete()
          .eq('role_id', id);

        // Add new permissions
        if (data.permissions.length > 0) {
          const permissionAssignments = data.permissions.map(permissionId => ({
            role_id: id,
            permission_id: permissionId,
          }));

          await supabase.from('role_permissions').insert(permissionAssignments);
        }
      }

      return role as Role;
    } catch (error) {
      console.error('Update role error:', error);
      throw error;
    }
  }

  /**
   * Delete role
   */
  static async deleteRole(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Delete role error:', error);
      throw error;
    }
  }

  /**
   * Get user roles
   */
  static async getUserRoles(userId: string): Promise<UserRole[]> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*, roles(*)')
        .eq('user_id', userId);

      if (error) {
        throw new Error(error.message);
      }

      return data as UserRole[];
    } catch (error) {
      console.error('Get user roles error:', error);
      throw error;
    }
  }

  /**
   * Assign role to user
   */
  static async assignRole(data: AssignRoleData, assignedBy?: string): Promise<UserRole> {
    try {
      const { data: userRole, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: data.user_id,
          role_id: data.role_id,
          assigned_by: assignedBy,
          expires_at: data.expires_at,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return userRole as UserRole;
    } catch (error) {
      console.error('Assign role error:', error);
      throw error;
    }
  }

  /**
   * Remove role from user
   */
  static async removeRole(userRoleId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', userRoleId);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Remove role error:', error);
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
        .eq('user_id', userId);

      if (error || !data) {
        return false;
      }

      for (const userRole of data) {
        const role = userRole as any;
        if (role.roles?.permissions?.includes(permissionSlug)) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Check permission error:', error);
      return false;
    }
  }

  /**
   * Get all permissions for a user
   */
  static async getUserPermissions(userId: string): Promise<Permission[]> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('roles!inner(permissions)')
        .eq('user_id', userId);

      if (error) {
        throw new Error(error.message);
      }

      const allPermissions = new Set<string>();
      data.forEach((userRole: any) => {
        if (userRole.roles?.permissions) {
          userRole.roles.permissions.forEach((perm: string) => allPermissions.add(perm));
        }
      });

      // Fetch permission details
      const { data: permissions } = await supabase
        .from('permissions')
        .select('*')
        .in('slug', Array.from(allPermissions));

      return permissions as Permission[];
    } catch (error) {
      console.error('Get user permissions error:', error);
      throw error;
    }
  }

  /**
   * Initialize default permissions
   */
  static async initializeDefaultPermissions(): Promise<void> {
    const defaultPermissions = [
      // User management
      { name: 'View Users', slug: 'users.view', resource: 'users', action: 'view' },
      { name: 'Create Users', slug: 'users.create', resource: 'users', action: 'create' },
      { name: 'Edit Users', slug: 'users.edit', resource: 'users', action: 'edit' },
      { name: 'Delete Users', slug: 'users.delete', resource: 'users', action: 'delete' },
      
      // Role management
      { name: 'View Roles', slug: 'roles.view', resource: 'roles', action: 'view' },
      { name: 'Create Roles', slug: 'roles.create', resource: 'roles', action: 'create' },
      { name: 'Edit Roles', slug: 'roles.edit', resource: 'roles', action: 'edit' },
      { name: 'Delete Roles', slug: 'roles.delete', resource: 'roles', action: 'delete' },
      
      // Organization management
      { name: 'View Organizations', slug: 'organizations.view', resource: 'organizations', action: 'view' },
      { name: 'Create Organizations', slug: 'organizations.create', resource: 'organizations', action: 'create' },
      { name: 'Edit Organizations', slug: 'organizations.edit', resource: 'organizations', action: 'edit' },
      { name: 'Delete Organizations', slug: 'organizations.delete', resource: 'organizations', action: 'delete' },
      
      // Event management
      { name: 'View Events', slug: 'events.view', resource: 'events', action: 'view' },
      { name: 'Create Events', slug: 'events.create', resource: 'events', action: 'create' },
      { name: 'Edit Events', slug: 'events.edit', resource: 'events', action: 'edit' },
      { name: 'Delete Events', slug: 'events.delete', resource: 'events', action: 'delete' },
      { name: 'Manage Events', slug: 'events.manage', resource: 'events', action: 'manage' },
      
      // Rider management
      { name: 'View Riders', slug: 'riders.view', resource: 'riders', action: 'view' },
      { name: 'Create Riders', slug: 'riders.create', resource: 'riders', action: 'create' },
      { name: 'Edit Riders', slug: 'riders.edit', resource: 'riders', action: 'edit' },
      { name: 'Delete Riders', slug: 'riders.delete', resource: 'riders', action: 'delete' },
      
      // Judge management
      { name: 'View Judges', slug: 'judges.view', resource: 'judges', action: 'view' },
      { name: 'Create Judges', slug: 'judges.create', resource: 'judges', action: 'create' },
      { name: 'Edit Judges', slug: 'judges.edit', resource: 'judges', action: 'edit' },
      { name: 'Delete Judges', slug: 'judges.delete', resource: 'judges', action: 'delete' },
      { name: 'Assign Judges', slug: 'judges.assign', resource: 'judges', action: 'assign' },
      
      // Scoring
      { name: 'View Scores', slug: 'scores.view', resource: 'scores', action: 'view' },
      { name: 'Submit Scores', slug: 'scores.submit', resource: 'scores', action: 'submit' },
      { name: 'Edit Scores', slug: 'scores.edit', resource: 'scores', action: 'edit' },
      { name: 'Approve Scores', slug: 'scores.approve', resource: 'scores', action: 'approve' },
      
      // Categories
      { name: 'View Categories', slug: 'categories.view', resource: 'categories', action: 'view' },
      { name: 'Create Categories', slug: 'categories.create', resource: 'categories', action: 'create' },
      { name: 'Edit Categories', slug: 'categories.edit', resource: 'categories', action: 'edit' },
      { name: 'Delete Categories', slug: 'categories.delete', resource: 'categories', action: 'delete' },
      
      // Settings
      { name: 'View Settings', slug: 'settings.view', resource: 'settings', action: 'view' },
      { name: 'Edit Settings', slug: 'settings.edit', resource: 'settings', action: 'edit' },
    ];

    for (const permission of defaultPermissions) {
      const { error } = await supabase
        .from('permissions')
        .insert(permission);

      if (error && !error.message.includes('duplicate key')) {
        console.error('Failed to create permission:', permission.slug, error);
      }
    }
  }

  /**
   * Initialize default roles
   */
  static async initializeDefaultRoles(organizationId?: string): Promise<void> {
    const defaultRoles = [
      {
        name: 'Admin',
        slug: 'admin',
        description: 'Full system access',
        permissions: [
          'users.view', 'users.create', 'users.edit', 'users.delete',
          'roles.view', 'roles.create', 'roles.edit', 'roles.delete',
          'organizations.view', 'organizations.create', 'organizations.edit', 'organizations.delete',
          'events.view', 'events.create', 'events.edit', 'events.delete', 'events.manage',
          'riders.view', 'riders.create', 'riders.edit', 'riders.delete',
          'judges.view', 'judges.create', 'judges.edit', 'judges.delete', 'judges.assign',
          'scores.view', 'scores.submit', 'scores.edit', 'scores.approve',
          'categories.view', 'categories.create', 'categories.edit', 'categories.delete',
          'settings.view', 'settings.edit',
        ],
      },
      {
        name: 'Judge',
        slug: 'judge',
        description: 'Judge access for scoring',
        permissions: [
          'events.view',
          'riders.view',
          'scores.view', 'scores.submit',
        ],
      },
      {
        name: 'Operator',
        slug: 'operator',
        description: 'Operator access for event management',
        permissions: [
          'events.view', 'events.manage',
          'riders.view',
          'judges.view', 'judges.assign',
          'scores.view', 'scores.approve',
        ],
      },
      {
        name: 'Member',
        slug: 'member',
        description: 'Basic member access',
        permissions: [
          'events.view',
          'riders.view',
          'scores.view',
        ],
      },
    ];

    for (const roleData of defaultRoles) {
      const { error } = await supabase
        .from('roles')
        .insert({
          organization_id: organizationId,
          name: roleData.name,
          slug: roleData.slug,
          description: roleData.description,
          permissions: roleData.permissions,
          is_system: true,
        });

      if (error && !error.message.includes('duplicate key')) {
        console.error('Failed to create role:', roleData.slug, error);
      }
    }
  }
}
