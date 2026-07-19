import { NextRequest, NextResponse } from 'next/server';
import { EventService } from '@/lib/event';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await EventService.getEventById(params.id);

    return NextResponse.json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Get event error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_EVENT_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get event',
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
    const event = await EventService.updateEvent(params.id, body);

    return NextResponse.json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPDATE_EVENT_ERROR',
          message: error instanceof Error ? error.message : 'Failed to update event',
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
    await EventService.deleteEvent(params.id);

    return NextResponse.json({
      success: true,
      data: { id: params.id },
    });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DELETE_EVENT_ERROR',
          message: error instanceof Error ? error.message : 'Failed to delete event',
        },
      },
      { status: 500 }
    );
  }
}
