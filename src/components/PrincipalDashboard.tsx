'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { Menu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import SideMenu from '@/components/SideMenu'
import { UserInfo } from '@/components/UserInfo'
import { getClassroomsBySchool, getClassroomsBySchoolAndTeacher, getCoursesBySchool, getSilabusBySchool } from '@/lib/firebaseUtils'
import { CourseList } from './CourseList'
import { Course } from '@/types/course'
import { SilabusList } from './SilabusList'
import { Silabo } from '@/types/silabo'

export default function PrincipalDashboard() {
    const { data: session, status } = useSession()
    const [isOpen, setIsOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState('info')
    const [courses, setCourses] = useState<Course[]>([])
    const [silabus, setSilabus] = useState<Silabo[]>([])

    useEffect(() => {
        if (status === "loading") return;
        if (!session) signIn();
    }, [session, status])

    useEffect(() => {
        if (session) {
            getCoursesBySchool(session.school.id).then(setCourses)
            getSilabusBySchool(session.school.id).then(setSilabus)
        }
    }, [session])

    if (status === "loading") {
        return <div className="flex items-center justify-center h-screen">Cargando...</div>
    }

    if (!session) {
        return <div className="flex items-center justify-center h-screen">No autorizado</div>
    }

    const { user, school } = session

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="shadow-sm" style={{ backgroundColor: school.mainColor || '#000' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <h1 className="text-white text-2xl font-semibold">EasyLearning Principal</h1>
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" onClick={() => signIn()} className="text-black">Cerrar sesión</Button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 items-center">
                <div className="flex">
                    {/* Menú lateral */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="lg:hidden">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                            <SideMenu
                                user={user}
                                selectedOption={selectedOption}
                                setSelectedOption={setSelectedOption}
                                setIsOpen={setIsOpen}
                            />
                        </SheetContent>
                    </Sheet>

                    <div className="hidden lg:block w-64">
                        <SideMenu
                            user={user}
                            selectedOption={selectedOption}
                            setSelectedOption={setSelectedOption}
                            setIsOpen={setIsOpen}
                        />
                    </div>

                    <div className="flex-1 ml-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedOption}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {selectedOption === 'info' ? (
                                    <UserInfo user={user} />
                                ) : selectedOption === 'courses' ? (
                                    <div className='space-y-4'>
                                        <CourseList courses={courses} />
                                    </div>
                                ) : (
                                    <div className='space-y-4'>
                                        <SilabusList silabus={silabus} courses={courses} />
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>


                </div>
            </div>
        </div>
    )
}
