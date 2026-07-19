import { NextRequest, NextResponse } from 'next/server';
import { CompetitionService } from '@/lib/competition';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const round = await CompetitionService.getRoundById(params.id);

    return NextResponse.json({
      success: true,
      data: round,
    });
  } catch (error) {
    console.error('Get round error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_ROUND_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get round',
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
    const round = await CompetitionService.updateRound(params.id, body);

    return NextResponse.json({
      success: true,
      data: round,
    });
  } catch (error) {
    console.error('Update round error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPDATE_ROUND_ERROR',
          message: error instanceof Error ? error.message : 'Failed to update round',
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
    await CompetitionService.deleteRound(params.id);

    return NextResponse.json({
      success: true,
      data: { id: params.id },
    });
  } catch (error) {
    console.error('Delete round error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DELETE_ROUND_ERROR',
          message: error instanceof Error ? error.message : 'Failed to delete round',
        },
      },
      { status: 500 }
    );
  }
}
