import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/firebase/dbm';
import { LoaderCircleIcon, Home } from 'lucide-react';

const AuthCheck = ({ successRedirect = "/", redirectToAuthOnFail = true }) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        setLoading(true);

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push(successRedirect);
            } else if (redirectToAuthOnFail) {
                router.push("/account");
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [router, successRedirect, redirectToAuthOnFail]);

    return (
        loading && (
            <div className="fixed inset-0 z-10 flex items-center justify-center bg-[#101010] m-0 p-0">
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

export default AuthCheck;
