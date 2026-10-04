import { errorResponse } from "@/lib/server/http";
import { deleteTaskOperation, updateTaskOperation } from "@/lib/server/tasks";

type RouteContext = { params: Promise<{ taskId: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { taskId } = await context.params;
    return Response.json(
      await updateTaskOperation({ ...(await request.json()), taskId }),
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { taskId } = await context.params;
    return Response.json(await deleteTaskOperation({ taskId }));
  } catch (error) {
    return errorResponse(error);
  }
}