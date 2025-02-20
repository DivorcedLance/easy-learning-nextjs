export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  codTeacher?: string;
  codStudent?: string;
  sex: string;
  profilePictureLink: string | null;
  currentGrade?: number;
  role: "teacher" | "student" | "principal";
  schoolId: string;
  state: boolean | null;
}