import { useState } from 'react'
import ClassroomItem from '@/components/ClassroomItem'
import { Classroom } from '@/types/classroom'
import { Skeleton } from './ui/skeleton'
import { User } from '@/types/user'
import Link from 'next/link'
import { Button } from './ui/button'
import { Dialog } from './ui/dialog'

export function ClassroomList({ classrooms, user, setIsOpenModal, setIdClassroom }: { classrooms: Classroom[], user?: User, setIsOpenModal?: Function, setIdClassroom?: Function }) {
  const [expandedClassroom, setExpandedClassroom] = useState<string | null>(null)
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">Clases</h2>
        {user?.role==='principal' && (<Link href={`classroom/create`} className="ml-4">
          <Button variant="default" className="mt-2 ">Crear clase</Button>
        </Link>)}
      </div>
      {classrooms.length > 0 ? (
        <ul className="space-y-2">
          {classrooms.map((classroom) => (
            <ClassroomItem
              key={classroom.id}
              classroom={classroom}
              expandedClassroom={expandedClassroom}
              setExpandedClassroom={setExpandedClassroom}
              role={user?.role ?? ''}
              setIsOpen={setIsOpenModal}
              setIdClassroom={setIdClassroom}
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
