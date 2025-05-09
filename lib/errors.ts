export class BadRequestError extends Error {
  constructor(message = "Bad Request") {
    super(message);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends Error {
  constructor(message = "Not Found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class MethodNotAllowedError extends Error {
  constructor(message = "Method Not Allowed") {
    super(message);
    this.name = "MethodNotAllowedError";
  }
}

export class ConflictError extends Error {
  constructor(message = "Conflict") {
    super(message);
    this.name = "ConflictError";
  }
}

export class UnprocessableEntityError extends Error {
  constructor(message = "Unprocessable Entity") {
    super(message);
    this.name = "UnprocessableEntityError";
  }
}

export class TooManyRequestsError extends Error {
  constructor(message = "Too Many Requests") {
    super(message);
    this.name = "TooManyRequestsError";
  }
}

export class InternalServerError extends Error {
  constructor(message = "Internal Server Error") {
    super(message);
    this.name = "InternalServerError";
  }
}

export class ServiceUnavailableError extends Error {
  constructor(message = "Service Unavailable") {
    super(message);
    this.name = "ServiceUnavailableError";
  }
}
