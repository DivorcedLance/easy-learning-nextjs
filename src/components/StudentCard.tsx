import { Student } from '@/types/student';
import Image from 'next/image';

export default function StudentCard({ student }: { student: Student }) {
  return (
    <div className="student-card w-fit bg-white rounded-lg shadow-md p-6 mb-4 ml-4 transition-transform duration-200 transform hover:scale-105">
      <div className='flex flex-row'>
        <div className="w-20 h-20 overflow-hidden rounded-full mr-4">
          <Image
            src={student.profilePictureLink}
            alt={`${student.firstName} ${student.lastName}`}
            width={80}
            height={80}
            className="object-cover w-full h-full"
            layout="fixed"
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-blue-700 mb-2">
            {student.firstName} {student.lastName}
          </h3>
          <p className="text-gray-600">E-mail: {student.email}</p>
        </div>
      </div>
    </div>
  );
}
