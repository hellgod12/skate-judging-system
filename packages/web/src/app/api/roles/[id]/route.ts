import { NextRequest, NextResponse } from 'next/server';
import { RBACService } from '@/lib/rbac';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const role = await RBACService.getRoleById(params.id);

    return NextResponse.json({
      success: true,
      data: role,
    });
  } catch (error) {
    console.error('Get role error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_ROLE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get role',
        },
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const role = await RBACService.updateRole(params.id, body);

    return NextResponse.json({
      success: true,
      data: role,
    });
  } catch (error) {
    console.error('Update role error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPDATE_ROLE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to update role',
        },
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await RBACService.deleteRole(params.id);

    return NextResponse.json({
      success: true,
      data: { id: params.id },
    });
  } catch (error) {
    console.error('Delete role error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DELETE_ROLE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to delete role',
        },
      },
      { status: 500 }
    );
  }
}
