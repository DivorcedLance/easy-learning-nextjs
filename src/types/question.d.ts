import { Timestamp } from "@firebase/firestore";

export type Question = {
  id?: string
  courseId: string;
  data: Record<string, any>;
  grade: number;
  learningStylesIds: string[];
  schoolId: string;
  templateId: string;
  topics: string[];
  lastModified: string;
}