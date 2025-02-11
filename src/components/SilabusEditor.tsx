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
import { createSilabus, getCoursesBySchool } from "@/lib/firebaseUtils";
import { Course } from "@/types/course";

export default function SilabusEditor({ silabo }: { silabo: Silabo | null }) {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [temas, setTemas] = useState<string[]>(silabo?.silabusData.topics || [])
    const [nuevoTema, setNuevoTema] = useState("")
    const [grade, setGrade] = useState(silabo?.grade || 1)
    const [courseNm, setCourseNm] = useState("")
    const [description, setDescription] = useState(silabo?.silabusData.description || "")
    const [goals, setGoals] = useState(silabo?.silabusData.goals || "")
    const [method, setMethod] = useState(silabo?.silabusData.method || "")
    const [bibliography, setBibliography] = useState(silabo?.silabusData.bibliography || "")
    const [availableCourses, setAvailableCourses] = useState<Course[]>([]);

    useEffect(() => {
        if (status === "loading") return;
        if (!session) signIn();
    }, [session, status]);

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

    const agregarTema = () => {
        if (nuevoTema.trim() !== "") {
            setTemas([...temas, nuevoTema.trim()])
            setNuevoTema("")
        }
    }

    const eliminarTema = (index: number) => {
        setTemas(temas.filter((_, i) => i !== index))
    }
    const handleSaveSilabo = async () => {
        console.log("Guardando sílabo");
        try {
            const newSilabo = {
                courseId: courseNm,
                schoolId: session?.school?.id,
                grade: grade,
                silabusData: {
                    description: description,
                    goals: goals,
                    topics: temas,
                    method: method,
                    bibliography: bibliography
                }
            };

            const silaboId = await createSilabus(newSilabo as Silabo);
            console.log(silaboId);
            alert("Silabo guardado exitosamente");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Crear Nuevo Sílabo</CardTitle>
                    <CardDescription>Ingresa los detalles del sílabo para el curso.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre del Curso</Label>
                        {/* Select para elegir un curso */}
                        <Select onValueChange={(value) => setCourseNm(value)} value={courseNm}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un curso" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableCourses.length>0 ? (
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
                    </div>
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="titulo">Grado</Label>
                        <Input id="titulo" type="number" name="titulo" onChange={(e) => setGrade(parseInt(e.target.value))} value={grade} placeholder="Grado" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="descripcion">Descripción del Curso</Label>
                        <Textarea id="descripcion" name="descripcion" onChange={(e) => setDescription(e.target.value)} placeholder="Breve descripción del curso" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="objetivos">Objetivos de Aprendizaje</Label>
                        <Textarea id="objetivos" name="objetivos" onChange={(e) => setGoals(e.target.value)} placeholder="Lista de objetivos de aprendizaje" required />
                    </div>
                    <div className="space-y-2">
                        <Label>Temas Principales</Label>
                        <div className="flex space-x-2">
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
                            {temas.map((tema, index) => (
                                <li key={index} className="flex items-center justify-between bg-secondary p-2 rounded">
                                    {tema}
                                    <Button type="button" variant="ghost" size="icon" onClick={() => eliminarTema(index)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                        <input type="hidden" name="temas" value={JSON.stringify(temas)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="evaluacion">Método de Evaluación</Label>
                        <Textarea id="evaluacion" name="evaluacion" onChange={(e) => setMethod(e.target.value)} placeholder="Describe cómo se evaluará el curso" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bibliografia">Bibliografía</Label>
                        <Textarea
                            id="bibliografia"
                            name="bibliografia"
                            onChange={(e) => setBibliography(e.target.value)}
                            placeholder="Lista de libros y recursos recomendados"
                            required
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleSaveSilabo}>
                        Crear Sílabo
                    </Button>
                </CardFooter>
            </Card>

        </div>
    )
}

