"use client";

import { useState } from "react";
import { Globe, Mail, Clock ,ArrowLeft} from "lucide-react";
import { timeZones } from "@/app/lib/timezone";
import axios from "axios";
import ScriptPopup from "@/app/(analystics)/Components/DisplayScript";
import Link from "next/link";

export default function AddWebsite() {

    const defaultTZ =
        Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

    const [form, setForm] = useState({
        domain: "",
        timeZone: defaultTZ,
        enableLocahostTracking: false,
    });

    const [errors, setErrors] = useState({
        domain: "",
        timeZone: "",
    });

    const formatTimeZone = (tz) => {
        return tz.replace(/_/g, " ");
    };

    const validate = () => {
        const newErrors = {};

       const domainRegex =
        /^(https?:\/\/)?((?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|localhost)(:\d+)?$/;

        if (!domainRegex.test(form.domain)) {
            newErrors.domain = "Enter a valid domain (example.com or localhost:3000)";
        }

        if (!form.timeZone) {
            newErrors.timeZone = "Please select a timezone";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const [loading, setLoading] = useState(false);
    const [error_reponsemsg, setError_reponsemsg] = useState("")
    const [sucess_reponse, setSucess_reponse] = useState("")
    const [createdWebsite, setCreatedWebsite] = useState(null);
    const [showScriptModal, setShowScriptModal] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setLoading(true);
            setError_reponsemsg("");

            const response = await axios.post("/api/website", form);

            setSucess_reponse(response.data.message);
            setCreatedWebsite(response.data.data);
            setShowScriptModal(true);

            // ✅ Disable button after success
            setIsRegistered(true);

        } catch (error) {
            setError_reponsemsg(error.response?.data?.error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen text-zinc-300 p-6 pt-32 max-w-6xl mx-auto">

            <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 text-white hover:text-green-400 transition-colors mb-8"
            >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Dashboard
            </Link>

            <div className="max-w-2xl mx-auto">

                <div className="mb-8 border-b border-zinc-800 pb-6">
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Add Website
                    </h1>
                    <p className="text-sm text-zinc-500">
                        Register a new domain for tracking and monitoring.
                    </p>
                </div>

                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 shadow-xl">

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Domain */}
                        <div>
                            <label className="text-xs uppercase tracking-widest text-zinc-500">
                                Domain
                            </label>
                            <div className="mt-2 flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 focus-within:border-emerald-500 transition-colors">
                                <Globe size={16} className="text-zinc-500" />
                                <input
                                    type="text"
                                    placeholder="example.com"
                                    className="bg-transparent outline-none w-full text-sm text-white"
                                    value={form.domain}
                                    onChange={(e) =>
                                        setForm({ ...form, domain: e.target.value })
                                    }
                                />
                            </div>
                            {errors.domain && (
                                <p className="text-red-500 text-xs mt-2">
                                    {errors.domain}
                                </p>
                            )}
                        </div>

                        {/* Timezone */}
                        <div>
                            <label className="text-xs uppercase tracking-widest text-zinc-500">
                                Timezone
                            </label>
                            <div className="mt-2 flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 focus-within:border-emerald-500 transition-colors">
                                <Clock size={16} className="text-zinc-500" />
                                <select
                                    className="bg-transparent outline-none w-full text-sm text-white"
                                    value={form.timeZone}
                                    onChange={(e) =>
                                        setForm({ ...form, timeZone: e.target.value })
                                    }
                                >
                                    <option value="" className="bg-zinc-900">
                                        Select Timezone
                                    </option>

                                    {timeZones.map((tz) => (
                                        <option
                                            key={tz}
                                            value={tz}
                                            className="bg-zinc-900"
                                        >
                                            {formatTimeZone(tz)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.timeZone && (
                                <p className="text-red-500 text-xs mt-2">
                                    {errors.timeZone}
                                </p>
                            )}
                        </div>

                        {/* Localhost toggle */}
                        <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3">
                            <div>
                                <p className="text-sm text-white font-medium">
                                    Enable Localhost Tracking
                                </p>
                                <p className="text-xs text-zinc-500">
                                    Allow tracking on localhost during development.
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={form.enableLocahostTracking}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        enableLocahostTracking: e.target.checked
                                    })
                                }
                                className="accent-emerald-500 w-4 h-4"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || isRegistered}
                            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-widest rounded transition-all active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                        >
                            {loading ? "Registering..." : "Register Website"}
                        </button>
                        {
                            error_reponsemsg && (
                                <p className="text-red-500 text-xs mt-2">
                                    {error_reponsemsg}
                                </p>
                            )
                        }
                        {
                            sucess_reponse && (
                                <p className="text-green-500 text-xs mt-2">
                                    {sucess_reponse}
                                </p>
                            )
                        }
                        {showScriptModal && createdWebsite && (
                            <ScriptPopup
                                website={createdWebsite}
                                onClose={() => setShowScriptModal(false)}
                            />
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}