'use client'
import { CourseEditor } from "@/components/CourseEditor"
import { getCourseById } from "@/lib/firebaseUtils"
import { Course } from "@/types/course"
import { useEffect, useState } from "react"

export default function EditCoursePage({params}: {params: {courseId: string}}) {
    const courseId = params.courseId
    const [course, setCourse] = useState<Course | null>(null)

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                await getCourseById(courseId).then((course) => {
                    setCourse(course)
                    console.log("Curso obtenido:", course)
                })
            } catch (error) {
                console.error("Error al obtener curso:", error);
            }
        };

        fetchCourse();
    }, []);
    return (
        <CourseEditor course={course}/>
    )
}

