'use client'

import React, { useState } from 'react'
import { uploadImage } from '@/lib/firebaseUtils';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import ImageEditor from './ImageEditor';
import { Button } from './ui/button';

function ImageLoader({imageSrc, setImageSrc, imageMetadata, setImageMetadata}: {imageSrc: string | null, setImageSrc: React.Dispatch<React.SetStateAction<string | null>>, imageMetadata: any | null, setImageMetadata: React.Dispatch<React.SetStateAction<any | null>>}) {
    const [showImageEditor, setShowImageEditor] = useState(false);
    
    async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0]; // Accedemos al primer archivo seleccionado
            try {
                // se sube la imagen a Firebase Storage
                const a = await uploadImage(file);
                const imageURL = a?.downloadURL || null;
                const metadat = a?.metadata || null;
                setImageSrc(imageURL);
                setImageMetadata(metadat);
            } catch (error) {
                console.error("Error al subir la imagen:", error);
            }
        } else {
            setImageSrc(null);
        }
    };
    return (
        <>
            {/* Input para subir imagen e div de imagen para que se visualice*/}
            <div className="flex flex-row ">
                <input type="file" className="w-3/4" onChange={handleImageChange} />
                {/* Vista previa de la imagen seleccionada */}
                {imageSrc && (
                    <div className="w-1/3">
                        {/* boton de eliminar imagen cargada */}
                        <button onClick={() => {
                            setImageSrc(null);
                            // eliminar imagen del input
                            const fileInput = document.querySelector("input[type='file']") as HTMLInputElement;
                            fileInput.value = "";
                        }} className="text-white bg-red-500 rounded-md">Eliminar</button>
                        {/* boton de editar imagen cargada */}
                        <button onClick={() => setShowImageEditor(true)} className="text-white bg-blue-500 rounded-md">Editar</button>
                        <Image src={imageSrc} alt="Vista previa" className="border rounded-md" width={150} height={150} />
                    </div>
                    
                )}
            </div>
            {showImageEditor && (
        <Dialog open={showImageEditor} onOpenChange={(open) => !open && setShowImageEditor(false)}>
          <DialogContent className="max-w-3xl h-5/6 mx-auto">
            <DialogHeader>
              <DialogTitle>Seleccionar Pregunta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 overflow-scroll">
              <ImageEditor sourceImageURL={imageSrc} sourceImageMetadata={imageMetadata} exportedImageURL={null} setExportedImageURL={setImageSrc} onSave={() => setShowImageEditor(false)} />
            </div>
            <DialogFooter>
              <Button onClick={() => {setShowImageEditor(false)}} className="w-full bg-red-500 text-white rounded-md hover:bg-red-600">
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
        </>
    )
}

export default ImageLoader