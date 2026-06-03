import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import AddProjectForm from "../forms/add-project-form"

type AddProjectModalProps = {
    open: boolean,
    onOpenChange: (open: boolean) => void;
}

export function AddProjectModal({open, onOpenChange}: Readonly<AddProjectModalProps>) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Ajouter votre projet</DialogTitle>
                    <DialogDescription>
                        Ajouter votre projet à partir d&apos;ici. 
                        Arranger vous à cliquer sur le bouton enregistrer à la fin.
                    </DialogDescription>
                </DialogHeader>
                <AddProjectForm />
            </DialogContent>
        </Dialog>
    )
}
