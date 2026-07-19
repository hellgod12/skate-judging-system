import { NextRequest, NextResponse } from 'next/server';
import { JudgeService } from '@/lib/judge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organization_id') || undefined;
    const searchQuery = searchParams.get('search') || undefined;
    const certification = searchParams.get('certification') || undefined;
    const specialty = searchParams.get('specialty') || undefined;

    if (searchQuery) {
      const judges = await JudgeService.searchJudges(searchQuery, organizationId);
      return NextResponse.json({
        success: true,
        data: judges,
      });
    }

    if (certification) {
      const judges = await JudgeService.getJudgesByCertification(certification, organizationId);
      return NextResponse.json({
        success: true,
        data: judges,
      });
    }

    if (specialty) {
      const judges = await JudgeService.getJudgesBySpecialty(specialty, organizationId);
      return NextResponse.json({
        success: true,
        data: judges,
      });
    }

    const judges = await JudgeService.getJudges(organizationId);

    return NextResponse.json({
      success: true,
      data: judges,
    });
  } catch (error) {
    console.error('Get judges error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_JUDGES_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get judges',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const judge = await JudgeService.createJudge(body);

    return NextResponse.json({
      success: true,
      data: judge,
    });
  } catch (error) {
    console.error('Create judge error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CREATE_JUDGE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create judge',
        },
      },
      { status: 500 }
    );
  }
}
