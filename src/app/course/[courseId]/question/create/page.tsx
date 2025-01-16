import { QuestionEditor } from "@/components/QuestionEditor";

interface CreateQuestionProps {
  params: {
    courseId: string;
  };
}

export default async function CreateQuestionPage({ params }: CreateQuestionProps) {

  const { courseId } = params;

  return (
    
    <div>
        <QuestionEditor courseId={courseId} question={null} />
    </div>
  )
}
