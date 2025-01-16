import {getLetterFromIndex} from "@/lib/myUtils";

export default function AlternativeBtn({
    opt_id,
    opt,
    onChange,
    onClick,
    correctAnswer
  }: {
    opt_id: number;
    opt: string;
    onChange: (id: number, value: string) => void;
    onClick: (id: number) => void;
    correctAnswer: number;
  }) {
    return (
      <div className="flex flex-row text-center border-2 rounded-md w-full">
        <div
          onClick={() => onClick(opt_id)}
          className={`flex justify-center items-center hover:cursor-pointer hover:opacity-80 w-4/12 ${
            correctAnswer === opt_id ? "bg-green-400" : "bg-slate-400"
          }`}
        >
          {getLetterFromIndex(opt_id)}
        </div>
        <input
          type="text"
          value={opt}
          onChange={(e) => onChange(opt_id, e.target.value)}
          placeholder={`Insertar opción ${getLetterFromIndex(opt_id)}`}
          className="text-center w-full"
        />
      </div>
    );
  }
  