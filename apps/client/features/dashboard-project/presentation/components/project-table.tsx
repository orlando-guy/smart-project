import React, { useState } from 'react'
import { Project } from '../../domain/entities/Project';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, Folder, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { DeleteProjectModal } from './modals/delete-project-modal';

const ProjectTable = ({ projects }: Readonly<{ projects: Project[] | [] }>) => {
    const router = useRouter();
    const [projectToDelete, setProjectToDelete] = useState<{ id: string; titre: string } | null>(null);

    if (projects.length === 0) return null;

    return (
        <React.Fragment>
            <Table>
                <TableCaption>La liste de vos récents projets</TableCaption>
                <TableHeader className='bg-accent'>
                    <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead className="w-25">Clé</TableHead>
                        <TableHead>Responsable</TableHead>
                        <TableHead>Créer le</TableHead>
                        <TableHead className="w-10 text-right"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projects.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.titre}</TableCell>
                            <TableCell>{item.id.substring(0, 2)}</TableCell>
                            <TableCell>{item.lead?.name}</TableCell>
                            <TableCell>{(new Date(item.createdAt).toDateString())}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0 cursor-pointer">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 rounded-lg">
                                        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/dashboard/project/${item.id}`)}>
                                            <Folder className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <span>Voir le detail du projet</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem 
                                            className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10" 
                                            onClick={() => setProjectToDelete({ id: item.id, titre: item.titre })}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            <span>Supprimer le projet</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <DeleteProjectModal
                open={projectToDelete !== null}
                onOpenChange={(open) => {
                    if (!open) setProjectToDelete(null);
                }}
                projectId={projectToDelete?.id ?? ""}
                projectName={projectToDelete?.titre ?? ""}
            />
        </React.Fragment>
    )
}

export default React.memo(ProjectTable)
