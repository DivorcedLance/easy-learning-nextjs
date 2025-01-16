'use client';

import { useClassroomStore } from '@/stores/useClassroomStore';
import { Classroom } from '@/types/classroom';
import { Material } from '@/types/material';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { LoadingCharger } from '@/components/LoadingCharger';

export default function ClassroomWeeklyTests({ classroom, material }: { classroom : Classroom, material : Material | null }) {
  const { fetchWeeklyTests, weeklyTests } = useClassroomStore();
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

  useEffect(() => {
    if (material) {
      fetchWeeklyTests(material.weeklyTestIds);
    }
  }, [fetchWeeklyTests, material]);

  if (isLoading || status === 'loading' || !session) {
    return <LoadingCharger/>;
  }

  return (
    <div>
      <a href={`../../../course/${classroom.courseId}/weeklyTest/create`} className="text-blue-600 hover:underline">
        <Button variant="default" className="mt-2">Crear Prueba Semanal</Button>
      </a>
      <ul>
        {weeklyTests.map((weeklyTest) => (
          <li key={weeklyTest.id}>{weeklyTest.title}
            <a href={`../../../course/${classroom.courseId}/weeklyTest/${weeklyTest.id}/edit`} className="text-blue-600 hover:underline">
              <Button variant="default" className="mt-2">Editar</Button>
            </a>
            <a href={`../../../course/${classroom.courseId}/weeklyTest/${weeklyTest.id}/preview`} className="text-blue-600 hover:underline">
              <Button variant="default" className="mt-2">Ver</Button>
            </a>
          </li>

        ))}
      </ul>
    </div>
  );
}
