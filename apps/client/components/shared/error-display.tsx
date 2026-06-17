import React from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ErrorDisplayProps {
  message?: string
  onRetry?: () => void
  className?: string
}

/**
 * Composant de traitement visuel des erreurs.
 * Affiche un message d'erreur clair avec une option de réessai.
 */
export const ErrorDisplay = ({ 
  message = "Une erreur est survenue lors du chargement.", 
  onRetry, 
  className 
}: ErrorDisplayProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 p-8 text-center rounded-xl border border-red-100 bg-red-50/50", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertCircle className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-slate-900">Erreur de chargement</h3>
        <p className="text-sm text-slate-500 max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry}
          className="gap-2 border-[#5030E5]/20 text-[#5030E5] hover:bg-[#5030E5]/10"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Réessayer
        </Button>
      )}
    </div>
  )
}
