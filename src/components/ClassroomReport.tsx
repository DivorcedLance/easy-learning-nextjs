'use client';

import { Classroom } from '@/types/classroom';
import { Student } from '@/types/student';
import StudentCard from './StudentCard';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getStudentById } from '@/lib/firebaseUtils';
import { LoadingCharger } from '@/components/LoadingCharger';

export default function ClassroomReport({ classroom }: { classroom: Classroom }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
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
    const fetchStudents = async () => {
      const estudiantes = await Promise.all(classroom.studentIds.map((studentId) => getStudentById(studentId)));
      setStudents(estudiantes);
    };

    fetchStudents();
  }, [classroom.studentIds]);


  if (isLoading || status === 'loading' || !session) {
    return <LoadingCharger/>;
  }

  return (
    <div>
      <h2>Students:</h2>
      <ul>
      {students.map((student) => (
          <li key={student.id}>
            <StudentCard student={student} />
          </li>
        ))}
      </ul>
    </div>
  );
}
