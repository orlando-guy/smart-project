import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function obtainInitials(fullName: string) {
    // Supprime les espaces inutiles au début et à la fin, puis sépare par les espaces
    const words = fullName.trim().split(/\s+/);
    
    // Cas 1 : Le nom contient au moins 2 mots
    if (words.length >= 2) {
        const firstLetter = words[0].charAt(0).toUpperCase();
        const secondLetter = words[1].charAt(0).toUpperCase();
        return firstLetter + secondLetter;
    }
    
    // Cas 2 : Un seul mot (ou chaîne vide)
    const uniqueWord = words[0];
    
    if (uniqueWord.length >= 2) {
        // Retourne les 2 premières lettres (ex: Donald -> Do)
        return uniqueWord.charAt(0).toUpperCase() + uniqueWord.charAt(1).toLowerCase();
    } else {
        // Sécurité si le mot ne fait qu'une seule lettre
        return uniqueWord.toUpperCase();
    }
}