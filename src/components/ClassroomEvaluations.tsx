'use client'

import { useClassroomStore } from '@/stores/useClassroomStore'
import { Classroom } from '@/types/classroom'
import { Material } from '@/types/material'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Evaluation } from '@/types/evaluation'
import { LoadingCharger } from '@/components/LoadingCharger'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PlusCircle, Edit, Eye } from 'lucide-react'

export default function ClassroomEvaluations({ classroom, material, evaluationType }: { classroom: Classroom; material: Material | null; evaluationType: string }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      signIn()
    } else if (session && (classroom.teacherId !== session.user.id || classroom.schoolId !== session.school.id)) {
      router.push('/')
    } else {
      setIsLoading(false)
    }
  }, [session, status, classroom.teacherId, classroom.schoolId, router])

  const { fetchWeeklyTests, weeklyTests } = useClassroomStore()
  const { fetchHomeworks, homeworks } = useClassroomStore()
  const { fetchReinforcements, reinforcements } = useClassroomStore()

  const [evaluations, setEvaluations] = useState([] as Evaluation[])

  useEffect(() => {
    if (material) {
      if (evaluationType === 'weeklyTest') {
        fetchWeeklyTests(material.weeklyTestIds)
      }
      if (evaluationType === 'homework') {
        fetchHomeworks(material.homeworkIds)
      }
      if (evaluationType === 'reinforcement') {
        fetchReinforcements(material.reinforcementIds)
      }
    }
  }, [fetchWeeklyTests, fetchHomeworks, fetchReinforcements, material, evaluationType])

  useEffect(() => {
    if (evaluationType === 'weeklyTest') {
      setEvaluations(weeklyTests)
    }
    if (evaluationType === 'homework') {
      setEvaluations(homeworks)
    }
    if (evaluationType === 'reinforcement') {
      setEvaluations(reinforcements)
    }
  }, [weeklyTests, homeworks, reinforcements, evaluationType])

  if (isLoading || status === 'loading' || !session) {
    return <LoadingCharger />
  }

  const evaluationTypeTitle = {
    weeklyTest: 'Prueba Semanal',
    homework: 'Tarea',
    reinforcement: 'Refuerzo'
  }[evaluationType]

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{evaluationTypeTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Button variant="default" className="w-full sm:w-auto" asChild>
            <a href={`../../../course/${classroom.courseId}/${evaluationType}/create`}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Crear {evaluationTypeTitle}
            </a>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {evaluations.map((evaluation) => (
            <Card key={evaluation.id} className="flex flex-col justify-between">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">{evaluation.title}</h3>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`../../../course/${classroom.courseId}/${evaluationType}/${evaluation.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`../../../course/${classroom.courseId}/${evaluationType}/${evaluation.id}/preview`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}