import Elysia, { status } from "elysia";
import { RaffleItemService } from "@/services/raffle-item.service";

export const raffle = new Elysia({ prefix: "/raffle" }).get(
  "/",
  async ({ query }) => {
    try {
      const n = query.n ? parseInt(query.n as string) : 1;

      if (isNaN(n) || n < 1) {
        return status(400, {
          success: false,
          message: "Invalid parameter 'n'. Must be a positive integer.",
        });
      }

      const response = await RaffleItemService.performRaffle(n);

      if (response.statusCode !== 200) {
        return status(response.statusCode, {
          success: false,
          message: response.message,
        });
      }

      return status(200, {
        success: true,
        message: response.message,
        data: response.data,
      });
    } catch (error) {
      return status(500, {
        success: false,
        message: "Internal Server Error",
      });
    }
  },
  {
    detail: {
      description:
        "Perform raffle to randomly select n winners from available students.",
      tags: ["Raffle"],
    },
  },
);
