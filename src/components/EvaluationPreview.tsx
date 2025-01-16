'use client'

import React, { useState, useEffect } from "react";
import { Question } from "@/types/question";
import { Evaluation } from "@/types/evaluation";
import { QuestionPreview } from "@/components/QuestionPreview";

interface EvaluationPreviewProps {
  evaluation: Evaluation;
}

// Función para convertir HH:MM a segundos
const convertToSeconds = (duration: string) => {
  const [hours, minutes] = duration.split(':').map(Number);
  return hours * 3600 + minutes * 60;
};

// Función para convertir segundos a formato HH:MM
const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export function EvaluationPreview({ evaluation }: EvaluationPreviewProps) {
  const [responses, setResponses] = useState<Map<string, number | null>>(new Map());
  const [showFeedback, setShowFeedback] = useState(false);
  const [timer, setTimer] = useState(evaluation.duration ? convertToSeconds(evaluation.duration) : 0);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);

      return () => clearInterval(countdown); // Limpiar el intervalo al desmontar el componente
    }
  }, [timer]);

  const handleResponseChange = (questionId: string, responseMap: Map<string, number | null>) => {
    setResponses(prevResponses => {
      const newResponses = new Map(prevResponses);
      const selectedOption = responseMap.get(questionId);
      if (selectedOption !== undefined) {
        newResponses.set(questionId, selectedOption);
      }
      return newResponses;
    });
  };

  const handleGradeClick = () => {
    setShowFeedback(true);
  };

  return (
    <div className="p-4">
      <div className="sticky top-0 z-10 bg-white p-4 shadow-md mb-6">
        <h1 className="text-2xl font-bold mb-1">{evaluation.title}</h1>
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold">Duración:</span>
          <div className="text-2xl font-bold text-blue-500 bg-gray-100 px-4 py-1 rounded-md">
            {formatTime(timer)}
          </div>
        </div>
        <h3 className="text-md mt-2">Semana: {evaluation.week}</h3>
        <h3 className="text-md mt-2">Grado: {evaluation.grade}</h3>
      </div>
      
      <div className="flex flex-col gap-4">
        {(evaluation.questions || [] as Question[]).map((question) => (
          <QuestionPreview
            key={question.id}
            question={question}
            showFeedback={showFeedback}
            onResponseChange={handleResponseChange}
          />
        ))}
      </div>

      <div className="mt-8">
        <button
          onClick={handleGradeClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Calificar
        </button>
      </div>
    </div>
  );
}
