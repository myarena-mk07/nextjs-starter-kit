import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

const TITLE_TAILWIND_CLASS = "text-2xl sm:text-2xl md:text-3xl lg:text-4xl";

export default function HeroSection() {
    return (
        <section className="relative flex flex-col items-center justify-center leading-6 min-h-screen w-full overflow-hidden" aria-label="Nextjs Starter Kit Hero">
            {/* Background gradient elements */}
            <div className="absolute inset-0">
                {/* Larger elements */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-tr from-green-500/20 via-emerald-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-bl from-blue-500/20 via-cyan-500/10 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/6 left-1/6 w-64 h-64 bg-gradient-to-r from-yellow-500/20 via-orange-500/10 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '3s' }} />
                <div className="absolute bottom-1/4 right-1/6 w-56 h-56 bg-gradient-to-l from-indigo-500/30 via-violet-500/20 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
                
                {/* Smaller elements */}
                <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-gradient-to-br from-yellow-400/30 to-transparent rounded-full blur-xl animate-float" />
                <div className="absolute bottom-1/4 left-1/5 w-32 h-32 bg-gradient-to-tr from-indigo-500/20 to-transparent rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/6 right-1/3 w-24 h-24 bg-gradient-to-tl from-red-500/20 to-transparent rounded-full blur-lg animate-float" style={{ animationDelay: '3s' }} />
                <div className="absolute bottom-1/3 left-1/3 w-36 h-36 bg-gradient-to-br from-green-400/30 to-transparent rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }} />
                <div className="absolute top-2/5 right-1/5 w-28 h-28 bg-gradient-to-tl from-pink-500/20 to-transparent rounded-full blur-lg animate-float" style={{ animationDelay: '5s' }} />
                
                {/* Parabolic shapes */}
                <div className="absolute -top-40 left-0 right-0 h-80 bg-gradient-to-b from-teal-500/10 to-transparent blur-3xl transform rotate-6" />
                <div className="absolute -bottom-40 left-0 right-0 h-80 bg-gradient-to-t from-fuchsia-500/10 to-transparent blur-3xl transform -rotate-6" />
            </div>
            
            {/* Content */}
            <div className="relative z-10 text-center px-4">
                <h1 className={`${TITLE_TAILWIND_CLASS} text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-center max-w-[1120px] bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent`}>
                    Shot Beautifier
                </h1>
                <p className="mx-auto max-w-[700px] text-xl md:text-2xl text-gray-300 text-center mt-6">
                    Make Screenshot stand out with Dynamic Effects in Seconds!
                </p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link href="/dashboard">
                        <Button className="bg-black text-white border-2 border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-4 relative overflow-hidden group">
                            <span className="relative z-10">Get Started Free</span>
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300 ease-in-out"></div>
                        </Button>
                    </Link>
                    <Button variant="outline" className="text-white border-white hover:bg-white/10 text-lg px-8 py-4">
                        Watch Demo
                    </Button>
                </div>
                <p className="mt-8 text-gray-400 text-sm">
                    Join thousands of developers already transforming their workflow
                </p>
            </div>

            {/* Design-related decorative elements */}
            <div className="absolute top-10 left-10 w-16 h-16 border-4 border-white/20 rounded-full animate-spin-slow" />
            <div className="absolute bottom-20 right-20 w-20 h-20 border-4 border-green-400/20 rounded-md animate-bounce" style={{ animationDuration: '3s' }} />
            <div className="absolute top-1/3 right-10 w-24 h-8 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-sm animate-pulse" />
        </section>
    );
}
