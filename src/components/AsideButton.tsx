'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react';

export default function AsideButton({ icon, label, link, onClick }: { icon: string; label: string; link: string; onClick?: () => void}) {

  const router = useRouter();
  const [estado, setEstado] = useState(false);
  console.log(estado);

  useEffect(() => {
    if(estado){
      router.push(link);
    }
    setEstado(false);
  }, [estado, link, router]);


  return (
    <button className="bg-[#189F4E69] h-28 flex items-center pl-2 gap-3" onClick={()=>{
      setEstado(true);
    }}>
      <Image src={icon} alt="" className="p-3" width={112} height={112}/>
      <label className="font-[poppins] italic">{label}</label>

    </button>
  );
}