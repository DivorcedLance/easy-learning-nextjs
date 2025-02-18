'use client'

import { LoadingCharger } from "@/components/LoadingCharger";
import TeacherEditor from "@/components/TeacherEditor";
import { getTeacherById } from "@/lib/firebaseUtils";
import { Teacher } from "@/types/teacher";
import { useEffect, useState } from "react"

export default function EditTeacherPage({params}: {params: {teacherId: string}}) {
    const teacherId = params.teacherId
    const [teacher, setTeacher] = useState<Teacher | null>(null)
    const [loading, setLoading] = useState(true); // Estado de carga

    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                setLoading(true);
                await getTeacherById(teacherId).then((teacherData) => {
                    setTeacher(teacherData)
                    console.log("Teacher:", teacherData)
                })
            } catch (error) {
                console.error("Error al obtener la data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacher();
    }, [teacherId]);
    if (loading) return <LoadingCharger />;
    return (
        <TeacherEditor teacher={teacher} />
    )
}
