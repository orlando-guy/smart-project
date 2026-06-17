import React from 'react';
import { Comment } from '../../domain/entities/Comment';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { obtainInitials } from '@/lib/utils';

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <div className="flex gap-3 mb-4">
      <Avatar size="sm">
        <AvatarFallback className="bg-slate-100 text-[10px] font-bold">
          {obtainInitials(comment.author.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 bg-slate-50 p-3 rounded-lg border">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-bold text-[#0D062D]">{comment.author.name}</span>
          <span className="text-[10px] text-muted-foreground">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">{comment.description}</p>
      </div>
    </div>
  );
};
