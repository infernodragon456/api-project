import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { rows } = await pool.query('SELECT * FROM recipes');
    return NextResponse.json({ recipes: rows }, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.making_time || !body.serves || !body.ingredients || !body.cost) {
      return NextResponse.json({
        message: "Recipe creation failed!",
        required: "title, making_time, serves, ingredients, cost"
      }, { status: 400 });
    }

    const { rows } = await pool.query(
      `INSERT INTO recipes (title, making_time, serves, ingredients, cost)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [body.title, body.making_time, body.serves, body.ingredients, body.cost]
    );

    return NextResponse.json({
      message: "Recipe successfully created!",
      recipe: [rows[0]]
    }, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({
      message: "Recipe creation failed!",
      required: "title, making_time, serves, ingredients, cost"
    }, { status: 400 });
  }
}