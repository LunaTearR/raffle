import { RaffleItem } from "@/models/raffle-item.model";
import { RaffleLog } from "@/models/raffle-log.model";
import { User } from "@/models/user.model";

export abstract class RaffleItemService {
  /**
   * Get all raffle items
   */
  static async getAllRaffleItems() {
    try {
      const items = await RaffleItem.find(
        {},
        { __v: 0, createdAt: 0, updatedAt: 0 },
      );

      return {
        success: true,
        message: "Raffle items retrieved successfully.",
        data: items,
        statusCode: 200,
      };
    } catch (error) {
      console.error("Error retrieving raffle items:", error);
      return {
        success: false,
        message: "Error retrieving raffle items",
        statusCode: 500,
      };
    }
  }

  /**
   * Create a new raffle item
   */
  static async createRaffleItem(data: {
    name: string;
    quantity: number;
    itemPic?: string;
  }) {
    try {
      const newItem = new RaffleItem({
        name: data.name,
        quantity: data.quantity,
        itemPic: data.itemPic || "",
      });

      await newItem.save();

      return {
        success: true,
        message: "Raffle item created successfully.",
        data: {
          _id: newItem._id,
          name: newItem.name,
          quantity: newItem.quantity,
          itemPic: newItem.itemPic,
        },
        statusCode: 201,
      };
    } catch (error) {
      console.error("Error creating raffle item:", error);
      return {
        success: false,
        message: "Error creating raffle item",
        statusCode: 500,
      };
    }
  }

  /**
   * Update a raffle item
   */
  static async updateRaffleItem(
    id: string,
    data: { name?: string; quantity?: number; itemPic?: string }
  ) {
    try {
      const updatedItem = await RaffleItem.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
      );

      if (!updatedItem) {
        return {
          success: false,
          message: "Raffle item not found",
          statusCode: 404,
        };
      }

      return {
        success: true,
        message: "Raffle item updated successfully.",
        data: updatedItem,
        statusCode: 200,
      };
    } catch (error) {
      console.error("Error updating raffle item:", error);
      return {
        success: false,
        message: "Error updating raffle item",
        statusCode: 500,
      };
    }
  }

  /**
   * Delete a raffle item
   */
  static async deleteRaffleItem(id: string) {
    try {
      const deletedItem = await RaffleItem.findByIdAndDelete(id);

      if (!deletedItem) {
        return {
          success: false,
          message: "Raffle item not found",
          statusCode: 404,
        };
      }

      return {
        success: true,
        message: "Raffle item deleted successfully.",
        statusCode: 200,
      };
    } catch (error) {
      console.error("Error deleting raffle item:", error);
      return {
        success: false,
        message: "Error deleting raffle item",
        statusCode: 500,
      };
    }
  }

  /**
   * Perform raffle - randomly select n winners
   */
  static async performRaffle(n: number = 1) {
    try {
      // Get students who haven't received an award yet
      const availableStudents = await User.find({ receivedAward: false });

      if (availableStudents.length === 0) {
        return {
          success: false,
          message: "No available students to raffle.",
          statusCode: 400,
        };
      }

      // Get available items (quantity > 0)
      const availableItems = await RaffleItem.find({ quantity: { $gt: 0 } });

      if (availableItems.length === 0) {
        return {
          success: false,
          message: "No available items to raffle.",
          statusCode: 400,
        };
      }

      // Limit n to available students
      const actualN = Math.min(n, availableStudents.length);

      // Randomly select n students
      const shuffledStudents = availableStudents.sort(
        () => Math.random() - 0.5,
      );
      const selectedStudents = shuffledStudents.slice(0, actualN);

      const results = [];

      for (const student of selectedStudents) {
        // Check if there are still available items
        if (availableItems.length === 0) {
          console.warn(`No more items available for student ${student.studentId}`);
          break;
        }

        // Randomly select an item from available items
        const randomItem =
          availableItems[Math.floor(Math.random() * availableItems.length)];

        if (!randomItem || !randomItem._id) {
          console.error("Invalid item selected");
          break;
        }

        // Create raffle log
        const log = new RaffleLog({
          studentId: student.studentId,
          itemId: randomItem._id.toString(),
        });
        await log.save();

        // Update student's receivedAward status
        student.receivedAward = true;
        await student.save();

        // Decrease item quantity using atomic update
        const newQuantity = (randomItem.quantity as number) - 1;
        await RaffleItem.updateOne(
          { _id: randomItem._id },
          { $inc: { quantity: -1 } }
        );

        // Remove item from available items if quantity will be 0
        if (newQuantity === 0) {
          const index = availableItems.indexOf(randomItem);
          if (index > -1) {
            availableItems.splice(index, 1);
          }
        }

        results.push({
          studentId: student.studentId,
          name: student.name,
          item: {
            _id: randomItem._id,
            name: randomItem.name,
            itemPic: randomItem.itemPic,
          },
        });
      }

      return {
        success: true,
        message: `Raffle completed successfully. ${actualN} winner(s) selected.`,
        data: results,
        statusCode: 200,
      };
    } catch (error) {
      console.error("Error performing raffle:", error);
      return {
        success: false,
        message: "Error performing raffle",
        statusCode: 500,
      };
    }
  }

  /**
   * Get all raffle logs
   */
  static async getRaffleLogs() {
    try {
      const logs = await RaffleLog.find({}, { __v: 0 })
        .populate("itemId", "name itemPic")
        .sort({ timestamp: -1 });

      const formattedLogs = logs.map((log) => ({
        studentId: log.studentId,
        item: log.itemId,
        timestamp: log.timestamp,
      }));

      return {
        success: true,
        message: "Raffle logs retrieved successfully.",
        data: formattedLogs,
        statusCode: 200,
      };
    } catch (error) {
      console.error("Error retrieving raffle logs:", error);
      return {
        success: false,
        message: "Error retrieving raffle logs",
        statusCode: 500,
      };
    }
  }
}
