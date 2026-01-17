import { Elysia } from "elysia";
import { openApi } from "@/plugins/open-api";
import env from "./env";

const app = new Elysia()
  .use(openApi)
  .get("/", () => "Hello Elysia")
  .listen({
    port: env.PORT || 3000,
    hostname: "0.0.0.0",
  });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
