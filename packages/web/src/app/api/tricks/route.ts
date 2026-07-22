import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: tricks, error } = await supabase
      .from('tricks')
      .select('*')
      .order('name');

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch tricks', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(tricks || []);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
