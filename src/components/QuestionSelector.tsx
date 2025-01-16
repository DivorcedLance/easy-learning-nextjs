import { Question } from "@/types/question";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import QuestionCard from "./QuestionCard";

interface QuestionSelectorProps {
  availableQuestions: Question[];
  selectedQuestions: Question[];
  onSelectQuestion: (question: Question) => void;
  onClose: () => void;
}

export function QuestionSelector({
  availableQuestions,
  selectedQuestions,
  onSelectQuestion,
  onClose,
}: QuestionSelectorProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleSelect = (question: Question) => {
    onSelectQuestion(question);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl h-5/6 mx-auto">
        <DialogHeader>
          <DialogTitle>Seleccionar Pregunta</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 overflow-scroll">
          {availableQuestions
            .filter((q) => !selectedQuestions.some((sq) => sq.id === q.id))
            .map((question) => (
              <div key={question.id} className="bg-gray-100 p-4 rounded-md">
                <QuestionCard
                  question={question}
                />
                <Button
                  onClick={() => handleSelect(question)}
                  className="mt-2 w-full bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Añadir Pregunta
                </Button>
              </div>
            ))}
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="w-full bg-red-500 text-white rounded-md hover:bg-red-600">
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
