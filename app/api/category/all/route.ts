import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/error-handler";

export async function GET(_: Request) {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return handleApiError(error);
  }
}
