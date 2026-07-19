import { NextRequest, NextResponse } from 'next/server';
import { RBACService } from '@/lib/rbac';

export async function GET(request: NextRequest) {
  try {
    const permissions = await RBACService.getPermissions();

    return NextResponse.json({
      success: true,
      data: permissions,
    });
  } catch (error) {
    console.error('Get permissions error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_PERMISSIONS_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get permissions',
        },
      },
      { status: 500 }
    );
  }
}
