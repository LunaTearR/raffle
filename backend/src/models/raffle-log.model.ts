import mongoose, { Schema, type InferSchemaType } from "mongoose";

const RaffleLogSchema: Schema = new Schema({
  studentId: { type: String, required: true },
  itemId: { type: Schema.Types.ObjectId, ref: "RaffleItem", required: true },
  timestamp: { type: Date, default: Date.now },
});

export type TRaffleLog = InferSchemaType<typeof RaffleLogSchema>;
export const RaffleLog = mongoose.model<TRaffleLog>(
  "RaffleLog",
  RaffleLogSchema,
  "raffle_logs",
);
