import { useState } from 'react'
import ClassroomItem from '@/components/ClassroomItem'
import { Classroom } from '@/types/classroom'
import { Skeleton } from './ui/skeleton'

export function ClassroomList({ classrooms }: { classrooms: Classroom[] }) {
  const [expandedClassroom, setExpandedClassroom] = useState<string | null>(null)

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Cursos</h2>
      {classrooms.length > 0 ? (
        <ul className="space-y-2">
          {classrooms.map((classroom) => (
            <ClassroomItem
              key={classroom.id} 
              classroom={classroom} 
              expandedClassroom={expandedClassroom} 
              setExpandedClassroom={setExpandedClassroom} 
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
