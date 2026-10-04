import "dotenv/config";
import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { db } from "../prisma/db";

const pool = new Pool({
  connectionString: process.env["DATABASE_URL"],
});

export const auth = betterAuth({
  database: pool,

  emailAndPassword: {
    enabled: true,
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await db.orm.public.User.create({
            authUserId: user.id,
            email: user.email,
            name: user.name,
            ...(user.image ? { avatarUrl: user.image } : {}),
          });
        },
      },
    },
  },

  baseURL: process.env["BETTER_AUTH_URL"],
  secret: process.env["BETTER_AUTH_SECRET"],
});
