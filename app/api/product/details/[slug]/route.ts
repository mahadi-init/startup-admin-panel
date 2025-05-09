import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/error-handler";

export async function GET(
  _: Request,
  props: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await props.params;

    const products = await prisma.product.findUnique({
      where: { slug: slug },
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
