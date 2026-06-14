import React, { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import { AddTaskModal } from './modals/AddTaskModal'

interface KanbanColumnProps {
  id: string
  title: string
  dividerColor: string
  taskCount: number
  projectId: string
  children?: React.ReactNode
}

export const KanbanColumn = ({
  id,
  title,
  dividerColor,
  taskCount,
  projectId,
  children
}: KanbanColumnProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  })

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "flex flex-1 flex-col w-87.5 min-h-125 bg-[#F5F5F5] rounded-t-[16px] py-5.25 px-5 transition-colors duration-200",
        isOver && "bg-slate-200"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5.5">
        <div className="flex items-center gap-2">
            <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: dividerColor }}
            />
            <h3 className="text-base font-bold text-[#0D062D] capitalize">
                {title}
            </h3>
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#E0E0E0] text-[#625F6D] text-[12px] font-medium">
                {taskCount}
            </span>
        </div>
        {id === "NOT_STARTED" && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-1 hover:bg-[#5030E5]/10 rounded-md transition-colors text-[#5030E5] cursor-pointer"
            aria-label={`Add task to ${title}`}
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Divider */}
      <div 
        className="w-full h-0.75 mb-7" 
        style={{ backgroundColor: dividerColor }} 
      />

      {/* Content / Drop Zone */}
      <div className="flex-1 flex flex-col gap-5 mt-4">
        {children}
        {/* Placeholder if empty */}
        {React.Children.count(children) === 0 && !isOver && (
            <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm italic">
                Aucune tâche
            </div>
        )}
      </div>

      {id === "NOT_STARTED" && (
        <AddTaskModal 
          projectId={projectId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}
