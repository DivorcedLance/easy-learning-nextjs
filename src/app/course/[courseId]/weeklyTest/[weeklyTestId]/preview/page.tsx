import { EvaluationPreview } from "@/components/EvaluationPreview";
import { getEvaluationAndQuestionsById } from "@/lib/firebaseUtils";

interface PreviewWeeklyTestProps {
  params: {
    courseId: string;
    weeklyTestId: string;
  };
}

export default async function PreviewWeeklyTestPage({ params }: PreviewWeeklyTestProps) {

  const { courseId, weeklyTestId } = params;

  const evaluation = await getEvaluationAndQuestionsById(weeklyTestId);

  return (
    
    <div>
        <EvaluationPreview evaluation={evaluation} />
    </div>
  )
}
