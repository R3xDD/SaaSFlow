import { revalidatePath } from "next/cache";
import { errorResponse } from "@/lib/server/http";
import { deleteWorkspaceOperation, updateWorkspaceOperation } from "@/lib/server/workspaces";

type RouteContext = { params: Promise<{ workspaceId: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { workspaceId } = await context.params;
    const result = await updateWorkspaceOperation({ ...(await request.json()), workspaceId });
    revalidatePath("/dashboard");
    return Response.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { workspaceId } = await context.params;
    const result = await deleteWorkspaceOperation({ workspaceId });
    revalidatePath("/dashboard");
    return Response.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}