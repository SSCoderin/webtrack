"use client"
import { useState } from "react";
import { Plus, Globe, LayoutGrid, Activity, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
    const [websitelist, setWebsitelist] = useState([]);

    return (
        <div className="min-h-screen  text-zinc-300 p-6 pt-32">
            <div className="max-w-6xl mx-auto space-y-8">

                <div className="flex flex-row items-center justify-between border-b border-zinc-800 pb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Project Overview</h1>
                        <p className="text-sm text-zinc-500">Manage and monitor your tracked domains.</p>
                    </div>
                    <Link href="/dashboard/add-website">
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-widest rounded transition-all active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                        <Plus size={16} strokeWidth={3} />
                        Add Website
                    </button>
                    </Link>
                </div>


                <div className="relative">
                    {websitelist.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-950/20">
                            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 border border-zinc-800">
                                <Globe className="text-zinc-600 w-8 h-8" />
                            </div>
                            <h3 className="text-white font-bold text-lg">No Active Nodes</h3>
                            <p className="text-zinc-500 text-sm mb-6 max-w-[280px] text-center leading-relaxed">
                                You haven&apos;t added any websites to track yet. Start by deploying your first tracking script.
                            </p>
                            <Link href="/dashboard/add-website">
                            <button className="px-6 py-2.5 bg-zinc-100 hover:bg-white text-black font-bold text-xs uppercase tracking-widest rounded transition-colors">
                                Initialize First Website
                            </button>
                            </Link>
                        </div>
                    ) : (
                        /* Website Grid (When data exists) */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {websitelist.map((site, idx) => (
                                <div key={idx} className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-emerald-500/50 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800 group-hover:border-emerald-500/50 transition-colors">
                                            <Activity size={18} className="text-emerald-500" />
                                        </div>
                                        <ExternalLink size={14} className="text-zinc-600 group-hover:text-white cursor-pointer" />
                                    </div>
                                    <h4 className="text-white font-bold truncate">website-url.com</h4>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono mt-1">Status: Operational</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}