'use client'

import { LoadingCharger } from "@/components/LoadingCharger";
import StudentEditor from "@/components/StudentEditor";
import StudentsAssign from "@/components/StudentsAssign";
import { getStudentById, getStudentsByClassroomGrade} from "@/lib/firebaseUtils";
import { Student } from "@/types/student";
import { useEffect, useState } from "react"

export default function AssignStudentPage({params}: {params: {classroomId: string}}) {
    const classroomId = params.classroomId
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true); // Estado de carga
    useEffect(() => {
        const fetchStudentsByGrade= async () => {
            try {
                setLoading(true);
                await getStudentsByClassroomGrade(classroomId).then((studentsData) => {
                    setStudents(studentsData)
                    console.log("Estudiantes obtenidos:", studentsData)
                })
                
            } catch (error) {
                console.error("Error al obtener curso:", error);
            }finally {
                setLoading(false);
            }
        };

        fetchStudentsByGrade();
    }, [classroomId]);
    if (loading) return <LoadingCharger />;
    return (
        <StudentsAssign students={students} classroomId={classroomId}/>
    )
}