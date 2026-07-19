import { NextRequest, NextResponse } from 'next/server';
import { CompetitionService } from '@/lib/competition';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const heat = await CompetitionService.getHeatById(params.id);

    return NextResponse.json({
      success: true,
      data: heat,
    });
  } catch (error) {
    console.error('Get heat error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_HEAT_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get heat',
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
    const heat = await CompetitionService.updateHeat(params.id, body);

    return NextResponse.json({
      success: true,
      data: heat,
    });
  } catch (error) {
    console.error('Update heat error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPDATE_HEAT_ERROR',
          message: error instanceof Error ? error.message : 'Failed to update heat',
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
    await CompetitionService.deleteHeat(params.id);

    return NextResponse.json({
      success: true,
      data: { id: params.id },
    });
  } catch (error) {
    console.error('Delete heat error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DELETE_HEAT_ERROR',
          message: error instanceof Error ? error.message : 'Failed to delete heat',
        },
      },
      { status: 500 }
    );
  }
}
