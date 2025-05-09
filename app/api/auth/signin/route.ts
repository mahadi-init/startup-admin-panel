import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createJWT } from "@/utils/jwt";
import { NextResponse } from "next/server";

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
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 401 },
      );
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid credentials",
        },
        { status: 401 },
      );
    }

    const token = await createJWT({
      userId: user.id,
    });

    return NextResponse.json({ success: true, data: user, token });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
