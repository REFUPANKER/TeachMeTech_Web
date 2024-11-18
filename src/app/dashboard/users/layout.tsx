"use client";
import { HomeIcon, SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className='flex flex-col gap-2 h-full'>
      <div className='w-full text-white flex items-center gap-2'>
        <Link href={"/dashboard/users"} className={`${path.endsWith("users") && "border-b-4 border-solid border-[green]"} hover:bg-[#252525] rounded-lg p-3 duration-300 text-2xl gap-2 flex items-center justify-center text-white text-decoration-none`}><HomeIcon size={32} />Home</Link>
        <Link href={"/dashboard/users/search"} className={`${path.includes("search") && "border-b-4 border-solid border-[green]"} hover:bg-[#252525] rounded-lg p-3 duration-300 text-2xl gap-2 flex items-center justify-center text-white text-decoration-none`} ><SearchIcon size={32} />Search</Link>
      </div>
      <div className='w-full h-full'>
        {children}
      </div>
    </div>
  )
}
