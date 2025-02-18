'use client'

import { LoadingCharger } from "@/components/LoadingCharger";
import StudentEditor from "@/components/StudentEditor";
import { getStudentById} from "@/lib/firebaseUtils";
import { Student } from "@/types/student";
import { useEffect, useState } from "react"

export default function EditStudentPage({params}: {params: {studentId: string}}) {
    const studentId = params.studentId
    const [student, setStudent] = useState<Student | null>(null)
    const [loading, setLoading] = useState(true); // Estado de carga

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                setLoading(true);
                await getStudentById(studentId).then((studentData) => {
                    setStudent(studentData)
                    console.log("Student:", studentData)
                })
            } catch (error) {
                console.error("Error al obtener la data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudent();
    }, [studentId]);
    if (loading) return <LoadingCharger />;
    return (
        <StudentEditor student={student} />
    )
}
