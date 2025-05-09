import { verifyJWTPayload } from "./jwt";
import { UnauthorizedError } from "@/lib/errors";

export default async function jwtAuth(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    throw new UnauthorizedError("Token is not provided");
  }

  const token = authHeader.split(" ")[1];
  const payload = await verifyJWTPayload(token);

  if (!payload) {
    throw new UnauthorizedError("Token is invalid");
  }

  return payload as { userId: string; exp: number };
}
