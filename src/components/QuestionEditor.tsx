'use client'

import { useState, useEffect } from "react";
import { Question } from "@/types/question";
import { getTemplates, getLearningStyles, createQuestion, updateQuestion } from "@/lib/firebaseUtils";
import { Template } from "@/types/template";
import QuestionEditorType1 from "./QuestionEditorType1";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LearningStyle } from "@/types/learningStyle";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Badge from "@/components/Badge";
import { LoadingCharger } from "@/components/LoadingCharger";

export function QuestionEditor({ courseId, question, onQuestionAdded }: { courseId: string; question: Question | null; onQuestionAdded?: (question: Question) => void }) {
  
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  const [toEdit] = useState(!!question);

  const [learningStyles, setLearningStyles] = useState<LearningStyle[]>([]);
  const [selectedLearningStyles, setSelectedLearningStyles] = useState<string[]>(question?.learningStylesIds || []);
  const [topics, setTopics] = useState<string[]>(question?.topics || []);
  const [grade, setGrade] = useState(question?.grade || 1);
  
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [questionData, setQuestionData] = useState(question?.data || {});

  useEffect(() => {
    const fetchData = async () => {
      const [fetchedLearningStyles, fetchedTemplates] = await Promise.all([
        getLearningStyles(),
        getTemplates()
      ]);
      setLearningStyles(fetchedLearningStyles);
      setTemplates(fetchedTemplates);
      if (question && toEdit) {
        setSelectedTemplate(fetchedTemplates.find((template) => template.id === question.templateId) || null);
      } else {
        setSelectedTemplate(fetchedTemplates[0]);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [question, toEdit]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) signIn();
  }, [session, status]);

  const toggleLearningStyle = (styleId: string) => {
    setSelectedLearningStyles(prev => 
      prev.includes(styleId) ? prev.filter(id => id !== styleId) : [...prev, styleId]
    );
  };

  const handleSaveQuestion = async () => {
    try {
      const newQuestion = {
        courseId,
        data: questionData,
        grade,
        learningStylesIds: selectedLearningStyles,
        schoolId: session?.school?.id,
        templateId: selectedTemplate?.id,
        topics,
        lastModified: new Date().toISOString()
      };
      if (toEdit && question?.id) {
        await updateQuestion(question.id, newQuestion as Question);
      } else {
        const questionId = await createQuestion(newQuestion as Question);
        onQuestionAdded && onQuestionAdded({ ...newQuestion, id: questionId } as Question);
      }
      alert("Pregunta guardada exitosamente");
    } catch (error) {
      console.error("Error al guardar la pregunta:", error);
    }
  };

  if (isLoading || status === "loading" || !session) return <LoadingCharger/>;

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{toEdit ? "Editar Pregunta" : "Crear nueva pregunta"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="templateId">Plantilla</Label>
          <Select
            onValueChange={(value) => setSelectedTemplate(templates.find((template) => template.id === value) || null)}
            value={selectedTemplate?.id || ""}
            disabled={toEdit}
          >
            <SelectTrigger id="templateId">
              <SelectValue placeholder="Seleccione una plantilla" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.templateName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="topics">Temas</Label>
          <Input
            type="text"
            id="topics"
            value={topics.join(",")}
            onChange={(e) => setTopics(e.target.value.split(",").map(topic => topic.trim()))}
            placeholder="Ingrese los temas separados por coma"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="grade">Grado</Label>
          <Input
            type="number"
            id="grade"
            value={grade}
            onChange={(e) => setGrade(parseInt(e.target.value))}
            min={1}
            max={12}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="learningStyles">Estilos de Aprendizaje</Label>
          <div className="flex flex-wrap gap-2" id="learningStyles">
            {learningStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => toggleLearningStyle(style.id)}
                className={`cursor-pointer transition-all ${
                  selectedLearningStyles.includes(style.id) ? 'ring-2 ring-primary' : ''
                }`}
                aria-pressed={selectedLearningStyles.includes(style.id)}
              >
                <Badge learningStyleid={style.id} />
              </button>
            ))}
          </div>
        </div>

        {selectedTemplate?.id === "BbqRwAwHHxRL5B5lZyaa" && (
          <QuestionEditorType1 questionData={questionData} setQuestionData={setQuestionData} />
        )}

      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveQuestion} className="w-full">
          {toEdit ? "Actualizar Pregunta" : "Crear Pregunta"}
        </Button>
      </CardFooter>
    </Card>
  );
}