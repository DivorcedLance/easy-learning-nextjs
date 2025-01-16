import { QuestionEditor } from "@/components/QuestionEditor";
import { getQuestionById } from "@/lib/firebaseUtils";

interface EditQuestionProps {
  params: {
    courseId: string;
    questionId: string;
  };
}

export default async function EditQuestionPage({ params }: EditQuestionProps) {

  const { courseId, questionId } = params;

  const question = await getQuestionById(questionId);

  return (
    
    <div>
        <QuestionEditor question={question} courseId={courseId}/>
    </div>
  )
}
