'use client'
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoadingCharger } from "@/components/LoadingCharger";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Course } from "@/types/course";
import { Teacher } from "@/types/teacher";
import { createCourse, getClassroomsByCourse, getTeachersBySchool, updateCourse } from "@/lib/firebaseUtils";
import { ChevronDown, Plus, User as UserLR } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import SilabusEditor from "./SilabusEditor";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { NewClassroom } from "@/types/classroom";



export function CourseEditor({ course, onCourseAdded }: { course: Course | null; onCourseAdded?: (course: Course) => void }) {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [courseName, setCourseName] = useState(course?.courseName || "");
    const [grade, setGrade] = useState(1);
    const [section, setSection] = useState("");
    const [teacherId, setTeacherId] = useState("");
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [classrooms, setClassrooms] = useState<NewClassroom[]>([]);
    const [toEdit, setToEdit] = useState(false);

    useEffect(() => {
        if (status === "loading") return;
        if (!session) signIn();
    }, [session, status]);

    useEffect(() => {
        setToEdit(!!course);
    }, [course]);

    useEffect(() => {
        if (course) {
            setCourseName(course.courseName || "");
        }
    }, [course]);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch teachers
            if (session) {
                if (course?.schoolId) {
                    await getTeachersBySchool(course.schoolId).then(setTeachers);
                }

                if (course && toEdit) {
                    await getClassroomsByCourse(course?.id || "").then((classes) => {
                        setClassrooms(classes.map(classroom => ({
                            grade: classroom.grade,
                            section: classroom.section,
                            teacherId: classroom.teacherId
                        })));
                    });
                }
            }
            setIsLoading(false);
        };

        fetchData();
    }, [course, toEdit]);

    const handleAddClassroom = () => {
        // Verificar si ya existe una clase con los mismos valores
        const exists = classrooms.some(classroom =>
            classroom.grade === grade &&
            classroom.section === section
        );

        if (!exists) {
            setClassrooms([...classrooms, {
                grade: grade,
                section: section,
                teacherId: teacherId
            }]);
        } else {
            alert("⚠️ La clase ya existe y no se puede agregar nuevamente.");
        }
    };


    const handleSaveCourse = async () => {
        try {
            const newCourse = {
                codCourse: course?.codCourse || "",
                courseName: courseName,
                schoolId: session?.school?.id,
            };

            if (toEdit && course?.id) {
                await updateCourse(course.id, newCourse as Course, classrooms);
            } else {
                const courseId = await createCourse(newCourse as Course, classrooms);
                console.log(courseId);
            }


            alert("Curso guardado exitosamente");
        } catch (error) {
            alert(error);
        }
    };
    if (isLoading || status === "loading" || !session) return <LoadingCharger />;
    return (
        <div className="max-w-2xl mx-auto p-4">
            <Card>
                <CardHeader>
                <CardTitle>{toEdit ? "Editar Curso" : "Crear nuevo Curso"}</CardTitle>
                    <CardDescription>Ingresa los detalles del curso.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <h2 className="font-semibold text-xl">General</h2>
                    <div className="space-y-2">
                        <Label htmlFor="titulo">Título del Curso</Label>
                        <Input id="titulo" name="titulo" onChange={(e) => setCourseName(e.target.value)} value={courseName} placeholder="Introduce el título del curso" required />
                    </div>

                    <div className="grid grid-cols-1 items-center gap-4">
                        <h2 className="font-semibold text-xl">Asignar clases</h2>
                        <Label htmlFor="descripcion" className="text-left">
                            Docente a cargo
                        </Label>
                        <Select
                            value={teacherId}
                            onValueChange={(value) => setTeacherId(value)}
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
                                                    <AvatarImage src={teacher.profilePictureLink} alt={teacher.codTeacher} className='rounded-full object-fill' />
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
                            <Input id="titulo" type="number" name="titulo" onChange={(e) => setGrade(parseInt(e.target.value))} value={grade} placeholder="Grado" required />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="titulo">Sección</Label>
                            <Input id="titulo" name="titulo" onChange={(e) => setSection(e.target.value)} value={section} placeholder="Sección" required />
                        </div>
                        <div className="flex items-end justify-end">
                            <Button onClick={handleAddClassroom}>Añadir clase</Button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h2 className="font-semibold text-sm">Clases</h2>
                        <div className="space-y-4">
                            {classrooms.length > 0 ? (
                                classrooms.map((member, index) => (
                                    <div key={index} className="flex flex-col justify-between p-4 bg-white rounded-lg shadow">
                                        <div className="flex flex-row space-x-2">
                                            <p className="font-medium text-lg">Grado: {member.grade} -</p>
                                            <p className="text-gray-500 text-lg">Sección: {member.section}</p>
                                        </div>
                                        <div className="flex items-center space-x-4 mt-2">
                                            {teachers.find(teacher => teacher.id === member.teacherId)?.profilePictureLink ? (
                                                <div className="flex flex-row items-center space-x-4">
                                                    <Avatar className='h-7 w-7'>
                                                        <AvatarImage src={(teachers.find(teacher => teacher.id === member.teacherId))?.profilePictureLink || ''} alt={member.teacherId} className='rounded-full object-fill' />
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{(teachers.find(teacher => teacher.id === member.teacherId))?.firstName} {(teachers.find(teacher => teacher.id === member.teacherId))?.lastName}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>

                                                    <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <UserLR className="h-9 w-9 text-gray-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{(teachers.find(teacher => teacher.id === member.teacherId))?.firstName} {(teachers.find(teacher => teacher.id === member.teacherId))?.lastName}</p>
                                                    </div>
                                                </div>
                                            )}

                                        </div>

                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No hay clases asignadas</p>
                            )}
                        </div>
                    </div>

                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" onClick={handleSaveCourse}>
                    {toEdit ? "Actualizar Curso" : "Crear Curso"}
                    </Button>
                </CardFooter>
            </Card>


        </div>
    );
}