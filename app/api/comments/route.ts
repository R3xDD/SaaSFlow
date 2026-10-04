import { errorResponse } from "@/lib/server/http";
import { createCommentOperation } from "@/lib/server/comments";

export async function POST(request: Request) {
  try {
    return Response.json(await createCommentOperation(await request.json()), { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}