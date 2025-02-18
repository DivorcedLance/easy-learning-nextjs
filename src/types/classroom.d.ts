export interface Classroom {
  id: string;
  courseId: string;
  courseName: string | null;
  codCourse: string | null;
  courseGradeId: string | null;
  grade: number;
  schoolId: string;
  section: string;
  studentIds: string[];
  teacherId: string;
  teacherName: string | null;
}

export interface NewClassroom {
    grade: number;
    section: string;
    teacherId: string;
    courseId?: string;
}