import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock database
let recipes = [
  { 
    id: 1,
    title: "Chicken Curry",
    making_time: "45 min",
    serves: "4 people",
    ingredients: "onion, chicken, seasoning",
    cost: "1000"
  },
  {
    id: 2,
    title: "Rice Omelette",
    making_time: "30 min",
    serves: "2 people",
    ingredients: "onion, egg, seasoning, soy sauce",
    cost: "700"
  },
  {
    id: 3,
    title: "Tomato Soup",
    making_time: "15 min",
    serves: "5 people",
    ingredients: "onion, tomato, seasoning, water",
    cost: "450"
  }
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ recipes }, { status: 200 });
  } catch (error) {
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

    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const newRecipe = {
      id: recipes.length + 1,
      title: body.title,
      making_time: body.making_time,
      serves: body.serves,
      ingredients: body.ingredients,
      cost: body.cost,
      created_at: timestamp,
      updated_at: timestamp
    };

    recipes.push(newRecipe);
    return NextResponse.json({
      message: "Recipe successfully created!",
      recipe: [newRecipe]
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      message: "Recipe creation failed!",
      required: "title, making_time, serves, ingredients, cost"
    }, { status: 400 });
  }
}
