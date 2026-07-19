import { NextRequest, NextResponse } from 'next/server';
import { EventService } from '@/lib/event';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organization_id');

    if (!organizationId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_ORGANIZATION_ID',
            message: 'Organization ID is required',
          },
        },
        { status: 400 }
      );
    }

    const events = await EventService.getEvents(organizationId);

    return NextResponse.json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_EVENTS_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get events',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = await EventService.createEvent(body);

    return NextResponse.json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CREATE_EVENT_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create event',
        },
      },
      { status: 500 }
    );
  }
}
