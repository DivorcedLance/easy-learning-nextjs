import ClassroomEvaluations from '@/components/ClassroomEvaluations';
import { getClassroomById, getMaterialByClassroom } from '@/lib/firebaseUtils';
import { Classroom } from '@/types/classroom';
import { Material } from '@/types/material';

interface HomeworksProps {
  params: {
    classroomId: string;
  };
}

export default async function HomeworksPage({ params }: HomeworksProps) {
  const { classroomId } = params;

  const classroom: Classroom | null = await getClassroomById(classroomId);
  const material: Material | null = await getMaterialByClassroom(classroom);

  return (
    <div>
      <ClassroomEvaluations evaluationType="homework" classroom={classroom} material={material} />
    </div>
  );
}