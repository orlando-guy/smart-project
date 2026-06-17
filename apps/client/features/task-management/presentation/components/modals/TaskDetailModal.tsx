"use client"

import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  UpdateTaskSchema, 
  UpdateTaskInput, 
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
import { useUpdateTask } from '../../../application/hooks/useUpdateTask'
import { useDeleteTask } from '../../../application/hooks/useDeleteTask'
import { Loader2, Check, Trash2 } from 'lucide-react'
import { 
  Field, 
  FieldLabel, 
  FieldGroup, 
  FieldError, 
  FieldDescription 
} from '@/components/ui/field'
import { 
  InputGroup, 
  InputGroupTextarea, 
  InputGroupAddon, 
  InputGroupText 
} from '@/components/ui/input-group'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { obtainInitials, cn } from '@/lib/utils'
import { Task } from '../../../domain/entities/Task'
import { TaskCommentForm } from '../TaskCommentForm'
import { CommentList } from '../CommentList'

interface TaskDetailModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
}

export const TaskDetailModal = ({
  task,
  isOpen,
  onClose
}: TaskDetailModalProps) => {
  const { data: members, isLoading: isLoadingMembers } = useProjectMembers(task?.projectId ?? "")
  const { mutate: updateTask, isPending } = useUpdateTask(task?.projectId ?? "")
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask(task?.projectId ?? "")

  const [isConfirmingDelete, setIsConfirmingDelete] = React.useState(false)

  const form = useForm<UpdateTaskInput>({
    resolver: zodResolver(UpdateTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      statut: TaskStatus.NOT_STARTED,
      priority: ProjectPriority.COULD,
      assignedUserIds: []
    }
  })

  // Synchroniser les valeurs du formulaire quand la tâche change
  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description ?? "",
        statut: task.statut,
        priority: task.priority,
        endDate: task.endDate ? new Date(task.endDate).toISOString().split('T')[0] : null,
        assignedUserIds: task.assignedUsers.map(u => u.id)
      })
      setIsConfirmingDelete(false)
    }
  }, [task, form])

  const onSubmit = (data: UpdateTaskInput) => {
    if (!task) return
    updateTask({ id: task.id, payload: data }, {
      onSuccess: () => {
        onClose()
      }
    })
  }

  const handleDelete = () => {
    if (!task) return
    deleteTask(task.id, {
      onSuccess: () => {
        setIsConfirmingDelete(false)
        onClose()
      }
    })
  }

  const toggleMember = (memberId: string, currentIds: string[] | undefined) => {
    const ids = currentIds ?? []
    const isSelected = ids.includes(memberId)
    if (isSelected) {
      form.setValue('assignedUserIds', ids.filter(id => id !== memberId), { shouldDirty: true, shouldValidate: true })
    } else {
      form.setValue('assignedUserIds', [...ids, memberId], { shouldDirty: true, shouldValidate: true })
    }
  }

  const isDirty = form.formState.isDirty

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
             <div className={cn(
                "w-2.5 h-2.5 rounded-full",
                task?.statut === 'ACHIEVED' ? "bg-[#8BC48A]" : 
                task?.statut === 'ONGOING' ? "bg-[#FFA500]" : "bg-[#5030E5]"
             )} />
             <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {task?.statut?.replace('_', ' ')}
             </span>
          </div>
          <DialogTitle>Détails de la tâche</DialogTitle>
          <DialogDescription>
            Consultez ou modifiez les informations de cette tâche.
          </DialogDescription>
        </DialogHeader>

        <form
          id="update-task"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 py-4"
        >
          {/* Titre */}
          <Controller
            name='title'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className='space-y-2'>
                <FieldLabel htmlFor="edit-title">Titre</FieldLabel>
                <Input
                  {...field}
                  type="text"
                  id="edit-title"
                  aria-invalid={fieldState.invalid}
                  className='focus-visible:ring-[#5030E5]/30 font-semibold text-lg'
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
                  <FieldLabel htmlFor='edit-description'>
                    Description
                  </FieldLabel>
                  <InputGroup className='has-[[data-slot=input-group-control]:focus-visible]:ring-[#5030E5]/30'>
                    <InputGroupTextarea
                      {...field}
                      value={field.value ?? ""}
                      id="edit-description"
                      rows={4}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field?.value?.length ?? 0}/1000 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
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
                    <FieldLabel htmlFor="edit-priority">Priorité</FieldLabel>
                    <select
                      {...field}
                      id="edit-priority"
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
                    <FieldLabel htmlFor="edit-end-date">Échéance</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      type="date"
                      id="edit-end-date"
                      aria-invalid={fieldState.invalid}
                      className='focus-visible:ring-[#5030E5]/30'
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Statut */}
             <Controller
                name='statut'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="edit-status">Statut</FieldLabel>
                    <select
                      {...field}
                      id="edit-status"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value={TaskStatus.NOT_STARTED}>À faire</option>
                      <option value={TaskStatus.ONGOING}>En cours</option>
                      <option value={TaskStatus.ACHIEVED}>Terminé</option>
                    </select>
                  </Field>
                )}
              />

            {/* Assignation Multiple */}
            <Controller
              name='assignedUserIds'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="space-y-3">
                  <FieldLabel>Membres assignés</FieldLabel>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                    {members?.map(member => {
                      const isSelected = field.value?.includes(member.id)
                      return (
                        <div 
                          key={member.id}
                          onClick={() => toggleMember(member.id, field.value)}
                          className={cn(
                            "flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all hover:bg-slate-50",
                            isSelected ? "border-[#5030E5] bg-[#5030E5]/5" : "border-slate-200"
                          )}
                        >
                          <Avatar size="sm">
                            <AvatarFallback className="text-[10px]">
                              {obtainInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-medium truncate">{member.name}</span>
                          </div>
                          {isSelected && <Check className="ml-auto w-3.5 h-3.5 text-[#5030E5]" />}
                        </div>
                      )
                    })}
                  </div>
                  {isLoadingMembers && <p className="text-[10px] text-slate-400 animate-pulse text-center">Chargement des membres...</p>}
                </Field>
              )}
            />
          </FieldGroup>

          {/* Commentaires */}
          <div className="pt-4 border-t border-dashed">
            <h4 className="text-sm font-semibold mb-3">Commentaires</h4>
            {/* Conteneur pour la liste future */}
            <div className="mb-4">
               <CommentList taskId={task?.id ?? ""} />
            </div>
            
            {/* Formulaire de création */}
            <TaskCommentForm taskId={task?.id ?? ""} />
          </div>

          <DialogFooter>
            <div className="flex w-full items-center justify-between">
              <div>
                {isConfirmingDelete ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-red-500">Confirmer ?</span>
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm" 
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Oui"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsConfirmingDelete(false)}
                    >
                      Non
                    </Button>
                  </div>
                ) : (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => setIsConfirmingDelete(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="secondary" onClick={onClose}>
                  Fermer
                </Button>
                {isDirty && (
                  <Button type="submit" disabled={isPending} className="bg-[#5030E5] hover:bg-[#4020D5]">
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enregistrer les changements
                  </Button>
                )}
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
