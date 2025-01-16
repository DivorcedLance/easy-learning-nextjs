import Image from 'next/image';
import SchoolHeader from './SchoolHeader';
export default function Header() {
  return (
    <>
        <div className="flex justify-center">
            <div className="flex flex-col justify-center items-center h-24 m-1">
                <div className="w-44">
                    <Image className='object-cover' src="/img/TESIS_1.png" alt="Logo de la Secretaría de Educación de Bogotá" width="176" height="176"/>
                </div>
                <label>easy learning</label>
            </div>
        </div>
        <SchoolHeader/>
        <label className='text-center italic font-bold'>--IEP. Maria Montesori. Ugel 06. ATE --</label>
    </>
  )
}