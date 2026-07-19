import { NextRequest, NextResponse } from 'next/server';
import { CategoryService } from '@/lib/category';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await CategoryService.getCategoryById(params.id);

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Get category error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_CATEGORY_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get category',
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
    const category = await CategoryService.updateCategory(params.id, body);

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Update category error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPDATE_CATEGORY_ERROR',
          message: error instanceof Error ? error.message : 'Failed to update category',
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
    await CategoryService.deleteCategory(params.id);

    return NextResponse.json({
      success: true,
      data: { id: params.id },
    });
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DELETE_CATEGORY_ERROR',
          message: error instanceof Error ? error.message : 'Failed to delete category',
        },
      },
      { status: 500 }
    );
  }
}
