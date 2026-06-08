"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ProjectInput, ProjectSchema } from "@repo/shared"
import { Controller, useForm } from "react-hook-form"
import { useEffect } from "react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group"

export type ProjectDisplayStatus = "active" | "planning" | "paused" | "done"

type ProjectFormValues = ProjectInput & {
    color: string
    status: ProjectDisplayStatus
}

type ProjectFormModalProps = {
    mode: "create" | "rename"
    open: boolean
    onOpenChange: (open: boolean) => void
    initialValues?: Partial<ProjectFormValues>
    isPending?: boolean
    onSubmit: (values: ProjectFormValues) => void
}

const colors = ["#7AC555", "#FFA500", "#E4CCFD", "#76A5EA", "#5030E5", "#D25B68"]

const statuses: { value: ProjectDisplayStatus; label: string }[] = [
    { value: "active", label: "Actif" },
    { value: "planning", label: "Planifie" },
    { value: "paused", label: "En pause" },
    { value: "done", label: "Termine" },
]

export function ProjectFormModal({
    mode,
    open,
    onOpenChange,
    initialValues,
    isPending = false,
    onSubmit,
}: Readonly<ProjectFormModalProps>) {
    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(ProjectSchema) as never,
        defaultValues: {
            title: initialValues?.title ?? "",
            description: initialValues?.description ?? "",
            color: initialValues?.color ?? colors[0],
            status: initialValues?.status ?? "active",
        },
    })

    useEffect(() => {
        if (!open) return;

        form.reset({
            title: initialValues?.title ?? "",
            description: initialValues?.description ?? "",
            color: initialValues?.color ?? colors[0],
            status: initialValues?.status ?? "active",
        })
    }, [form, initialValues, open])

    function handleSubmit(values: ProjectFormValues) {
        onSubmit({
            ...values,
            title: values.title.trim(),
            description: values.description?.trim() ?? "",
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "Créer un projet" : "Renommer le projet"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "create"
                            ? "Ajoutez un projet à votre espace de travail."
                            : "Modifiez le nom et la description du projet."}
                    </DialogDescription>
                </DialogHeader>

                <form id={`project-${mode}-form`} onSubmit={form.handleSubmit(handleSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="title"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={`project-${mode}-title`}>Nom du projet</FieldLabel>
                                    <Input
                                        {...field}
                                        id={`project-${mode}-title`}
                                        placeholder="Ex: Mobile App"
                                        className="focus-visible:ring-[#5030E5]/30"
                                        disabled={isPending}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={`project-${mode}-description`}>Description</FieldLabel>
                                    <InputGroup className="has-[[data-slot=input-group-control]:focus-visible]:ring-[#5030E5]/30">
                                    <InputGroupTextarea
                                        {...field}
                                        value={field.value ?? ""}
                                        id={`project-${mode}-description`}
                                            placeholder="Décrivez brièvement le projet..."
                                            rows={4}
                                            className="min-h-24 resize-none"
                                            disabled={isPending}
                                        />
                                        <InputGroupAddon align="block-end">
                                        <InputGroupText className="tabular-nums">
                                                {(field.value ?? "").length}/100
                                        </InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="color"
                            control={form.control}
                            render={({ field }) => (
                                <Field>
                                    <FieldLabel>Couleur</FieldLabel>
                                    <div className="flex flex-wrap gap-2">
                                        {colors.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => field.onChange(color)}
                                                className={`h-8 w-8 rounded-full border-2 transition ${
                                                    field.value === color ? "border-[#0D062D]" : "border-transparent"
                                                }`}
                                                style={{ backgroundColor: color }}
                                                disabled={isPending}
                                            >
                                                <span className="sr-only">{color}</span>
                                            </button>
                                        ))}
                                    </div>
                                </Field>
                            )}
                        />

                        <Controller
                            name="status"
                            control={form.control}
                            render={({ field }) => (
                                <Field>
                                    <FieldLabel htmlFor={`project-${mode}-status`}>Statut</FieldLabel>
                                    <select
                                        id={`project-${mode}-status`}
                                        value={field.value}
                                        onChange={field.onChange}
                                        className="border-input bg-background flex min-h-10 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#5030E5]/30 disabled:cursor-not-allowed disabled:opacity-50"
                                        disabled={isPending}
                                    >
                                        {statuses.map((status) => (
                                            <option key={status.value} value={status.value}>
                                                {status.label}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>

                <DialogFooter className="mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        form={`project-${mode}-form`}
                        disabled={isPending}
                    >
                        {isPending ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
