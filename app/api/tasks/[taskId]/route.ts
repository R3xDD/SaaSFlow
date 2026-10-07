import { revalidatePath } from "next/cache";
import { errorResponse } from "@/lib/server/http";
import { deleteTaskOperation, updateTaskOperation } from "@/lib/server/tasks";

type RouteContext = { params: Promise<{ taskId: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { taskId } = await context.params;
    const result = await updateTaskOperation({ ...(await request.json()), taskId });
    revalidatePath("/dashboard");
    return Response.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { taskId } = await context.params;
    const result = await deleteTaskOperation({ taskId });
    revalidatePath("/dashboard");
    return Response.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}