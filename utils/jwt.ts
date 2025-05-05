import * as jose from "jose";

const alg = "HS256";
const secret = new TextEncoder().encode(process.env.JWT as string);

export const createJWT = async (payload: any) => {
  try {
    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg })
      .setExpirationTime("72h")
      .sign(secret);

    return jwt;
  } catch (err) {
    return null;
  }
};

export const verifyJWTPayload = async (jwt: string | null | undefined) => {
  try {
    if (!jwt) {
      throw new Error();
    }

    const { payload } = await jose.jwtVerify(jwt, secret);
    return payload;
  } catch (err) {
    return undefined;
  }
};
