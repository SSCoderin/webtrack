"use client"
import { useState } from "react";
export default function ScriptPopup({ website, onClose }) {

    const [copied, setCopied] = useState(false);

    const baseUrl = window.location.origin;

    const scriptCode = `<script
  defer
  data-website-id="${website.websiteId}"
  data-domain="${website.domain}"
  src="${baseUrl}/analytics.js"
></script>`;

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(scriptCode);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl p-8 shadow-2xl relative">


                <p className="text-zinc-400 text-sm mb-6">
                    Add this tracking script inside your website's {"<head>"} tag.
                </p>

                <div className="bg-black rounded-lg p-4 border border-zinc-800 text-green-400 text-sm font-mono overflow-x-auto">
                    <pre>{scriptCode}</pre>
                </div>

                <div className="flex justify-between mt-6 items-center">

                    <div className="text-xs text-emerald-400">
                        {copied && "✓ Script copied to clipboard"}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={copyToClipboard}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-widest rounded"
                        >
                            {copied ? "Copied!" : "Copy Script"}
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs uppercase tracking-widest rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}