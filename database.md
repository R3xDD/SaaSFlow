# SaaSFlow Database Design

## 1. Purpose

This document describes the initial domain model and relationships for SaaSFlow.

This is a conceptual design for Phase 0. It is not yet a Prisma schema or SQL migration.

## 2. Domain Entities

### User

Represents a person using SaaSFlow.

Responsibilities:
- Identity/profile information
- Authentication-related identity
- Relationship with workspaces through Membership

### Workspace

Represents a team or company boundary.

Responsibilities:
- Tenant/security boundary
- Contains projects
- Contains memberships
- Contains workspace-level labels and activity

### Membership

Represents the relationship between a User and a Workspace.

Responsibilities:
- Connects a user to a workspace
- Stores the user's role in that workspace
- Supports multi-tenancy and authorization

Initial roles:
- OWNER
- ADMIN
- MEMBER

### Project

Represents a unit of work inside a Workspace.

Responsibilities:
- Belongs to a workspace
- Groups tasks
- Can be created, edited, archived, and deleted according to permissions

### Task

Represents an individual work item.

Responsibilities:
- Belongs to a project
- Can be assigned to a user
- Has status
- Has priority
- Can have a due date
- Can have labels
- Can have comments
- Can have attachments
- Can produce activity records

### Comment

Represents discussion attached to a Task.

Responsibilities:
- Belongs to a task
- Stores the author and comment content
- Supports team communication

### Label

Represents reusable task classification inside a Workspace.

Responsibilities:
- Belongs to a workspace
- Can be associated with many tasks

### TaskLabel

Join entity connecting Tasks and Labels.

Responsibilities:
- Implements the many-to-many relationship between Task and Label

### Attachment

Represents metadata about a stored file.

Responsibilities:
- Belongs to a task
- Stores metadata about the file
- Actual file content will later live in object storage

### Invitation

Represents an invitation for a person to join a Workspace.

Responsibilities:
- Belongs to a workspace
- Identifies the invited email/user information
- Tracks invitation state

### Activity

Represents an important action/history event.

Responsibilities:
- Belongs to a workspace and/or relevant resource
- Records important actions for audit/history
- Can later power activity feeds and analytics

## 3. Main Relationships

```text
User
 |
 | 1-to-many
 v
Membership
 |
 | many-to-1
 v
Workspace
 |
 +--------------------+
 |                    |
 | 1-to-many          | 1-to-many
 v                    v
Project              Label
 |
 | 1-to-many
 v
Task
 |
 +----------+----------+----------+
 |          |          |          |
 v          v          v          v
Comment  Attachment  TaskLabel  Activity
                      |
                      v
                     Label
```

## 4. Relationship Details

### User ↔ Workspace

A User can belong to multiple Workspaces.

A Workspace can contain multiple Users.

This is implemented through Membership:

```text
User 1 ---- * Membership * ---- 1 Workspace
```

Membership stores the user's role.

### Workspace → Project

One Workspace can contain many Projects.

Each Project belongs to one Workspace.

```text
Workspace 1 ---- * Project
```

### Project → Task

One Project can contain many Tasks.

Each Task belongs to one Project.

```text
Project 1 ---- * Task
```

### Task → Comment

One Task can contain many Comments.

Each Comment belongs to one Task.

```text
Task 1 ---- * Comment
```

### Workspace → Label

A Workspace can contain many Labels.

Labels are reusable inside the workspace.

```text
Workspace 1 ---- * Label
```

### Task ↔ Label

A Task can have multiple Labels.

A Label can be attached to multiple Tasks.

Therefore this is a many-to-many relationship implemented through TaskLabel.

```text
Task 1 ---- * TaskLabel * ---- 1 Label
```

### Task → Attachment

A Task can have multiple Attachments.

```text
Task 1 ---- * Attachment
```

### Workspace → Invitation

A Workspace can have multiple pending or historical Invitations.

```text
Workspace 1 ---- * Invitation
```

### Workspace → Activity

A Workspace can have many Activity records.

Activity records can describe important actions performed by users.

```text
Workspace 1 ---- * Activity
```

## 5. Initial Ownership Rules

The initial ownership model is:

```text
Workspace
 ├── Members through Membership
 ├── Projects
 ├── Labels
 ├── Invitations
 └── Activity

Project
 └── Tasks

Task
 ├── Comments
 ├── Attachments
 └── Labels through TaskLabel
```

The exact database foreign keys, constraints, indexes, and cascade behavior will be decided during Phase 2.

## 6. Important Design Principle

Workspace is the primary tenant boundary.

Every query involving workspace-owned resources must eventually verify that the current user has membership and appropriate permission in that workspace.

This must be enforced on the server, not only by hiding UI elements.

## 7. Future Database Questions

Before implementing the Prisma schema, decide:

- Which IDs should be used?
- Which fields are required?
- Which fields are optional?
- Which fields must be unique?
- What exact status values exist?
- What exact priority values exist?
- What happens when a project is deleted?
- What happens when a workspace member is removed?
- What indexes are needed for search/filter queries?
- How should invitations expire?
- How should activity records reference resources?
