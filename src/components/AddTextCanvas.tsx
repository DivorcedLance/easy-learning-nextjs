import React, { useContext } from 'react'
import { CanvasContext } from "./CanvasContainer";
import {Type} from "lucide-react";

const AddTextCanvas = () => {
    const { actions } = useContext(CanvasContext);
    const addElement = (type: string) => {
        actions?.addElement(type);
    };
    return (
        <>
        {/* estos Add son la paleta de botones de una opcion del menu del canvas */}
            {/* {
            [1, 2, 3, 4, 5].map((item, index) => (
                <div key={index} className="flex flex-col justify-center p-4  bg-white">
                    <div className="flex flex-row-reverse justify-center w-full">
                        <div className="">
                            
                        </div>
                    </div>
                </div>
            ))
        } */}
            <div className="flex flex-col justify-center items-center p-4 rounded-lg bg-white hover:cursor-pointer hover:bg-slate-300 transition-all duration-200" onClick={() => addElement("TEXT")}>
                <div className="text-slate-950 text-5xl">
                    <Type />
                </div>
                <span>
                    Agregar texto
                </span>
            </div>
        </>
    )
}

export default AddTextCanvas;