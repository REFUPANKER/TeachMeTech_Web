"use client";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <div className='flex-1 flex-col p-0 m-0'>
            <div className='d-flex gap-x-0 md:gap-x-3 items-center h-fit'>
                <Link href='/dashboard/chat' className={`${pathname === "/dashboard/chat" ? "border-b-4 border-[#08781d]" : ""} text-white text-decoration-none content-center p-2 hover:bg-[#052b0c]`}>
                    <i className="fas fa-home text-l"></i> General
                </Link>
                <i className="fas fa-chevron-right text-l"></i>
                <Select onValueChange={e => { router.push(`/dashboard/chat/${e}`) }}>
                    <SelectTrigger className="w-[180px] bg-black">
                        <SelectValue placeholder="Chat Rooms">Chat Rooms</SelectValue>
                    </SelectTrigger>
                    <SelectContent className='bg-black text-white'>
                        {[1, 2, 3, 4].map((e, i) => {
                            return (
                                <SelectItem key={i}
                                    value={`PublicChatRoom${e}`}
                                    className={`${pathname === `/dashboard/chat/PublicChatRoom${e}` ? "border-l-4 border-[#08781d]" : ""} cursor-grab active:cursor-grabbing`}>
                                    Public Chat Room {e}
                                </SelectItem>
                            )
                        })}
                    </SelectContent>
                </Select>

            </div>
            <div className='mt-2 d-flex flex-column w-100'>
                {children}
            </div>
        </div>
    )
}
