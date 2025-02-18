'use client'
import { Textarea } from "./ui/textarea";
import { useRouter } from "next/navigation";
import { LoadingCharger } from "@/components/LoadingCharger";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Course } from "@/types/course";
import { Teacher } from "@/types/teacher";
import { ChevronDown, User as UserLR } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import SilabusEditor from "./SilabusEditor";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { NewClassroom } from "@/types/classroom";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Plus, X } from 'lucide-react';
import { createCourse, getCoursesBySchool, getSilabusByCourse, updateCourse } from "@/lib/firebaseUtils";
import { ModalGrade } from "./ModalGrade";
import { ModalAddSilabus } from "./ModalAddSilabus";
import { Silabo } from "@/types/silabo";
import { ModalViewSilabus } from "./ModalViewSilabus";

interface Grade {
    courseId: string;
    grade: number;
}

export function CourseEditor({ course, onCourseAdded }: { course: Course | null; onCourseAdded?: (course: Course) => void }) {
    const { data: session, status } = useSession();
    const [courseName, setCourseName] = useState(course?.courseName || "");
    const [grades, setGrades] = useState<Grade[]>([]);
    const [toEdit, setToEdit] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isAddSilabusOpen, setIsAddSilabusOpen] = useState(false);
    const [isViewSilabusOpen, setIsViewSilabusOpen] = useState(false);
    const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
    const [toInput, setToInput] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState(0);
    const [silabus, setSilabus] = useState<(Silabo | null)[]>([]);
    const [silabusSelected, setSilabusSelected] = useState<Silabo | null>(null);


    useEffect(() => {
        if (status === "loading") return;
        if (!session) signIn();
    }, [session, status]);

    useEffect(() => {
        setToEdit(!!course);
    }, [course]);

    useEffect(() => {
        console.log(silabus);
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
        const fetchSilabus = async () => {
            if (course) {
                try {
                    const silabus = await getSilabusByCourse(course.id);
                    setSilabus(silabus);
                } catch (error) {
                    console.error("Error al obtener silabus:", error);
                }
            }
        };

        fetchSilabus();
    }, [course]);

    useEffect(() => {
        if (course) {
            setCourseName(course.courseName || "");
        }
    }, [course]);

    const handleOpenModal = () => setIsOpen(true);
    const handleOpenAddSilabus = (grade: number) => {
        console.log(grade);
        setIsAddSilabusOpen(true);
        setSelectedGrade(grade);
    }

    const handleSaveSilabus = (silabo: Silabo) => {
        console.log(silabo);
        setSilabus((prevSilabus) => [...prevSilabus, silabo]);
        setIsAddSilabusOpen(false);
        setSelectedGrade(0);
    };

    const handleUpgradeSilabus = (silabo: Silabo) => {
        console.log(silabo);
        setSilabus((prevSilabus) => prevSilabus.map(s => s?.grade === silabo.grade ? silabo : s));
        setIsViewSilabusOpen(false);
    }

    const deleteSavedSilabus = (grade: number) => {
        setSilabus((prevSilabus) => prevSilabus.filter(s => s?.grade !== grade));
    };

    const viewSavedSilabus = (grade: number) => {
        console.log(silabus.find(s => s?.grade === grade));
        setSilabusSelected(silabus.find(s => s?.grade === grade) || null);
        setIsViewSilabusOpen(true);
    }


    const handleSaveCourse = async () => {
        try {
            const newCourse = {
                id: course?.id || "",
                codCourse: course?.codCourse || "",
                courseName: courseName,
                schoolId: session?.school?.id,
            };

            if (toEdit && course?.id) {
                await updateCourse(course.id, newCourse as Course, grades);
            } else {
                const courseId = await createCourse(newCourse as Course, grades, availableCourses, silabus);
                newCourse.id = courseId;
                console.log(courseId);
            }
            setAvailableCourses([...availableCourses, newCourse as Course]);
            setCourseName("");
            setSilabus([]);
            setGrades([]);

            alert("Curso guardado exitosamente");
        } catch (error) {
            alert(error);
        }
    };

    const handleAddGrade = (grado: number) => {
        if (!grades.some(g => g.grade === grado)) {
            setGrades(prevGrades => [...prevGrades, { courseId: course?.id || "", grade: grado }]);
        } else {
            alert("⚠️ El grado ya existe y no se puede agregar nuevamente.");
        }
    };

    const handleRemoveGrade = (grado: number) => {
        setGrades(prevGrades => prevGrades.filter(g => g.grade !== grado));
    };

    const changeToInput = () => {
        setCourseName("");
        setToInput(!toInput);
    };

    return (
        <div className="flex flex-col justify-center max-w-2xl mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>{toEdit ? "Editar Curso" : "Crear nuevo Curso"}</CardTitle>
                    <CardDescription>Ingresa los detalles del curso.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="titulo">Título del Curso</Label>
                        <div className="flex flex-row">
                            {!toInput ? (<Select onValueChange={(value) => setCourseName(value)} value={courseName}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un curso" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableCourses.length > 0 ? (
                                        availableCourses.map((course, index) => (
                                            <SelectItem key={index} value={course.courseName}>
                                                {course.courseName}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 px-2">No se encontraron cursos</p>
                                    )}
                                </SelectContent>
                            </Select>) : (
                                <Input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="Nombre del curso" required />
                            )}
                            <Button variant="outline" className=" ml-2" onClick={changeToInput}>
                                <Plus size={16} />
                            </Button>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" onClick={handleSaveCourse}>
                        {toEdit ? "Actualizar Curso" : "Crear Curso"}
                    </Button>
                </CardFooter>
            </Card>

            <Button variant="ghost" size="sm" className="w-fit mx-auto mt-4 rounded-lg" onClick={handleOpenModal}>
                <p className="text-sm mr-2">Agregar Grado</p>
                <Plus size={16} />
            </Button>

            <div className="space-y-4">
                <h2 className="font-semibold text-sm">Grados</h2>
                <div className="space-y-4">
                    {grades.length > 0 ? (
                        grades.map((grad, index) => (
                            <div key={index} className="flex flex-row justify-between items-center space-x-2">
                                <div key={index} className="flex flex-row justify-between p-4 bg-white rounded-lg shadow w-full">
                                    <div className="flex flex-row p-6 items-center bg-slate-900 rounded-lg">
                                        <p className="font-medium text-6xl text-white">{grad.grade}</p>
                                    </div>
                                    <div className="flex flex-col justify-center w-4/12">
                                        {!silabus.find((s) => s?.grade == grad.grade) ? (
                                            <Button variant="outline" size="sm" className="w-full rounded-lg p-0 my-1" onClick={() => handleOpenAddSilabus(grad.grade)}>
                                                <p className="text-sm">Agregar Silabus</p>
                                            </Button>
                                        ) :
                                            (
                                                <div>
                                                    <Button onClick={()=>viewSavedSilabus(grad.grade)} variant="default" size="sm" className="w-full rounded-lg p-0 my-1">
                                                        <p className="text-sm">Ver Silabus</p>
                                                    </Button>
                                                    <Button onClick={()=>deleteSavedSilabus(grad.grade)} variant="destructive" size="sm" className="w-full rounded-lg p-0 my-1">
                                                        <p className="text-sm">Eliminar Silabus</p>
                                                    </Button>

                                                </div>
                                            )

                                        }
                                    </div>

                                </div>
                                <Button variant="ghost" onClick={() => handleRemoveGrade(grad.grade)} className="rounded-full text-red-500 hover:text-red-700">
                                    <X />
                                </Button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">Este curso no tiene grados</p>
                    )}
                </div>
            </div>

            {isOpen && (<ModalGrade isOpen={isOpen} onGradeAdded={handleAddGrade} onOpenChange={setIsOpen} />)}
            {isAddSilabusOpen && (<ModalAddSilabus isOpen={isAddSilabusOpen} onOpenChange={setIsAddSilabusOpen} type={"coursePage"} selectedGrade={selectedGrade} courseName={courseName} onSilabusAdded={handleSaveSilabus} />)}
            {isViewSilabusOpen && silabusSelected && (<ModalViewSilabus isOpen={isViewSilabusOpen} onOpenChange={setIsViewSilabusOpen} type={"coursePage"} selectedGrade={selectedGrade} courseName={courseName} silabus={silabusSelected} onSilabusAdded={handleUpgradeSilabus} /> )}
        </div>
    );
}
