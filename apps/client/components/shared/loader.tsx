import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoaderProps {
  /** Classes CSS additionnelles pour le conteneur */
  className?: string
  /** Taille du loader : sm (16px), md (32px), lg (48px), xl (64px) */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Si vrai, affiche le loader au centre de l'écran avec un overlay flouté */
  fullPage?: boolean
  /** Texte optionnel à afficher sous le loader */
  label?: string
}

const sizeMap = {
  sm: 'h-4 w-4 stroke-[2.5px]',
  md: 'h-8 w-8 stroke-[2px]',
  lg: 'h-12 w-12 stroke-[1.5px]',
  xl: 'h-16 w-16 stroke-[1px]',
}

/**
 * Composant Loader moderne et générique.
 * Utilise la couleur de marque #5030E5 et des animations fluides.
 */
export const Loader = ({ 
  className, 
  size = 'md', 
  fullPage = false,
  label 
}: LoaderProps) => {
  const loaderContent = (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className="relative flex items-center justify-center">
        {/* Anneau extérieur pulsant pour l'effet moderne */}
        <div className={cn(
          "absolute rounded-full border-2 border-[#5030E5]/20 animate-ping",
          size === 'sm' ? 'h-6 w-6' : size === 'md' ? 'h-12 w-12' : size === 'lg' ? 'h-20 w-20' : 'h-28 w-28'
        )} />
        
        {/* Icone de chargement principale */}
        <Loader2 className={cn(
          "animate-spin text-[#5030E5] transition-all",
          sizeMap[size]
        )} />
      </div>
      
      {label && (
        <span className="text-sm font-medium text-slate-500 animate-pulse">
          {label}
        </span>
      )}
    </div>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-md transition-all duration-300">
        {loaderContent}
      </div>
    )
  }

  return loaderContent
}
