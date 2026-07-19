import { NextRequest, NextResponse } from 'next/server';
import { CompetitionService } from '@/lib/competition';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roundId = searchParams.get('round_id');

    if (!roundId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_ROUND_ID',
            message: 'Round ID is required',
          },
        },
        { status: 400 }
      );
    }

    const heats = await CompetitionService.getHeats(roundId);

    return NextResponse.json({
      success: true,
      data: heats,
    });
  } catch (error) {
    console.error('Get heats error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_HEATS_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get heats',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const heat = await CompetitionService.createHeat(body);

    return NextResponse.json({
      success: true,
      data: heat,
    });
  } catch (error) {
    console.error('Create heat error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CREATE_HEAT_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create heat',
        },
      },
      { status: 500 }
    );
  }
}
