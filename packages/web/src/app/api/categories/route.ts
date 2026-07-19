import { NextRequest, NextResponse } from 'next/server';
import { CategoryService } from '@/lib/category';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organization_id') || undefined;
    const age = searchParams.get('age') ? parseInt(searchParams.get('age')!) : undefined;
    const gender = searchParams.get('gender') || undefined;
    const skillLevel = searchParams.get('skill_level') || undefined;

    if (age || gender || skillLevel) {
      const categories = await CategoryService.filterCategories({
        age,
        gender,
        skill_level: skillLevel,
        organizationId,
      });

      return NextResponse.json({
        success: true,
        data: categories,
      });
    }

    const categories = await CategoryService.getCategories(organizationId);

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_CATEGORIES_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get categories',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const category = await CategoryService.createCategory(body);

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CREATE_CATEGORY_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create category',
        },
      },
      { status: 500 }
    );
  }
}
