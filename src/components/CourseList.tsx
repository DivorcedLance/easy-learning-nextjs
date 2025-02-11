import { useState } from 'react'
import { Skeleton } from './ui/skeleton'
import { Course } from '@/types/course'
import CourseItem from './CourseItem'
import Link from 'next/link'
import { Button } from './ui/button'

export function CourseList({ courses }: { courses: Course[] }) {
    const [expandedCourse, setExpandedCourse] = useState<string | null>(null)

    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold mb-4">Cursos</h2>
                <Link href={`course/create`} className="ml-4">
                    <Button variant="default" className="mt-2 ">Crear curso</Button>
                </Link>
            </div>
            {courses.length > 0 ? (
                <ul className="space-y-2">
                    {courses.map((course) => (
                        <CourseItem
                            key={course.id}
                            course={course}
                            expandedCourse={expandedCourse}
                            setExpandedCourse={setExpandedCourse}
                        />
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
