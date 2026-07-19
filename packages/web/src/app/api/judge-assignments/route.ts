import { NextRequest, NextResponse } from 'next/server';
import { JudgeService } from '@/lib/judge';

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

    const assignments = await JudgeService.getJudgeAssignments(eventId);

    return NextResponse.json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    console.error('Get judge assignments error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_JUDGE_ASSIGNMENTS_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get judge assignments',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const assignment = await JudgeService.assignJudge(body);

    return NextResponse.json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    console.error('Assign judge error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'ASSIGN_JUDGE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to assign judge',
        },
      },
      { status: 500 }
    );
  }
}
