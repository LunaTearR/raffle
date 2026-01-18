import mongoose, { Schema, type InferSchemaType } from "mongoose";

const RaffleItemSchema: Schema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  itemPic: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export type TRaffleItem = InferSchemaType<typeof RaffleItemSchema>;
export const RaffleItem = mongoose.model<TRaffleItem>(
  "RaffleItem",
  RaffleItemSchema,
  "raffle_items",
);
