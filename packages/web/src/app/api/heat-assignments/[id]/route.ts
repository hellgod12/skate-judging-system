import { NextRequest, NextResponse } from 'next/server';
import { HeatAssignmentService } from '@/lib/heat-assignment';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assignment = await HeatAssignmentService.getHeatAssignmentById(params.id);

    return NextResponse.json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    console.error('Get heat assignment error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_HEAT_ASSIGNMENT_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get heat assignment',
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
    const assignment = await HeatAssignmentService.updateHeatAssignment(params.id, body);

    return NextResponse.json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    console.error('Update heat assignment error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPDATE_HEAT_ASSIGNMENT_ERROR',
          message: error instanceof Error ? error.message : 'Failed to update heat assignment',
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
    await HeatAssignmentService.deleteHeatAssignment(params.id);

    return NextResponse.json({
      success: true,
      data: { id: params.id },
    });
  } catch (error) {
    console.error('Delete heat assignment error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DELETE_HEAT_ASSIGNMENT_ERROR',
          message: error instanceof Error ? error.message : 'Failed to delete heat assignment',
        },
      },
      { status: 500 }
    );
  }
}
