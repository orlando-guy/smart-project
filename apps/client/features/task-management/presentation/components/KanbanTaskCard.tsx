import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Task } from '../../domain/entities/Task'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { obtainInitials } from '@/lib/utils'
import { CalendarDays } from 'lucide-react'

interface KanbanTaskCardProps {
  task: Task
}

const priorityColorMap = {
  MUST: 'text-[#D8727D] bg-[#D8727D]/20',
  SHOULD: 'text-[#68B266] bg-[#68B266]/20',
  COULD: 'text-[#D58D49] bg-[#D58D49]/20',
  WONT: 'text-slate-500 bg-slate-50',
}

export const KanbanTaskCard = ({ task }: KanbanTaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: task
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1,
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-secondary h-25 min-h-25 rounded-xl border-2 border-primary border-dashed"
      />
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow border-none bg-white rounded-2xl p-5"
    >
      <CardContent className="flex flex-col gap-4">
        {/* Priority Badge */}
        <div className={`w-fit px-2 py-1 rounded-md text-[10px] font-bold ${priorityColorMap[task.priority]}`}>
          {task.priority}
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-[#0D062D] line-clamp-2">
          {task.title}
        </h4>

        {/* Description preview */}
        {task.description && (
          <p className="text-xs text-[#787486] line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-4 text-[#787486]">
            {task.endDate && (
              <div className="flex items-center gap-1.5 text-[10px] font-medium">
                <CalendarDays className="w-3.5 h-3.5" />
                {new Date(task.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
              </div>
            )}
          </div>

          {task.assignedUser && (
            <Avatar size="default" className="border border-white">
              <AvatarFallback className="bg-slate-100 text-[10px] font-bold">
                {obtainInitials(task.assignedUser.name)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
