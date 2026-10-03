import { DatabaseError } from "./errors";

export async function withDatabaseError<T>(
  operation: () => Promise<T>,
  context: string,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    throw new DatabaseError(
      `Database operation failed: ${context}`,
      { cause: error },
    );
  }
}