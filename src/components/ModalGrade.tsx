'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { on } from "events";

export function ModalGrade({ isOpen, onGradeAdded, onOpenChange }: { isOpen: boolean; onGradeAdded: (grade: number) => void, onOpenChange: (isOpen: boolean) => void }) {
    const [grade, setGrade] = useState(1);

    const handleAddGrade = () => {
        onGradeAdded(grade);
        setGrade(1);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Grado</DialogTitle>
                    
                </DialogHeader>
                <form onSubmit={handleAddGrade}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nombre" className="text-right">
                                Grado
                            </Label>
                            <Input
                                type="number"
                                min="1"
                                max="10"
                                value={grade}
                                onChange={(e) => setGrade(parseInt(e.target.value))}
                            />
                        </div>


                    </div>
                    <DialogFooter>
                        <Button type="submit">Crear</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}