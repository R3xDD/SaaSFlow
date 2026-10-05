import { errorResponse } from "@/lib/server/http";
import { createWorkspaceOperation, listWorkspacesOperation } from "@/lib/server/workspaces";

export async function GET() {
  try {
    return Response.json(await listWorkspacesOperation());
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    return Response.json(await createWorkspaceOperation(await request.json()), { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}