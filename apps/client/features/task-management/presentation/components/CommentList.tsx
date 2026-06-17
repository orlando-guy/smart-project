import React from 'react';
import { useComments } from '../../application/hooks/useComments';
import { CommentItem } from './CommentItem';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CommentListProps {
  taskId: string;
}

export const CommentList = ({ taskId }: CommentListProps) => {
  const [page, setPage] = React.useState(1);
  const { data, isLoading } = useComments(taskId, { limit: 10, p: page, ord: 'desc' });

  if (isLoading) return <Loader2 className="w-6 h-6 animate-spin text-[#5030E5] mx-auto" />;
  if (!data?.data.length) return <p className="text-xs text-muted-foreground text-center py-4">Aucun commentaire pour le moment.</p>;

  return (
    <div className="space-y-4">
      {data.data.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
      
      {data.meta.totalPages > page && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-xs" 
          onClick={() => setPage(p => p + 1)}
        >
          Voir plus
        </Button>
      )}
    </div>
  );
};
