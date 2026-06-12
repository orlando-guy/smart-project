'use client'

import { useSyncExternalStore, useEffect } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { ProblemSolution } from "@/components/landing/problem-solution";
import { Features } from "@/components/landing/features";
import { FinalCTA } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

// Définition des snapshots en dehors du composant (évite les re-créations)
const subscribe = () => () => { };
const getSnapshot = () => true;       // Client = true
const getServerSnapshot = () => false; // Serveur = false

export default function Home() {
  const { token, isHydrated } = useAuth();
  const router = useRouter();

  const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isReady = isClient && isHydrated;

  // 2. Gestion propre de la redirection
  useEffect(() => {
    if (isReady && token) {
      router.push("/dashboard");
    }
  }, [isReady, token, router]);

  // 3. Rendu conditionnel propre (Early Return)
  if (!isReady || token) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900 overflow-x-hidden">
      <Navbar />
      <main className="flex-1 pt-16">
        <Hero />
        <ProblemSolution />
        <Features />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
