/**
 * Validate student ID format
 * Student ID must be exactly 8 digits
 */
export function validateStudentId(stdId: string): boolean {
  const regex = /^\d{8}$/;
  return regex.test(stdId);
}
