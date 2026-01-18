import Elysia, { status } from "elysia";
import { RegistrationService } from "@/services/registration.service";
import { RegistrationValidation } from "./registration.validation";

export const regis = new Elysia({ prefix: "/regis" }).post(
  "/",
  async ({ body }) => {
    try {
      const stdId = body.std_id.trim();

      const response = await RegistrationService.registerStudent(stdId);

      if (response.statusCode !== 201) {
        return status(response.statusCode, {
          success: false,
          message: response.message,
        });
      }

      return status(201, {
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
    body: RegistrationValidation.RegisterBody,
    detail: {
      description: "Register a new student with student ID validation.",
      tags: ["Registration"],
    },
  },
);
