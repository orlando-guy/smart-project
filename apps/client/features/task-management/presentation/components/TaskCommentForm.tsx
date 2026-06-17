"use client"

import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateCommentSchema, CreateCommentInput } from '@repo/shared'
import { Button } from '@/components/ui/button'
import { Field, FieldError } from '@/components/ui/field'
import { InputGroup, InputGroupTextarea, InputGroupAddon, InputGroupText } from '@/components/ui/input-group'
import { Loader2, Send } from 'lucide-react'
import { useCreateComment } from '../../application/hooks/useCreateComment'

interface TaskCommentFormProps {
  taskId: string
}

export const TaskCommentForm = ({ taskId }: TaskCommentFormProps) => {
  const { mutate: createComment, isPending } = useCreateComment(taskId)

  const form = useForm<CreateCommentInput>({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: {
      description: ""
    }
  })

  const onSubmit = (data: CreateCommentInput) => {
    createComment(data, {
      onSuccess: () => {
        form.reset()
      }
    })
  }

  return (
    <div className="space-y-2">
      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <InputGroup className="has-[[data-slot=input-group-control]:focus-visible]:ring-[#5030E5]/30">
              <InputGroupTextarea
                {...field}
                value={field.value ?? ""}
                placeholder="Écrire un commentaire..."
                rows={2}
                className="min-h-16 resize-none"
                aria-invalid={fieldState.invalid}
              />
              <InputGroupAddon align="block-end">
                <Button 
                    type="button" 
                    size="sm" 
                    className="bg-[#5030E5] hover:bg-[#4020D5]" 
                    disabled={isPending || !form.formState.isValid}
                    onClick={form.handleSubmit(onSubmit)}
                >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </InputGroupAddon>
            </InputGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  )
}
