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

export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  created_at: string;
}

export interface CreateRoleData {
  organization_id?: string;
  name: string;
  slug: string;
  description?: string;
  permissions: string[];
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
  permissions?: string[];
}

export interface AssignRoleData {
  user_id: string;
  role_id: string;
  expires_at?: string;
}
