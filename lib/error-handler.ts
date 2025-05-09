// lib/errorHandler.ts
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  MethodNotAllowedError,
  ConflictError,
  UnprocessableEntityError,
  TooManyRequestsError,
  InternalServerError,
  ServiceUnavailableError,
} from "./errors";
import { NextResponse } from "next/server";

export function handleApiError(error: unknown) {
  if (error instanceof BadRequestError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }

  if (error instanceof UnauthorizedError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 401 },
    );
  }

  if (error instanceof ForbiddenError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 403 },
    );
  }

  if (error instanceof NotFoundError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 404 },
    );
  }

  if (error instanceof MethodNotAllowedError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 405 },
    );
  }

  if (error instanceof ConflictError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 409 },
    );
  }

  if (error instanceof UnprocessableEntityError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 422 },
    );
  }

  if (error instanceof TooManyRequestsError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 429 },
    );
  }

  if (error instanceof InternalServerError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }

  if (error instanceof ServiceUnavailableError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 503 },
    );
  }

  // Fallback for unhandled errors
  console.error("Unhandled error:", error);
  return NextResponse.json(
    { success: false, error: "Internal Server Error" },
    { status: 500 },
  );
}
