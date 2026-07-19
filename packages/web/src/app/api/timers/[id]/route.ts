import { NextRequest, NextResponse } from 'next/server';
import { TimerService } from '@/lib/timer';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const timer = await TimerService.getTimerById(params.id);

    return NextResponse.json({
      success: true,
      data: timer,
    });
  } catch (error) {
    console.error('Get timer error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_TIMER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get timer',
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
    const timer = await TimerService.updateTimer(params.id, body);

    return NextResponse.json({
      success: true,
      data: timer,
    });
  } catch (error) {
    console.error('Update timer error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPDATE_TIMER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to update timer',
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
    await TimerService.deleteTimer(params.id);

    return NextResponse.json({
      success: true,
      data: { id: params.id },
    });
  } catch (error) {
    console.error('Delete timer error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DELETE_TIMER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to delete timer',
        },
      },
      { status: 500 }
    );
  }
}
