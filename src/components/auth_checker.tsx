import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { auth, db } from '@/app/firebase/dbm';
import { LoaderCircleIcon, Home } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';





const AuthChecker = ({ successRedirect = "/" }) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const path = usePathname()

    useEffect(() => {
        const checkIsMod = async () => {
            try {
                const u = doc(db, "Moderators", auth.currentUser?.uid || "")
                const gd = await getDoc(u)
                return gd.exists()
            } catch { }
            return false
        }
        setLoading(true);

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                checkIsMod().then(r => {
                    if (r == true) {
                        if (successRedirect != "") {
                            router.push(successRedirect);
                        }
                    }else{
                        auth.signOut()
                        toast({
                            title: "Access denied",
                            description: "User not have access",
                            style: {
                                background: "#151515",
                                color: "white",
                            }
                        })
                    }
                })
            } else if (path != "/account") {
                toast({
                    title: "Access denied",
                    description: "User not have access",
                    style: {
                        background: "#151515",
                        color: "white",
                    }
                })
                router.push("/account");
            }
            setTimeout(() => {
                setLoading(false);
            }, 700);
        });

        return () => unsubscribe();
    }, [router,path,successRedirect]);

    return (
        loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-[#101010] m-0 p-0" style={{ zIndex: "100" }}>
                <Home
                    className="absolute top-4 left-4 text-white cursor-pointer"
                    size={32}
                    onClick={() => router.push('/')}
                />
                <div className="flex flex-col items-center">
                    <LoaderCircleIcon className="text-white animate-spin" size={128} />
                    <p className="text-white mt-4 fs-2">Loading...</p>
                </div>
            </div>
        )
    );
};

export default AuthChecker;
