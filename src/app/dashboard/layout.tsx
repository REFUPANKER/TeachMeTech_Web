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
    X
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

export default function DashboardLayout({ children, }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [selectedItem, setSelectedItem] = useState("Dashboard")
    const [isMobile, setIsMobile] = useState(false)


    const [loadingState, setLoadingState] = useState(true)
    const [userData, setUserData] = useState(Object)

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

    const sidebarItems = [
        { name: "Dashboard", icon: Home, path: "/dashboard" },
        { name: "Courses", icon: BookOpen, path: "/dashboard/courses" },
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
                        } catch (error) { }
                        setUserData({ ...userData, pfp: pfp });
                    } catch (error) { }
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
                    <div className="flex flex-col items-center mb-8">
                        <div
                            className="rounded-circle h-[14vh] aspect-square text-white flex justify-center items-center"
                            style={{
                                backgroundImage: userData.pfp ? `url(${userData.pfp})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}>
                            {userData.pfp ? null : (
                                <i className="fa-regular fa-user text-6xl"></i>
                            )}
                        </div>


                        <span className={`mt-2 text-lg font-semibold `}>
                            {userData.name}
                        </span>
                        <span className={`mt-2 text-l ps-3 pe-3 `}>
                            {userData.aboutMe}
                        </span>
                        <div className="mt-4 flex justify-center items-center space-x-2">
                            <Button variant="ghost" >
                                <CircleUser className="mr-2 h-4 w-4" />
                                Profile
                            </Button>
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
                                                setSelectedItem(item.name)
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
            <div className="flex-1 overflow-auto">
                <header className="bg-[#151515] p-2 md:hidden">
                    <div className="d-flex items-center space-x-2">
                        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-white hover:bg-[#252525]">
                            <Menu className="h-6 w-6" />
                        </Button>
                        <span className="text-xl font-bold">Teach Me Tech</span>
                    </div>
                </header>
                <main className="p-4 max-h-[100vh]">
                    <div className="h-100 overflow-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}