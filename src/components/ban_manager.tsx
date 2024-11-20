"use client";
import { db } from '@/app/firebase/dbm';
import React, { useEffect, useState } from 'react'
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { Input } from './ui/input';
import { BanIcon, DoorOpenIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from '@/hooks/use-toast';

export default function BanManager({ token }: { token: string }) {
    const [loading, setLoading] = useState(true);
    const [banInfo, setBanInfo] = useState(Object);
    const [banstate, setbanState] = useState(false);

    const [banUntil, setBanUntil] = useState(() =>
        new Date().toISOString().split("T")[0]
    );
    const [banReason, setBanReason] = useState("Performed irregular actions");

    useEffect(() => {
        setLoading(true);
        if (token) {
            const getUserData = async () => {
                try {
                    const data = (await getDoc(doc(db, "Bans", token))).data();
                    setBanInfo(data);
                } catch { }
                setLoading(false);
            };
            getUserData();
        } else {
            setLoading(false);
        }
    }, [banstate]);

    async function BanUser() {
        await setDoc(doc(db, "Bans", token), {
            "until": banUntil,
            "reason": banReason
        });
        setbanState(!banstate);
        toast({
            title: "User Banned",
            description: "Until : " + new Date(banUntil).toLocaleDateString(),
            style: { background: "#151515", color: "white" }
        });
    }

    async function UnbanUser() {
        await deleteDoc(doc(db, "Bans", token));
        setbanState(!banstate);
        toast({
            title: "User Unbanned",
            description: "Gotta be happy about it",
            style: { background: "#151515", color: "white" }
        });
    }


    return (
        <div className="dark flex flex-col gap-[1rem]">
            {loading ? (
                <h4 className='animate-pulse p-2 text-danger'>Checking ban state ...</h4>) :
                (!banInfo ? <>
                    <div className='flex flex-col gap-2 dark'>
                        <h4 className='text-danger text-center'>Ban from app</h4>
                        <div className='flex md:flex-row flex-col gap-2'>
                            <div className='flex flex-col gap-2 w-full'>
                                <h6>Until</h6>
                                <Input
                                    type="date"
                                    min={new Date().toISOString().split("T")[0]}
                                    value={banUntil} onChange={(e) => { setBanUntil(e.target.value) }}
                                />
                                <Button onClick={() => BanUser()} variant={"outline"} className='flex gap-2 hover:bg-[red] active:bg-[#902020]'><BanIcon size={20} />Ban</Button>
                            </div>
                            <div className='flex flex-col w-full'>
                                <h6>Reason</h6>
                                <Textarea className='h-full resize-none' maxLength={128} value={banReason} onChange={e => setBanReason(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </> : (
                    <div className='flex flex-col gap-2'>
                        <h4 className='text-center'>User banned</h4>
                        <div className='flex md:flex-row flex-col gap-2'>
                            <div className='w-full flex-col flex gap-1 items-center'>
                                Until
                                <div className='w-full p-2 bg-[#050505] border-2 border-[#505050] rounded-lg cursor-default text-center'>
                                    {new Date(banInfo.until).toLocaleDateString()}
                                </div>
                            </div>
                            <div className='w-full flex-col flex gap-1 items-center'>
                                Reason
                                <div className='w-full p-2 bg-[#050505] border-2 border-[#505050] rounded-lg cursor-default text-center text-wrap'>
                                    {banInfo.reason}
                                </div>
                            </div>
                        </div>
                        <Button onClick={() => UnbanUser()} variant={"outline"} className='h-full w-full flex gap-2 hover:bg-[green] active:bg-[#209020]'><DoorOpenIcon size={20} />Unban</Button>
                    </div>
                ))}
        </div>
    )
}
