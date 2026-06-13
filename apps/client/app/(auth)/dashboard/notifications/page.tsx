import { NotificationList } from "@/features/notifications/presentation/components/NotificationList";

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-4xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Toutes les notifications</h1>
        <p className="text-muted-foreground mt-2">
          Gérez et consultez l&apos;historique de vos notifications.
        </p>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <NotificationList showFooter={false} />
      </div>
    </div>
  );
}
