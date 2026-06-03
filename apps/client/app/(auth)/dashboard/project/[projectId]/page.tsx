import ProjectPresentationDetailView from "@/features/dashboard-project/presentation/pages/project-presentation-detail-view";

type SingleProjectPageSearchParams = {
    params: Promise<{projectId: string}>
};


export default async function SingleProjectPage(
    { params }: Readonly<SingleProjectPageSearchParams>)
{
    const { projectId } = await params;

    return <ProjectPresentationDetailView projectId={projectId} />
}