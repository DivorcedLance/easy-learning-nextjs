import { useState } from 'react'
import { Skeleton } from './ui/skeleton'
import Link from 'next/link'
import { Button } from './ui/button'
import { Silabo } from '@/types/silabo'
import { Card, CardContent, CardHeader } from './ui/card'
import { Course } from '@/types/course'
import { Archive, Edit, Trash2 } from 'lucide-react'

export function SilabusList({ silabus, courses, setSilabusId, setAction, setIsOpenModal }: { silabus: Silabo[], courses: Course[], setSilabusId: Function, setAction: Function, setIsOpenModal: Function }) {

    // Agrupar los sílabos por grado
    const groupedSilabus: Record<string, Silabo[]> = silabus.reduce((acc, item) => {
        if (!acc[item.grade]) {
            acc[item.grade] = [];
        }
        acc[item.grade].push(item);
        return acc;
    }, {} as Record<string, Silabo[]>);

    const handleDelete = async (silabusId: string) => {
        setSilabusId(silabusId)
        setAction('delete')
        setIsOpenModal(true)
    }

    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold mb-4">Silabus</h2>
                <Link href={`silabus/create`} className="ml-4">
                    <Button variant="default" className="mt-2 ">+ Crear silabo</Button>
                </Link>
            </div>
            {silabus.length > 0 ? (
                <ul className="space-y-2">
                    {Object.entries(groupedSilabus).map(([grade, items]) => (
                        <Card key={grade} className="shadow-lg">
                            <CardHeader className="text-lg font-bold">{`Grado: ${grade}`}</CardHeader>
                            <CardContent>
                                <ul className="list-disc pl-5 space-y-1">
                                    {items.map((s) => (
                                        <div className='flex flex-row justify-between text-sm border border-gray-200 pb-2 rounded-lg'
                                            key={s.id}>
                                            <div className='flex justify-between items-center'>
                                                <span className='font-semibold'>{courses.find(course => course.id === s.courseId)?.courseName || "Curso desconocido"}</span>
                                        
                                            </div>
                                            <div className='flex flex-row gap-4'>
                                                <Link href={`/silabus/${s.id}/edit`}>
                                                    <Button variant="outline" size="icon">
                                                        <Edit className="h-4 w-4" />
                                                        <span className="sr-only">Edit</span>
                                                    </Button>
                                                </Link>
                                                <Button variant="outline" size="icon" onClick={() => handleDelete(s.id as string)}>
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                                
                                            </div>
                                        </div>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}

                </ul>
            ) : (
                <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            )}
        </div>
    )
}
