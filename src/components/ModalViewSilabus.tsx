import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import SilabusEditor from "./SilabusEditor";
import { Silabo } from "@/types/silabo";


export function ModalViewSilabus({ silabus, isOpen, onSilabusAdded, onOpenChange, type, selectedGrade, courseName }: { silabus: Silabo ,isOpen: boolean; onSilabusAdded?: (silabo: Silabo) => void, onOpenChange: (isOpen: boolean) => void,type: string, selectedGrade: number, courseName: string }) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl h-5/6 mx-auto">
                <DialogHeader>
                    <DialogTitle>Seleccionar Pregunta</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 overflow-scroll">
                    <SilabusEditor silabus={silabus} type={type} selectedGrade={selectedGrade} courseName={courseName} onSaveSilabus={onSilabusAdded}/>
                </div>
                <DialogFooter>
                    <Button onClick={()=>onOpenChange(false)}
                    className="w-full bg-red-500 text-white rounded-md hover:bg-red-600">
                        Cancelar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}