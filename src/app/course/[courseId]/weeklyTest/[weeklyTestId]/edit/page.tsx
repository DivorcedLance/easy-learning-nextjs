import { EvaluationEditor } from "@/components/EvaluationEditor";
import { getEvaluationAndQuestionsById } from "@/lib/firebaseUtils";

interface EditWeeklyTestProps {
  params: {
    courseId: string;
    weeklyTestId: string;
  };
}

export default async function EditWeeklyTestPage({ params }: EditWeeklyTestProps) {

  const { courseId, weeklyTestId } = params;

  const evaluation = await getEvaluationAndQuestionsById(weeklyTestId);

  return (
    
    <div>
        <EvaluationEditor courseId={courseId} evaluation={evaluation} evaluationType="weeklyTest" />
    </div>
  )
}
