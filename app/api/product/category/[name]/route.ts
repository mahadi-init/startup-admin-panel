import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  props: { params: Promise<{ name: string }> },
) {
  const { name } = await props.params;

  const products = await prisma.product.findMany({
    where: { category: { name: name } },
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
}
