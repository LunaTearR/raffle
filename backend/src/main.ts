import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { openApi } from "@/plugins/open-api";
import env from "./env";
import { user } from "@/modules/users/user.routes";
import { regis } from "@/modules/registration/registration.routes";
import { raffleItem } from "@/modules/raffle-items/raffle-item.routes";
import { raffle } from "@/modules/raffle/raffle.routes";
import { logs } from "@/modules/logs/logs.routes";
import { system } from "@/modules/system/system.routes";
import mongoose from "mongoose";

try {
  await mongoose.connect(env.DATABASE_URL);
  console.log("✅ Connected to the database successfully.");
} catch (error) {
  console.error("❌ Failed to connect to the database:", error);
}

const app = new Elysia()
  .use(cors({
    origin: ["http://localhost:5174"],
    credentials: true,
  }))
  .use(openApi)
  .use(regis)
  .use(user)
  .use(raffleItem)
  .use(raffle)
  .use(logs)
  .use(system)
  .listen({
    port: env.PORT || 3000,
    hostname: "0.0.0.0",
  });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
