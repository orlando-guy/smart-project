'use client'

import React, { memo } from "react";
import { Card } from "@/components/ui/card";
import { 
  Clock, 
  Zap, 
  Users
} from "lucide-react";
import { BEFORE_AFTER_CARDS } from "@/lib/landing-constants";

export const ProblemSolution = memo(() => (
  <section id="before-after" className="bg-slate-50 py-20 sm:py-32">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <h2 className="mb-8 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Pourquoi <span className="text-[#5030E5] underline decoration-slate-200 underline-offset-8">SmartProject</span> ?
          </h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-rose-500 shadow-sm">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">Le problème (Before)</h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  Des fichiers éparpillés, des conversations perdues sur Discord, et personne ne sait vraiment qui fait quoi. Le résultat ? Du stress et des nuits blanches avant la soutenance.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#5030E5] text-white shadow-lg shadow-[#5030E5]/20">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">La solution (After)</h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  Une interface unique, propre et intuitive. Chaque membre sait ce qu'il a à faire. Les fichiers sont centralisés. Vous avancez avec sérénité, en temps réel.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <Card className="rounded-2xl border-none bg-white p-5 shadow-xl shadow-slate-200/50 transition-transform hover:-translate-y-2 sm:rounded-3xl sm:p-6">
              <Users className="mb-4 h-7 w-7 text-[#5030E5] sm:h-8 sm:w-8" />
              <h4 className="mb-1 font-black text-sm sm:text-base text-slate-900">Équipes Unies</h4>
              <p className="text-xs text-slate-500 sm:text-sm">Ajoutez vos camarades en un clic.</p>
            </Card>
            {BEFORE_AFTER_CARDS.map((card, idx) => (
              <Card key={idx} className={`rounded-2xl border-none bg-white p-5 shadow-xl shadow-slate-200/50 transition-transform hover:-translate-y-2 sm:rounded-3xl sm:p-6 ${card.offset}`}>
                <div className="mb-4 h-7 w-7 sm:h-8 sm:w-8">
                  <card.icon className={card.color} />
                </div>
                <h4 className="mb-1 font-black text-sm sm:text-base text-slate-900">{card.title}</h4>
                <p className="text-xs text-slate-500 sm:text-sm">{card.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
));

ProblemSolution.displayName = "ProblemSolution";
