"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useInviteProjectMember } from "@/features/dashboard-project/application/mutations/useInviteProjectMember";
import { useUsers } from "@/features/dashboard-project/application/hooks/useUsers";
import { ProjectMember } from "@/features/dashboard-project/domain/entities/Project";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type InviteMemberModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
    members: ProjectMember[];
};

export function InviteMemberModal({
    open,
    onOpenChange,
    projectId,
    members,
}: Readonly<InviteMemberModalProps>) {
    const [selectedUserId, setSelectedUserId] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const usersQuery = useUsers();
    const inviteMutation = useInviteProjectMember(projectId);

    const memberIds = useMemo(
        () => new Set(members.map((member) => member.user.id)),
        [members]
    );

    const availableUsers = useMemo(
        () => (usersQuery.data ?? []).filter((user) => !memberIds.has(user.id)),
        [memberIds, usersQuery.data]
    );

    const hasError = submitted && !selectedUserId;

    function handleSubmit() {
        setSubmitted(true);
        if (!selectedUserId) return;

        inviteMutation.mutate(selectedUserId, {
            onSuccess: () => {
                toast.success("Le membre a ete invite avec succes.");
                setSelectedUserId("");
                setSubmitted(false);
                onOpenChange(false);
            },
            onError: () => {
                toast.error("Impossible d'inviter ce membre. Verifiez que l'API d'invitation est disponible.");
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Inviter un membre</DialogTitle>
                    <DialogDescription>
                        Selectionnez un utilisateur existant pour l&apos;ajouter a ce projet.
                    </DialogDescription>
                </DialogHeader>

                <FieldGroup>
                    <Field data-invalid={hasError}>
                        <FieldLabel htmlFor="project-member">Utilisateur</FieldLabel>
                        <select
                            id="project-member"
                            value={selectedUserId}
                            onChange={(event) => setSelectedUserId(event.target.value)}
                            className="border-input bg-background ring-offset-background focus-visible:ring-ring flex min-h-10 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={usersQuery.isLoading || inviteMutation.isPending}
                        >
                            <option value="">
                                {usersQuery.isLoading ? "Chargement des utilisateurs..." : "Choisir un utilisateur"}
                            </option>
                            {availableUsers.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name} - {user.email}
                                </option>
                            ))}
                        </select>
                        {hasError && <FieldError errors={[{ message: "Veuillez selectionner un utilisateur." }]} />}
                    </Field>
                </FieldGroup>

                {availableUsers.length === 0 && !usersQuery.isLoading && (
                    <p className="text-sm text-[#787486]">
                        Aucun utilisateur disponible a inviter pour le moment.
                    </p>
                )}

                <DialogFooter className="mt-4 flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={inviteMutation.isPending}
                        className="cursor-pointer"
                    >
                        Annuler
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={inviteMutation.isPending || usersQuery.isLoading || availableUsers.length === 0}
                        className="cursor-pointer"
                    >
                        {inviteMutation.isPending ? "Invitation..." : "Inviter"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
