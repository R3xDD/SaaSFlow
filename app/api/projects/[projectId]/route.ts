import { revalidatePath } from "next/cache";
import { errorResponse } from "@/lib/server/http";
import { deleteProjectOperation, updateProjectOperation } from "@/lib/server/projects";

type RouteContext = { params: Promise<{ projectId: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { projectId } = await context.params;
    const result = await updateProjectOperation({ ...(await request.json()), projectId });
    revalidatePath("/dashboard");
    return Response.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { projectId } = await context.params;
    const result = await deleteProjectOperation({ projectId });
    revalidatePath("/dashboard");
    return Response.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}