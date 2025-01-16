import { Badge as BadgeSCN } from "@/components/ui/badge";
import { getLearningStyleById } from "@/lib/firebaseUtils";
import { LearningStyle } from "@/types/learningStyle";
import { useEffect, useState } from "react";

export default function Badge({ learningStyleid }: { learningStyleid: string }) {
    const [learningStyles, setLearningStyles] = useState<LearningStyle[]>([]);

    useEffect(() => {
        if (learningStyleid) {
            getLearningStyleById(learningStyleid).then((learningStyle) => {
                setLearningStyles([learningStyle]);
            });
        } else {
            setLearningStyles([]);
        }
    }, [learningStyleid]);

    return (
        <>
            {learningStyles.map((style) => (
                <BadgeSCN
                    key={style.id}
                    variant="secondary"
                    style={{ backgroundColor: style.color || "#343a40", color: "#fff", width: "fit-content" }}
                    className="mr-1 mb-1"
                >
                    {style.id}
                </BadgeSCN>
            ))}
        </>
    );
}
