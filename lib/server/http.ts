import {
  ConflictError,
  DatabaseError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../data/errors";

export function errorResponse(error: unknown) {
  if (error instanceof ValidationError) {
    return Response.json(
      {
        success: false,
        error: { code: "VALIDATION_ERROR", message: error.message, issues: error.issues },
      },
      { status: 400 },
    );
  }

  if (error instanceof UnauthorizedError) {
    return Response.json(
      { success: false, error: { code: "UNAUTHENTICATED", message: error.message } },
      { status: 401 },
    );
  }

  if (error instanceof ForbiddenError) {
    return Response.json(
      { success: false, error: { code: "FORBIDDEN", message: error.message } },
      { status: 403 },
    );
  }

  if (error instanceof NotFoundError) {
    return Response.json(
      { success: false, error: { code: "NOT_FOUND", message: "The requested resource was not found." } },
      { status: 404 },
    );
  }

  if (error instanceof ConflictError) {
    return Response.json(
      { success: false, error: { code: "CONFLICT", message: error.message } },
      { status: 409 },
    );
  }

  if (error instanceof DatabaseError) {
    console.error(error);
  } else {
    console.error("Unexpected server operation error", error);
  }

  return Response.json(
    { success: false, error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." } },
    { status: 500 },
  );
}