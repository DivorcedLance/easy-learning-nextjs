import React, { useContext } from 'react'
import { CanvasContext } from "./CanvasContainer";
import { CloudUpload } from 'lucide-react';

const AddImageCanvas = () => {
    const { actions } = useContext(CanvasContext);
    const addElement = (type: string) => {
        actions?.addElement(type);
    };

    return (
        <div className="flex flex-col justify-center items-center p-4 rounded-lg bg-white hover:cursor-pointer hover:bg-slate-300 transition-all duration-200" onClick={() => addElement("IMAGE")}>
            <div className="text-slate-950 text-5xl">
                <CloudUpload />
            </div>
            <span>
                Agregar imagen
            </span>
        </div>
    )
}

export default AddImageCanvas