'use client'

import React, { useState, useImperativeHandle, forwardRef, useEffect } from "react";
import { Question } from "@/types/question";
import { Option } from "@/types/option";
import { getLetterFromIndex } from "@/lib/myUtils";
import Image from "next/image";
import {calculateDimensions} from "@/lib/imageUtils";

interface QuestionPreviewType1Props {
  question: Question;
  showFeedback: boolean;
  onOptionSelect: (responseMap: Map<string, number | null>) => void;
}

const QuestionPreviewType1 = forwardRef(({ question, showFeedback, onOptionSelect }: QuestionPreviewType1Props, ref) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ height: number; width: number } | null>(null);

  useEffect(() => {
    if(question.data.imageMetadata) {
      const { height, width } = question.data.imageMetadata;
      const { height: newHeight, width: newWidth } = calculateDimensions(height, width, 300, 300);
      setImageDimensions({ height: newHeight, width: newWidth });
    }
  } , [question.data.imageMetadata]);
  

  const handleOptionSelect = (optionId: number) => {

    if (optionId === selectedOption) {
      setSelectedOption(null);
      setShowCorrectAnswer(false);
      return;
    }

    setSelectedOption(optionId);

    // Crear un Map con la respuesta seleccionada
    const responseMap = new Map<string, number | null>();
    responseMap.set(question.id as string, optionId);
    
    // Enviar el Map de respuesta al componente padre
    onOptionSelect(responseMap);

    if (showFeedback) {
      setShowCorrectAnswer(true);
    }
  };

  useImperativeHandle(ref, () => ({
    getSelectedOptionInfo: () => ({
      selectedOption,
      isCorrect: selectedOption === question.data.correctOption,
    }),
  }));

  return (
    <>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Enunciado</h3>
        <p className="p-2 bg-white border rounded-md">{question.data.statement}</p>
      </div>

      {question.data.image && imageDimensions && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Imagen</h3>
          <Image src={question.data.image} alt="Imagen de la pregunta" className="border rounded-md" width={imageDimensions?.width} height={imageDimensions?.height} />
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Opciones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {question.data.options.map((option: { id: number; opt: string }, index: number) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={`p-2 border rounded-md w-full text-left ${
                selectedOption === option.id
                  ? showFeedback
                    ? option.id === question.data.correctOption
                      ? "bg-green-200 border-green-500"
                      : "bg-red-200 border-red-500"
                    : "bg-blue-200 border-blue-400" // Si el feedback está deshabilitado, solo se resalta sin color de corrección
                  : "bg-white border-gray-300"
              }`}
            >
              <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
              {option.opt}
            </button>
          ))}
        </div>
      </div>

      {showFeedback && showCorrectAnswer && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-blue-600">Respuesta Correcta</h3>
          <p className="p-2 bg-blue-50 border border-blue-500 rounded-md">
            {getLetterFromIndex(question.data.correctOption)}.{" "}
            {question.data.options.find((opt: Option) => opt.id === question.data.correctOption)?.opt}
          </p>
        </div>
      )}
    </>
  );
});

QuestionPreviewType1.displayName = "QuestionPreviewType1";

export default QuestionPreviewType1;
