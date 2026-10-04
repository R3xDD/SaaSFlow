import { errorResponse } from "@/lib/server/http";
import { deleteWorkspaceOperation, updateWorkspaceOperation } from "@/lib/server/workspaces";

type RouteContext = { params: Promise<{ workspaceId: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { workspaceId } = await context.params;
    return Response.json(await updateWorkspaceOperation({ ...(await request.json()), workspaceId }));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { workspaceId } = await context.params;
    return Response.json(await deleteWorkspaceOperation({ workspaceId }));
  } catch (error) {
    return errorResponse(error);
  }
}