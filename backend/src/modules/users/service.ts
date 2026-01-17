import { User } from "@/models/user";
import type { userType } from "@/types/user";
import { status } from "elysia";

export abstract class UserService {
  static async getAllUsers() {
    try {
      const users = await User.find(
        {},
        { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 },
      );

      const result = users.map((user) => ({
        studentId: user.studentId,
        name: user.name,
        receivedAward: user.receivedAward,
      }));
      return status(200, {
        success: true,
        message: "Users retrieved successfully.",
        data: result,
      });
    } catch (error) {
      console.error("Error retrieving users:", error);
      return status(500, {
        success: false,
        message: "Error retrieving users",
      });
    }
  }

  static async createUserFormData(data: userType) {
    try {
      const existsUser = await User.findOne({ studentId: data.studentId });

      if (existsUser) {
        return {
          success: false,
          message: "User with the same studentId already exists.",
          statusCode: 400,
        };
      }

      const newUser = new User({
        studentId: data.studentId,
        name: data.name,
      });

      await newUser.save();

      const result = { studentId: newUser.studentId, name: newUser.name };

      return {
        success: true,
        message: "User created successfully.",
        data: result,
        statusCode: 201,
      };
    } catch (error) {
      console.error("Error creating user:", error);
      return {
        success: false,
        message: "Error creating user",
        statusCode: 500,
      };
    }
  }
}
