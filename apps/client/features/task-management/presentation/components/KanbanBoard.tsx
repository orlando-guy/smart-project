import { KanbanColumn } from './KanbanColumn'
import { KanbanTaskCard } from './KanbanTaskCard'
import { useProjectTasks, useUpdateTaskStatus } from '../../application/hooks/useProjectTasks'
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import { Loader } from '@/components/shared/loader'

interface KanbanBoardProps {
  projectId: string
}

const COLUMNS = [
  { id: 'NOT_STARTED', title: 'À faire', color: '#5030E5' },
  { id: 'ONGOING', title: 'En cours', color: '#FFA500' },
  { id: 'ACHIEVED', title: 'Terminé', color: '#8BC48A' },
]

export const KanbanBoard = ({
  projectId
}: KanbanBoardProps) => {
  const { data: tasks, isLoading } = useProjectTasks(projectId)
  const { mutate: updateStatus } = useUpdateTaskStatus()

  // Configuration des capteurs pour le DND (évite les conflits avec le clic sur bouton)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Délai de 8px avant de commencer le drag
      },
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as string
    const currentTask = tasks?.find(t => t.id === taskId)

    if (currentTask && currentTask.statut !== newStatus) {
      updateStatus({ taskId, status: newStatus })
    }
  }

  if (isLoading) {
    return (
      <div className="w-full h-100 flex items-center justify-center">
        <Loader size="lg" label="Chargement du tableau..." />
      </div>
    )
  }

  return (
    <div className="w-full mt-10 overflow-x-auto pb-10">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex gap-3.5 min-w-max">
          {COLUMNS.map((column) => {
            const columnTasks = tasks?.filter((t) => t.statut === column.id) ?? []
            
            return (
              <KanbanColumn 
                key={column.id}
                id={column.id}
                title={column.title}
                dividerColor={column.color}
                taskCount={columnTasks.length}
                projectId={projectId}
              >
                {columnTasks.map((task) => (
                  <KanbanTaskCard key={task.id} task={task} />
                ))}
              </KanbanColumn>
            )
          })}
        </div>
      </DndContext>
    </div>
  )
}
