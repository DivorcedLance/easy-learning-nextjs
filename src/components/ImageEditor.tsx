'use client';

import CanvasContainer from "./CanvasContainer";
import html2canvas from 'html2canvas';
import { uploadImage } from "@/lib/firebaseUtils";

// Función auxiliar para convertir dataURL a Blob
function dataURLtoBlob(dataURL: string) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

function ImageEditor({ sourceImageURL, sourceImageMetadata, exportedImageURL, setExportedImageURL, onSave }: { sourceImageURL: string | null, sourceImageMetadata: any | null, exportedImageURL: string | null, setExportedImageURL: React.Dispatch<React.SetStateAction<string | null>>, onSave: () => void }) {

    async function handleSave() {
        // Guardar la imagen en el servidor
        const $canvasContainer = document.querySelector('.canvas-container-clase') as HTMLElement;
        console.log($canvasContainer);
        if ($canvasContainer) {
            const canvas = await html2canvas($canvasContainer);
            const dataURL = canvas.toDataURL('image/png', 1.0);
            // Convertir el dataURL a Blob
            const blob = dataURLtoBlob(dataURL);

            // Subir el archivo Blob a Firebase usando la función uploadImage
            const file = new File([blob], 'canvas-image.png', { type: 'image/png' });
            try {
                const uploadResult = await uploadImage(file);
                const exportedImgUrl = uploadResult?.downloadURL || null;
                console.log('Imagen subida:', exportedImgUrl);
                // Actualizar el estado de la imagen exportada
                setExportedImageURL(exportedImgUrl);
            } catch (error) {
                console.error('Error al subir la imagen:', error);
            }


            // Crear un enlace temporal para forzar la descarga
            // const downloadLink = document.createElement('a');
            // downloadLink.href = dataURL;
            // downloadLink.download = 'imagen.png';  // Nombre del archivo
            // downloadLink.click();  // Simula el clic para iniciar la descarga
        }

        onSave();
    }
    return (
        <>
            <button onClick={handleSave} className="flex bg-sky-400 items-center mr-2.5 p-2 cursor-pointer rounded-sm transition-all duration-300 ease-out hover:bg-sky-200 hover:shadow-md">Save</button>
            <CanvasContainer width={sourceImageMetadata["width"] || '800'} height={sourceImageMetadata["height"] || '600'} imagenUrl={sourceImageURL} />
        </>
    )
}

export default ImageEditor