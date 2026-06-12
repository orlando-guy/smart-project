'use client'

import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { NAV_LINKS } from "@/lib/landing-constants";

export const Navbar = memo(() => (
  <nav className="fixed top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <Image 
          src="/logo-icon.svg" 
          alt="SmartProject Logo" 
          width={32} 
          height={32} 
          className="drop-shadow-sm md:w-10 md:h-10"
        />
        <span className="text-xl font-black tracking-tight text-slate-900 md:text-2xl">
          Smart<span className="text-[#5030E5]">Project</span>
        </span>
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden items-center gap-8 md:flex">
        {NAV_LINKS.map(link => (
          <Link key={link.href} href={link.href} className="text-sm font-semibold text-slate-600 hover:text-[#5030E5] transition-colors">
            {link.label}
          </Link>
        ))}
        <Button asChild variant="ghost" className="font-bold text-slate-700 hover:text-[#5030E5]">
          <Link href="/login">Connexion</Link>
        </Button>
        <Button asChild className="rounded-full bg-[#5030E5] px-6 font-bold text-white hover:bg-[#4020D5] shadow-lg shadow-[#5030E5]/20">
          <Link href="/sign-up">Essayer gratuitement</Link>
        </Button>
      </div>

      {/* Mobile Navigation (Burger Menu) */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-slate-600 hover:bg-slate-50 active:scale-95 transition-all">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col w-[300px] p-0 border-l border-slate-100">
            <div className="p-6 border-b border-slate-50 bg-slate-50/30">
              <SheetTitle className="text-left flex items-center gap-3">
                <Image src="/logo-icon.svg" alt="SmartProject Logo" width={32} height={32} />
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Smart<span className="text-[#5030E5]">Project</span>
                </span>
              </SheetTitle>
            </div>
            
            <nav className="flex-1 px-4 py-6">
              <div className="space-y-1">
                {NAV_LINKS.map(link => (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 rounded-xl hover:bg-[#5030E5]/5 hover:text-[#5030E5] transition-all group"
                  >
                    <link.icon className="h-4.5 w-4.5 opacity-70 group-hover:opacity-100" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="p-6 mt-auto border-t border-slate-50 space-y-3 bg-slate-50/30">
              <Button asChild variant="outline" className="w-full h-11 rounded-xl border-slate-200 font-bold text-slate-700 hover:bg-white hover:border-[#5030E5] hover:text-[#5030E5] transition-all">
                <Link href="/login">Connexion</Link>
              </Button>
              <Button asChild className="w-full h-11 rounded-xl bg-[#5030E5] font-bold text-white hover:bg-[#4020D5] shadow-lg shadow-[#5030E5]/10 transition-all">
                <Link href="/sign-up">S'inscrire</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </nav>
));

Navbar.displayName = "Navbar";
