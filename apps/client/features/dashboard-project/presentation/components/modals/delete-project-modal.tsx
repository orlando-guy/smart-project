import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useDeleteProject } from "@/features/dashboard-project/application/mutations/useDeleteProject"
import { toast } from "sonner"
import { useState } from "react"

type DeleteProjectModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    projectId: string
    projectName: string
}

export function DeleteProjectModal({ open, onOpenChange, projectId, projectName }: Readonly<DeleteProjectModalProps>) {
    const deleteMutation = useDeleteProject()
    const [isPending, setIsPending] = useState(false)

    const handleDelete = () => {
        setIsPending(true)
        deleteMutation.mutate(projectId, {
            onSuccess: () => {
                toast.success(`Le projet "${projectName}" a été supprimé avec succès.`)
                onOpenChange(false)
            },
            onError: () => {
                toast.error(`Une erreur est survenue lors de la suppression du projet.`)
            },
            onSettled: () => {
                setIsPending(false)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-destructive flex items-center gap-2">
                        Supprimer le projet
                    </DialogTitle>
                    <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer le projet <strong>{projectName}</strong> ? Cette action est irréversible et supprimera également toutes les tâches associées.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                        className="cursor-pointer"
                    >
                        Annuler
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isPending}
                        className="cursor-pointer"
                    >
                        {isPending ? "Suppression..." : "Supprimer"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
