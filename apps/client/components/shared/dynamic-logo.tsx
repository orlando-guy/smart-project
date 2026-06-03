import Image from 'next/image'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';

const DynamicLogo = ({
  brandName
}: Readonly<{
  brandName?: string
}>) => {
  brandName ??= "Smart Project"
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-transparent text-sidebar-primary-foreground">
            <Image src="/logo-icon.svg" alt="Logo" width={40} height={40} />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{brandName}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default DynamicLogo