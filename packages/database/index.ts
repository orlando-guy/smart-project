import { prisma } from "./lib/config"; 

declare global {
    var prismaOrm: typeof prisma | undefined;
}

// Évite de créer de multiples instances de Prisma en mode développement
export const getPrisma = () => {
    globalThis.prismaOrm ??= prisma;
    return globalThis.prismaOrm;
}

export type * from "./generated/prisma/client";