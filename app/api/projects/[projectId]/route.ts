import { errorResponse } from "@/lib/server/http";
import { deleteProjectOperation, updateProjectOperation } from "@/lib/server/projects";

type RouteContext = { params: Promise<{ projectId: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { projectId } = await context.params;
    return Response.json(
      await updateProjectOperation({ ...(await request.json()), projectId }),
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { projectId } = await context.params;
    return Response.json(await deleteProjectOperation({ projectId }));
  } catch (error) {
    return errorResponse(error);
  }
}