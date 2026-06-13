import { useCallback, useState } from "react";
import { useUpdateProject } from "../mutations/useUpdateProject";

interface UseEditProjectParams {
    currentTitle?: string;
    currentDescription: string;
    projectId: string;
}

export function useEditProject({
    currentTitle,
    currentDescription,
    projectId
}: UseEditProjectParams) {
    const updateProjectMutation = useUpdateProject();

    const [isEditing, setIsEditing] = useState(false);
    const [tempTitle, setTempTitle] = useState(currentTitle ?? "");

    const handleStartEdit = useCallback(() => {
        setIsEditing(true);
    }, [])

    const handleCancelEdit = useCallback(() => {
        setIsEditing(false);
        setTempTitle(currentTitle ?? "");
    }, [currentTitle]);

    const handleSaveEdit = useCallback(async () => {
        if (!tempTitle?.trim() || tempTitle === currentTitle) {
            setIsEditing(false);
            return;
        }

        await updateProjectMutation.mutate({
            id: projectId,
            payload: {
                title: tempTitle,
                description: currentDescription
            }
        });

        setIsEditing(false);
    }, [tempTitle, currentTitle, currentDescription, projectId, updateProjectMutation]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSaveEdit();
        if (e.key === "Escape") handleCancelEdit(); 
    };

    return {
        isEditing,
        tempTitle,
        setTempTitle,
        handleKeyDown,
        handleSaveEdit,
        handleStartEdit,
        handleCancelEdit,
        isUpdatePending: updateProjectMutation.isPending
    }
}