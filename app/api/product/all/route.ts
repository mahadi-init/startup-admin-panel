import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/error-handler";

export async function GET(_: Request) {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        category: { select: { name: true, img: true } },
        price: true,
        discount_percentage: true,
        rating: true,
        sold: true,
        model: true,
        quantity: true,
        status: true,
        images: true,
        videos: true,
      },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return handleApiError(error);
  }
}
