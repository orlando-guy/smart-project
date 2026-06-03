import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu as Root,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// 1. Main Wrapper Component
interface GenericDropdownProps {
  children: React.ReactNode
  triggerLabel?: string
  triggerVariant?: "default" | "outline" | "secondary" | "ghost"
  triggerClassName?: string
  triggerLeftIcon?: React.ReactNode
}

export function GenericDropdown({ 
  children, 
  triggerLabel = "Open", 
  triggerVariant = "outline" ,
  triggerClassName = undefined,
  triggerLeftIcon
}: Readonly<GenericDropdownProps>) {
  return (
    <Root>
      <DropdownMenuTrigger asChild>
        <Button
            variant={triggerVariant}
            className={`${triggerLeftIcon ? 'flex items-center gap-1.5' : undefined} ${triggerClassName}`}
        >
            {triggerLeftIcon ?? undefined}
            {triggerLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {children}
      </DropdownMenuContent>
    </Root>
  )
}

// 2. Expose sub-components for compound composition
GenericDropdown.Group = DropdownMenuGroup
GenericDropdown.Label = DropdownMenuLabel
GenericDropdown.Item = DropdownMenuItem
GenericDropdown.Separator = DropdownMenuSeparator
