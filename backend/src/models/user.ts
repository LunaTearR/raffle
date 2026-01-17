import mongoose, { Schema, type InferSchemaType } from "mongoose";

const UserSchema: Schema = new Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  receivedAward: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export type TUser = InferSchemaType<typeof UserSchema>;
export const User = mongoose.model<TUser>("User", UserSchema, "users");
