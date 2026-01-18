import { t } from "elysia";

/**
 * Validation schemas for registration requests
 */
export namespace RegistrationValidation {
  export const RegisterBody = t.Object({
    std_id: t.String(),
  });
}
