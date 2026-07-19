import { NextRequest, NextResponse } from 'next/server';
import { RiderService } from '@/lib/rider';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organization_id') || undefined;
    const searchQuery = searchParams.get('search') || undefined;
    const categoryId = searchParams.get('category_id') || undefined;
    const divisionId = searchParams.get('division_id') || undefined;

    if (searchQuery) {
      const riders = await RiderService.searchRiders(searchQuery, organizationId);
      return NextResponse.json({
        success: true,
        data: riders,
      });
    }

    if (categoryId) {
      const riders = await RiderService.getRidersByCategory(categoryId);
      return NextResponse.json({
        success: true,
        data: riders,
      });
    }

    if (divisionId) {
      const riders = await RiderService.getRidersByDivision(divisionId);
      return NextResponse.json({
        success: true,
        data: riders,
      });
    }

    const riders = await RiderService.getRiders(organizationId);

    return NextResponse.json({
      success: true,
      data: riders,
    });
  } catch (error) {
    console.error('Get riders error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_RIDERS_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get riders',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rider = await RiderService.createRider(body);

    return NextResponse.json({
      success: true,
      data: rider,
    });
  } catch (error) {
    console.error('Create rider error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CREATE_RIDER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create rider',
        },
      },
      { status: 500 }
    );
  }
}
