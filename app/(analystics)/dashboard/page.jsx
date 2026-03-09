"use client"
import axios from "axios";
import { useState, useEffect } from "react";
import { Plus, Globe, LayoutGrid, Activity, ExternalLink, Trash2 } from "lucide-react"; import Link from "next/link";
import ScriptPopup from "@/app/(analystics)/Components/DisplayScript";

export default function Dashboard() {
    const [websitelist, setWebsitelist] = useState([]);
    const [loading, setLoading] = useState(true)
    const [selectedWebsite, setSelectedWebsite] = useState(null);
    const [search, setSearch] = useState("");
    const [showScriptModal, setShowScriptModal] = useState(false);
    useEffect(() => {
        getWebsiteList();
    }, [])
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            getWebsiteList(search);
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [search]);
    const getWebsiteList = async (searchValue = "") => {
        try {
            setLoading(true);

            const response = await axios.get("/api/website", {
                params: { search: searchValue }
            });

            setWebsitelist(response.data.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };
    const handleDelete = async (websiteId) => {
        const confirmDelete = confirm("Are you sure you want to delete this website?");

        if (!confirmDelete) return;

        try {
            await axios.delete(`/api/website?websiteId=${websiteId}`);

            // Remove from UI instantly
            setWebsitelist((prev) =>
                prev.filter((site) => site.websiteId !== websiteId)
            );

        } catch (error) {
            console.log(error);
            alert("Failed to delete website");
        }
    };

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
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by domain or timezone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:w-96 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                </div>
                {
                    loading ? (
                        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-950/20">
                            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 border border-zinc-800">
                                <Globe className="text-zinc-600 w-8 h-8" />
                            </div>
                            <h3 className="text-white font-bold text-lg">Loading...</h3>
                            <p className="text-zinc-500 text-sm mb-6 max-w-[280px] text-center leading-relaxed">
                                Please wait while we fetch your website list.
                            </p>
                        </div>
                    ) : (



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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {websitelist.map((site) => (
                                        <div
                                            key={site.websiteId}
                                            className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-emerald-500/50 transition-all group"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800 group-hover:border-emerald-500/50 transition-colors">
                                                    <Activity size={18} className="text-emerald-500" />
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <a
                                                        href={site.domain.startsWith('localhost') ? `${site.domain}` : `${site.domain}`}
                                                        target="_blank"
                                                        className="text-zinc-600 hover:text-white transition-colors"
                                                    >
                                                        <ExternalLink size={14} />
                                                    </a>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(site.websiteId)}
                                                        className="text-zinc-600 hover:text-red-500 transition-colors cursor-pointer"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            <h4 className="text-white font-bold truncate">
                                                {site.domain}
                                            </h4>

                                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono mt-1">
                                                {site.timeZone}
                                            </p>

                                            <div className="mt-3 flex items-center justify-between text-xs">
                                                <span
                                                    className={`px-2 py-1 rounded-full ${site.enableLocahostTracking
                                                        ? "bg-emerald-500/20 text-emerald-400"
                                                        : "bg-zinc-700 text-zinc-400"
                                                        }`}
                                                >
                                                    {site.enableLocahostTracking
                                                        ? "Localhost Enabled"
                                                        : "Production Only"}
                                                </span>

                                                <div className="flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedWebsite(site);
                                                            setShowScriptModal(true);
                                                        }}
                                                        className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold cursor-pointer"
                                                    >
                                                        Get Script
                                                    </button>

                                                </div>
                                            </div>

                                        </div>

                                    ))}
                                </div>
                            )}
                        </div>
                    )
                }
            </div>
            {showScriptModal && selectedWebsite && (
                <ScriptPopup
                    website={selectedWebsite}
                    onClose={() => setShowScriptModal(false)}
                />
            )}
        </div >
    );
}