import { NextRequest, NextResponse } from 'next/server';
import { CompetitionService } from '@/lib/competition';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('event_id');

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

    const rounds = await CompetitionService.getRounds(eventId);

    return NextResponse.json({
      success: true,
      data: rounds,
    });
  } catch (error) {
    console.error('Get rounds error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_ROUNDS_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get rounds',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const round = await CompetitionService.createRound(body);

    return NextResponse.json({
      success: true,
      data: round,
    });
  } catch (error) {
    console.error('Create round error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CREATE_ROUND_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create round',
        },
      },
      { status: 500 }
    );
  }
}
