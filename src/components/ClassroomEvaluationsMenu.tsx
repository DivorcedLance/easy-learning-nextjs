'use client';

import { Classroom } from '@/types/classroom';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { BookOpenIcon, BrainCircuitIcon, ClipboardCheckIcon } from 'lucide-react';
import { LoadingCharger } from '@/components/LoadingCharger';

export default function ClassroomEvaluationsMenu({ classroom }: { classroom: Classroom }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading || status === 'loading' || !session) {
    return <LoadingCharger/>;
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Evaluaciones: {classroom.courseName} - {classroom.grade} - {classroom.section}
      </h1>
      <div className="flex-grow flex items-center justify-center">
        <div className="flex space-x-8">
          <Link href={`/classroom/${classroom.id}/evaluations/weeklyTests` } className="no-underline text-current">
            <div className="flex flex-col items-center">
              <Button
                variant="outline"
                size="icon"
                className="w-24 h-24 rounded-full"
              >
                <ClipboardCheckIcon className="h-12 w-12" />
              </Button>
              <span className="mt-2 text-sm font-medium">Test semanal</span>
            </div>
          </Link>
          <Link href={`/classroom/${classroom.id}/evaluations/homeworks`} className="no-underline text-current">
            <div className="flex flex-col items-center">
              <Button
                variant="outline"
                size="icon"
                className="w-24 h-24 rounded-full"
              >
                <BookOpenIcon className="h-12 w-12" />
              </Button>
              <span className="mt-2 text-sm font-medium">Tarea</span>
            </div>
          </Link>
          <Link href={`/classroom/${classroom.id}/evaluations/reinforcements`} className="no-underline text-current">
            <div className="flex flex-col items-center">
              <Button
                variant="outline"
                size="icon"
                className="w-24 h-24 rounded-full"
              >
                <BrainCircuitIcon className="h-12 w-12" />
              </Button>
              <span className="mt-2 text-sm font-medium">Reforzamiento</span>
            </div>

          </Link>
        </div>
      </div>

    </div>
  );
}
