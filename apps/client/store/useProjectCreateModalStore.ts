import { create } from "zustand"

type ProjectCreateModalState = {
    isOpen: boolean
    open: () => void
    close: () => void
    setOpen: (open: boolean) => void
}

export const useProjectCreateModalStore = create<ProjectCreateModalState>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    setOpen: (open) => set({ isOpen: open }),
}))
