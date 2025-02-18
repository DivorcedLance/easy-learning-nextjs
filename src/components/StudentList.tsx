import { Teacher } from "@/types/teacher";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Archive, Edit, Edit2, Search, Trash2 } from "lucide-react"
import { Input } from "./ui/input";
import Link from "next/link";
import { Student } from "@/types/student";

export function StudentList({ students, setIsOpenModal, setIdStudent, setAction }: { students: Student[], setIsOpenModal: Function, setIdStudent: Function, setAction: Function }) {
    const hasStudents = students && students.length > 0

    const handleDelete = async (idStudent: string) => {
        setIdStudent(idStudent)
        setAction('delete')
        setIsOpenModal(true)
    }

    const handleArchive = async (idStudent: string) => {
        setIdStudent(idStudent)
        setAction('archive')
        setIsOpenModal(true)
    }
    return (
        <div className="shadow-lg rounded-lg p-6">
            {/* Falta componetizar */}
            <h1>Estudiantes</h1>
            <div className="flex flex-row space-x-2 items-center mb-4">
                <div className="flex-1 bg-white shadow-lg rounded-lg p-2">
                    <div className="flex flex-row space-x-2">
                        <Input type="text" placeholder="Search teacher" />
                        <div className="">
                            <Button variant={"outline"} size={"icon"}>
                                <Search className="h-4 w-4" />
                                <span className="sr-only">Add</span>
                            </Button>
                        </div>
                    </div>
                </div>
                <Link href={`student/create`} >
                    <Button className="">Agregar</Button>
                </Link>
            </div>

            <div className="w-full overflow-auto shadow-lg rounded-lg">
                <table className="w-full rounded-lg overflow-hidden border-separate border-spacing-0">
                    <thead className="bg-gray-800 text-white rounded-t-lg">
                        <tr>
                            <th className="p-3 text-left rounded-tl-lg">Código</th>
                            <th className="p-3 text-left">Nombre</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Grado</th>
                            <th className="p-3 text-left">Sexo</th>
                            <th className="p-3 text-left">Estado</th>
                            <th className="p-3 text-left rounded-tr-lg">Acciones</th>
                        </tr>
                    </thead>
                    {hasStudents ? (<tbody className="bg-white">
                        {students.map((student, index) => (
                            <tr key={student.id} className="border-b last:rounded-b-lg">
                                <td className="p-3">{student.codStudent}</td>
                                <td className="p-3">{`${student.firstName} ${student.lastName}`}</td>
                                <td className="p-3">{student.email}</td>
                                <td className="p-3">{student.currentGrade}</td>
                                <td className="p-3">{student.sex}</td>
                                <td className="p-3">{student.state ? "Activo" : "Inactivo"}</td>
                                <td className="p-3 flex gap-2">
                                    <Link href={`student/${student.id}/edit`}>
                                        <Button variant="outline" size="icon">
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                    </Link>
                                    <Button variant="outline" size="icon" onClick={() => handleDelete(student.id)}>
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Delete</span>
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => handleArchive(student.id)}>
                                        <Archive className="h-4 w-4" />
                                        <span className="sr-only">Archive</span>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>) :
                        (
                            <tbody className="bg-white">
                                <tr className="border-b last:rounded-b-lg">
                                    <td colSpan={6} className="p-3">No hay registros</td>
                                </tr>
                            </tbody>
                        )}
                </table>
            </div>
        </div>
    );
}