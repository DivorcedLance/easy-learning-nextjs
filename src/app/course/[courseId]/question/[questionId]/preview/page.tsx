import { QuestionPreview } from "@/components/QuestionPreview";
import { getQuestionById } from "@/lib/firebaseUtils";

interface PreviewQuestionProps {
  params: {
    courseId: string;
    questionId: string;
  };
}

export default async function PreviewQuestionPage({ params }: PreviewQuestionProps) {

  const { questionId } = params;

  const question = await getQuestionById(questionId);

  return (
    
    <div>
      <QuestionPreview
            question={question}
            showFeedback={true}
            onResponseChange={null}
      />
    </div>
  )
}
