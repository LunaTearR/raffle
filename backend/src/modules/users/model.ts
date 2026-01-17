import { t } from "elysia";

export namespace UserModel {
  export const InputFormBody = t.Object({
    studentId: t.String(),
    name: t.String(),
  });
}
