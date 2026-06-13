'use client'

import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from '@/components/ui/input-group'
import { useCreateProject } from '@/features/dashboard-project/application/mutations/useCreateProject'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProjectInput, ProjectSchema } from '@repo/shared'
import axios from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

function getProjectCreationError(error: unknown) {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as {
            message?: string
            error?: string
        } | undefined

        if (data?.message) return data.message
        if (data?.error) return data.error
        if (error.response?.status === 401) return "Votre session a expire. Reconnectez-vous puis reessayez."
        if (error.response?.status === 409) return "Un projet avec ce titre existe deja."
        if (!error.response) return "Impossible de joindre l'API. Verifiez que le backend est lance."
    }

    if (error instanceof Error && error.message) return error.message

    return "Une erreur s'est produite lors de la creation de votre projet."
}

const AddProjectForm = () => {
    const mutation = useCreateProject()
    const form = useForm<ProjectInput>({
        resolver: zodResolver(ProjectSchema),
        defaultValues: {
            title: "",
            description: ""
        }
    })

    function onSubmit(data: ProjectInput) {
        form.clearErrors("root")
        mutation.mutate(data, {
            onSuccess: async () => {
                toast.success("Votre projet a ete cree avec succes !")
                form.reset()
            },
            onError: async (error) => {
                const message = getProjectCreationError(error)
                form.setError("root", { message })
                toast.error(message)
            }
        })
    }

    return (
        <form
            id="register-project"
            onSubmit={form.handleSubmit(onSubmit)}
        >
            <FieldGroup>
                <Controller
                    name="title"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor='register-project-title'>
                                Titre
                            </FieldLabel>
                            <Input
                                {...field}
                                type="text"
                                id="register-project-title"
                                aria-invalid={fieldState.invalid}
                                placeholder='Saisissez le titre de votre projet'
                                className='focus-visible:ring-(--purple)/30'
                                required
                                autoComplete='off'
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="register-project-description">
                                Description
                            </FieldLabel>
                            <InputGroup className='has-[[data-slot=input-group-control]:focus-visible]:ring-(--purple)/30'>
                                <InputGroupTextarea
                                    {...field}
                                    id="register-project-description"
                                    placeholder="Ce projet vise a developper integralement l'interface..."
                                    rows={6}
                                    className="min-h-24 resize-none"
                                    aria-invalid={fieldState.invalid}
                                />
                                <InputGroupAddon align="block-end">
                                    <InputGroupText className="tabular-nums">
                                        {field.value.length}/100 characters
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                            <FieldDescription>
                                Soyez le plus precis dans votre description afin de permettre
                                a vos futurs collaborateur de comprendre les enjeux.
                            </FieldDescription>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>

            {form.formState.errors.root && (
                <p className="mt-3 rounded-md bg-destructive/10 p-3 text-sm font-medium text-destructive">
                    {form.formState.errors.root.message}
                </p>
            )}

            <Field orientation="horizontal" className='mt-6 justify-end'>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={mutation.isPending}
                >
                    Reinitialiser
                </Button>
                <Button
                    type="submit"
                    form="register-project"
                    className='cursor-pointer'
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? "Enregistrement..." : "Enregistrer"}
                </Button>
            </Field>
        </form>
    )
}

export default AddProjectForm
