"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

export default function layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    return (
        <div className='flex-1 flex-col p-0 m-0'>
            <div className='d-flex gap-x-3 items-center'>
                <Link href='/dashboard/courses' className={`${pathname === "/dashboard/courses" ? "border-b-4 border-[#08781d]" : ""} text-white text-decoration-none content-center p-2 hover:bg-[#052b0c]`}>
                    <i className="fas fa-house text-2xl"></i>
                </Link>
                <i className="fas fa-chevron-right text-xl"></i>
                <Link href='/dashboard/courses/contents' className={`${pathname === "/dashboard/courses/contents" ? "border-b-4 border-[#08781d]" : ""} text-white text-decoration-none content-center p-2 hover:bg-[#052b0c]`}>
                    Contents
                </Link>
                <i className="fas fa-chevron-right text-xl"></i>
                <Link href='/dashboard/courses/contents/add' className={`${pathname === "/dashboard/courses/contents/add" ? "border-b-4 border-[#08781d]" : ""} text-white text-decoration-none content-center p-2 hover:bg-[#052b0c]`}>
                    Add
                </Link>
            </div>
            <div>
                {children}
            </div>
        </div>
    )
}
