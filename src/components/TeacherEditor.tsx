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
import { createTeacher, updateTeacher, uploadImage } from "@/lib/firebaseUtils";
import { on } from "events";


interface NewTeacher {
    codTeacher: string;
    firstName: string;
    lastName: string;
    email: string;
    dni: string;
    sex: string;
    state: boolean;
    profilePictureLink?: string;
    schoolId: string;
    password?: string;
}

export default function TeacherEditor({ teacher, onTeacherAdded }: { teacher: Teacher | null; onTeacherAdded?: (teacher: Teacher) => void }) {
    const { data: session, status } = useSession();
    const [toEdit, setToEdit] = useState(false);
    const [codeTeacher, setCodeTeacher] = useState(Number(teacher?.codTeacher.split('-')[2]) || 0);
    const [teacherFirstName, setTeacherFirstName] = useState(teacher?.firstName || "");
    const [teacherLastName, setTeacherLastName] = useState(teacher?.lastName || "");
    const [teacherEmail, setTeacherEmail] = useState(teacher?.email || "");
    const [teacherCodTeacher, setTeacherCodTeacher] = useState(Number(teacher?.codTeacher.split('-')[2]) || 0);
    const [teacherSex, setTeacherSex] = useState(teacher?.sex || "");
    const [teacherDni, setTeacherDni] = useState(teacher?.dni || "");
    const [teacherState, setTeacherState] = useState<boolean>(teacher?.state || true);
    const [teacherProfileImage, setTeacherProfileImage] = useState(teacher?.profilePictureLink || "");
    const [file, setFile] = useState<File | null>(null);


    useEffect(() => {
        if (status === "loading") return;
        if (!session) signIn();
    }, [session, status]);

    useEffect(() => {
        setToEdit(!!teacher);
    }, [teacher]);

    useEffect(() => {
        if (teacher) {
            setTeacherState(teacher.state ?? true); // Se actualiza con el valor correcto cuando se recibe `teacher`
        }
    }, [teacher]);

    const handleCheckChange = (checked: boolean) => {
        setTeacherState(checked);
        console.log(checked);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const imageUrl = URL.createObjectURL(file); // Crea una URL temporal para previsualización
            setTeacherProfileImage(imageUrl);
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

    const handleCreateTeacher = async () => {

        try {
            const imgUrl = await uploadImage(file);

            const newTeacher: NewTeacher = {
                codTeacher: String("COD-"+session?.school.code+"-"+teacherCodTeacher),
                firstName: teacherFirstName,
                lastName: teacherLastName,
                email: teacherEmail,
                dni: teacherDni,
                sex: teacherSex,
                state: teacherState,
                profilePictureLink: imgUrl?.downloadURL ?? '',
                schoolId: session?.school.id,
            };

            if (toEdit) {
                if(teacher?.id){await updateTeacher(teacher?.id, newTeacher);}
                alert("Profesor actualizado exitosamente");
            } else {
                console.log(newTeacher);
                const response = await createTeacher(newTeacher);
                const emailData: {
                    firstName: string;
                    lastName: string;
                    email: string;
                    password: string;
                } = {
                    firstName: teacherFirstName,
                    lastName: teacherLastName,
                    email: teacherEmail,
                    password: response.password,
                };
                onSubmit(emailData);
                // console.log(response);
                setFile(null);
                setTeacherProfileImage("");
                setTeacherFirstName("");
                setTeacherLastName("");
                setTeacherEmail("");
                setTeacherDni("");
                setTeacherSex("");
                setTeacherState(true);
                alert("Profesor creado exitosamente");
            }
        } catch (error) {
            alert("Error creando profesor");
            console.error("Error creating/updating teacher:", error);
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
                        <CardTitle>{toEdit ? "Editar Profesor" : "Crear nuevo Profesor"}</CardTitle>
                        <CardDescription>Ingresa los detalles del profesor.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-row space-x-4">
                            <div className="flex-1">
                                <Label>Foto</Label>
                                <div className="relative w-44 h-44">
                                    {teacherProfileImage ? (
                                        <Image
                                            src={teacherProfileImage}
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
                                            <span className="text-gray-500">COD-{session?.school.code}-</span>
                                        </div>
                                        <Input type="number" value={teacherCodTeacher} onChange={(e) => setTeacherCodTeacher(Number(e.target.value))} placeholder="Código" required min={1} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="titulo">Nombres</Label>
                                    <Input type="text" value={teacherFirstName} onChange={(e) => setTeacherFirstName(e.target.value)} placeholder="Nombres" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="titulo">Apellidos</Label>
                                    <Input type="text" value={teacherLastName} onChange={(e) => setTeacherLastName(e.target.value)} placeholder="Apellidos" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="titulo">Email</Label>
                                    <Input type="email" value={teacherEmail} onChange={(e) => setTeacherEmail(e.target.value)} placeholder="Email" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="titulo">DNI</Label>
                                    <Input type="text" value={teacherDni} onChange={(e) => setTeacherDni(e.target.value)} placeholder="DNI" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="titulo">Sexo</Label>
                                    <Select value={teacherSex} onValueChange={(e) => setTeacherSex(e)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione sexo">{teacherSex}</SelectValue>
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
                                        <Checkbox checked={teacherState} onCheckedChange={handleCheckChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" onClick={handleCreateTeacher}>
                            {toEdit ? "Actualizar Profesor" : "Crear Profesor"}
                        </Button>
                    </CardFooter>
                </Card>


            </div>
        </>
    );

}