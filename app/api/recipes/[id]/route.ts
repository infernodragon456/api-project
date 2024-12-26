import { NextResponse } from 'next/server';

// Reference to the same mock database
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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const recipe = recipes.find(r => r.id === parseInt(params.id));
    
    if (!recipe) {
      return NextResponse.json({ message: "No recipe found" }, { status: 404 });
    }
    
    return NextResponse.json({
      message: "Recipe details by id",
      recipe: [recipe]
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "No recipe found" }, { status: 404 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const recipeIndex = recipes.findIndex(r => r.id === parseInt(params.id));
    
    if (recipeIndex === -1) {
      return NextResponse.json({ message: "No recipe found" }, { status: 404 });
    }
    
    // Validate required fields
    if (!body.title || !body.making_time || !body.serves || !body.ingredients || !body.cost) {
      return NextResponse.json({
        message: "Recipe update failed!",
        required: "title, making_time, serves, ingredients, cost"
      }, { status: 400 });
    }
    
    // Update recipe
    recipes[recipeIndex] = {
      ...recipes[recipeIndex],
      title: body.title,
      making_time: body.making_time,
      serves: body.serves,
      ingredients: body.ingredients,
      cost: body.cost,
      id: recipes[recipeIndex].id // Ensure ID doesn't change
    };
    
    return NextResponse.json({
      message: "Recipe successfully updated!",
      recipe: [recipes[recipeIndex]]
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      message: "Recipe update failed!",
      required: "title, making_time, serves, ingredients, cost"
    }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const recipeIndex = recipes.findIndex(r => r.id === parseInt(params.id));
    
    if (recipeIndex === -1) {
      return NextResponse.json({ message: "No recipe found" }, { status: 404 });
    }
    
    recipes = recipes.filter(r => r.id !== parseInt(params.id));
    return NextResponse.json({ message: "Recipe successfully removed!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "No recipe found" }, { status: 404 });
  }
}