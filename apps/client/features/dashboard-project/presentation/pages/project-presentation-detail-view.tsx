"use client"

import React from 'react'
import { useSingleProject } from '../../application/hooks/useSingleProject'
import { FilterIcon, Link2Icon, PencilIcon, PlusIcon } from 'lucide-react'
import { GenericDropdown } from '@/components/dropdown/generic-dropdown'
import { Button } from '@/components/ui/button'

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

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (error) {
    console.error(error.message)
    return <p>{error.message}</p>
  }

  return (
    <div className='container px-4 md:px-6'>
      <div className='flex items-center justify-between'>
        <div className='relative flex flex-col gap-7'>
          {/* Title + cta - Filtres */}
          <div className='flex items-center gap-5'>
            <h1 className="font-semibold text-2xl md:text-3xl text-[#0D062D] w-full md:w-75">
              {results?.titre}
            </h1>
            <div className='flex gap-3.5 items-center'>
              <span className='w-7.5 h-7.5 bg-[#5030E5]/20 flex items-center justify-center rounded-md'>
                <PencilIcon className='w-3.5 h-3.5 text-[#5030E5]' />
              </span>
              <span className='w-7.5 h-7.5 bg-[#5030E5]/20 flex items-center justify-center rounded-md'>
                <Link2Icon className='w-3.5 h-3.5 text-[#5030E5]' />
              </span>
            </div>
          </div>

          <GenericDropdown
            triggerLabel='Filtre'
            triggerClassName='w-fit text-[#787486] text-base px-6 py-2.5 cursor-pointer'
            triggerLeftIcon={<FilterIcon className="w-4 h-4" />}
          >
            <GenericDropdown.Group>
              <GenericDropdown.Item>Date de création</GenericDropdown.Item>
              <GenericDropdown.Item>Haute priorité</GenericDropdown.Item>
              <GenericDropdown.Item>Priorité Moyenne</GenericDropdown.Item>
            </GenericDropdown.Group>
          </GenericDropdown>
        </div>
        <div className='ml-auto'>
          {/* Team - Mode vue */}
          <div className='flex items-center gap-3'>
            {/* Team + Invite button */}
              <Button
                variant="link"
                className='cursor-pointer'
                onClick={() => alert('add a new member')} // TODO: Should trigger a modal form to add a new member to the current project
              >
                <span className='flex items-center gap-2'>
                  <div className='px-[7.5px] py-[4.5px] bg-[#5030E5]/20 rounded-sm'>
                    <PlusIcon color='#5030E5' />
                  </div>
                  <span className='text-[#5030E5] text-base font-medium'>Invite</span>
                </span>
              </Button>
            <div>
              {/* Avatars */}
              {/* TODO: List the a least 4 team's member avatar and should be clickable. On click display a modal of all team's members */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectPresentationDetailView