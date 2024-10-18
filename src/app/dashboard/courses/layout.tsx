"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

export default function layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    return (
        <div className='flex-1 flex-col p-0 m-0 h-100'>
            <div className='d-flex gap-x-0 md:gap-x-3 items-center'>
                <Link href='/dashboard/courses' className={`${pathname === "/dashboard/courses" ? "border-b-4 border-[#08781d]" : ""} text-white text-decoration-none content-center p-2 hover:bg-[#052b0c]`}>
                    Courses
                </Link>
                <i className="fas fa-chevron-right text-l"></i>
                <Link href='/dashboard/courses/add' className={`${pathname === "/dashboard/courses/add" ? "border-b-4 border-[#08781d]" : ""} text-white text-decoration-none content-center p-2 hover:bg-[#052b0c]`}>
                    Add
                </Link>
                <i className="fas fa-minus text-l"></i>
                <Link href='/dashboard/courses/contents' className={`${pathname === "/dashboard/courses/contents" ? "border-b-4 border-[#08781d]" : ""} text-white text-decoration-none content-center p-2 hover:bg-[#052b0c]`}>
                    Contents
                </Link>
                <i className="fas fa-chevron-right text-l"></i>
                <Link href='/dashboard/courses/contents/add' className={`${pathname === "/dashboard/courses/contents/add" ? "border-b-4 border-[#08781d]" : ""} text-white text-decoration-none content-center p-2 hover:bg-[#052b0c]`}>
                    Add
                </Link>
            </div>
            <div className='mt-2 d-flex flex-column w-100'>
                {children}
            </div>
        </div>
    )
}
