import { auth } from "../src/auth/auth";

async function main() {
  const result = await auth.api.signUpEmail({
    body: {
      name: "Youssef",
      email: "youssef@saasflow.dev",
      password: "SaaSFlowDev123!",
    },
  });

  console.log(result);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});