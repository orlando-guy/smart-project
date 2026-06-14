"use client"

import React, { useState } from 'react'
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
import { useUsers } from '@/features/user-management/application/hooks/useUsers'

import { Search, UserPlus, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { obtainInitials } from '@/lib/utils'
import { useAddMemberToProject } from '@/features/dashboard-project/application/mutations/useAddMemberToProject'

interface InviteMemberModalProps {
  projectId: string
  isOpen: boolean
  onClose: () => void
  existingMemberIds: string[]
}

export const InviteMemberModal = ({
  projectId,
  isOpen,
  onClose,
  existingMemberIds
}: InviteMemberModalProps) => {
  const { data: users, isLoading: isLoadingUsers } = useUsers()
  const { mutate: addMember, isPending: isInviting } = useAddMemberToProject()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = users?.filter(user => 
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    !existingMemberIds.includes(user.id)
  )

  const handleInvite = (userId: string) => {
    addMember({ projectId, memberId: userId }, {
      onSuccess: () => {
        // Optionnel: on peut garder la modal ouverte pour inviter plusieurs personnes
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Inviter un membre</DialogTitle>
          <DialogDescription>
            Recherchez et ajoutez des collaborateurs à votre projet.
          </DialogDescription>
        </DialogHeader>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Nom ou email..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div
          className="mt-4 max-h-72 overflow-y-scroll pr-2 space-y-2"
          style={{
            maxHeight: 300,
            overflowY: "scroll"
          }}
        >
          {isLoadingUsers ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#5030E5]" />
            </div>
          ) : filteredUsers?.length === 0 ? (
            <p className="text-center py-8 text-sm text-muted-foreground">
              Aucun utilisateur trouvé
            </p>
          ) : (
            filteredUsers?.map((user) => (
              <div 
                key={user.id} 
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    <AvatarFallback className="bg-[#5030E5]/10 text-[#5030E5] text-[10px]">
                      {obtainInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-[11px] text-muted-foreground">{user.email}</span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="h-8 w-8 p-0 text-[#5030E5] hover:bg-[#5030E5]/10"
                  onClick={() => handleInvite(user.id)}
                  disabled={isInviting}
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="secondary" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
