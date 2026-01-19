import { User } from "@/models/user.model";
import { validateStudentId } from "@/utils/validation";
import { SystemStateService } from "@/services/system.state";

export abstract class RegistrationService {
  /**
   * Register a student
   */
  static async registerStudent(stdId: string) {
    try {
      // Check if registration is open
      if (!SystemStateService.isRegistrationOpen()) {
        return {
          success: false,
          message: "Registration is currently closed.",
          statusCode: 403,
        };
      }

      // Validate format
      if (!validateStudentId(stdId)) {
        return {
          success: false,
          message: "Invalid student ID format. Must be 8 digits.",
          statusCode: 400,
        };
      }

      // Check if student already exists
      const existingStudent = await User.findOne({ studentId: stdId });

      if (existingStudent) {
        return {
          success: false,
          message: "Student with this ID is already registered.",
          statusCode: 400,
        };
      }

      // Create new student (name can be empty or generated)
      const newStudent = new User({
        studentId: stdId,
        name: `Student ${stdId}`, // Auto-generate name or leave empty
        receivedAward: false,
      });

      await newStudent.save();

      return {
        success: true,
        message: "Student registered successfully.",
        data: {
          studentId: newStudent.studentId,
          name: newStudent.name,
        },
        statusCode: 201,
      };
    } catch (error) {
      console.error("Error registering student:", error);
      return {
        success: false,
        message: "Error registering student",
        statusCode: 500,
      };
    }
  }
}
