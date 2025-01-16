"use client";

import React, { useCallback, useRef, useState } from "react";
import CanvasComponent from "./canvasComponents/CanvasComponent";
import Toolbar from "./canvasComponents/Toolbar";
import { Rnd } from "react-rnd";
import AddTextCanvas from "./AddTextCanvas";
import AddImageCanvas from "./AddImageCanvas";
import {Type, Triangle, ChevronLeft, Diff, Music, Image as Img } from 'lucide-react';

export const CanvasContext = React.createContext<ICanvasContext>({});

export interface ICanvasData {
  component?: string;
  id?: string;
  position?: { top: number; left: number };
  dimension?: { width: string; height: string };
  content?: string | ArrayBuffer;
  type: string;
}

export interface ICanvasComponent {
  position?: { top: number; left: number };
  dimension?: { width: string; height: string };
  content?: string | ArrayBuffer;
  id?: string;
  type: string;
  isReadOnly?: boolean;
}

export interface ICanvasContext {
  state?: {
    canvasData: ICanvasData[];
    activeSelection: Set<string>;
    enableQuillToolbar: boolean;
  };
  actions?: {
    setCanvasData: React.Dispatch<React.SetStateAction<ICanvasData[]>>;
    setActiveSelection: React.Dispatch<React.SetStateAction<Set<string>>>;
    updateCanvasData: (data: Partial<ICanvasComponent>) => void;
    addElement: (type: string) => void;
    setEnableQuillToolbar: (state: boolean) => void;
  };
}

//algunnos ajustes de los componentes image y text que se crean al dar click a los botones que los crean
const getInitialData = (data: any[], type: string = "TEXT") => {
  return {
    type: type,
    id: `${type}__${Date.now()}__${data.length}`,
    position: {
      top: 100,
      left: 500
    },
    dimension: {
      width: "150",
      height: type === "TEXT" ? "50" : "150"
    },
    content: type === "TEXT" ? "Sample Text" : ""
  };
};

type CanvasContainerProps = {
  width: string;
  height: string;
  imagenUrl: string | null;
};

const CanvasContainer: React.FC<CanvasContainerProps> = ({ width, height, imagenUrl }) => {
  const w = width
  const h = height
  const imageUrl = imagenUrl
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [canvasData, setCanvasData] = useState<ICanvasData[]>([]);
  const [activeSelection, setActiveSelection] = useState<Set<string>>(
    new Set()
  );
  const [enableQuillToolbar, setEnableQuillToolbar] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isSelectAll = useRef<boolean>(false);

  async function urlToFile(url:string, filename:string, mimeType: string) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  }
  
  console.log(w, h);

  React.useEffect(() => {
    console.log(imageUrl);
    if (imageUrl) {
      urlToFile(imageUrl, 'prueba.png', 'image/png').then((file) => {
        console.log(file);
        setImageFile(file);
      });
    }
  }, [imageUrl]); // Aquí solo depende de imageUrl

  React.useEffect(() => {
    if (imageFile) {
      // Aquí creas un FileReader para convertir el archivo a base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result; // Aquí estará la imagen en formato base64
  
        // Actualizamos el canvasData con la imagen en base64
        setCanvasData([
          {
            type: "IMAGE",
            id: "IMAGE__1616154982257__0",
            position: { left: 0, top: 0 },
            dimension: { width: w + "px" as string, height: h + "px" as string },
            content: base64data || ""  // Aquí usas la imagen en base64 como contenido
          }
        ]);
      };
  
      // Lee el archivo como una URL de datos (base64)
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile, w, h]);


  const updateCanvasData = (data: Partial<ICanvasComponent>) => {
    const currentDataIndex =
      canvasData.findIndex((canvas) => canvas.id === data.id) ?? -1;
    const updatedData = { ...canvasData?.[currentDataIndex], ...data };
    canvasData.splice(currentDataIndex, 1, updatedData);
    setCanvasData([...(canvasData || [])]);
  };
  //serializable
  console.log(canvasData);

  const addElement = (type: string) => {
    const defaultData = getInitialData(canvasData, type);
    setCanvasData([...canvasData, { ...defaultData, type: type ?? "TEXT" }]);
    activeSelection.clear();
    activeSelection.add(defaultData.id);
    setActiveSelection(new Set(activeSelection));
  };

  const deleteElement = useCallback(() => {
    setCanvasData([
      ...canvasData.filter((data) => {
        if (data.id && activeSelection.has(data.id)) {
          activeSelection.delete(data.id);
          return false;
        }
        return true;
      })
    ]);
    setActiveSelection(new Set(activeSelection));
  }, [activeSelection, canvasData]);

  const selectAllElement = useCallback(() => {
    isSelectAll.current = true;
    canvasData.map((data) => activeSelection.add(data.id || ""));
    setActiveSelection(new Set(activeSelection));
  }, [activeSelection, canvasData]);

  const context: ICanvasContext = {
    actions: {
      setCanvasData,
      setActiveSelection,
      updateCanvasData,
      addElement,
      setEnableQuillToolbar
    },
    state: {
      canvasData,
      activeSelection,
      enableQuillToolbar
    }
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Delete") {
        deleteElement();
      } else if (["a", "A"].includes(event.key) && event.ctrlKey) {
        event.preventDefault();
        selectAllElement();
      }
    },
    [deleteElement, selectAllElement]
  );

  const outSideClickHandler = () => {
    isSelectAll.current = false;
    setActiveSelection(new Set());
  };

  const handleMouseDown = useCallback((event: any) => {
    if (!isSelectAll.current) {
      return;
    }

    outSideClickHandler();
    isSelectAll.current = false;
  }, []);

  const [state, setState] = useState("");
  const [show, setShow] = useState({
    status: true,
    name: ""
  });

  const setElements = (type: string, name: string) => {
    setState(type);
    setShow({ status: false, name: name });
  };

  const handleSave = async () => {
    alert("alert");
    try {
      //guarda la imagen en firebase
    //   await saveCanvasAsImage();
      alert("Imagen guardada correctamente");
    } catch (error) {
      alert("Error al guardar la imagen:");
    }
  };


  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [handleKeyDown, handleMouseDown]);

  return (
    <>
      <div ref={containerRef}>
        <CanvasContext.Provider value={context}>
          <div className="flex flex-row">
            {/* Sidebar */}
            <div className="w-[80px] bg-slate-600 z-50 h-[73vh] text-slate-300 overflow-y-auto">
              <div onClick={() => setElements('shape', 'shape')} className={`w-full h-[80px] cursor-pointer flex justify-center flex-col items-center gap-1 hover:text-gray-100`}>
                <span className="text-2xl"><Triangle /></span>
                <span className="text-xs font-medium">Formas</span>
              </div>
              <div onClick={() => setElements('equation', 'equations')} className={`w-full h-[80px] cursor-pointer flex justify-center flex-col items-center gap-1 hover:text-gray-100`}>
                <span className="text-2xl"><Diff /></span>
                <span className="text-xs font-medium">Ecuacion</span>
              </div>
              <div onClick={() => setElements('image', 'uploadImage')} className={`w-full h-[80px] cursor-pointer flex justify-center flex-col items-center gap-1 hover:text-gray-100`}>
                <span className="text-2xl"><Img /></span>
                <span className="text-xs font-medium">Imagen</span>
              </div>
              <div onClick={() => setElements('audio', 'media')} className={`w-full h-[80px] cursor-pointer flex justify-center flex-col items-center gap-1 hover:text-gray-100`}>
                <span className="text-2xl"><Music /></span>
                <span className="text-xs font-medium">Audio</span>
              </div>
              <div onClick={() => setElements('text', 'text')} className={`w-full h-[80px] cursor-pointer flex justify-center flex-col items-center gap-1 hover:text-gray-100`}>
                <span className="text-2xl"><Type /></span>
                <span className="text-xs font-medium">Texto</span>
              </div>
            </div>

            {/* Contenedor expandible */}
            <div className={`${show.status ? 'p-0 left-[390px] absolute w-[1px] z-30 transition-opacity' : 'px-8 left-[455px] absolute py-5 w-[350px] z-30'} bg-slate-700 h-[73vh] transition-opacity`}>
              <div onClick={() => setShow({ name: "", status: true })} className={`${show.status ? '' : 'flex relative z-30 justify-center items-center bg-slate-200 w-[40px] h-[40px] left-[90%] text-slate-600 top-[1px] cursor-pointer rounded-full'}`}>
                <ChevronLeft className={`${show.status ? 'w-[2px]' : ''}`} />
              </div>
              {state === "shape" && !show.status && <div>
                <div className="grid grid-cols-2">
                  {/* <TemplateDesign /> */}
                </div>
              </div>
              }
              {state === "equation" && !show.status && <div>
                Ecuaciones
              </div>
              }
              {state === "image" && !show.status && <div>
                <div className="grid grid-cols-2">
                  <AddImageCanvas />
                </div>
              </div>
              }
              {state === "audio" && !show.status && <div>
                Audios
              </div>
              }
              {state === "text" && !show.status && 
              <div className={`transition-opacity duration-600 ${!show.status ? 'opacity-100' : 'opacity-0'}`}>
                <div className="grid grid-cols-2">
                  <AddTextCanvas />
                </div>
              </div>
              }
            </div>

            <div className="flex flex-col w-4/5 mx-14 relative z-14">
              <div className="flex flex-row z-20">
                <Toolbar isEditEnable={enableQuillToolbar} />
                {/* botones para guardar
                <button onClick={handleSave} className="flex items-center mr-2.5 p-2 cursor-pointer rounded-sm transition-all duration-300 ease-out hover:bg-gray-200 hover:shadow-md">Guardar</button> */}

              </div>
              {/* LIENZO REDIMENSIONABLE */}
              <Rnd
                default={{
                  x: 0,
                  y: 26,
                  width: `auto`,
                  height: `auto`,
                }}
                style={{
                  marginLeft: '3rem',
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
                  position: 'relative',
                  overflow: 'hidden',
                  zIndex: 10,
                }}
                enableResizing={{
                  top: false,
                  right: true,
                  bottom: true,
                  left: false,
                  topRight: false,
                  bottomRight: true,
                  bottomLeft: false,
                  topLeft: false,
                }} // Controla qué lados son redimensionables
                
                disableDragging={true} // Desactiva el arrastre
              >
                {/* Contenedor del lienzo */}
                <div id="canvas-container" className="min-h-[625px] min-w-[800px] h-full bg-red-300 canvas-container-clase">
                  {canvasData.map((canvas) => {
                    return <CanvasComponent key={canvas.id} {...canvas} />;
                  })}
                </div>
              </Rnd>
              {/* <div id="canvas-container" style={{
                  width: `${w}px`,
                  height: `${h}px`,
                  marginLeft: '3rem', // 50px en Tailwind corresponde a 3rem
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
                }}>
                  {canvasData.map((canvas) => {
                    return <CanvasComponent key={canvas.id} {...canvas} />;
                  })}
                </div> */}



            </div>
          </div>
          {/* {JSON.stringify(canvasData)} */}
        </CanvasContext.Provider>


      </div>

    </>
  );
};

export default CanvasContainer;