'use client'

import { Classroom, NewClassroom } from "@/types/classroom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarImage } from "./ui/avatar";
import { ChevronDown, User as UserLR } from 'lucide-react'
import { Input } from "./ui/input";
import { Teacher } from "@/types/teacher";
import { createClassroom, getClassroomsByCourse, getCourseGradeAndCourseBySchool, getTeachersBySchool } from "@/lib/firebaseUtils";
import { Course } from "@/types/course";
import { Silabo } from "@/types/silabo";

// NO FETCHEA LOS DATOS PREVIOS DEL CLASSROOM Y FALTA FUNCION DE ACTUALIZAR AAAAAAAAAAAAAAAAAAA

const sections = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

export function ClassroomEditor({ classroom, onClassroomAdded }: { classroom: Classroom | null; onClassroomAdded?: (classroom: Classroom) => void }) {
    const { data: session, status } = useSession();
    const [toEdit, setToEdit] = useState(false);
    const [grade, setGrade] = useState(1);
    const [section, setSection] = useState(classroom?.section || "");
    const [teacherId, setTeacherId] = useState(classroom?.teacherId ?? "");
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [courseGrades, setCourseGrades] = useState<{ course: Course, courseGrade: Silabo }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [idGradeSelected, setIdGradeSelected] = useState('');

    useEffect(() => {
        setToEdit(!!classroom);
    }, [classroom]);

    useEffect(() => {
        if (!session?.school?.id) return; // No ejecutar si schoolId no está listo

        const fetchData = async () => {
            setIsLoading(true); // Mostrar el loading antes de empezar

            console.log('Fetching data...');
            try {
                const [teachersData, courseGradesData] = await Promise.all([
                    getTeachersBySchool(session.school.id),
                    getCourseGradeAndCourseBySchool(session.school.id)
                ]);
                setTeachers(teachersData);
                setCourseGrades(courseGradesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false); // Solo ocultar el loading después de completar la carga
            }
        };

        fetchData();
    }, [session?.school?.id]);

    const handleAddClassroom = async () => {
        try {
            if (!teacherId || !section || !idGradeSelected) {
                alert('Por favor, completa todos los campos');
                return;
            }
            const clase: {
                grade: number,
                section: string,
                teacherId: string,
                schoolId: string,
                courseId: string,
                studentIds: string[],
                courseGradeId: string
            } = {
                grade: courseGrades.find((cg) => cg.courseGrade.id === idGradeSelected)?.courseGrade.grade ?? 0,
                section,
                teacherId,
                schoolId: session?.school?.id ?? '',
                courseId: courseGrades.find((cg) => cg.courseGrade.id === idGradeSelected)?.course.id ?? '',
                studentIds: [],
                courseGradeId: idGradeSelected
            }

            if (toEdit && classroom?.id) {
                // Update classroom logic here
                console.log('Updating classroom...');
                // Add your update logic here
            } else {
                // Add classroom
                const result = await createClassroom(clase as Classroom);
                console.log(result);
                alert('Clase creada exitosamente');
                setSection('');
                setTeacherId('');
                setIdGradeSelected('');
            }
        } catch (error) {
            console.error('Error adding classroom:', error);
            alert('Hubo un error al agregar la clase. Por favor, intenta nuevamente.');
        }
    };



    return (
        <div className="flex flex-col justify-center max-w-2xl mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>{toEdit ? "Editar Clase" : "Crear nueva Clase"}</CardTitle>
                    <CardDescription>Ingresa los detalles de la clase.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 items-center gap-4">
                        <h2 className="font-semibold text-xl">Asignar clases</h2>
                        <Label htmlFor="descripcion" className="text-left">
                            Docente a cargo
                        </Label>
                        <Select value={teacherId} onValueChange={(value) => setTeacherId(value)}
                        >
                            <SelectTrigger id="type">
                                <SelectValue placeholder="Selecciona persona" />
                            </SelectTrigger>

                            <SelectContent>
                                {teachers.map((teacher) => (
                                    <SelectItem key={teacher.id} value={teacher.id}>
                                        <div className="flex items-center gap-2">
                                            {teacher.profilePictureLink ? (
                                                <Avatar className='w-7 h-7'>
                                                    <AvatarImage src={teacher.profilePictureLink} alt={teacher.codTeacher}
                                                        className='rounded-full object-fill' />
                                                </Avatar>
                                            ) : (
                                                <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center">
                                                    <UserLR className="h-9 w-9 text-gray-500" />
                                                </div>
                                            )}

                                            <span>{teacher.firstName} {teacher.lastName}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-row gap-4">
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="titulo">Grado</Label>
                            <Select value={idGradeSelected} onValueChange={(value) => setIdGradeSelected(value)}>
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Selecciona grado">
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {courseGrades.length > 0 ? (
                                        courseGrades.map((grade, index) => (
                                            <SelectItem key={index} value={grade.courseGrade.id ?? ''}>
                                                {`${grade.courseGrade.grade}`} - {grade.course.courseName}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className="text-center p-2">No hay cursos disponibles</div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="titulo">Sección</Label>
                            <Select value={section} onValueChange={(value) => setSection(value)}>
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Selecciona sección" />
                                </SelectTrigger>

                                <SelectContent>
                                    {sections.map((section) => (
                                        <SelectItem key={section} value={section}>
                                            <span>{section}</span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleAddClassroom} type="submit" className="w-full">
                        {toEdit ? "Actualizar Clase" : "Crear Clase"}
                    </Button>
                </CardFooter>
            </Card>



        </div>
    )
}