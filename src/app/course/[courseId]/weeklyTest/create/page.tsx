import { EvaluationEditor } from "@/components/EvaluationEditor";

interface CreateWeeklyTestProps {
  params: {
    courseId: string;
  };
}

export default async function CreateWeeklyTestPage({ params }: CreateWeeklyTestProps) {

  const { courseId } = params;

  return (
    
    <div>
        <EvaluationEditor courseId={courseId} evaluation={null} evaluationType="weeklyTest" />
    </div>
  )
}
