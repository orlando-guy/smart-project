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
        <main className="w-screen min-h-screen overflow-x-hidden">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <DashboardHeader />
                    {children}
                    <ProjectCreateModalHost />
                    <Toaster />
                </SidebarInset>
            </SidebarProvider>
        </main>
    )
}
