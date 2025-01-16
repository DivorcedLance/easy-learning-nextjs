import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Classroom } from '@/types/classroom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"

export default function ClassroomItem({ classroom, expandedClassroom, setExpandedClassroom }: { classroom: Classroom, expandedClassroom: string | null, setExpandedClassroom: Function }) {
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
              <a href={`/classroom/${classroom.id}`} className="text-blue-600 hover:underline">
                <Button variant="default" className="mt-2">Ver Curso</Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}
