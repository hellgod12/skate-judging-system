import { NextRequest, NextResponse } from 'next/server';
import { EventService } from '@/lib/event';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await EventService.publishEvent(params.id);

    return NextResponse.json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Publish event error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PUBLISH_EVENT_ERROR',
          message: error instanceof Error ? error.message : 'Failed to publish event',
        },
      },
      { status: 500 }
    );
  }
}
