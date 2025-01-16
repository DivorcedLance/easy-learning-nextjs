export interface Material {
  id: string;
  courseId: string;
  grade: number;
  homeworkIds: string[];
  schoolId: string;
  reinforcementIds: string[];
  weeklyTestIds: string[];
}