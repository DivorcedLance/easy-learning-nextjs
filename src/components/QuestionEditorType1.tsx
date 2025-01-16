import { useEffect, useState, useRef } from "react";
import AlternativeBtn from "@/components/AlternativeBtn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Option } from "@/types/option";
import { Bold, Italic, Underline, Plus, Minus } from "lucide-react";
import ImageLoader from "./ImageLoader";

export default function QuestionEditorType1({ questionData, setQuestionData } : { questionData: any, setQuestionData: any }) {
  const textareaRef = useRef(null);
  const [textareaValue, setTextareaValue] = useState(questionData.statement || "");
  const [options, setOptions] = useState(questionData.options || Array.from({ length: 5 }, (_, id) => ({ id, opt: "" })));
  const [correctAnswer, setCorrectAnswer] = useState(questionData.correctOption || 0);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageMetadata, setImageMetadata] = useState<any | null>(null);

  // Only update `setQuestionData` if the content has changed, preventing infinite loops
  useEffect(() => {
    const newQuestionData = { correctOption: correctAnswer, options, statement: textareaValue, image: imageSrc, imageMetadata };
    if (
      newQuestionData.statement !== questionData.statement ||
      newQuestionData.correctOption !== questionData.correctOption ||
      JSON.stringify(newQuestionData.options) !== JSON.stringify(questionData.options) ||
      newQuestionData.image !== questionData.image ||
      newQuestionData.imageMetadata !== questionData.imageMetadata
    ) {
      setQuestionData(newQuestionData);
    }
  }, [correctAnswer, options, textareaValue, setQuestionData, questionData, imageSrc, imageMetadata]);

  const handleChange = (id: number, value: string) => {
    setOptions((prevOptions: Option[]) => prevOptions.map((option: Option) => (option.id === id ? { ...option, opt: value } : option)));
  };

  const applyStyle = (tag: string) => {
    const textarea : any = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.slice(start, end);
    if (!selectedText) return;

    const newText = `${textarea.value.slice(0, start)}${tag}${selectedText}${tag}${textarea.value.slice(end)}`;
    setTextareaValue(newText);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Pregunta de Selección Única</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={() => applyStyle("**")}>
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => applyStyle("*")}>
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => applyStyle("__")}>
            <Underline className="h-4 w-4" />
          </Button>
        </div>

        <Textarea
          ref={textareaRef}
          value={textareaValue}
          onChange={(e) => setTextareaValue(e.target.value)}
          className="min-h-[200px]"
          placeholder="Escribe el enunciado de la pregunta usando markdown"
        />

        {/* Upload Image */}
        <ImageLoader imageSrc={imageSrc} setImageSrc={setImageSrc} imageMetadata={imageMetadata} setImageMetadata={setImageMetadata} />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={() => setOptions([...options, { id: options.length, opt: "" }])}>
            <Plus className="h-4 w-4 mr-2" /> Añadir opción
          </Button>
          <Button variant="outline" size="sm" onClick={() => options.length > 2 && setOptions(options.slice(0, -1))}>
            <Minus className="h-4 w-4 mr-2" /> Eliminar opción
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {options.map((option: Option) => (
            <AlternativeBtn
              key={option.id}
              opt_id={option.id}
              opt={option.opt}
              onChange={handleChange}
              onClick={() => setCorrectAnswer(option.id)}
              correctAnswer={correctAnswer}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
