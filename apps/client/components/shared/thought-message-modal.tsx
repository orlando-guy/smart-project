"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"

type ThoughtMessageModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ThoughtMessageModal({
  open,
  onOpenChange,
}: Readonly<ThoughtMessageModalProps>) {
  const [content, setContent] = useState("")

  const messageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await api.post("/messages", { content: message })
      return response.data
    },
    onSuccess: () => {
      toast.success("Votre message a ete envoye a l'equipe.")
      setContent("")
      onOpenChange(false)
    },
    onError: () => {
      toast.error("Impossible d'envoyer votre message.")
    },
  })

  const canSubmit = content.trim().length > 0 && !messageMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thoughts Time</DialogTitle>
          <DialogDescription>
            Partagez une pensee courte avec votre equipe.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Partagez votre pensee avec l'equipe"
          className="min-h-32 resize-none"
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={messageMutation.isPending}
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button
            type="button"
            disabled={!canSubmit}
            onClick={() => messageMutation.mutate(content.trim())}
          >
            {messageMutation.isPending ? "Envoi..." : "Envoyer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
