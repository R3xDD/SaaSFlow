import "dotenv/config";
import { Client } from "pg";

async function main() {
  const client = new Client({
    connectionString: process.env["DATABASE_URL"],
  });

  await client.connect();

  const tables = ["user", "account", "session"];

  for (const table of tables) {
    const result = await client.query(
      `SELECT COUNT(*)::int AS count FROM "${table}"`
    );

    console.log(`${table}: ${result.rows[0].count}`);
  }

  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});