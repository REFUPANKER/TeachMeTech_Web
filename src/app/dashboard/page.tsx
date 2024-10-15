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
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { auth } from "../firebase/dbm"

export default function Page() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [selectedItem, setSelectedItem] = useState("Dashboard")
  const [isMobile, setIsMobile] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const sidebarItems = [
    { name: "Dashboard", icon: Home },
    { name: "Courses", icon: BookOpen },
    { name: "Users", icon: Users },
  ]

  const router = useRouter();

  async function Logout() {
    await signOut(auth).then(() => {
      router.push("/")
    })
  }

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
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-gray-950 transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        "md:relative md:translate-x-0"
      )}>
        <div className="flex h-full w-64 flex-col">
          <div className="flex items-center justify-between p-4">
            <span className="text-xl font-bold">Teach Me Tech</span>
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-white md:hidden hover:bg-[--bs-danger]">
                <X className="h-6 w-6" />
              </Button>
            )}
          </div>
          <div className="flex flex-col items-center mt-8 mb-8">
            <CircleUser className="h-12 w-12 text-white" />
            <span className="mt-2 text-lg font-semibold">John Doe</span>
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
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      selectedItem === item.name && "font-bold bg-gray-800"
                    )}
                    onClick={() => setSelectedItem(item.name)}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    <span>{item.name}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto p-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setSelectedItem("Management")}
            >
              <Settings className="mr-2 h-5 w-5" />
              <span>Management</span>
            </Button>
          </div>
        </div>
      </aside>
      <div className="flex-1">
        <header className="bg-gray-950 p-2 md:hidden">
          <div className="d-flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-white hover:bg-[#252525]">
              <Menu className="h-6 w-6" />
            </Button>
            <span className="text-xl font-bold">Teach Me Tech</span>
          </div>
        </header>
        <main className="p-8">
          <h1 className="text-3xl font-bold mb-6">{selectedItem}</h1>
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-gray-800 bg-gray-900 shadow-sm p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                Welcome to Teach Me Tech
              </h3>
              <p className="text-lg text-gray-300">
                Start exploring courses or manage your learning journey.
              </p>
              <Button className="mt-4 bg-white text-black hover:bg-gray-200">Get Started</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}