import { NextRequest, NextResponse } from 'next/server';
import { TimerService } from '@/lib/timer';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('event_id');
    const timerType = searchParams.get('timer_type');

    if (!eventId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_EVENT_ID',
            message: 'Event ID is required',
          },
        },
        { status: 400 }
      );
    }

    if (timerType) {
      const timer = await TimerService.getActiveTimer(eventId, timerType);
      return NextResponse.json({
        success: true,
        data: timer,
      });
    }

    const timers = await TimerService.getEventTimers(eventId);

    return NextResponse.json({
      success: true,
      data: timers,
    });
  } catch (error) {
    console.error('Get timers error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_TIMERS_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get timers',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const timer = await TimerService.createTimer(body);

    return NextResponse.json({
      success: true,
      data: timer,
    });
  } catch (error) {
    console.error('Create timer error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CREATE_TIMER_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create timer',
        },
      },
      { status: 500 }
    );
  }
}
