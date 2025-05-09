import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const SignupSchema = z.object({
  name: z.string(),
  phone: z.string().length(11, { message: "Phone number must be 11 digits" }),
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  dob: z.string(),
});

export async function POST(request: Request) {
  try {
    const { name, email, phone, password, dob } = await request.json();
    const data = SignupSchema.parse({ name, phone, email, password, dob });

    const userExists = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { phone: phone }],
      },
    });

    if (userExists) {
      return NextResponse.json({
        success: false,
        data: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const modifiedData = { ...data, password: hashedPassword };

    const user = await prisma.user.create({ data: modifiedData });
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
