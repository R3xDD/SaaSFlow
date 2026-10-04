# Authorization

SaaSFlow authentication answers who the user is. Authorization answers
whether that authenticated user may access a workspace resource.

## Current server-side flow

```text
Better Auth session
        |
        v
SaaSFlow User.authUserId
        |
        v
Membership(userId, workspaceId)
        |
        v
Workspace permission
        |
        v
Workspace-scoped query or mutation
```

The browser is not a security boundary. A client-supplied user ID, workspace
ID, project ID, or role must not be trusted for authorization.

## Current implementation

- `requireApplicationUser()` resolves the authenticated SaaSFlow user.
- `requireWorkspaceMembership()` verifies the user belongs to a workspace.
- `requireWorkspacePermission()` applies the central role-to-permission map.
- `getWorkspace()` requires workspace membership before returning a workspace.
- `createWorkspace()` derives the owner from the authenticated session.
- `createProject()` derives the creator from the authenticated session and
  requires `project:create` permission.
- `getProjectsWithTasks()` requires workspace access before querying projects.

The role model is already defined by the database contract:

```text
OWNER
ADMIN
MEMBER
```

Current project permissions are:

| Permission | OWNER | ADMIN | MEMBER |
| --- | --- | --- | --- |
| workspace:view | yes | yes | yes |
| project:create | yes | yes | yes |
| project:update | yes | yes | yes |
| project:delete | yes | yes | no |
| member:manage | yes | yes | no |
| role:change | yes | no | no |

## Remaining Phase 5 work

Task, comment, invitation, label, attachment, and activity mutations still
need server-side authorization at the point where those operations are added.
Each operation must verify the workspace boundary through its resource chain.

For example, task access must verify:

```text
Task -> Project -> Workspace -> Membership
```

No database migration is required for the current authorization layer. The
existing `Membership`, `Project.workspaceId`, and related foreign keys already
provide the required tenant model.

## Required verification

After authorization changes, run:

```powershell
npx tsc --noEmit
npx eslint lib/data/authorization.ts lib/data/errors.ts lib/data/workspaces.ts lib/data/projects.ts
npx prisma migration status
npx prisma db verify
```

Authorization tests should cover unauthenticated access, non-membership,
role boundaries, and cross-workspace project/task access before Phase 5 is
declared complete.