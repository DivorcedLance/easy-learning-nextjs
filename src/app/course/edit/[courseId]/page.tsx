'use client'
import { CourseEditor } from "@/components/CourseEditor"
import { LoadingCharger } from "@/components/LoadingCharger"
import { getCourseById } from "@/lib/firebaseUtils"
import { Course } from "@/types/course"
import { useEffect, useState } from "react"

export default function EditCoursePage({params}: {params: {courseId: string}}) {
    const courseId = params.courseId
    const [course, setCourse] = useState<Course | null>(null)
    const [loading, setLoading] = useState(true); // Estado de carga

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                await getCourseById(courseId).then((course) => {
                    setCourse(course)
                    console.log("Curso obtenido:", course)
                })
            } catch (error) {
                console.error("Error al obtener curso:", error);
            }finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);
    if (loading) return <LoadingCharger />;
    return (
        <CourseEditor course={course}/>
    )
}

