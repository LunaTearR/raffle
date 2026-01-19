import { Elysia } from "elysia";
import { SystemState, SystemStateService } from "@/services/system.state";
import { User } from "@/models/user.model";
import { RaffleLog } from "@/models/raffle-log.model";
import { RaffleItem } from "@/models/raffle-item.model";

export const system = new Elysia({ prefix: "/system" })
  .get("/state", () => {
    return {
      success: true,
      data: {
        state: SystemStateService.getState()
      }
    };
  })
  .post("/start", () => {
    SystemStateService.setState(SystemState.RAFFLE_STARTED);
    return {
      success: true,
      message: "Raffle started. Registration closed.",
      data: {
        state: SystemStateService.getState()
      }
    };
  })
  .post("/end", () => {
    SystemStateService.setState(SystemState.RAFFLE_ENDED);
    return {
      success: true,
      message: "Raffle ended.",
      data: {
        state: SystemStateService.getState()
      }
    };
  })
  .post("/reset", async () => {
    try {
      // Clear all data
      await User.deleteMany({});
      await RaffleLog.deleteMany({});
      await RaffleItem.deleteMany({});

      // Reset state
      SystemStateService.setState(SystemState.REGISTRATION_OPEN);
      
      return {
        success: true,
        message: "System reset. Database cleared. Registration open.",
        data: {
          state: SystemStateService.getState()
        }
      };
    } catch (error) {
      console.error("Failed to reset system:", error);
      return {
        success: false,
        message: "Failed to reset system data",
        statusCode: 500
      };
    }
  });

