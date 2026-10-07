import { revalidatePath } from "next/cache";
import { errorResponse } from "@/lib/server/http";
import { changeMemberRoleOperation, listMembersOperation, removeMemberOperation } from "@/lib/server/members";

type RouteContext = { params: Promise<{ workspaceId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { workspaceId } = await context.params;
    return Response.json(await listMembersOperation({ workspaceId }));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { workspaceId } = await context.params;
    const result = await changeMemberRoleOperation({ ...(await request.json()), workspaceId });
    revalidatePath("/dashboard");
    return Response.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { workspaceId } = await context.params;
    const result = await removeMemberOperation({ ...(await request.json()), workspaceId });
    revalidatePath("/dashboard");
    return Response.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}