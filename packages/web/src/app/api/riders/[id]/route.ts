import { NextRequest, NextResponse } from 'next/server';
import { RiderService } from '@/lib/rider';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rider = await RiderService.getRiderById(params.id);

    return NextResponse.json({
      success: true,
      data: rider,
    });
  } catch (error) {
    console.error('Get rider error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_RIDER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get rider',
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
    const rider = await RiderService.updateRider(params.id, body);

    return NextResponse.json({
      success: true,
      data: rider,
    });
  } catch (error) {
    console.error('Update rider error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPDATE_RIDER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to update rider',
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
    await RiderService.deleteRider(params.id);

    return NextResponse.json({
      success: true,
      data: { id: params.id },
    });
  } catch (error) {
    console.error('Delete rider error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DELETE_RIDER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to delete rider',
        },
      },
      { status: 500 }
    );
  }
}
