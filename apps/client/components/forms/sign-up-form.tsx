'use client';

import { type User as RegisterUserInput, UserSchema as RegisterUserSchema } from "@repo/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image"; import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { useSignupMutation, useLoginMutation } from "@/hooks/use-auth-mutations";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { loginAndRedirect } from "@/lib/auth-util";

export const SignUpForm = () => {
    const router = useRouter();


    const form = useForm<RegisterUserInput>({
        resolver: zodResolver(RegisterUserSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        }
    })

    const signupMutation = useSignupMutation();
    const loginMutation = useLoginMutation();

    function onSubmit(formData: RegisterUserInput) {
        signupMutation.mutate(formData, {
            onSuccess: async () => {
                const { email, password } = formData;
                // Connecte le nouvel utilisateur
                loginMutation.mutate({ email, password }, {
                    onSuccess: async (data) => {
                        const { token, user } = data.data;
                        loginAndRedirect({ token, user }, router);
                    },
                    onError: () => {
                        router.push('/login');
                    }
                })
            },
            onError: (error) => {
                if (axios.isAxiosError(error)) {
                    const apiErrorMessage = error.response?.data?.message || 'Une erreur est survenue';
                    form.setError('root', { type: 'server', message: apiErrorMessage });
                } else {
                    form.setError('root', { type: 'server', message: 'Une erreur inattendue est survenue (réseau)' });
                }
            }
        })
    }

    return (
        <Card className="w-full sm:max-w-md py-8 shadow-soft-medium ring-0 z-20">
            <CardHeader>
                <CardTitle>
                    <div className="flex gap-3 items-center tracking-[2%] justify-center">
                        <Image src="/logo-icon.svg" alt="Logo" width={40} height={40} />
                        <span className="text-4xl font-extrabold text-brand uppercase">Smart Project</span>
                    </div>
                </CardTitle>
                <CardDescription className="text-[1rem] text-(--text-foreground) leading-7 font-bold my-6 text-center">
                    Inscrivez-vous pour continuer
                    {signupMutation.isSuccess && (
                        <p className="text-sm font-medium text-green-600 bg-green-100 p-3 rounded mt-2">
                            Inscription réussie ! Redirection en cours...
                        </p>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className="px-6">
                <form
                    id="inscription-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="nom" className="font-bold">
                                        Nom complet <sup className="text-(--text-danger) text-sm">*</sup>
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        type="text"
                                        id="nom"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Saisissez votre nom complet"
                                        className="min-h-10 focus-visible:ring-(--purple)"
                                        required
                                        autoComplete="on"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="email" className="font-bold">
                                        E-mail <sup className="text-(--text-danger) text-sm">*</sup>
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        type="email"
                                        id="email"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Saisissez votre adresse e-mail"
                                        className="min-h-10 focus-visible:ring-(--purple)"
                                        required
                                        autoComplete="on"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="password" className="font-bold">
                                        Mot de passe <sup className="text-(--text-danger) text-sm">*</sup>
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        type="password"
                                        id="password"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Saisissez votre mot de passe"
                                        required
                                        autoComplete="off"
                                        className="min-h-10 focus-visible:ring-(--purple)"
                                    />
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
                </form>
            </CardContent>

            <CardFooter className="flex flex-col px-6 gap-6">
                <Button
                    type="submit"
                    form="inscription-form"
                    className="flex-1 bg-primary py-2.5 w-full cursor-pointer"
                    disabled={signupMutation.isPending}
                >
                    {signupMutation.isPending ? 'Inscription en cours...' : 'S\'inscrire'}
                </Button>
                <Link href="/login" className="text-brand self-end">Connectez-vous !</Link>
            </CardFooter>
        </Card>
    )
}