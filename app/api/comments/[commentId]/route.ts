import { errorResponse } from "@/lib/server/http";
import { deleteCommentOperation } from "@/lib/server/comments";

type RouteContext = { params: Promise<{ commentId: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { commentId } = await context.params;
    return Response.json(await deleteCommentOperation({ commentId }));
  } catch (error) {
    return errorResponse(error);
  }
}