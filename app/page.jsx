"use client"

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  MousePointer2,
  Zap,
  ShieldCheck,
  Globe,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  LogOut,
  User,
  TrendingUp,
  Clock,
  MapPin,
  Activity,
  ArrowUpRight
} from 'lucide-react';

import { useRouter } from "next/navigation";
import { useUser, SignOutButton } from "@clerk/nextjs";

export default function App() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { user, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      title: "Live Analytics",
      description: "Granular visitor tracking updated every 50ms. Global latency under 100ms.",
      icon: <Activity className="w-5 h-5" />,
    },
    {
      title: "Zero-Click Tracking",
      description: "Automatic event detection without manual tagging or complex configurations.",
      icon: <MousePointer2 className="w-5 h-5" />,
    },
    {
      title: "Data Sovereignty",
      description: "GDPR/CCPA compliant by design. Your data never leaves your chosen region.",
      icon: <ShieldCheck className="w-5 h-5" />,
    },
    {
      title: "Auto-Insights",
      description: "Machine learning models identify conversion bottlenecks before they impact ROI.",
      icon: <Zap className="w-5 h-5" />,
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans selection:bg-emerald-500/30 overflow-x-hidden">

      {/* Subtle Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* Navigation */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent py-5'}`}>
        <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
              <Globe className="text-black w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white">WebTrack</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {!isSignedIn ? (
              <div className="flex items-center gap-6">
                <button
                  onClick={() => router.push("/sign-in")}
                  className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push("/sign-up")}
                  className="px-5 py-2 rounded bg-zinc-100 text-black font-bold text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded bg-zinc-900 border border-zinc-800">
                  <User className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-white uppercase tracking-tighter">
                    {user?.firstName}
                  </span>
                </div>

                <SignOutButton>
                  <button className="text-zinc-500 hover:text-white transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </SignOutButton>
              </div>
            )}
          </div>

          <button className="md:hidden text-zinc-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>


      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 z-10">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-zinc-800 bg-zinc-950 text-zinc-500 animate-fade-in">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Build 2.0.42</span>
            <div className="w-px h-3 bg-zinc-800" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">System Online</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[0.9] animate-fade-in-up">
            Privacy-First <br />
            Analytics Infrastructure.
          </h1>

          <p className="max-w-xl mx-auto text-sm md:text-base text-zinc-500 leading-relaxed animate-fade-in-up [animation-delay:200ms]">
            Advanced website tracking for professional teams. High-fidelity data collection without the bloat or privacy compromises of legacy platforms.
          </p>
          <div className="pt-6 animate-fade-in-up [animation-delay:400ms]">
            <button
              onClick={() => {
                if (isSignedIn) {
                  router.push("/dashboard");
                } else {
                  router.push("/sign-in");
                }
              }}
              className="px-8 py-3 rounded bg-emerald-500 text-black font-bold text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>

        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30 hover:opacity-100 transition-opacity cursor-pointer group"
          onClick={() => window.scrollTo({ top: window.innerHeight - 80, behavior: 'smooth' })}
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 group-hover:text-emerald-500 transition-colors">
            Scroll to Data
          </span>
          <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-emerald-500" />
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-6xl mx-auto px-6 pb-24">

        {/* Dashboard Mockup - Professional Bento Style */}
        <div className="relative mb-32">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-1 shadow-2xl">
            <div className="bg-[#0c0c0e] rounded-md border border-zinc-900 overflow-hidden">

              {/* Window Bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-900 bg-zinc-950/50">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                </div>
                <div className="px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-500">
                  app.webtrack.io/dashboard/main
                </div>
                <div className="w-8" />
              </div>

              {/* Grid Content */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Stats Sidebar */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="p-4 rounded border border-zinc-900 bg-zinc-950/40">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Live Sessions</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-white">4,821</span>
                      <TrendingUp size={14} className="text-emerald-500" />
                    </div>
                  </div>
                  <div className="p-4 rounded border border-zinc-900 bg-zinc-950/40">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Avg Load Time</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-white">0.42s</span>
                      <span className="text-[10px] font-bold text-emerald-500">-12ms</span>
                    </div>
                  </div>
                  <div className="p-4 rounded border border-zinc-900 bg-zinc-950/40">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Conversion Rate</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-white">12.4%</span>
                      <ArrowUpRight size={14} className="text-emerald-500" />
                    </div>
                  </div>
                </div>

                {/* Main Data Feed */}
                <div className="lg:col-span-9 rounded border border-zinc-900 bg-zinc-950/20 p-6">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Traffic Distribution</h3>
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <div className="w-2 h-2 rounded-full bg-zinc-800" />
                    </div>
                  </div>

                  {/* Clean Bar Chart */}
                  <div className="h-48 flex items-end justify-between gap-1">
                    {[60, 40, 80, 50, 90, 70, 45, 85, 65, 30, 75, 55, 95, 40, 60, 80].map((h, i) => (
                      <div key={i} className="flex-1 group relative">
                        <div
                          className="w-full bg-zinc-800 group-hover:bg-emerald-500 transition-colors rounded-t-sm"
                          style={{ height: `${h}%` }}
                        />
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] font-mono transition-opacity text-emerald-500">
                          {h}%
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 grid grid-cols-4 gap-4">
                    {['Direct', 'Organic', 'Social', 'Referral'].map((src, i) => (
                      <div key={i} className="space-y-2">
                        <p className="text-[10px] font-bold text-zinc-600 uppercase">{src}</p>
                        <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${Math.random() * 60 + 20}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Features Bento Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800 border border-zinc-800 rounded-lg overflow-hidden">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-zinc-950 p-8 group hover:bg-zinc-900/50 transition-colors">
              <div className="w-10 h-10 rounded bg-zinc-900 flex items-center justify-center mb-6 text-emerald-500 group-hover:text-white group-hover:bg-emerald-500 transition-all">
                {feature.icon}
              </div>
              <h4 className="text-white font-bold text-sm mb-2 tracking-tight">{feature.title}</h4>
              <p className="text-zinc-500 text-xs leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-6 text-center text-sm text-zinc-500">
        © 2026 WebTrack Systems
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
      `}} />
    </div>
  );
}