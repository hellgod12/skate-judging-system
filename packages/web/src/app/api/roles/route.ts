import { NextRequest, NextResponse } from 'next/server';
import { RBACService } from '@/lib/rbac';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organization_id') || undefined;

    const roles = await RBACService.getRoles(organizationId);

    return NextResponse.json({
      success: true,
      data: roles,
    });
  } catch (error) {
    console.error('Get roles error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_ROLES_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get roles',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const role = await RBACService.createRole(body);

    return NextResponse.json({
      success: true,
      data: role,
    });
  } catch (error) {
    console.error('Create role error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CREATE_ROLE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create role',
        },
      },
      { status: 500 }
    );
  }
}
