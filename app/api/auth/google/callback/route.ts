import prisma from "@/lib/prisma";
import { createJWT } from "@/utils/jwt";
import { NextResponse } from "next/server";
import { ForbiddenError } from "@/lib/errors";
import { handleApiError } from "@/lib/error-handler";

type GoogleUser = {
  id: string;
  email: string;
  verified_email?: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      throw new ForbiddenError("No code found");
    }

    const data = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: "authorization_code",
    };

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(data),
    });

    const tokenJson = await tokenRes.json();

    const userRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenJson.access_token}` },
      },
    );

    const googleUser: GoogleUser = await userRes.json();

    // Check if user exists
    const user = await prisma.user.findFirst({
      where: {
        email: googleUser.email,
      },
    });

    if (user) {
      const token = await createJWT({
        sub: user.id,
        email: user.email,
      });

      return NextResponse.json({
        success: true,
        data: googleUser,
        token: token,
      });
    }

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.picture,
      },
    });
    const token = await createJWT({ sub: newUser.id, email: newUser.email });
    return NextResponse.json({ success: true, data: newUser, token: token });
  } catch (error) {
    return handleApiError(error);
  }
}
