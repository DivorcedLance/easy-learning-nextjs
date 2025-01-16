import { User as UserLR, BookOpen } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { User } from '@/types/user'
import Image from 'next/image'

export default function SideMenu({ user, selectedOption, setSelectedOption, setIsOpen }: { user: User, selectedOption: string, setSelectedOption: Function, setIsOpen: Function }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex flex-col items-center mb-6">
        <div className="flex flex-col items-center mb-3">
          {user.profilePictureLink ? (
              <Image
                src={user.profilePictureLink}
                alt={`${user.firstName} ${user.lastName}`}
                width={80}
                height={80}
                className="rounded-full"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                <UserLR className="h-12 w-12 text-gray-500" />
              </div>
            )}
        </div>
      <h2 className="text-lg font-semibold text-center mb-2">{user.firstName} {user.lastName}</h2>
      <p className="text-sm text-gray-500 text-center">{user.email}</p>
      </div>

      <nav>
        <Button
          variant={selectedOption === 'info' ? 'default' : 'ghost'}
          className="w-full justify-start mb-2"
          onClick={() => {
            setSelectedOption('info')
            setIsOpen(false)
          }}
        >
          <UserLR className="mr-2 h-4 w-4" /> Información
        </Button>
        <Button
          variant={selectedOption === 'courses' ? 'default' : 'ghost'}
          className="w-full justify-start"
          onClick={() => {
            setSelectedOption('courses')
            setIsOpen(false)
          }}
        >
          <BookOpen className="mr-2 h-4 w-4" /> Cursos
        </Button>
      </nav>
    </div>
  )
}
