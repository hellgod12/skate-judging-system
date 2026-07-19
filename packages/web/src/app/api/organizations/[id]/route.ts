import { NextRequest, NextResponse } from 'next/server';
import { OrganizationService } from '@/lib/organization';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const organization = await OrganizationService.getOrganizationById(params.id);

    return NextResponse.json({
      success: true,
      data: organization,
    });
  } catch (error) {
    console.error('Get organization error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_ORGANIZATION_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get organization',
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
    const organization = await OrganizationService.updateOrganization(params.id, body);

    return NextResponse.json({
      success: true,
      data: organization,
    });
  } catch (error) {
    console.error('Update organization error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPDATE_ORGANIZATION_ERROR',
          message: error instanceof Error ? error.message : 'Failed to update organization',
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
    await OrganizationService.deleteOrganization(params.id);

    return NextResponse.json({
      success: true,
      data: { id: params.id },
    });
  } catch (error) {
    console.error('Delete organization error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DELETE_ORGANIZATION_ERROR',
          message: error instanceof Error ? error.message : 'Failed to delete organization',
        },
      },
      { status: 500 }
    );
  }
}
