'use client'
import { ClassroomEditor } from "@/components/ClassroomEditor"
import { CourseEditor } from "@/components/CourseEditor"
import { LoadingCharger } from "@/components/LoadingCharger"
import { getClassroomById, getCourseById } from "@/lib/firebaseUtils"
import { Classroom } from "@/types/classroom"
import { Course } from "@/types/course"
import { useEffect, useState } from "react"

export default function EditClassroomPage({params}: {params: {classroomId: string}}) {
    const classroomId = params.classroomId
    const [classroom, setClassroom] = useState<Classroom | null>(null)
    const [loading, setLoading] = useState(true); // Estado de carga
    useEffect(() => {
        const fetchClassroom = async () => {
            try {
                setLoading(true);
                await getClassroomById(classroomId).then((classroomData) => {
                    setClassroom(classroomData)
                    console.log("Clase obtenida:", classroomData)
                })
            } catch (error) {
                console.error("Error al obtener clase:", error);
            }finally {
                setLoading(false);
            }
        };

        fetchClassroom();
    }, [classroomId]);
    if (loading) return <LoadingCharger />;
    return (
        <ClassroomEditor classroom={classroom}/>
    )
}

