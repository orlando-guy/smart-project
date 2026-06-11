import React from 'react';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '../../application/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BellOff } from 'lucide-react';
import Link from 'next/link';

interface NotificationListProps {
  limit?: number;
  showFooter?: boolean;
}

export const NotificationList: React.FC<NotificationListProps> = ({ limit, showFooter = true }) => {
  const { data: notifications, isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const displayedNotifications = limit ? notifications?.slice(0, limit) : notifications;
  const unreadCount = notifications?.filter(n => !n.isRead).length ?? 0;

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[500px]">
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <h3 className="font-semibold text-sm">Notifications</h3>
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-[11px] h-7 px-2 hover:bg-accent"
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending}
          >
            Tout marquer comme lu
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {displayedNotifications && displayedNotifications.length > 0 ? (
          <div className="flex flex-col">
            {displayedNotifications.map((notification) => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onMarkAsRead={(id) => markAsRead.mutate(id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <BellOff className="h-8 w-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm font-medium text-muted-foreground">Aucune notification</p>
          </div>
        )}
      </div>

      {showFooter && displayedNotifications && displayedNotifications.length > 0 && (
        <div className="p-2 border-t mt-auto text-center bg-background">
            <Link href="/dashboard/notifications" className="text-xs text-muted-foreground hover:text-foreground hover:underline">
                Voir toutes les notifications
            </Link>
        </div>
      )}
    </div>
  );
};
