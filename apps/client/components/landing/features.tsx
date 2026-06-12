'use client'

import React, { memo } from "react";
import { FEATURES_DATA } from "@/lib/landing-constants";

export const Features = memo(() => (
  <section id="features" className="py-20 sm:py-32">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-16 text-center sm:mb-20">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">Le pont vers votre réussite</h2>
        <p className="text-base font-medium text-slate-600 sm:text-lg">Tout ce dont vous avez besoin pour briller pendant vos études.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3 sm:gap-8">
        {FEATURES_DATA.map((feature, i) => (
          <div key={i} className="group relative rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-2xl hover:shadow-[#5030E5]/10 sm:rounded-3xl sm:p-8">
            <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl sm:h-14 sm:w-14 sm:rounded-2xl ${feature.color}`}>
              {feature.icon}
            </div>
            <h3 className="mb-3 text-lg font-black tracking-tight text-slate-900 sm:mb-4 sm:text-xl">{feature.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed sm:text-base">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
));

Features.displayName = "Features";
