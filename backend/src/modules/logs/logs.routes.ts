import Elysia, { status } from "elysia";
import { RaffleItemService } from "@/services/raffle-item.service";

export const logs = new Elysia({ prefix: "/logs" }).get(
  "/",
  async () => {
    try {
      const logsData = await RaffleItemService.getRaffleLogs();

      if (!logsData.success) {
        return status(500, {
          success: false,
          message: "Failed to retrieve raffle logs.",
        });
      }

      return status(200, {
        success: true,
        message: "Get all raffle logs successfully.",
        data: logsData.data,
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
      description: "Retrieve all raffle logs (winner history).",
      tags: ["Raffle"],
    },
  },
);
