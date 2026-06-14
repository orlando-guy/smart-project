"use client"

import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  TaskSchema,
  TaskInput,
  ProjectPriority,
  TaskStatus
} from '@repo/shared'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useProjectMembers } from '@/features/dashboard-project/application/hooks/useProjectMembers'
import { useCreateTask } from '../../../application/hooks/useCreateTask'
import { Loader2 } from 'lucide-react'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from '@/components/ui/input-group'

interface AddTaskModalProps {
  projectId: string
  isOpen: boolean
  onClose: () => void
}

export const AddTaskModal = ({
  projectId,
  isOpen,
  onClose
}: AddTaskModalProps) => {
  const { data: members, isLoading: isLoadingMembers } = useProjectMembers(projectId)
  const { mutate: createTask, isPending } = useCreateTask(projectId)

  const form = useForm<TaskInput>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: "",
      description: "",
      projectId,
      statut: TaskStatus.NOT_STARTED,
      priority: ProjectPriority.COULD,
      assignedUserId: "",
      endDate: new Date().toDateString()
    }
  })

  const onSubmit = (data: TaskInput) => {
    console.log("Creating task with data:", data)
    createTask(data, {
      onSuccess: () => {
        form.reset()
        onClose()
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle tâche</DialogTitle>
          <DialogDescription>
            Remplissez les détails pour ajouter une tâche à la colonne &quot;À faire&quot;.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-task"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 py-4"
        >
          {/* Titre */}
          <Controller
            name='title'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className='space-y-2'>
                <FieldLabel htmlFor="title">Titre de la tâche</FieldLabel>
                <Input
                  {...field}
                  type="text"
                  id="title"
                  aria-invalid={fieldState.invalid}
                  placeholder="Ex: Finaliser le design de l'API"
                  className='focus-visible:ring-(--purple)/30'
                  required
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <FieldGroup className='space-y-2'>
            <Controller
              name='description'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor='task-description'>
                    Description (Optionnel)
                  </FieldLabel>
                  <InputGroup className='has-[[data-slot=input-group-control]:focus-visible]:ring-(--purple)/30'>
                    <InputGroupTextarea
                      {...field}
                      id="task-description"
                      placeholder="Détail de la tâche..."
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field?.value?.length}/100 characters
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

            <div className='grid grid-cols-2 gap-4'>
              {/* Priorité */}
              <Controller
                name='priority'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="task-priority">Priorité</FieldLabel>
                    <select
                      {...field}
                      id="task-priority"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value={ProjectPriority.MUST}>MUST (Critique)</option>
                      <option value={ProjectPriority.SHOULD}>SHOULD (Important)</option>
                      <option value={ProjectPriority.COULD}>COULD (Souhaitable)</option>
                      <option value={ProjectPriority.WONT}>WONT (Plus tard)</option>
                    </select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Date d'échéance */}
              <Controller
                name='endDate'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className='space-y-2'>
                    <FieldLabel htmlFor="task-end-date">Date d&apos;échéance</FieldLabel>
                    <Input
                      {...field}
                      type="date"
                      id="task-end-date"
                      aria-invalid={fieldState.invalid}
                      className='focus-visible:ring-(--purple)/30'
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Assignation */}
            <Controller
              name='assignedUserId'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="task-priority">Priorité</FieldLabel>
                  <select
                    {...field}
                    id="assignedUserId"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Choisir un membre...</option>
                    {members?.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.email})
                      </option>
                    ))}
                  </select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  {isLoadingMembers && <p className="text-[10px] text-slate-400 animate-pulse">Chargement des membres...</p>}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending} className="bg-[#5030E5] hover:bg-[#4020D5]">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Créer la tâche
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
