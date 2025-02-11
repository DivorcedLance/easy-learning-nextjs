import { use, useEffect, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Course } from '@/types/course'
import { getClassroomsByCourse } from '@/lib/firebaseUtils'
import { Classroom } from '@/types/classroom'

export default function CourseItem({ course, expandedCourse, setExpandedCourse }: { course: Course, expandedCourse: string | null, setExpandedCourse: Function }) {
    const [classrooms, setClassrooms] = useState<Classroom[]>([])

    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const classrooms = await getClassroomsByCourse(course.id)
                setClassrooms(classrooms)
            } catch (error) {
                console.error("Error al obtener salones:", error)
            }
        }

        fetchClassrooms()
    }, [])
  return (
    <li className="border-b border-gray-200 pb-2">
      <button
        className="w-full text-left py-2 flex justify-between items-center hover:bg-gray-50 rounded transition-colors duration-200"
        onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
      >
        <span>{course.courseName}</span>
        {expandedCourse === course.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      <AnimatePresence>
        {expandedCourse === course.id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="py-2 px-4">
              <p><strong>Salones:</strong></p>
                <ul className="list-disc list-inside">
                    {classrooms.map((classroom, index) => (
                    <li key={index}>Grado: {classroom.grade} - Sección: {classroom.section}</li>
                    ))}
                </ul>
              <a href={`/course/edit/${course.id}`} className="text-blue-600 hover:underline">
                <Button variant="default" className="mt-2">Ver Curso</Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}
