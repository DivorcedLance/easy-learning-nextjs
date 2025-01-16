export interface Evaluation {
  id: string;
  title: string;
  duration?: string;
  courseId: string;
  grade: number;
  schoolId: string;
  week?: number;
  questionIds: string[];
  questions?: Question[];
  evaluationType: string;
}

