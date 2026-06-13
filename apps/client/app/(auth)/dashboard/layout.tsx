import DashboardHeader from "@/components/navigation/dashboard-header";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ProjectCreateModalHost } from "@/features/dashboard-project/presentation/components/modals/project-create-modal-host";
import { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default function DashboardLayout({children}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <main className="min-h-screen overflow-x-hidden bg-[#ECECF0] px-3 py-3 md:px-6 md:py-4">
            <SidebarProvider>
                <div className="flex min-h-[calc(100vh-1.5rem)] w-full overflow-hidden rounded-[22px] bg-white shadow-[0_20px_60px_rgba(15,13,43,0.14)] md:min-h-[calc(100vh-2rem)]">
                    <AppSidebar />
                    <SidebarInset className="min-w-0 flex-1 bg-white">
                    <DashboardHeader />
                    {children}
                    <ProjectCreateModalHost />
                    <Toaster />
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </main>
    )
}
