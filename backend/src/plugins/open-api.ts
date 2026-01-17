import env from "@/env";
import { fromTypes, openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import * as z from "zod";

export const openApi = new Elysia()
  .use(
    openapi({
      references: fromTypes(
        env.NODE_ENV === "production" ? "dist/src/main.d.ts" : "src/main.ts",
      ),
      mapJsonSchema: {
        zod: z.toJSONSchema,
      },
      documentation: {
        info: {
          title: "Raffle API",
          description: "API documentation for the Raffle system",
          version: "1.0.0",
        },
        tags: [
          { name: "User", description: "Endpoints related to user management" },
        ],
      },
    }),
  )
  .as("global");
