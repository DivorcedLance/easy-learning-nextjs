'use client'

import React, { useRef } from "react";
import { Question } from "@/types/question";
import QuestionPreviewType1 from "@/components/QuestionPreviewType1";
import Badge from "@/components/Badge";

interface QuestionPreviewProps {
  question: Question;
  showFeedback: boolean;
  onResponseChange: ((questionId: string, responseMap: Map<string, number | null>) => void) | null;
}

export function QuestionPreview({ question, showFeedback, onResponseChange }: QuestionPreviewProps) {
  const questionRef = useRef(null);

  // Llama a onResponseChange con un Map cuando hay una nueva respuesta
  const handleOptionSelect = (responseMap: Map<string, number | null>) => {
    if (!onResponseChange) return;
    onResponseChange(question.id as string, responseMap);
  };

  return (
    <div className="p-4 border rounded-md bg-blue-100">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Estilos de aprendizaje</h3>
        {/* badge por cada learningstyleid */}
        <div className="flex flex-wrap justify-left mt-2">
            {question.learningStylesIds.map((id, index) => (
            <Badge key={id} learningStyleid={id} />
            ))}
        </div>
      </div>
      {(question.templateId == "BbqRwAwHHxRL5B5lZyaa") ? 
      (
          <QuestionPreviewType1
            ref={questionRef}
            question={question}
            showFeedback={showFeedback}
            onOptionSelect={handleOptionSelect}
          />
        
      ) : (
        <div className="p-4 border rounded-md bg-gray-100">
          <div className="mb-4">
            <p className="p-2 bg-white border rounded-md">{question.data.statement}</p>
          </div>
        </div>
      )}
    </div>
  )
}
