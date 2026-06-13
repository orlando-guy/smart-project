import React from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount
} from '@/components/ui/avatar';
import { obtainInitials } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Member {
  id: string;
  name: string;
  email: string;
}

interface TeamAvatarGroupProps {
  members: Member[];
  max?: number;
}

export const TeamAvatarGroup = ({ members, max = 4 }: TeamAvatarGroupProps) => {
  const displayMembers = members.slice(0, max);
  const remainingCount = members.length - max;

  return (
    <TooltipProvider>
      <AvatarGroup>
        {displayMembers.map((member) => (
          <Tooltip key={member.id}>
            <TooltipTrigger asChild>
              <Avatar className="cursor-pointer border-2 border-background h-10 w-10">
                {/* TODO: Add AvatarImage when image support is ready */}
                {/* <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.name}`} /> */}
                <AvatarFallback
                  className="bg-[#7F4D2E]/10 text-[#FFF] font-semibold text-xs"
                  style={{
                    backgroundColor: "color-mix(in oklab, #7F4D2E 90%, transparent)",
                    color: "#fff"
                  }}
                >
                  {obtainInitials(member.name)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{member.name}</p>
              <p className="text-[10px] text-muted-foreground">{member.email}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        {remainingCount > 0 && (
          <AvatarGroupCount
            className="cursor-pointer w-10 h-10"
            style={{
              backgroundColor: "#F4D7DA",
              color: "#D25B68"
            }}
          >
            +{remainingCount}
          </AvatarGroupCount>
        )}
      </AvatarGroup>
    </TooltipProvider>
  );
};
