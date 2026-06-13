'use client'

import DashboardHeader from "@/components/navigation/dashboard-header";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";
import { useNotificationSocket } from "@/features/notifications/application/hooks/useNotificationSocket";

export default function DashboardLayout({children}: Readonly<{
    children: React.ReactNode
}>) {
    // Initialise l'écouteur de notifications en temps réel
    useNotificationSocket();

    return (
        <main className="w-screen min-h-screen overflow-x-hidden">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <DashboardHeader />
                    {children}
                    <Toaster position="top-right" />
                </SidebarInset>
            </SidebarProvider>
        </main>
    )
}