'use client'

import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";

export const Footer = memo(() => (
  <footer className="border-t border-slate-100 bg-white py-12">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex items-center gap-3">
          <Image src="/logo-icon.svg" alt="SmartProject Logo" width={28} height={28} />
          <span className="text-lg font-black tracking-tight text-slate-900">Smart<span className="text-[#5030E5]">Project</span></span>
        </div>
        <p className="text-xs font-medium text-slate-500 sm:text-sm">
          © 2026 SmartProject. Développé avec ❤️ pour les étudiants.
        </p>
        <div className="flex gap-6">
          <Link href="#" className="text-xs font-bold text-slate-400 hover:text-[#5030E5] transition-colors sm:text-sm">Twitter</Link>
          <Link href="#" className="text-xs font-bold text-slate-400 hover:text-[#5030E5] transition-colors sm:text-sm">GitHub</Link>
          <Link href="#" className="text-xs font-bold text-slate-400 hover:text-[#5030E5] transition-colors sm:text-sm">Documentation</Link>
        </div>
      </div>
    </div>
  </footer>
));

Footer.displayName = "Footer";
