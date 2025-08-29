import startDb from "@/app/lib/db";
import ProductModel from "@/app/models/productModel";
import { NextResponse } from "next/server";

// deployment
export const dynamic = "force-dynamic";

export async function GET() {
  await startDb();

  try {
    const products = await ProductModel.find().sort("-createdAt").limit(10);
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" });
  }
}
