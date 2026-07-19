import { NextRequest, NextResponse } from 'next/server';
import { JudgeService } from '@/lib/judge';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const judge = await JudgeService.getJudgeById(params.id);

    return NextResponse.json({
      success: true,
      data: judge,
    });
  } catch (error) {
    console.error('Get judge error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_JUDGE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get judge',
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
    const judge = await JudgeService.updateJudge(params.id, body);

    return NextResponse.json({
      success: true,
      data: judge,
    });
  } catch (error) {
    console.error('Update judge error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPDATE_JUDGE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to update judge',
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
    await JudgeService.deleteJudge(params.id);

    return NextResponse.json({
      success: true,
      data: { id: params.id },
    });
  } catch (error) {
    console.error('Delete judge error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DELETE_JUDGE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to delete judge',
        },
      },
      { status: 500 }
    );
  }
}
