import { EvaluationEditor } from "@/components/EvaluationEditor";
import { getEvaluationAndQuestionsById } from "@/lib/firebaseUtils";

interface EditReinforcementProps {
  params: {
    courseId: string;
    reinforcementId: string;
  };
}

export default async function EditReinforcementPage({ params }: EditReinforcementProps) {

  const { courseId, reinforcementId } = params;

  const evaluation = await getEvaluationAndQuestionsById(reinforcementId);

  return (
    
    <div>
        <EvaluationEditor courseId={courseId} evaluation={evaluation} evaluationType="reinforcement" />
    </div>
  )
}
