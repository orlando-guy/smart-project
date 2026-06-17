"use client"

import { useSingleProject } from '../../application/hooks/useSingleProject'
import { CheckIcon, FilterIcon, Link2Icon, PencilIcon, PlusIcon, XIcon } from 'lucide-react'
import { GenericDropdown } from '@/components/dropdown/generic-dropdown'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEditProject } from '../../application/hooks/useEditProject'
import { Loader } from '@/components/shared/loader'
import { CopyButton } from '@/components/shared/copy-button'
import { useProjectMembers } from '../../application/hooks/useProjectMembers'
import { TeamAvatarGroup } from '../components/TeamAvatarGroup'
import { InviteMemberModal } from '../components/modals/InviteMemberModal'
import { useState } from 'react'
import { KanbanBoard } from '@/features/task-management/presentation/components/KanbanBoard'
import { ErrorDisplay } from '@/components/shared/error-display'

interface ProjectPresentationDetailViewProps {
  projectId: string
}

const ProjectPresentationDetailView = ({
  projectId
}: Readonly<ProjectPresentationDetailViewProps>) => {
  const {
    results,
    isLoading,
    error
  } = useSingleProject(projectId)

  const { data: members, isLoading: isLoadingMembers } = useProjectMembers(projectId)

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    const {
    tempTitle,
    isEditing,
    isUpdatePending,
    setTempTitle,
    handleKeyDown,
    handleSaveEdit,
    handleStartEdit,
    handleCancelEdit
  } = useEditProject({
    projectId,
    currentTitle: results?.titre,
    currentDescription: results?.description ?? ""
  })

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-100">
        <Loader size="lg" label="Chargement du projet..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-100 px-4">
        <ErrorDisplay 
          message={error.message} 
          onRetry={() => globalThis.window.location.reload()} 
        />
      </div>
    )
  }

  return (
    <div className='container px-4 md:px-6'>
      <div className='flex flex-col gap-6 md:gap-0 md:flex-row md:items-center md:justify-between mb-10'>
        <div className='relative flex flex-col gap-7'>
          {/* Title + cta - Filtres */}
          <div className='flex flex-col md:flex-row md:items-center gap-5'>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="font-semibold text-lg md:text-xl text-[#0D062D] h-auto py-1 px-2 w-full md:w-75 border-[#5030E5] focus-visible:ring-[#5030E5]/20"
                  autoFocus
                />
                <button 
                  onClick={handleSaveEdit}
                  disabled={isUpdatePending}
                  className="p-2 bg-gray-500/10 text-gray-600 rounded hover:bg-gray-500/20 transition-colors"
                >
                  <CheckIcon className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleCancelEdit}
                  className="p-2 bg-red-500/10 text-red-600 rounded hover:bg-red-500/20 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <h1 className="font-semibold text-2xl md:text-3xl text-[#0D062D] w-full md:w-75">
                  {results?.titre}
                </h1>
                <div className='flex gap-3.5 items-center'>
                  <button 
                    onClick={handleStartEdit}
                    className='w-7.5 h-7.5 bg-[#5030E5]/20 flex items-center justify-center rounded-md cursor-pointer hover:bg-[#5030E5]/30 transition-colors'
                  >
                    <PencilIcon className='w-3.5 h-3.5 text-[#5030E5]' />
                  </button>
                  <CopyButton 
                    textToCopy={globalThis.window === undefined ? '' : globalThis.window.location.href }
                    defaultIcon={<Link2Icon className='w-3.5 h-3.5 text-[#5030E5]' />}
                    className='w-7.5 h-7.5 bg-[#5030E5]/20 flex items-center justify-center rounded-md cursor-pointer hover:bg-[#5030E5]/30 transition-colors'
                    label="Copier le lien"
                  />
                </div>
              </>
            )}
          </div>

          <GenericDropdown
            triggerLabel='Filtre'
            triggerClassName='w-[80dvw] md:w-fit text-[#787486] text-base px-6 py-2.5 cursor-pointer'
            triggerLeftIcon={<FilterIcon className="w-4 h-4" />}
          >
            <GenericDropdown.Group>
              <GenericDropdown.Item>Date de création</GenericDropdown.Item>
              <GenericDropdown.Item>Haute priorité</GenericDropdown.Item>
              <GenericDropdown.Item>Priorité Moyenne</GenericDropdown.Item>
            </GenericDropdown.Group>
          </GenericDropdown>
        </div>
        <div className='md:ml-auto'>
          {/* Team - Mode vue */}
          <div className='flex items-center justify-between gap-3'>
            {/* Team + Invite button */}
              <Button
                variant="link"
                className='cursor-pointer'
                onClick={() => setIsInviteModalOpen(true)}
              >
                <span className='flex items-center gap-2'>
                  <div className='px-[7.5px] py-[4.5px] bg-[#5030E5]/20 rounded-sm'>
                    <PlusIcon color='#5030E5' />
                  </div>
                  <span className='text-[#5030E5] text-base font-medium'>Invite</span>
                </span>
              </Button>
            <div>
              {isLoadingMembers ? (
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full bg-slate-100 animate-pulse border-2 border-background" />
                  ))}
                </div>
              ) : (
                <TeamAvatarGroup members={members ?? []} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='w-full min-w-0 overflow-hidden'>
        <KanbanBoard projectId={projectId} />
      </div>

      <InviteMemberModal 
        projectId={projectId}
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        existingMemberIds={members?.map(m => m.id) ?? []}
      />
    </div>
  )
}

export default ProjectPresentationDetailView