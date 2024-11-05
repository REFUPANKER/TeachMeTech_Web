import { HomeIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import icon from "./favicon.png";
export default function NotFound() {
    return (
        <div className='h-screen w-full bg-black flex flex-col gap-6 items-center justify-center'>
            <div className='flex items-center'>
                <Image width={128} height={128}
                    alt='Teach Me Tech'
                    src={icon.src} />
                    <h1>Teach Me Tech</h1>
            </div>
            <a href='/' className='no-underline bg-[#151515] hover:bg-[#303030] active:bg-[#252525] transition-all duration-300 rounded-lg p-3 text-3xl text-white flex gap-x-6 items-center'><HomeIcon size={32} /> Back To Home</a>
            <h2>There is no page that you are looking for</h2>
            <h6 className='text-xl text-danger'>404</h6>
        </div>
    )
}
