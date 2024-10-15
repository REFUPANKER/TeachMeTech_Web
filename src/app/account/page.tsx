"use client";
import "../globals.css"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/dbm";
import { toast } from "@/hooks/use-toast";
import AuthChecker from "@/components/auth_checker";


export default function AuthPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await signInWithEmailAndPassword(auth, email, password)
            .then(r => {
                toast({
                    title: "Successfully logged in",
                    description: "Redirecting ...",
                    style: {
                        background: "#151515",
                        color: "white"
                    }
                })
                setTimeout(() => {
                    router.push("/dashboard");
                }, 2000);
            }).catch(e => {
                toast({
                    title: "Login failed",
                    description: "Check Email or Password",
                    style: {
                        background: "#151515",
                        color: "white",
                    }
                })
            });
    }
    return (
        <div>
            <AuthChecker successRedirect="/dashboard" redirectToAuthOnFail={false} />
            <div className="flex items-center justify-center min-h-screen bg-[#101010]">
                <Card className="w-full max-w-lg bg-[#101010] relative shadow-2xl shadow-[#075D17] p-6">
                    <button
                        onClick={() => router.push('/')}
                        className="absolute top-4 left-4 text-white hover:text-gray-400 focus:outline-none text-xl"
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <CardHeader>
                        <h2 className="text-center text-2xl font-semibold text-white">
                            Developer Entry
                        </h2>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <Input required
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-gray-700 text-white bg-[#151515] border-solid border-2 border-[#075D17] hover:bg-[#252525] text-lg"
                                />
                            </div>
                            <div className="mb-6">
                                <Input required
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-gray-700 text-white bg-[#151515] border-solid border-2 border-[#075D17] hover:bg-[#252525] text-lg"
                                />
                            </div>
                            <hr className="mt-3 mb-4" />
                            <Button type="submit" className="w-full mb-4 bg-[#151515] border-solid border-2 border-[#075D17] hover:bg-[#252525] text-lg py-3 active:bg-[#075D17]">
                                Login
                            </Button>
                        </form>
                        <div className="alert alert-warning w-100">
                            <i className="fa-solid fa-triangle-exclamation mr-3"></i>
                            Web Accounts only available for developers</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}