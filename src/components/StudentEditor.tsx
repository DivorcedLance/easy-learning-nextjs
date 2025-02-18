'use client'
import { Teacher } from "@/types/teacher";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Input } from "./ui/input";
import { CameraIcon, ChevronLeftIcon } from "lucide-react";
import Image from "next/image";
import { User as UserLR } from 'lucide-react'
import { Checkbox } from "./ui/checkbox";
import { createStudent, createTeacher, updateStudent, updateTeacher, uploadImage } from "@/lib/firebaseUtils";
import { on } from "events";
import { Student } from "@/types/student";


interface NewStudent {
    codStudent: string;
    firstName: string;
    lastName: string;
    email: string;
    dni: string;
    sex: string;
    state: boolean;
    profilePictureLink?: string;
    schoolId: string;
    password?: string;
    currentGrade: number;
}

export default function StudentEditor({ student, onStudentAdded }: { student: Student | null; onStudentAdded?: (student: Student) => void }) {
    const { data: session, status } = useSession();
    const [toEdit, setToEdit] = useState(false);
    const [grade, setGrade] = useState(student?.currentGrade || 1);
    const [codeStudent, setCodeStudent] = useState(Number(student?.codStudent.split('-')[2]) || 0);
    const [studentFirstName, setStudentFirstName] = useState(student?.firstName || "");
    const [studentLastName, setStudentLastName] = useState(student?.lastName || "");
    const [studentEmail, setStudentEmail] = useState(student?.email || "");
    const [studentCodStudent, setStudentCodStudent] = useState(Number(student?.codStudent.split('-')[2]) || 0);
    const [studentSex, setStudentSex] = useState(student?.sex || "");
    const [studentDni, setStudentDni] = useState(student?.dni || "");
    const [studentState, setStudentState] = useState<boolean>(student?.state || true);
    const [studentProfileImage, setStudentProfileImage] = useState(student?.profilePictureLink || "");
    const [file, setFile] = useState<File | null>(null);


    useEffect(() => {
        if (status === "loading") return;
        if (!session) signIn();
    }, [session, status]);

    useEffect(() => {
        setToEdit(!!student);
    }, [student]);

    useEffect(() => {
        if (student) {
            setStudentState(student.state ?? true); // Se actualiza con el valor correcto cuando se recibe `teacher`
        }
    }, [student]);

    const handleCheckChange = (checked: boolean) => {
        setStudentState(checked);
        console.log(checked);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const imageUrl = URL.createObjectURL(file); // Crea una URL temporal para previsualización
            setStudentProfileImage(imageUrl);
            setFile(file);
        }
    };


    const onSubmit = async (data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }) => {
        try {
            const response = await fetch("/api/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                alert("Correo enviado exitosamente");
            } else {
                alert("Error enviando correo");
            }


        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateStudent = async () => {

        try {
            const imgUrl = await uploadImage(file);

            const newStudent: NewStudent = {
                codStudent: String("S-"+session?.school.code+"-"+studentCodStudent),
                firstName: studentFirstName,
                lastName: studentLastName,
                email: studentEmail,
                dni: studentDni,
                sex: studentSex,
                state: studentState,
                profilePictureLink: imgUrl?.downloadURL ?? '',
                schoolId: session?.school.id,
                currentGrade: grade
            };

            if (toEdit) {
                if(student?.id){await updateStudent(student?.id, newStudent);}
                alert("Student actualizado exitosamente");
            } else {
                console.log(newStudent);
                const response = await createStudent(newStudent);
                const emailData: {
                    firstName: string;
                    lastName: string;
                    email: string;
                    password: string;
                } = {
                    firstName: studentFirstName,
                    lastName: studentLastName,
                    email: studentEmail,
                    password: response.password,
                };
                onSubmit(emailData);
                // console.log(response);
                setFile(null);
                setStudentProfileImage("");
                setStudentFirstName("");
                setStudentLastName("");
                setStudentEmail("");
                setStudentDni("");
                setStudentSex("");
                setStudentState(true);
                alert("Estudiante creado exitosamente");
            }
        } catch (error) {
            alert("Error creando estudiante");
            console.error("Error creating/updating estudiante:", error);
        }

    }


    return (
        <>
            <div className="flex flex-col justify-center max-w-2xl mx-auto p-4">
                <Button variant={"outline"} onClick={() => { return window.history.back(); }} className="w-fit mb-4">
                    <ChevronLeftIcon className="" />
                    <span className="mr-2">Regresar</span>
                </Button>
                <Card>
                    <CardHeader>
                        <CardTitle>{toEdit ? "Editar Estudiante" : "Crear nuevo Estudiante"}</CardTitle>
                        <CardDescription>Ingresa los detalles del estudiante.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-row space-x-4">
                            <div className="flex-1">
                                <Label>Foto</Label>
                                <div className="relative w-44 h-44">
                                    {studentProfileImage ? (
                                        <Image
                                            src={studentProfileImage}
                                            alt="Foto de perfil"
                                            width={176} // 44 * 4px = 176px
                                            height={176}
                                            className="w-full h-full rounded-full object-cover"
                                        />

                                    ) : (
                                        <div className="w-44 h-44 bg-gray-200 rounded-full flex items-center justify-center">
                                            <UserLR className="h-12 w-12 text-gray-500" />
                                        </div>


                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        id="profileImageInput"
                                        onChange={handleImageChange}
                                    />
                                    <label htmlFor="profileImageInput" className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                                        <CameraIcon className="h-6 w-6 text-white" />
                                    </label>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="space-y-2">
                                    <Label htmlFor="titulo">Código</Label>
                                    <div className="flex flex-row items-center space-x-2">
                                        <div className="w-20">
                                            <span className="text-gray-500">S-{session?.school.code}-</span>
                                        </div>
                                        <Input type="number" value={studentCodStudent} onChange={(e) => setStudentCodStudent(Number(e.target.value))} placeholder="Código" required min={1} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="titulo">Nombres</Label>
                                    <Input type="text" value={studentFirstName} onChange={(e) => setStudentFirstName(e.target.value)} placeholder="Nombres" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="titulo">Apellidos</Label>
                                    <Input type="text" value={studentLastName} onChange={(e) => setStudentLastName(e.target.value)} placeholder="Apellidos" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="titulo">Email</Label>
                                    <Input type="email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} placeholder="Email" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="titulo">DNI</Label>
                                    <Input type="text" value={studentDni} onChange={(e) => setStudentDni(e.target.value)} placeholder="DNI" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="titulo">Grado</Label>
                                    <Input type="number" value={grade} onChange={(e) => setGrade(Number(e.target.value))} placeholder="Grado" required min={1} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="titulo">Sexo</Label>
                                    <Select value={studentSex} onValueChange={(e) => setStudentSex(e)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione sexo">{studentSex}</SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="M">Masculino</SelectItem>
                                            <SelectItem value="F">Femenino</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col space-y-2 mt-2">
                                    <Label htmlFor="titulo">Estado</Label>
                                    <div className="flex flex-row items-center space-x-2">
                                        <span className="text-sm text-gray-500">Activo</span>
                                        <Checkbox checked={studentState} onCheckedChange={handleCheckChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" onClick={handleCreateStudent}>
                            {toEdit ? "Guardar cambios" : "Crear Estudiante"}
                        </Button>
                    </CardFooter>
                </Card>


            </div>
        </>
    );

}