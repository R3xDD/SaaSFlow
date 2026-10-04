import { auth } from "../src/auth/auth";

async function main() {
  const [email, password] = process.argv.slice(2);

  if (!email || !password) {
    throw new Error("Usage: tsx scripts/verify-auth-login.ts <email> <password>");
  }

  const result = await auth.api.signInEmail({
    body: { email, password },
  });

  if (!result) {
    throw new Error("Better Auth sign-in returned no result.");
  }

  console.log("Better Auth sign-in and session creation succeeded.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
