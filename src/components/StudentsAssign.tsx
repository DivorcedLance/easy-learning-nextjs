"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Save } from "lucide-react"
import "tailwindcss/tailwind.css"
import { Student } from "@/types/student"
import { assignStudentsToClassroom } from "@/lib/firebaseUtils"

// Configuración de Tailwind dentro del componente
const tailwindConfig = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
}


export default function StudentsAssign({ students, classroomId }: { students: Student[], classroomId: string }) {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)

  useEffect(() => {
    setSelectAll(selectedStudents.length === students.length)
  }, [selectedStudents, students])

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  const handleSelectAllToggle = () => {
    setSelectedStudents(selectAll ? [] : students.map((student) => student.id))
    setSelectAll(!selectAll)
  }

  const handleSave = async() => {
    console.log("Selected students:", selectedStudents)
    try {
        await assignStudentsToClassroom(selectedStudents, classroomId)

        alert("Students saved")
        return window.history.back();
    } catch (error) {
      console.error("Error saving students:", error)
      alert("Error saving students")
        
    }
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="select-all" checked={selectAll} onCheckedChange={handleSelectAllToggle} />
          <label
            htmlFor="select-all"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Select All
          </label>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {students.map((student) => (
          <div
            key={student.id}
            className={`flex items-center space-x-4 p-4 border rounded-lg ${
              selectedStudents.includes(student.id) ? "bg-primary/10" : ""
            }`}
          >
            <Checkbox
              id={`student-${student.id}`}
              checked={selectedStudents.includes(student.id)}
              onCheckedChange={() => handleStudentToggle(student.id)}
            />
            <Image
              src={student.profilePictureLink}
              alt={`${student.firstName}'s avatar`}
              width={50}
              height={50}
              className="rounded-full"
            />
            <label htmlFor={`student-${student.id}`} className="flex-grow cursor-pointer">
              {student.firstName} {student.lastName}
            </label>
          </div>
        ))}
      </div>
      <Button onClick={handleSave} disabled={selectedStudents.length === 0}>
        <Save className="mr-2 h-4 w-4" /> Save Selected Students ({selectedStudents.length})
      </Button>
    </div>
  )
}
