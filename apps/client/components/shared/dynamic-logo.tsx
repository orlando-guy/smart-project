import Image from 'next/image'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';

const DynamicLogo = ({
  brandName
}: Readonly<{
  brandName?: string
}>) => {
  brandName ??= "Smart Project "
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="h-12 px-1 text-[#0D062D] hover:bg-transparent data-[state=open]:bg-transparent"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
            <Image src="/logo-icon.svg" alt="Logo" width={40} height={40} />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate text-base font-bold">{brandName}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default DynamicLogo
