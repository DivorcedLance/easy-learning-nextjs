import { Classroom } from '@/types/classroom';
import ClassroomReport from '@/components/ClassroomReport';
import { getClassroomById } from '@/lib/firebaseUtils';

interface ReportPageProps {
  params: {
    classroomId: string;
  };
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { classroomId } = params;

  const classroom: Classroom | null = await getClassroomById(classroomId);

  return (
    <div>
      <h1>Report for Classroom: {classroom.courseId}</h1>
      <ClassroomReport classroom={classroom} />
    </div>
  );
}