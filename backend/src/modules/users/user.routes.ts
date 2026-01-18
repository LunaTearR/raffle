import Elysia, { status } from "elysia";
import { UserService } from "@/services/user.service";
import { UserValidation } from "./user.validation";

export const user = new Elysia({ prefix: "/students" })
  .get(
    "/",
    async () => {
      try {
        const users = await UserService.getAllUsers();

        if (!users.success) {
          return status(500, {
            success: false,
            message: "Failed to retrieve users.",
          });
        }

        return status(200, {
          success: true,
          message: "Get all users successfully.",
          data: users.data,
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
        description: "Retrieve all users in the system.",
        tags: ["User"],
      },
    },
  )
  .post(
    "/",
    async ({ body }) => {
      try {
        if (!body.studentId || !body.name) {
          return status(400, {
            success: false,
            message: "studentId and name are required.",
          });
        }

        const studentId = body.studentId.trim();
        const name = body.name.trim();

        const response = await UserService.createUser({
          studentId,
          name,
          receivedAward: false,
        });

        if (response.statusCode !== 201) {
          if (response.statusCode === 400) {
            return status(400, {
              success: false,
              message: "User with the same studentId already exists.",
            });
          } else {
            return status(500, {
              success: false,
              message: "Failed to create user.",
            });
          }
        }

        return status(201, {
          success: true,
          message: "User created successfully.",
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
      body: UserValidation.CreateUserBody,
      detail: {
        description: "Create a new user with the provided data.",
        tags: ["User"],
      },
    },
  );
