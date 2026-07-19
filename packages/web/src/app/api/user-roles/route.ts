import { NextRequest, NextResponse } from 'next/server';
import { RBACService } from '@/lib/rbac';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_USER_ID',
            message: 'User ID is required',
          },
        },
        { status: 400 }
      );
    }

    const userRoles = await RBACService.getUserRoles(userId);

    return NextResponse.json({
      success: true,
      data: userRoles,
    });
  } catch (error) {
    console.error('Get user roles error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_USER_ROLES_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get user roles',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userRole = await RBACService.assignRole(body, body.assigned_by);

    return NextResponse.json({
      success: true,
      data: userRole,
    });
  } catch (error) {
    console.error('Assign role error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'ASSIGN_ROLE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to assign role',
        },
      },
      { status: 500 }
    );
  }
}
