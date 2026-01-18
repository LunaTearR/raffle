import { t } from "elysia";

/**
 * Validation schemas for user-related requests
 */
export namespace UserValidation {
  export const CreateUserBody = t.Object({
    studentId: t.String(),
    name: t.String(),
  });
}
