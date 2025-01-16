import { EvaluationEditor } from "@/components/EvaluationEditor";

interface CreateHomeworkProps {
  params: {
    courseId: string;
  };
}

export default async function CreateHomeworkPage({ params }: CreateHomeworkProps) {

  const { courseId } = params;

  return (
    
    <div>
        <EvaluationEditor courseId={courseId} evaluation={null} evaluationType="homework" />
    </div>
  )
}
