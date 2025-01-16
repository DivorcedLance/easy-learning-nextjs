export interface Classroom {
  id: string;
  courseId: string;
  courseName: string | null;
  codCourse: string | null;
  grade: number;
  schoolId: string;
  section: string;
  studentIds: string[];
  teacherId: string;
}