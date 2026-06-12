'use client'

import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = memo(() => (
  <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-32">
    <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#5030E5]/5 blur-3xl" />
    <div className="absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-blue-50/50 blur-3xl" />
    
    <div className="relative mx-auto max-w-7xl text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#5030E5]/20 bg-[#5030E5]/5 px-4 py-1.5 text-xs font-bold text-[#5030E5] sm:text-sm">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5030E5] opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5030E5]"></span>
        </span>
        Plateforme 100% Gratuite pour Étudiants
      </div>
      <h1 className="mb-6 text-4xl font-black tracking-tight text-slate-900 sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1]">
        Gérez vos projets <br className="hidden sm:block" />
        <span className="bg-gradient-to-r from-[#5030E5] to-[#8060FF] bg-clip-text text-transparent">
          sans le chaos.
        </span>
      </h1>
      <p className="mx-auto mb-10 max-w-2xl text-lg font-medium leading-relaxed text-slate-600 sm:text-xl md:text-2xl">
        L'outil de collaboration conçu pour les étudiants qui veulent transformer leurs idées en succès, sans perdre de temps en coordination.
      </p>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button asChild size="lg" className="h-12 w-full rounded-full bg-[#5030E5] px-8 text-base font-black text-white hover:bg-[#4020D5] shadow-xl shadow-[#5030E5]/30 transition-all hover:scale-105 sm:h-14 sm:px-10 sm:text-lg sm:w-auto">
          <Link href="/sign-up" className="flex items-center">
            Lancer mon projet gratuitement <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
      
      <div className="mt-16 relative mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-slate-50 p-1.5 shadow-2xl overflow-hidden group sm:rounded-3xl sm:p-2">
         <Image 
            src="/Interface.png" 
            alt="Aperçu de la plateforme SmartProject" 
            width={1200} 
            height={675}
            priority
            className="rounded-xl border border-slate-200 shadow-inner group-hover:scale-[1.01] transition-all duration-700 sm:rounded-2xl"
         />
         <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-900/5 to-transparent pointer-events-none" />
      </div>
    </div>
  </section>
));

Hero.displayName = "Hero";
