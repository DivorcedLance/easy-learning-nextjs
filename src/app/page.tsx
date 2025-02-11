'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import {UserInfo} from "@/components/UserInfo";
import {ClassroomList} from "@/components/ClassroomList";
import TeacherDashboard from "@/components/TeacherDashboard";
import PrincipalDashboard from '@/components/PrincipalDashboard';


export default function LoginPage() {
  const { data: session, status } = useSession()
  useEffect(() => {
      if (status === "loading") return;
      if (!session) signIn();
    }, [session, status])
  
    if (status === "loading") {
      return <div className="flex items-center justify-center h-screen">Cargando...</div>
    }
  
    if (!session) {
      return <div className="flex items-center justify-center h-screen">No autorizado</div>
    }

  return (
    session.user.role === "teacher" ?
    <TeacherDashboard /> :
    <PrincipalDashboard />
  )
}