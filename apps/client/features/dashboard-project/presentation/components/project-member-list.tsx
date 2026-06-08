import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProjectMember } from "../../domain/entities/Project";

function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");
}

type ProjectMemberListProps = {
    members: ProjectMember[];
};

export function ProjectMemberList({ members }: Readonly<ProjectMemberListProps>) {
    if (members.length === 0) {
        return (
            <p className="text-sm text-[#787486]">
                Aucun membre n&apos;a encore ete ajoute a ce projet.
            </p>
        );
    }

    return (
        <div className="flex flex-wrap gap-3">
            {members.map(({ user }) => (
                <div
                    key={user.id}
                    className="flex items-center gap-3 rounded-lg border border-[#ECECF2] bg-white px-3 py-2"
                >
                    <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-[#5030E5]/10 text-[#5030E5]">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#0D062D]">{user.name}</p>
                        <p className="truncate text-xs text-[#787486]">{user.email}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
