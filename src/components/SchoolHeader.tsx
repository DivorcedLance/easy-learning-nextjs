import '@/app/globals.css';
import Image from 'next/image';
export default function SchoolHeader() {
  return (
    <div className="flex flex-row mb-2 bg-green-400 h-28 items-center p-0 font-[orbitron]">
      <Image className='object-cover mr-96' src="/banners/school_banner.png" alt="" width={112} height={112}/>
      <h1 className='text-7xl ml-20 text-white'>MARIA MONTESSORI</h1>
    </div>
  )
}