"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useProjectMembers } from '@/features/dashboard-project/application/hooks/useProjectMembers'
import { useCreateTask } from '../../../application/hooks/useCreateTask'
import { Loader2 } from 'lucide-react'

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TaskInput>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: "",
      description: "",
      projectId,
      statut: TaskStatus.NOT_STARTED,
      priority: ProjectPriority.COULD,
      assignedUserId: ""
    }
  })

  const onSubmit = (data: TaskInput) => {
    console.log("Creating task with data:", data)
    createTask(data, {
      onSuccess: () => {
        reset()
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre de la tâche</Label>
            <Input 
              id="title" 
              placeholder="Ex: Finaliser le design de l'API" 
              {...register('title')} 
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optionnel)</Label>
            <Textarea 
              id="description" 
              placeholder="Détails de la tâche..." 
              className="resize-none"
              {...register('description')} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priorité */}
            <div className="space-y-2">
              <Label htmlFor="priority">Priorité</Label>
              <select 
                id="priority"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register('priority')}
              >
                <option value={ProjectPriority.MUST}>MUST (Critique)</option>
                <option value={ProjectPriority.SHOULD}>SHOULD (Important)</option>
                <option value={ProjectPriority.COULD}>COULD (Souhaitable)</option>
                <option value={ProjectPriority.WONT}>WONT (Plus tard)</option>
              </select>
            </div>

            {/* Date d'échéance */}
            <div className="space-y-2">
              <Label htmlFor="endDate">Date d&apos;échéance</Label>
              <Input 
                id="endDate" 
                type="date" 
                {...register('endDate')} 
              />
            </div>
          </div>

          {/* Assignation */}
          <div className="space-y-2">
            <Label htmlFor="assignedUserId">Assigner à</Label>
            <select 
              id="assignedUserId"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register('assignedUserId')}
            >
              <option value="">Choisir un membre...</option>
              {members?.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
            {errors.assignedUserId && <p className="text-xs text-red-500">{errors.assignedUserId.message}</p>}
            {isLoadingMembers && <p className="text-[10px] text-slate-400 animate-pulse">Chargement des membres...</p>}
          </div>

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
