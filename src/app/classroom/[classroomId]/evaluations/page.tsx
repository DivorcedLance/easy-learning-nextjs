import { Classroom } from '@/types/classroom';
import ClassroomEvaluationsMenu from '@/components/ClassroomEvaluationsMenu';
import { getClassroomById } from '@/lib/firebaseUtils';

interface EvaluationsPageProps {
  params: {
    classroomId: string;
  };
}

export default async function EvaluationsPage({ params }: EvaluationsPageProps) {
  const { classroomId } = params;

  const classroom: Classroom | null = await getClassroomById(classroomId);

  return (
    <div>
      <ClassroomEvaluationsMenu classroom={classroom} />
    </div>
  );
}