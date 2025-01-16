'use client';

import { Classroom } from '@/types/classroom';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClassroomStore } from '@/stores/useClassroomStore';
import Link from 'next/link';
import { LoadingCharger } from '@/components/LoadingCharger';
import { ClipboardCheckIcon, BookOpenIcon, BrainCircuitIcon } from 'lucide-react';
import { Button } from './ui/button';

interface ClassroomDetailsProps {
  classroom: Classroom;
}

export default function ClassroomDetails({ classroom }: ClassroomDetailsProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { setClassroom } = useClassroomStore();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      signIn();
    } else if (session && (classroom.teacherId !== session.user.id || classroom.schoolId !== session.school.id)) {
      router.push('/');
    } else {
      setIsLoading(false);
    }
  }, [session, status, classroom.teacherId, classroom.schoolId, router]);

  useEffect(() => {
    setClassroom(classroom);
  }, [classroom, setClassroom]);

  if (isLoading || status === 'loading' || !session) {
    return <LoadingCharger />;
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Classroom: {classroom.courseName} - {classroom.grade} - {classroom.section}
      </h1>
      <div className="flex-grow flex items-center justify-center">
        <div className="flex space-x-8">
          <Link href={`/classroom/${classroom.id}/evaluations`} className="no-underline text-current">
            <div className="flex flex-col items-center">
              <Button
                variant="outline"
                size="icon"
                className="w-24 h-24 rounded-full"
              >
                <ClipboardCheckIcon className="h-12 w-12" />
              </Button>
              <span className="mt-2 text-sm font-medium">Evaluaciones</span>
            </div>
          </Link>
          <Link href={`/course/${classroom.courseId}`} className="no-underline text-current">
            <div className="flex flex-col items-center">
              <Button
                variant="outline"
                size="icon"
                className="w-24 h-24 rounded-full"
              >
                <BookOpenIcon className="h-12 w-12" />
              </Button>
              <span className="mt-2 text-sm font-medium">Banco de Preguntas</span>
            </div>
          </Link>
          <Link href={`/classroom/${classroom.id}/reports`} className="no-underline text-current">
            <div className="flex flex-col items-center">
              <Button
                variant="outline"
                size="icon"
                className="w-24 h-24 rounded-full"
              >
                <BrainCircuitIcon className="h-12 w-12" />
              </Button>
              <span className="mt-2 text-sm font-medium">Reportes</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
