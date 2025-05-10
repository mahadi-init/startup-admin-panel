import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createJWT } from "@/utils/jwt";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/error-handler";
import { ConflictError, ForbiddenError, NotFoundError } from "@/lib/errors";

const SigninSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const data = SigninSchema.parse({ email, password });

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (!user.password) {
      throw new ConflictError("Try using the Google login");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new ForbiddenError("Invalid credentials");
    }

    const token = await createJWT({
      sub: user.id,
      email: user.email,
    });

    console.log("5");

    return NextResponse.json({ success: true, data: user, token });
  } catch (error) {
    return handleApiError(error);
  }
}
