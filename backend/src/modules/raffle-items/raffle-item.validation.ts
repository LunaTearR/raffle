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
}
