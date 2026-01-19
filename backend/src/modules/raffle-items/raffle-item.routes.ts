import Elysia, { status, t } from "elysia";
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
  )
  .post(
    "/import",
    async ({ body }) => {
      try {
        const fileContent = await body.file.text();
        const rows = fileContent.split('\n');
        
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i]?.trim();
          if (!row) continue;
          
          // Basic CSV parsing (handles simple commas)
          const cols = row.split(',').map(c => c.trim());
          
          // unexpected empty or header
          if (cols.length < 2) continue;
          
          const col0 = cols[0] || "";
          if (i === 0 && col0.toLowerCase() === 'name') continue; // Skip header

          const name = col0;
          const quantityStr = cols[1] || "0";
          const quantity = parseInt(quantityStr);
          const itemPic = cols[2] || ""; // Optional pic

          if (!name || isNaN(quantity)) {
            failCount++;
            continue;
          }

          const response = await RaffleItemService.createRaffleItem({
            name,
            quantity,
            itemPic
          });

          if (response.success) {
            successCount++;
          } else {
            failCount++;
          }
        }

        return status(200, {
          success: true,
          message: `Import processed. Success: ${successCount}, Failed: ${failCount}`,
          data: { successCount, failCount }
        });

      } catch (error) {
        console.error('Import error:', error);
        return status(500, {
          success: false,
          message: "Failed to process import file"
        });
      }
    },
    {
      body: t.Object({
        file: t.File()
      }),
      detail: {
        description: "Import raffle items from CSV file",
        tags: ["Raffle Items"]
      }
    }
  )
  .put(
    "/:id",
    async ({ params, body }) => {
      try {
        const response = await RaffleItemService.updateRaffleItem(
          params.id,
          {
            name: body.name,
            quantity: body.quantity,
            itemPic: body.itemPic,
          }
        );

        if (!response.success) {
          return status(response.statusCode, {
            success: false,
            message: response.message,
          });
        }

        return status(200, {
          success: true,
          message: "Raffle item updated successfully.",
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
      body: RaffleItemValidation.UpdateItemBody,
      detail: {
        description: "Update a raffle item.",
        tags: ["Raffle Items"],
      },
    }
  )
  .delete(
    "/:id",
    async ({ params }) => {
      try {
        const response = await RaffleItemService.deleteRaffleItem(params.id);

        if (!response.success) {
          return status(response.statusCode, {
            success: false,
            message: response.message,
          });
        }

        return status(200, {
          success: true,
          message: "Raffle item deleted successfully.",
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
        description: "Delete a raffle item.",
        tags: ["Raffle Items"],
      },
    }
  );
