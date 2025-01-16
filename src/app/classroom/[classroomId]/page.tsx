import { getClassroomById } from '@/lib/firebaseUtils';
import { Classroom } from '@/types/classroom';
import { notFound } from 'next/navigation';
import ClassroomDetails from '@/components/ClassroomDetails';

interface ClassroomPageProps {
  params: {
    classroomId: string;
  };
}

export default async function ClassroomPage({ params }: ClassroomPageProps) {
  const { classroomId } = params;

  const classroom: Classroom | null = await getClassroomById(classroomId);

  if (!classroom) {
    notFound();
  }

  return (
    <ClassroomDetails classroom={classroom} />
  );
}
