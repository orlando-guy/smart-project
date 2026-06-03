import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React from 'react'

const ProjectTableSkeleton = () => {
    return (
        <Table>
            <TableHeader className='bg-accent'>
                <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead className="w-25">Clé</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead className="text-right">Créer le</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 5 }, (_, i) => i).map((item) => (
                    <TableRow key={item}>
                        <TableCell>
                            <div className='flex gap-4 items-center w-full'>
                                <div className="h-8 w-8 aspect-video rounded-full bg-muted/50" />
                                <div className="h-7 flex-1 aspect-video rounded-xl bg-muted/50" />
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="h-7 w-full aspect-video rounded-xl bg-muted/50" />
                        </TableCell>
                        <TableCell>
                            <div className="h-7 w-full aspect-video rounded-xl bg-muted/50" />
                        </TableCell>
                        <TableCell>
                            <div className="h-7 w-full aspect-video rounded-xl bg-muted/50" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default ProjectTableSkeleton