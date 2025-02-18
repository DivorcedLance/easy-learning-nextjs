import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Classroom } from '@/types/classroom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function ClassroomItem({ classroom, expandedClassroom, setExpandedClassroom, role, setIsOpen, setIdClassroom }: { classroom: Classroom, expandedClassroom: string | null, setExpandedClassroom: Function, role?: string, setIsOpen?: Function, setIdClassroom?: Function }) {
  
  const handleOpenWarningDelete = () => {
    if (setIsOpen) {
      setIsOpen(true)
    }
    if (setIdClassroom) {
      setIdClassroom(classroom.id)
    }
  }
  return (
    <li className="border-b border-gray-200 pb-2">
      <button
        className="w-full text-left py-2 flex justify-between items-center hover:bg-gray-50 rounded transition-colors duration-200"
        onClick={() => setExpandedClassroom(expandedClassroom === classroom.id ? null : classroom.id)}
      >
        <span>{classroom.courseName} - {classroom.grade} - {classroom.section}</span>
        {expandedClassroom === classroom.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      <AnimatePresence>
        {expandedClassroom === classroom.id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="py-2 px-4">
              <p><strong>Nombre del Curso:</strong> {classroom.courseName}</p>
              <p><strong>Grado:</strong> {classroom.grade}</p>
              <p><strong>Sección:</strong> {classroom.section}</p>
              <p><strong>Docente:</strong> {classroom.teacherName}</p>
              <div className='flex flex-row gap-4'>
                <a href={`/classroom/${classroom.id}`} className="text-blue-600 hover:underline">
                  <Button variant="default" className="mt-2">Ver Curso</Button>
                </a>
                {role === 'principal' && (
                  <div className="flex flex-row gap-4">
                    <Link href={`/classroom/${classroom.id}/edit`}>
                      <Button variant="default" className="mt-2">Editar Curso</Button>
                    </Link>
                    <Button onClick={handleOpenWarningDelete}  variant="destructive" className="mt-2">Eliminar Curso</Button>
                    <Link href={`/classroom/${classroom.id}/students`}>
                      <Button variant="outline" className="mt-2">Asignar Estudiantes</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}
