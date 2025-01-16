import Header from "@/components/Header";
import QuestionBank from "@/components/QuestionBank";
import { getCourseById } from "@/lib/firebaseUtils";

interface CourseProps {
  params: {
    courseId: string;
  };
}

export default async function CoursePage({ params }: CourseProps) {
  const { courseId } = params;

  const course = await getCourseById(courseId);

  return (
    <div>
      <QuestionBank course={course} />
    </div>
  )
}