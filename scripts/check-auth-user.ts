import "dotenv/config";
import { Client } from "pg";

async function main() {
  const client = new Client({
    connectionString: process.env["DATABASE_URL"],
  });

  await client.connect();

  const result = await client.query(
    'SELECT id, email, name, "emailVerified" FROM "user"'
  );

  console.table(result.rows);

  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});