import { Elysia } from "elysia";
import { openApi } from "@/plugins/open-api";
import env from "./env";
import { user } from "@/modules/users";
import mongoose from "mongoose";

try {
  await mongoose.connect(env.DATABASE_URL);
  console.log("✅ Connected to the database successfully.");
} catch (error) {
  console.error("❌ Failed to connect to the database:", error);
}

const app = new Elysia()
  .use(openApi)
  .use(user)
  .listen({
    port: env.PORT || 3000,
    hostname: "0.0.0.0",
  });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
