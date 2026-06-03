'use client'

import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from '@/components/ui/input-group'
import { useCreateProject } from '@/features/dashboard-project/application/mutations/useCreateProject'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProjectInput, ProjectSchema } from '@repo/shared'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

const AddProjectForm = () => {
    const mutation = useCreateProject()
    const form = useForm<ProjectInput>({
        resolver: zodResolver(ProjectSchema),
        defaultValues: {
            title: "",
            description: ""
        }
    });
    function onSubmit(data: ProjectInput) {
        console.log(data);
        mutation.mutate(data, {
            onSuccess: async () => {
                toast.success("Votre projet a été créer avec succès !")
                form.reset()
            },
            onError: async () => {
                toast.error("Une érreur s'est produit lors de la création de votre projet.")
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
                                    placeholder="Ce projet vise à développer intégralement l'interface..."
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
                                Soyez le plus précis dans votre description afin de permettre
                                à vos futurs collaborateur de comprendre les enjeux.
                            </FieldDescription>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>

            {/* Affichage de l'erreur globale renvoyée par le serveur backend */}
            {form.formState.errors.root && (
                <p className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded mt-2">
                    {form.formState.errors.root.message}
                </p>
            )}

            <Field orientation="horizontal" className='mt-6 justify-end'>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                >
                    Réinitialiser
                </Button>
                <Button
                    type="submit"
                    form="register-project"
                    className='cursor-pointer'
                >
                    Enregistrer
                </Button>
            </Field>
        </form>
    )
}

export default AddProjectForm