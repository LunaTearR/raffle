import { t } from "elysia";

/**
 * Validation schemas for raffle item requests
 */
export namespace RaffleItemValidation {
  export const CreateItemBody = t.Object({
    name: t.String(),
    quantity: t.Number({ minimum: 0 }),
    itemPic: t.Optional(t.String()),
  });
  export const UpdateItemBody = t.Object({
    name: t.Optional(t.String()),
    quantity: t.Optional(t.Number({ minimum: 0 })),
    itemPic: t.Optional(t.String()),
  });
}
