"use client"

import { useState, useEffect } from "react"
import {
    CircleUser,
    Home,
    BookOpen,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    MessageSquareText
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth, db, storage } from "../firebase/dbm"
import Link from "next/link"
import AuthChecker from "@/components/auth_checker"
import { doc, getDoc } from "firebase/firestore"
import { getDownloadURL, ref } from "firebase/storage"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import UserProfile from "@/components/user_profile"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isMobile, setIsMobile] = useState(false)


    const [loadingState, setLoadingState] = useState(true)
    const [userData, setUserData] = useState(Object)

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

    const [profileShown, setProfileShown] = useState(false);

    const sidebarItems = [
        { name: "Dashboard", icon: Home, path: "/dashboard" },
        { name: "Courses", icon: BookOpen, path: "/dashboard/courses" },
        { name: "Chat", icon: MessageSquareText, path: "/dashboard/chat" },
        { name: "Users", icon: Users, path: "/dashboard/users" },
        { name: "Management", icon: Settings, path: "/dashboard/management" },
    ]

    const router = useRouter();
    const pathname = usePathname();

    async function Logout() {
        await signOut(auth).then(() => {
            router.push("/")
        })
    }

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
                    setLoadingState(false);
                };
                getUserData();
            } else {
                setUserData(null);
                setLoadingState(false);
            }
        });
        return () => unsubscribe();
    }, []);




    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768)
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(true)
            } else {
                setIsSidebarOpen(false)
            }
        }

        checkScreenSize()
        window.addEventListener('resize', checkScreenSize)

        return () => window.removeEventListener('resize', checkScreenSize)
    }, [])

    return (
        <div className="flex min-h-screen bg-black text-white">
            <AuthChecker successRedirect="" />
            <aside className={cn(
                "fixed left-0 top-0 z-40 h-screen bg-[#151515] transition-transform duration-300 ease-in-out",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full",
                "md:relative md:translate-x-0"
            )}>
                <div className="flex h-full w-64 flex-col">
                    <div className={cn("flex items-center justify-between p-4", isMobile ? "" : "justify-center")}>
                        <a href="/" className="text-decoration-none text-xl font-bold text-white">Teach Me Tech</a>
                        {isMobile && (
                            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-white md:hidden hover:bg-[--bs-danger]">
                                <X className="h-6 w-6" />
                            </Button>
                        )}
                    </div>
                    <div className="flex flex-col items-center mb-3">
                        {!loadingState && userData ? (
                            <>
                                <div
                                    className="rounded-circle h-[14vh] aspect-square text-white flex justify-center items-center"
                                    style={{
                                        backgroundImage: userData.pfp ? `url(${userData.pfp})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                >
                                    {userData.pfp ? null : (
                                        <i className="fa-regular fa-user text-6xl"></i>
                                    )}
                                </div>

                                <span className="mt-2 text-lg font-semibold">
                                    {userData.name}
                                </span>
                                <span className="mt-2 text-l ps-3 pe-3">
                                    {userData.aboutMe}
                                </span>
                            </>
                        ) : (
                            <>
                                <div className="rounded-circle h-[14vh] aspect-square bg-gray-300 animate-pulse"></div>
                                <div className="mt-2 h-6 w-1/3 bg-gray-300 rounded animate-pulse"></div>
                                <div className="mt-2 h-4 w-2/3 bg-gray-300 rounded animate-pulse"></div>
                            </>
                        )}

                        <div className="mt-4 flex justify-center items-center space-x-2">
                            <Dialog open={profileShown} onOpenChange={()=>{setProfileShown(!profileShown)}}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" onClick={() => { setProfileShown(!profileShown) }}>
                                        <CircleUser className="mr-2 h-4 w-4" />
                                        Profile
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] dark">
                                    <DialogHeader>
                                        <DialogTitle>Edit profile</DialogTitle>
                                        <DialogDescription>
                                            Make changes to your profile here.<br></br> Click save when you are done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex flex-col h-full p-3">
                                        {profileShown && <UserProfile token={`${auth.currentUser?.uid}`} />}
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit">Save changes</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <Button variant="ghost" className="text-red-500" onClick={Logout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Log out
                            </Button>
                        </div>
                    </div>
                    <nav className="flex-1">
                        <ul className="space-y-2 px-2">
                            {sidebarItems.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.path} passHref className="text-white">
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                "w-full justify-start",
                                                pathname === item.path && "font-bold bg-[#050505]"
                                            )}
                                            onClick={() => {
                                                if (isMobile) {
                                                    setIsSidebarOpen(false)
                                                }
                                            }}>
                                            <item.icon className="mr-2 h-5 w-5" />
                                            <span>{item.name}</span>
                                        </Button>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </aside>
            <div className="d-flex flex-col w-100 h-100 overflow-hidden">
                <div className="bg-[#151515] p-2 md:hidden sticky top-0 left-0 m-0">
                    <div className="d-flex items-center space-x-2">
                        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-white hover:bg-[#252525]">
                            <Menu className="h-6 w-6" />
                        </Button>
                        <span className="text-xl font-bold">Teach Me Tech</span>
                    </div>
                </div>
                <div className="p-3 w-100 md:h-[100vh] overflow-auto d-flex flex-column">
                    {children}
                </div>
            </div>
        </div>
    )
}