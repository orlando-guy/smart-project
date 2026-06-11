import React from 'react';
import { Notification } from '../../domain/entities/Notification';
import { Bell, CheckCircle2, UserPlus, FilePlus2, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'TASK_ASSIGNED':
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case 'PROJECT_INVITATION':
        return <UserPlus className="h-4 w-4 text-green-500" />;
      case 'PROJECT_CREATED':
        return <FilePlus2 className="h-4 w-4 text-purple-500" />;
      case 'TASK_STATUS_CHANGED':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div 
      className={`flex items-start gap-3 p-3 transition-colors hover:bg-accent cursor-pointer ${!notification.isRead ? 'bg-accent/30' : ''}`}
      onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
    >
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background border border-border">
        {getIcon()}
      </div>
      <div className="flex-1 space-y-1">
        <p className={`text-sm ${!notification.isRead ? 'font-semibold' : 'font-normal'}`}>
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(notification.createdAt, { addSuffix: true, locale: fr })}
        </p>
      </div>
      {!notification.isRead && (
        <div className="mt-2 h-2 w-2 rounded-full bg-blue-600" />
      )}
    </div>
  );
};
