import { useState } from 'react'
import { Skeleton } from './ui/skeleton'
import Link from 'next/link'
import { Button } from './ui/button'
import { Silabo } from '@/types/silabo'
import { Card } from './ui/card'
import { Course } from '@/types/course'

export function SilabusList({ silabus, courses }: { silabus: Silabo[], courses: Course[] }) {

    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold mb-4">Silabos</h2>
                <Link href={`silabus/create`} className="ml-4">
                    <Button variant="default" className="mt-2 ">+ Crear silabo</Button>
                </Link>
            </div>
            {silabus.length > 0 ? (
                <ul className="space-y-2">
                    {silabus.map((silabus) => (
                        <Card key={silabus.id} className="p-4 shadow-md border border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {courses.find(course => course.id === silabus.courseId)?.courseName || "Curso desconocido"}
                                </h3>
                                <Link href={`/silabus/${silabus.id}`}>
                                    <Button variant="default">Ver Sílabo</Button>
                                </Link>
                            </div>
                            <div className="mt-2 space-y-1 text-gray-700">
                                <p className="font-medium">Grado: <span className="font-normal">{silabus.grade}</span></p>
                                <p className="text-sm text-gray-600">
                                    {silabus.silabusData.description.split(' ').slice(0, 13).join(' ')}...
                                </p>
                            </div>
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
