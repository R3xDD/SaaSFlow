import "dotenv/config";
import { Client } from "pg";

async function main() {
  const client = new Client({
    connectionString: process.env["DATABASE_URL"],
  });

  await client.connect();

  const result = await client.query(`
    SELECT
      'Membership' AS table_name,
      COUNT(*)::int AS count
    FROM "Membership"
    WHERE "userId" = '2067705f-5a40-4b4e-b2e2-92945b8684c0'

    UNION ALL

    SELECT
      'Project' AS table_name,
      COUNT(*)::int AS count
    FROM "Project"
    WHERE "createdById" = '2067705f-5a40-4b4e-b2e2-92945b8684c0'

    UNION ALL

    SELECT
      'Task created' AS table_name,
      COUNT(*)::int AS count
    FROM "Task"
    WHERE "createdById" = '2067705f-5a40-4b4e-b2e2-92945b8684c0'

    UNION ALL

    SELECT
      'Task assigned' AS table_name,
      COUNT(*)::int AS count
    FROM "Task"
    WHERE "assigneeId" = '2067705f-5a40-4b4e-b2e2-92945b8684c0'

    UNION ALL

    SELECT
      'Comment' AS table_name,
      COUNT(*)::int AS count
    FROM "Comment"
    WHERE "authorId" = '2067705f-5a40-4b4e-b2e2-92945b8684c0'

    UNION ALL

    SELECT
      'Attachment' AS table_name,
      COUNT(*)::int AS count
    FROM "Attachment"
    WHERE "uploadedById" = '2067705f-5a40-4b4e-b2e2-92945b8684c0'

    UNION ALL

    SELECT
      'Invitation' AS table_name,
      COUNT(*)::int AS count
    FROM "Invitation"
    WHERE "invitedById" = '2067705f-5a40-4b4e-b2e2-92945b8684c0'

    UNION ALL

    SELECT
      'Activity' AS table_name,
      COUNT(*)::int AS count
    FROM "Activity"
    WHERE "actorId" = '2067705f-5a40-4b4e-b2e2-92945b8684c0';
  `);

  console.table(result.rows);

  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});