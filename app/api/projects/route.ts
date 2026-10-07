import { revalidatePath } from "next/cache";
import { createProjectOperation, listProjectsOperation } from "@/lib/server/projects";
import { errorResponse } from "@/lib/server/http";

export async function GET(request: Request) {
  try {
    const workspaceId = new URL(request.url).searchParams.get("workspaceId");
    return Response.json(await listProjectsOperation({ workspaceId }));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const result = await createProjectOperation(await request.json());
    revalidatePath("/dashboard");
    return Response.json(result, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}