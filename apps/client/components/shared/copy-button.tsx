'use client'

import React, { useState, useCallback, ReactNode } from 'react'
import { CheckIcon } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from '@/lib/utils'

interface CopyButtonProps {
  /** Le texte à copier dans le presse-papier */
  textToCopy: string
  /** Icône à afficher par défaut */
  defaultIcon: ReactNode
  /** Icône à afficher pendant l'état de succès (optionnel) */
  successIcon?: ReactNode
  /** Classes CSS additionnelles pour le bouton */
  className?: string
  /** Message du tooltip par défaut */
  label?: string
  /** Message du tooltip après la copie */
  successLabel?: string
  /** Position du tooltip */
  side?: "top" | "right" | "bottom" | "left"
}

/**
 * Un bouton générique pour copier du texte avec feedback visuel et Tooltip.
 */
export const CopyButton = ({
  textToCopy,
  defaultIcon,
  successIcon = <CheckIcon className="w-3.5 h-3.5 text-green-500" />,
  className,
  label = "Copier",
  successLabel = "Copié !",
  side = "top"
}: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setIsCopied(true)
      
      // Réinitialiser l'état après 2 secondes
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error("Échec de la copie : ", err)
    }
  }, [textToCopy])

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <button
          onClick={handleCopy}
          className={cn(
            "transition-all duration-200 active:scale-95",
            className
          )}
          aria-label={isCopied ? successLabel : label}
        >
          {isCopied ? successIcon : defaultIcon}
        </button>
      </TooltipTrigger>
      <TooltipContent side={side}>
        <p className="text-xs font-medium">{isCopied ? successLabel : label}</p>
      </TooltipContent>
    </Tooltip>
  )
}
