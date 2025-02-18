"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { signIn, useSession } from "next-auth/react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { X } from "lucide-react"
import { Silabo } from "@/types/silabo"
import { createSilabus, getCoursesBySchool, updateSilaBus } from "@/lib/firebaseUtils";
import { Course } from "@/types/course";

const semanas = ["Semana 1", "Semana 2", "Semana 3", "Semana 4", "Semana 5", "Semana 6", "Semana 7", "Semana 8", "Semana 9", "Semana 10", "Semana 11", "Semana 12", "Semana 13", "Semana 14", "Semana 15", "Semana 16", "Semana 17", "Semana 18", "Semana 19", "Semana 20", "Semana 21", "Semana 22", "Semana 23", "Semana 24", "Semana 25", "Semana 26", "Semana 27", "Semana 28", "Semana 29", "Semana 30", "Semana 31", "Semana 32", "Semana 33", "Semana 34", "Semana 35", "Semana 36"]

export default function SilabusEditor({ silabus, type, selectedGrade, courseName, onSaveSilabus }: { silabus: Silabo | null, type?: string, selectedGrade?: number, courseName?: string, onSaveSilabus?: (silabo: Silabo) => void }) {

    const { data: session, status } = useSession();
    const [toEdit, setToEdit] = useState(false);
    const [semanaSeleccionada, setSemanaSeleccionada] = useState("");
    const [temasPorSemana, setTemasPorSemana] = useState<Record<string, string>>(silabus?.silabusData.topics || {});
    const [nuevoTema, setNuevoTema] = useState("")
    const [grade, setGrade] = useState(silabus?.grade || selectedGrade || 1)
    const [idCourse, setIdCourse] = useState(silabus?.courseId || "")
    const [title, setTitle] = useState(courseName || "")
    const [description, setDescription] = useState(silabus?.silabusData.description || "")
    const [goals, setGoals] = useState(silabus?.silabusData.goals || "")
    const [method, setMethod] = useState(silabus?.silabusData.method || "")
    const [bibliography, setBibliography] = useState(silabus?.silabusData.bibliography || "")
    const [availableCourses, setAvailableCourses] = useState<Course[]>([]);

    useEffect(() => {
        if (status === "loading") return;
        if (!session) signIn();
    }, [session, status]);


    useEffect(() => {
        setToEdit(!!silabus);
    }, [silabus]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const courses = await getCoursesBySchool(session?.school?.id);
                setAvailableCourses(courses);
            } catch (error) {
                console.error("Error al obtener cursos:", error);
            }
        };

        fetchCourses();
    }, [session?.school?.id]);

    useEffect(() => {
        console.log("Temas por semana actualizado:", temasPorSemana);
    }, [temasPorSemana]); // Se ejecuta cada vez que temasPorSemana cambia


    const agregarTema = () => {
        if (!semanaSeleccionada || !nuevoTema.trim()) return;

        setTemasPorSemana((prevTemas) => ({
            ...prevTemas,
            [semanaSeleccionada]: nuevoTema, // Reemplaza el tema de la semana seleccionada
        }));

        setNuevoTema(""); // Limpiar el input después de agregar
    };

    const eliminarSemana = (index: number) => {
        setTemasPorSemana((prevTemas) => {
            const newTemas = { ...prevTemas };
            delete newTemas[Object.keys(prevTemas)[index]];
            return newTemas;
        });
    }
    const handleSaveSilabo = async () => {
        try {
            const newSilabo = {
                courseId: idCourse,
                schoolId: session?.school?.id,
                grade: grade,
                silabusData: {
                    description: description,
                    goals: goals,
                    topics: temasPorSemana,
                    method: method,
                    bibliography: bibliography
                }
            };

            if (toEdit) {
                if (type === "silabusPage") {
                    await updateSilaBus(silabus?.id as string, newSilabo as Silabo);
                    alert("Silabo actualizado exitosamente");

                } else {
                    console.log("d");
                    onSaveSilabus?.(newSilabo as Silabo);
                }
            } else {
                if (type === "silabusPage") {
                    const silaboId = await createSilabus(newSilabo as Silabo);
                    console.log(silaboId);
                    setIdCourse("");
                    setGrade(1);
                    setDescription("");
                    setGoals("");
                    setMethod("");
                    setBibliography("");
                    setTemasPorSemana({});

                } else {
                    onSaveSilabus?.(newSilabo as Silabo);
                }
                alert("Silabo creado exitosamente");
            }

        } catch (error) {
            console.error(error);
            alert("Ocurrió un error al guardar el sílabo: " + error as string);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <Card>
                <CardHeader>
                    {toEdit ? (<CardTitle>Editar Sílabus</CardTitle>) :
                        (<CardTitle>Crear Nuevo Sílabus</CardTitle>)}
                    <CardDescription>Ingresa los detalles del sílabus para el curso.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {type === "silabusPage" && (
                        <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre del Curso</Label>
                            {/* Select para elegir un curso */}
                            <Select onValueChange={(value) => setIdCourse(value)} value={idCourse}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un curso" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableCourses.length > 0 ? (
                                        availableCourses.map((course, index) => (
                                            <SelectItem key={index} value={course.id}>
                                                {course.courseName}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 px-2">No se encontraron cursos</p>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>)}
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="titulo">Grado</Label>
                        {selectedGrade || toEdit ? (<Input id="titulo" type="number" name="titulo" onChange={(e) => setGrade(parseInt(e.target.value))} value={selectedGrade} placeholder="Grado" disabled />) :
                            (<Input id="titulo" type="number" name="titulo" onChange={(e) => setGrade(parseInt(e.target.value))} value={grade} placeholder="Grado" required />)}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="descripcion">Descripción del Curso</Label>
                        <Textarea id="descripcion" value={description} name="descripcion" onChange={(e) => setDescription(e.target.value)} placeholder="Breve descripción del curso" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="objetivos">Objetivos de Aprendizaje</Label>
                        <Textarea id="objetivos" value={goals} name="objetivos" onChange={(e) => setGoals(e.target.value)} placeholder="Lista de objetivos de aprendizaje" required />
                    </div>
                    <div className="space-y-2">
                        <Label>Temas Principales</Label>
                        <div className="flex space-x-2">
                            <Select onValueChange={setSemanaSeleccionada}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una semana" />
                                </SelectTrigger>
                                <SelectContent>
                                    {semanas.map((semana, index) => (
                                        <SelectItem key={index} value={semana}>
                                            {semana}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input
                                value={nuevoTema}
                                onChange={(e) => setNuevoTema(e.target.value)}
                                placeholder="Añadir nuevo tema"
                            />
                            <Button type="button" onClick={agregarTema}>
                                Agregar
                            </Button>
                        </div>
                        <ul className="mt-2 space-y-2">
                            {Object.entries(temasPorSemana).map(([semana, temas], index) => (
                                <li key={index} className="flex items-center justify-between bg-secondary p-2 rounded">
                                    <h3>{semana}</h3>
                                    <ul>
                                        {temas}
                                    </ul>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => eliminarSemana(index)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="evaluacion">Método de Evaluación</Label>
                        <Textarea id="evaluacion" value={method} name="evaluacion" onChange={(e) => setMethod(e.target.value)} placeholder="Describe cómo se evaluará el curso" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bibliografia">Bibliografía</Label>
                        <Textarea
                            id="bibliografia"
                            name="bibliografia"
                            value={bibliography}
                            onChange={(e) => setBibliography(e.target.value)}
                            placeholder="Lista de libros y recursos recomendados"
                            required
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    {toEdit ? (<Button className="w-full" onClick={handleSaveSilabo}>
                        Guardar Cambios
                    </Button>) : (
                        <Button className="w-full" onClick={handleSaveSilabo}>
                            Crear Sílabo
                        </Button>)}
                </CardFooter>
            </Card>

        </div>
    )
}

