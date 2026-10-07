import { revalidatePath } from "next/cache";
import { errorResponse } from "@/lib/server/http";
import { createTaskOperation, listTasksOperation } from "@/lib/server/tasks";

export async function GET(request: Request) {
  try {
    const projectId = new URL(request.url).searchParams.get("projectId");
    return Response.json(await listTasksOperation({ projectId }));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const result = await createTaskOperation(await request.json());
    revalidatePath("/dashboard");
    return Response.json(result, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}