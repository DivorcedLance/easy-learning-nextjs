'use client'

import { getQuestionsBySchoolCourse } from "@/lib/firebaseUtils";
import { Course } from "@/types/course";
import { Question } from "@/types/question";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import QuestionCard from "./QuestionCard";
import Link from "next/link";
import { LoadingCharger } from "@/components/LoadingCharger";

export default function QuestionBank({ course }: { course: Course }) {
  const [questions, setQuestions] = useState([] as Question[]);
  const [filteredQuestions, setFilteredQuestions] = useState([] as Question[]);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Estados para los filtros
  const [gradeFilter, setGradeFilter] = useState(0);
  const [learningTypeFilter, setLearningTypeFilter] = useState("");

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      signIn();
    } else if (session && course.schoolId !== session.school.id) {
      router.push('/');
    } else {
      setIsLoading(false);
    }
  }, [session, status, router, course]);

  useEffect(() => {
    if (course) {
      getQuestionsBySchoolCourse(course.schoolId, course.id).then((questions) => {
        setQuestions(questions);
        console.log("Questions fetched:", questions);
      });
    }
  }, [course]);

  useEffect(() => {
    const filtered = questions.filter((question) =>
      (!gradeFilter || question.grade === gradeFilter) &&
      (!learningTypeFilter || question.learningStylesIds.includes(learningTypeFilter))
    );
    setFilteredQuestions(filtered);
  }, [gradeFilter, learningTypeFilter, questions]);

  if (isLoading || status === 'loading' || !session) {
    return <LoadingCharger />;
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Banco de preguntas: {course.courseName}
      </h1>
      {/* Filtros de grado y tipo de aprendizaje */}
      <div className="flex space-x-4 mb-4">
        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(Number(e.target.value))}
          className="p-2 border rounded"
        >
          <option value="">--</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>

        <select
          value={learningTypeFilter}
          onChange={(e) => setLearningTypeFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Selecciona Tipo de Aprendizaje</option>
          <option value="Visuales">Visuales</option>
          <option value="Activos">Activos</option>
          <option value="Reflexivos">Reflexivos</option>
          {/* Agrega más opciones si es necesario */}
        </select>
      </div>
      <div className="bg-white text-gray-800 p-8 rounded-lg relative shadow-lg h-min-1/4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
        <Link href={`${course.id}/question/create`} className="fixed bottom-4 right-4">
          <Button variant="default" className="mt-2 rounded-full">+</Button>
        </Link>
      </div>
    </div>
  );
}
