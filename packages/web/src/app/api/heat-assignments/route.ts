import { NextRequest, NextResponse } from 'next/server';
import { HeatAssignmentService } from '@/lib/heat-assignment';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const heatId = searchParams.get('heat_id');
    const riderId = searchParams.get('rider_id');
    const eventId = searchParams.get('event_id');

    if (heatId) {
      const assignments = await HeatAssignmentService.getHeatAssignments(heatId);
      return NextResponse.json({
        success: true,
        data: assignments,
      });
    }

    if (riderId && eventId) {
      const assignments = await HeatAssignmentService.getRiderHeatAssignments(riderId, eventId);
      return NextResponse.json({
        success: true,
        data: assignments,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'MISSING_PARAMETERS',
          message: 'Either heat_id or rider_id with event_id is required',
        },
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Get heat assignments error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_HEAT_ASSIGNMENTS_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get heat assignments',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const assignment = await HeatAssignmentService.createHeatAssignment(body);

    return NextResponse.json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    console.error('Create heat assignment error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CREATE_HEAT_ASSIGNMENT_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create heat assignment',
        },
      },
      { status: 500 }
    );
  }
}
