'use client'

import { useState, useEffect } from "react";
import { Evaluation } from "@/types/evaluation";
import { Question } from "@/types/question";
import { getQuestionsBySchoolCourse, createEvaluation, updateEvaluation } from "@/lib/firebaseUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { QuestionEditor } from "@/components/QuestionEditor";
import { QuestionSelector } from "@/components/QuestionSelector";
import { LoadingCharger } from "@/components/LoadingCharger";
import { signIn, useSession } from "next-auth/react";
import { QuestionPreview } from "./QuestionPreview";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";

export function EvaluationEditor({ courseId, evaluation, evaluationType }: { courseId: string, evaluation: Evaluation | null, evaluationType: string }) {

  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [toEdit] = useState(!!evaluation);
  const [title, setTitle] = useState(evaluation?.title || "");
  const [hours, setHours] = useState(evaluation?.duration ? parseInt(evaluation.duration.split(":")[0]) : 0);
  const [minutes, setMinutes] = useState(evaluation?.duration ? parseInt(evaluation.duration.split(":")[1]) : 0);
  const [week, setWeek] = useState(evaluation?.week || 1);
  const [grade, setGrade] = useState(evaluation?.grade || 1);
  const [questions, setQuestions] = useState<Question[]>(evaluation?.questions || []);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);
  const [showQuestionSelector, setShowQuestionSelector] = useState(false);

  useEffect(() => {
    if (!session) return;
    const fetchData = async () => {
      const fetchedQuestions = await getQuestionsBySchoolCourse(session.school.id, courseId);
      setAvailableQuestions(fetchedQuestions);
      setIsLoading(false);
    };

    fetchData();
  }, [courseId, session]);

  const toggleQuestion = (question: Question) => {
    setQuestions(prevQuestions =>
      prevQuestions.some(q => q.id === question.id)
        ? prevQuestions.filter(q => q.id !== question.id)
        : [...prevQuestions, question]
    );
  };

  const handleSaveEvaluation = async () => {
    try {
      const newEvaluation = {
        courseId,
        duration: `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`,
        evaluationType: evaluationType,
        questionIds: questions.map(q => q.id),
        schoolId: session?.school.id,
        title,
        grade,
        week,
      };
      
      if (toEdit) {
        await updateEvaluation(evaluation!.id, newEvaluation as Evaluation);
      } else {
        await createEvaluation(newEvaluation as Evaluation);
      }
      alert("Evaluación guardada exitosamente");

    } catch (error) {
      console.error("Error al guardar la evaluación:", error);
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session) signIn();
  }, [session, status]);

  const handleNewQuestionAdded = (newQuestion: Question) => {
    setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
    setShowQuestionEditor(false);
  };

  if (isLoading || status === "loading" || !session) return <LoadingCharger />;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="space-y-6 p-6 bg-white rounded-md shadow-md">
        <div className="space-y-2">
          <Label htmlFor="title">Título de la Evaluación</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ingrese el título de la evaluación"
          />
        </div>

        <div className="space-y-2">
          <Label>Duración</Label>
          <div className="flex gap-2">
            <Input
              id="hours"
              type="number"
              value={hours}
              onChange={(e) => setHours(Math.max(0, parseInt(e.target.value)))}
              placeholder="Horas"
              min={0}
            />
            <Input
              id="minutes"
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value))))}
              placeholder="Minutos"
              min={0}
              max={59}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="week">Semana</Label>
          <Input
            id="week"
            type="number"
            value={week}
            onChange={(e) => setWeek(parseInt(e.target.value))}
            min={1}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="grade">Grado</Label>
          <Input
            id="grade"
            type="number"
            value={grade}
            onChange={(e) => setGrade(parseInt(e.target.value))}
            min={1}
            max={12}
          />
        </div>

        <div className="space-y-2">
          <Label>Preguntas</Label>
          <div className="flex flex-col gap-3">
            {questions.map((question) => (
              <QuestionPreview key={question.id} question={question} showFeedback={true} onResponseChange={null} />
            ))}
          </div>
            <div className="flex flex-col gap-3">
              <Button onClick={() => setShowQuestionEditor(true)} className="mt-4">
                Añadir Nueva Pregunta
              </Button>
              <Button onClick={() => setShowQuestionSelector(true)} className="mt-4">
                Añadir Pregunta Existente
              </Button>
            </div>
        </div>

        <Button onClick={handleSaveEvaluation} className="w-full mt-6">
          {toEdit ? "Actualizar Evaluación" : "Crear Evaluación"}
        </Button>
      </div>

      {showQuestionEditor && (
        <Dialog open={showQuestionEditor} onOpenChange={(open) => !open && setShowQuestionEditor(false)}>
          <DialogContent className="max-w-3xl h-5/6 mx-auto">
            <DialogHeader>
              <DialogTitle>Seleccionar Pregunta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 overflow-scroll">
              <QuestionEditor courseId={courseId} question={null} onQuestionAdded={
                (newQuestion: Question) => {
                  handleNewQuestionAdded(newQuestion);
                  setShowQuestionEditor(false);
                }
              } />
            </div>
            <DialogFooter>
              <Button onClick={() => {setShowQuestionEditor(false)}} className="w-full bg-red-500 text-white rounded-md hover:bg-red-600">
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {showQuestionSelector && (
        <QuestionSelector
          availableQuestions={availableQuestions}
          selectedQuestions={questions}
          onSelectQuestion={toggleQuestion}
          onClose={() => setShowQuestionSelector(false)}
        />
      )}
    </div>
  );
}
