import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import pool from '@/lib/db';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  _request: NextRequest,
  context: RouteParams
) {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM recipes WHERE id = $1',
      [context.params.id]
    );
    
    if (rows.length === 0) {
      return NextResponse.json({ message: "No recipe found" }, { status: 404 });
    }
    
    return NextResponse.json({
      message: "Recipe details by id",
      recipe: [rows[0]]
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "No recipe found" }, { status: 404 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const body = await request.json();
    
    if (!body.title || !body.making_time || !body.serves || !body.ingredients || !body.cost) {
      return NextResponse.json({
        message: "Recipe update failed!",
        required: "title, making_time, serves, ingredients, cost"
      }, { status: 400 });
    }

    const { rows } = await pool.query(
      `UPDATE recipes 
       SET title = $1, making_time = $2, serves = $3, ingredients = $4, cost = $5
       WHERE id = $6
       RETURNING *`,
      [body.title, body.making_time, body.serves, body.ingredients, body.cost, context.params.id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "No recipe found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Recipe successfully updated!",
      recipe: [rows[0]]
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      message: "Recipe update failed!",
      required: "title, making_time, serves, ingredients, cost"
    }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteParams
) {
  try {
    const { rows } = await pool.query(
      'DELETE FROM recipes WHERE id = $1 RETURNING id',
      [context.params.id]
    );
    
    if (rows.length === 0) {
      return NextResponse.json({ message: "No recipe found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Recipe successfully removed!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "No recipe found" }, { status: 404 });
  }
}