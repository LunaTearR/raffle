import Elysia, { status } from "elysia";
import { RaffleItemService } from "@/services/raffle-item.service";
import { RaffleItemValidation } from "./raffle-item.validation";

export const raffleItem = new Elysia({ prefix: "/raffle_items" })
  .get(
    "/",
    async () => {
      try {
        const items = await RaffleItemService.getAllRaffleItems();

        if (!items.success) {
          return status(500, {
            success: false,
            message: "Failed to retrieve raffle items.",
          });
        }

        return status(200, {
          success: true,
          message: "Get all raffle items successfully.",
          data: items.data,
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
        description: "Retrieve all raffle items in the system.",
        tags: ["Raffle Items"],
      },
    },
  )
  .post(
    "/",
    async ({ body }) => {
      try {
        const response = await RaffleItemService.createRaffleItem({
          name: body.name,
          quantity: body.quantity,
          itemPic: body.itemPic,
        });

        if (response.statusCode !== 201) {
          return status(500, {
            success: false,
            message: "Failed to create raffle item.",
          });
        }

        return status(201, {
          success: true,
          message: "Raffle item created successfully.",
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
      body: RaffleItemValidation.CreateItemBody,
      detail: {
        description: "Create a new raffle item with the provided data.",
        tags: ["Raffle Items"],
      },
    },
  );
