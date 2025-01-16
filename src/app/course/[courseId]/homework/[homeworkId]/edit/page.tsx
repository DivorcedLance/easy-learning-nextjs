import { EvaluationEditor } from "@/components/EvaluationEditor";
import { getEvaluationAndQuestionsById } from "@/lib/firebaseUtils";

interface EditHomeworkProps {
  params: {
    courseId: string;
    homeworkId: string;
  };
}

export default async function EditHomeworkPage({ params }: EditHomeworkProps) {

  const { courseId, homeworkId } = params;

  const evaluation = await getEvaluationAndQuestionsById(homeworkId);

  return (
    
    <div>
        <EvaluationEditor courseId={courseId} evaluation={evaluation} evaluationType="homework" />
    </div>
  )
}
