import { NextRequest, NextResponse } from 'next/server';
import { OrganizationService } from '@/lib/organization';

export async function GET(request: NextRequest) {
  try {
    const organizations = await OrganizationService.getOrganizations();

    return NextResponse.json({
      success: true,
      data: organizations,
    });
  } catch (error) {
    console.error('Get organizations error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_ORGANIZATIONS_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get organizations',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const organization = await OrganizationService.createOrganization(body);

    return NextResponse.json({
      success: true,
      data: organization,
    });
  } catch (error) {
    console.error('Create organization error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CREATE_ORGANIZATION_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create organization',
        },
      },
      { status: 500 }
    );
  }
}
