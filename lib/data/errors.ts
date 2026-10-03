export class NotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} with id "${id}" not found`);
    this.name = "NotFoundError";
  }
}

export class DatabaseError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "DatabaseError";
  }
}