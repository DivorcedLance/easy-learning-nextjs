import { EvaluationEditor } from "@/components/EvaluationEditor";

interface CreateReinforcementProps {
  params: {
    courseId: string;
  };
}

export default async function CreateReinforcementPage({ params }: CreateReinforcementProps) {

  const { courseId } = params;

  return (
    
    <div>
        <EvaluationEditor courseId={courseId} evaluation={null} evaluationType="reinforcement" />
    </div>
  )
}
