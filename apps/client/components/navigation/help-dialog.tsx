"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type HelpDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const shortcuts = [
  { key: "Entrée", label: "Lancer une recherche dans le header" },
  { key: "Échap", label: "Fermer le panneau de recherche ouvert" },
  { key: "Ctrl + B", label: "Ouvrir ou fermer la sidebar" },
  { key: "Dashboard", label: "Cliquez sur un projet pour ouvrir son Kanban" },
]

export function HelpDialog({ open, onOpenChange }: Readonly<HelpDialogProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Aide rapide</DialogTitle>
          <DialogDescription>
            Quelques raccourcis et gestes utiles dans Smart Project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.key}
              className="flex items-center justify-between gap-4 rounded-lg bg-[#F5F5F5] px-3 py-2"
            >
              <span className="text-sm text-[#787486]">{shortcut.label}</span>
              <kbd className="shrink-0 rounded-md bg-white px-2 py-1 text-xs font-semibold text-[#0D062D] shadow-sm">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
