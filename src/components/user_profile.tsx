"use client";
import { auth, db, storage } from '@/app/firebase/dbm';
import React, { use, useEffect, useState } from 'react'
import { onAuthStateChanged } from '@firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';

export default function UserProfile({ token }: { token: string }) {
    const [loading, setLoading] = useState(true);
    const [userdata, setUserData] = useState(Object);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const getUserData = async () => {
                    try {
                        const userData = (await getDoc(doc(db, "Users", user.uid))).data();
                        let pfp = "";
                        try {
                            pfp = await getDownloadURL(ref(storage, `ProfilePhotos/${user.uid}`));
                        } catch { }
                        setUserData({ ...userData, pfp: pfp });
                    } catch { }
                    setLoading(false);
                };
                getUserData();
            } else {
                setUserData(null);
                setLoading(false);
            }
        });
        return () => unsubscribe();
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
                                        backgroundImage: userdata.pfp ? `url(${userdata.pfp})` : 'none',
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
                        <h1>Can't get user data</h1>
                    </>)}
                </>)}
        </div>
    )
}
