import prisma from "@/lib/prisma";
import jwtAuth from "@/utils/jwt-auth";
import { NextResponse } from "next/server";
import { NotFoundError } from "@/lib/errors";
import { handleApiError } from "@/lib/error-handler";

export async function GET(request: Request) {
  try {
    const { userId } = await jwtAuth(request);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return handleApiError(error);
  }
}
