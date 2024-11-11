"use client";
import { auth, db, storage } from '@/app/firebase/dbm';
import React, { use, useEffect, useState } from 'react'
import { onAuthStateChanged } from '@firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';

export default function UserProfile({ token }: { token: string }) {
    const [loading, setLoading] = useState(true);
    const [userdata, setUserData] = useState(Object);
    const [pfp, setpfp] = useState("");
    useEffect(() => {
        if (token) {
            const getUserData = async () => {
                try {
                    const userData = (await getDoc(doc(db, "Users", token))).data();
                    setUserData({ ...userData });
                    await getDownloadURL(ref(storage, `ProfilePhotos/${token}`)).then(e => {
                        setpfp(`${e}`);
                    }).catch(() => { })
                } catch { }
                setLoading(false);
            };
            getUserData();
        } else {
            setUserData(null);
            setLoading(false);
        }
    }, []);
    return (
        <div className="dark flex flex-col gap-[1rem]">
            {loading ? (<h2 className='animate-pulse p-2'>Loading ...</h2>) :
                (<>
                    {(!loading && userdata) ? (<>
                        <div className='flex gap-4'>
                            <div>
                                <h5>Photo</h5>
                                <div
                                    className="rounded-lg h-[20vh] aspect-square"
                                    style={{
                                        backgroundImage: pfp ? `url(${pfp})` : 'url(https://cdn-icons-png.flaticon.com/512/847/847969.png)',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                ></div>
                            </div>
                            <div>
                                <div>
                                    <h5>Username</h5>
                                    <h3 className={`${loading && "bg-gray-300  animate-pulse p-2"}`}>{userdata.name}</h3>
                                </div>
                                <div>
                                    <h5>About Me</h5>
                                    <div className={`${loading && "bg-gray-300  animate-pulse p-2"} max-h-[4rem] overflow-auto text-break`}>{userdata.aboutMe}</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h5>Rank</h5>
                            <div className={`${loading && "bg-gray-300  animate-pulse"} w-100 flex flex-col gap-2 text-center`}>
                                {`${userdata.rank}/${userdata.rank * 2}`}
                                <div className='bg-[#202020] flex min-h-[1rem]'>
                                    <div className='bg-[#14d938] w-[50%]'></div>
                                </div>
                            </div>
                        </div>
                    </>) : (<>
                        <h1>Cant get user data</h1>
                    </>)}
                </>)}
        </div>
    )
}
