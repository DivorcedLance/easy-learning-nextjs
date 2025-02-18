'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { Menu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import SideMenu from '@/components/SideMenu'
import { UserInfo } from '@/components/UserInfo'
import { archiveStudent, archiveTeacher, deleteClassroom, deleteSilabus, deleteStudent, deleteTeacher, getClassroomsBySchool, getCoursesBySchool, getSilabusBySchool, getStudentsBySchool, getTeachersBySchool } from '@/lib/firebaseUtils'
import { CourseList } from './CourseList'
import { Course } from '@/types/course'
import { SilabusList } from './SilabusList'
import { Silabo } from '@/types/silabo'
import { ClassroomList } from './ClassroomList'
import { Classroom } from '@/types/classroom'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { TeacherList } from './TeacherList'
import { Teacher } from '@/types/teacher'
import { StudentList } from './StudentList'
import { Student } from '@/types/student'

export default function PrincipalDashboard() {
    const { data: session, status } = useSession()
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [selectedOption, setSelectedOption] = useState('info')
    const [courses, setCourses] = useState<Course[]>([])
    const [silabus, setSilabus] = useState<Silabo[]>([])
    const [classrooms, setClassrooms] = useState<Classroom[]>([])
    const [idClassroom, setIdClassroom] = useState('')
    const [idTeacher, setIdTeacher] = useState('')
    const [idStudent, setIdStudent] = useState('')
    const [silabusId, setSilabusId] = useState('')
    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [students, setStudents] = useState<Student[]>([])
    const [action, setAction] = useState('')

    useEffect(() => {
        if (status === "loading") return;
        if (!session) signIn();
    }, [session, status])

    useEffect(() => {
        if (session?.school?.id) {
            getCoursesBySchool(session.school.id).then(setCourses)
            getSilabusBySchool(session.school.id).then(setSilabus)
            getClassroomsBySchool(session.school.id).then(setClassrooms)
            getTeachersBySchool(session.school.id).then(setTeachers)
            getStudentsBySchool(session.school.id).then(setStudents)

            console.log('verifica 1')
        }
    }, [session?.school?.id])

    const handleArchive = async () => {
        try {
            if (selectedOption == "teachers") {
                await archiveTeacher(idTeacher)
                setIsOpenModal(false)
                // actualizar el estado de la lista de profesores
                setTeachers(teachers.map((teacher) => {
                    if (teacher.id === idTeacher) {
                        return { ...teacher, state: false }
                    }
                    return teacher
                }))
                setIdTeacher('')
            } else {
                await archiveStudent(idStudent)
                setIsOpenModal(false)
                setStudents(students.map((student) => {
                    if (student.id === idStudent) {
                        return { ...student, state: false }
                    }
                    return student
                }))
                setIdStudent('')
            }
        } catch (error) {
            console.error("Error archiving:", error)
            alert('Ocurrió un error al archivar')
        }
    }

    const handleDelete = async () => {
        try {
            if (selectedOption == "classrooms") {
                await deleteClassroom(idClassroom)
                setIsOpenModal(false)
                setClassrooms(classrooms.filter((classroom) => classroom.id !== idClassroom))
                setIdClassroom('')
            } else if (selectedOption == "teachers") {
                await deleteTeacher(idTeacher)
                setIsOpenModal(false)
                setTeachers(teachers.filter((teacher) => teacher.id !== idTeacher))
                setIdTeacher('')
            } else if (selectedOption == "silabus") {
                await deleteSilabus(silabusId)
                setIsOpenModal(false)
                setSilabus(silabus.filter((s) => s.id !== silabusId))
                setSilabusId('')
            } else {
                await deleteStudent(idStudent)
                setIsOpenModal(false)
                setStudents(students.filter((student) => student.id !== idStudent))
                setIdStudent('')
            }
        } catch (error) {
            console.error("Error deleting:", error)
            alert('Ocurrió un error al eliminar')
        }
    }

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
                                ) : selectedOption == 'silabus' ? (
                                    <div className='space-y-4'>
                                        <SilabusList silabus={silabus} courses={courses} setIsOpenModal={setIsOpenModal} setSilabusId={setSilabusId} setAction={setAction} />
                                    </div>
                                ) : selectedOption == 'classrooms' ? (
                                    <div className='space-y-4'>
                                        <ClassroomList classrooms={classrooms} user={user} setIsOpenModal={setIsOpenModal} setIdClassroom={setIdClassroom} />
                                    </div>
                                ) : selectedOption == 'teachers' ? (
                                    <div className='space-y-4'>
                                        <TeacherList teachers={teachers} setIsOpenModal={setIsOpenModal} setIdTeacher={setIdTeacher} setAction={setAction} />
                                    </div>
                                ) : (
                                    <div className='space-y-4'>
                                        <StudentList students={students} setIsOpenModal={setIsOpenModal} setIdStudent={setIdStudent} setAction={setAction} />
                                    </div>
                                )
                                }
                            </motion.div>
                        </AnimatePresence>
                    </div>


                </div>
            </div>
            {isOpenModal && (
                <Dialog open={isOpenModal} onOpenChange={() => setIsOpenModal(false)}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            {action == "delete" ? (<DialogTitle>¿Está seguro de eliminar este item?</DialogTitle>) : (<DialogTitle>¿Está seguro de archivar este item?</DialogTitle>)}

                        </DialogHeader>
                        <div className="ap-4 py-4">
                            <div className="items-center gap-4">
                                <Label htmlFor="nombre">
                                    Los cambios no se podrán deshacer
                                </Label>

                            </div>


                        </div>
                        <DialogFooter>
                            {action == "delete" ? (<Button variant="destructive" onClick={handleDelete}>Eliminar</Button>) : (<Button variant="destructive" onClick={handleArchive}>Archivar</Button>)}
                            <Button type="submit" onClick={() => setIsOpenModal(false)}>Cancelar</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
