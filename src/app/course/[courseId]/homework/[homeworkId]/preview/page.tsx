import { EvaluationPreview } from "@/components/EvaluationPreview";
import { getEvaluationAndQuestionsById } from "@/lib/firebaseUtils";

interface PreviewHomeworkProps {
  params: {
    courseId: string;
    homeworkId: string;
  };
}

export default async function PreviewHomeworkPage({ params }: PreviewHomeworkProps) {

  const { courseId, homeworkId } = params;

  const evaluation = await getEvaluationAndQuestionsById(homeworkId);

  return (
    
    <div>
        <EvaluationPreview evaluation={evaluation} />
    </div>
  )
}
