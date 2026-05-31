import React from "react"
import ProjectPresentationView from "@/features/dashboard-project/presentation/pages/project-presentation-view"

export default function DashboardPage() {
    return (
        <React.Fragment>
            <ProjectPresentationView />
            {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="aspect-video rounded-xl bg-muted/50" />
                        <div className="aspect-video rounded-xl bg-muted/50" />
                        <div className="aspect-video rounded-xl bg-muted/50" />
                    </div>
                    <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
                </div> */}

        </React.Fragment>
    )
}