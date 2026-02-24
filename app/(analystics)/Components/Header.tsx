"use client"
import { UserButton, useUser } from "@clerk/nextjs";
import { Globe } from "lucide-react";

export default function Header() {
    const { user } = useUser();
    
    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
            {/* The Floating Card Container */}
            <nav className="flex items-center justify-between w-full  h-14 px-6 
                            bg-zinc-950/60 backdrop-blur-xl border border-white/10 
                            rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                
                {/* Logo Section */}
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        <Globe className="text-black w-4 h-4 stroke-[2.5]" />
                    </div>
                    <span className="text-lg font-bold tracking-tighter text-white">
                        WebTrack
                    </span>
                </div>

                {/* User Section */}
                <div className="flex items-center gap-4">
                    {user && (
                        <span className="text-[12px] font-black uppercase text-zinc-400">
                            {user?.firstName}
                        </span>
                    )}
                    <div className="flex items-center scale-90 hover:scale-100 transition-transform">
                        <UserButton 
                            appearance={{
                                elements: {
                                    avatarBox: "border border-white/10"
                                }
                            }}
                        />
                    </div>
                </div>
            </nav>
        </header>
    );
}