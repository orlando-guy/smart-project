import { 
  LayoutDashboard, 
  ShieldCheck, 
  MessageSquare,
  CheckCircle2,
  Zap,
  Users
} from "lucide-react";
import React from "react";

export const NAV_LINKS = [
  { href: "#features", label: "Fonctionnalités", icon: LayoutDashboard },
  { href: "#before-after", label: "Notre approche", icon: ShieldCheck },
  { href: "#", label: "Communauté", icon: MessageSquare },
];

export const FEATURES_DATA = [
  {
    title: "Suivi des Tâches",
    desc: "Assignez des priorités (MUST, SHOULD, COULD) et suivez l'avancement avec précision.",
    icon: React.createElement(CheckCircle2, { className: "h-6 w-6" }),
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Notifications Live",
    desc: "Restez informé dès qu'une tâche vous est assignée ou qu'un statut change. Pas de refresh nécessaire.",
    icon: React.createElement(Zap, { className: "h-6 w-6" }),
    color: "bg-[#5030E5]/5 text-[#5030E5]"
  },
  {
    title: "Espace Collaboratif",
    desc: "Invitez des membres, retirez-les, gérez les rôles. Votre équipe est sous contrôle.",
    icon: React.createElement(Users, { className: "h-6 w-6" }),
    color: "bg-green-50 text-green-600"
  }
];

export const BEFORE_AFTER_CARDS = [
  { icon: LayoutDashboard, color: "text-blue-500", title: "Visibilité", desc: "Un dashboard clair pour votre progression.", offset: "mt-6 sm:mt-8" },
  { icon: MessageSquare, color: "text-purple-500", title: "Temps Réel", desc: "WebSockets pour des alertes instantanées.", offset: "-mt-6 sm:-mt-8" },
  { icon: ShieldCheck, color: "text-green-500", title: "Sécurité", desc: "Vos données sont protégées et isolées.", offset: "" },
];
