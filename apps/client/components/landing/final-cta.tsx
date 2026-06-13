'use client'

import React, { memo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const FinalCTA = memo(() => (
  <section className="px-4 py-20 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-5xl rounded-[2rem] bg-slate-900 px-6 py-16 text-center shadow-2xl shadow-slate-900/40 sm:rounded-[3rem] sm:px-8 sm:py-20">
      <h2 className="mb-6 text-3xl font-black tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.2]">
        Prêt à transformer votre <br className="hidden sm:block" /> façon de travailler ?
      </h2>
      <p className="mx-auto mb-10 max-w-2xl text-base font-medium text-slate-400 leading-relaxed sm:text-lg md:text-xl">
        Rejoignez des centaines d'étudiants qui utilisent déjà SmartProject pour leurs projets de fin d'année.
      </p>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button asChild size="lg" className="h-12 w-full rounded-full bg-white px-6 text-sm font-black text-slate-950 hover:bg-orange-500 hover:text-white transition-all shadow-xl shadow-white/5 sm:h-14 sm:px-10 sm:text-base md:text-lg sm:w-auto">
          <Link href="/sign-up">Créer mon compte gratuitement</Link>
        </Button>
      </div>
      <p className="mt-6 text-xs font-bold text-slate-500 sm:text-sm">Pas de carte bancaire · Accès illimité aux fonctionnalités de base</p>
    </div>
  </section>
));

FinalCTA.displayName = "FinalCTA";
