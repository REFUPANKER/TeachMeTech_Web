"use client";
import { db } from '@/app/firebase/dbm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import UserProfile from '@/components/user_profile';
import { collection, getDocs, or, query, where } from 'firebase/firestore';
import { BanIcon, SearchIcon, TrashIcon } from 'lucide-react';
import React, { useState } from 'react'

export default function Page() {
    const [search, setSearch] = useState("");
    const [searchType, setSearchType] = useState("");
    const [resLoading, setResLoading] = useState(false);
    const [res, setRes] = useState<any[]>([]);

    async function MakeSearch() {
        setResLoading(true);
        switch (searchType) {
            case "token":
                const directEq = await (getDocs(query(collection(db, "Users"),
                    where("token", "==", search),
                )));
                const deq = directEq.docs.map(e => e.data());
                setRes(deq)
                break;
            case "name":
                const simpleEq = await (getDocs(query(collection(db, "Users"),
                    or(
                        where("name", "==", search),
                        where("name", "==", search.toUpperCase()),
                        where("name", "==", search.toLowerCase()),
                    ))));
                const seq = simpleEq.docs.map(e => e.data());
                setRes(seq)
                break;
        }
        setResLoading(false);
    }

    async function HandleSearchSubmit(e: any) {
        e.preventDefault();
        await MakeSearch();
    }


    const [profileShown, setProfileShown] = useState(false);
    const [activeProfile, setActiveProfile] = useState("");
    function ShowUserProfile(token: string) {
        setActiveProfile(token);
        setProfileShown(!profileShown);
    }
    return (
        <div className='flex lg:flex-row flex-col gap-4 dark w-full'>
            <form className='flex flex-col gap-2 w-full' onSubmit={(e) => HandleSearchSubmit(e)}>
                <h4>Make search</h4>
                <Input required value={search} placeholder='Type here' onChange={(e) => { setSearch(e.target.value) }} />
                <label onClick={() => setSearchType("token")} className='flex items-center gap-2'>
                    <Input type='radio' name='searchtype' defaultChecked className='p-0 m-0 w-[4vh] aspect-square' />
                    By Token
                </label>
                <label onClick={() => setSearchType("name")} className='flex items-center gap-2'>
                    <Input type='radio' name='searchtype' className='p-0 m-0 w-[4vh] aspect-square' />
                    By Name
                </label>
                <Button variant={"outline"} className='gap-2'><SearchIcon /> Search</Button>
            </form>
            <div className='w-full'>
                <div className='flex flex-col items-center'>
                    <h4>Search results will be shown here</h4>
                </div>
                {resLoading == true ? (
                    <div className="animate-pulse duration-600 rounded-lg bg-[#404040] text-white p-3">Loading ...</div>
                ) : (
                    <div className='text-white'>
                        {res.length <= 0 && (
                            <div className="rounded-lg bg-[#ad261a] text-white p-3">No results found or no search made</div>
                        )}
                        <div className='flex flex-col gap-2'>
                            {res.map((e, i) => {
                                return (
                                    <div key={i} className='flex items-center gap-x-2 p-2 rounded-lg bg-[#202020]'>
                                        <h5 className='flex gap-x-2 items-center'>
                                            <u className='cursor-pointer m-0 p-0' title='Show Profile'
                                                onClick={() => { ShowUserProfile(e.token) }}>{e.name}</u>
                                            <i className='text-[#707070] text-xs m-0 p-0'>{e.token}</i>
                                        </h5>
                                        <p>{e.aboutme}</p>
                                    </div>
                                )
                            })}
                        </div>
                        <Dialog open={profileShown} onOpenChange={() => { setProfileShown(!profileShown) }}>
                            <DialogContent className="w-[90%] bg-[#151515] text-white">
                                <DialogHeader>
                                    <DialogTitle>Profile</DialogTitle>
                                    <DialogDescription>
                                        {activeProfile}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col h-full dark gap-3">
                                    {profileShown && <UserProfile token={`${activeProfile}`} />}
                                    {/* <div className='flex flex-col gap-2'>
                                        <h6 className='text-danger'>Ban from app</h6>
                                        <div className='flex flex-col gap-2 w-[50%]'>
                                            <Input
                                                type="datetime-local"
                                                min={new Date().toISOString().slice(0, 16)}
                                                defaultValue={new Date().toISOString().slice(0, 16)}
                                            />
                                            <Button variant={"outline"} className='flex gap-2 hover:bg-[red] active:bg-[#902020]'><BanIcon size={20} />Ban</Button>
                                        </div>
                                    </div> */}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>
        </div>
    )
}
