import { EvaluationPreview } from "@/components/EvaluationPreview";
import { getEvaluationAndQuestionsById } from "@/lib/firebaseUtils";

interface PreviewReinforcementProps {
  params: {
    courseId: string;
    reinforcementId: string;
  };
}

export default async function PreviewReinforcementPage({ params }: PreviewReinforcementProps) {

  const { courseId, reinforcementId } = params;

  const evaluation = await getEvaluationAndQuestionsById(reinforcementId);

  return (
    
    <div>
        <EvaluationPreview evaluation={evaluation} />
    </div>
  )
}
