'use client';

import { Task } from '@/lib/api';
import { markTaskComplete } from '@/lib/api';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface TaskCardProps {
  task: Task;
  onTaskCompleted: () => void;
  isSelected?: boolean;
  onSelectChange?: (isSelected: boolean) => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  }
}

export default function TaskCard({ 
  task, 
  onTaskCompleted, 
  isSelected = false,
  onSelectChange 
}: TaskCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    if (task.is_completed) return;

    setIsCompleting(true);
    try {
      await markTaskComplete(task.id);
      toast.success('Task completed!', {
        description: `"${task.title}" has been marked as complete.`,
      });
      onTaskCompleted();
    } catch (error) {
      toast.error('Failed to complete task', {
        description: error instanceof Error ? error.message : 'An error occurred while completing the task.',
      });
      console.error('Failed to mark task as complete:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSelect = (checked: boolean) => {
    if (onSelectChange && !task.is_completed) {
      onSelectChange(checked);
    }
  };

  return (
    <Card 
      className={`
        transition-all duration-300 hover:shadow-lg border-2
        ${task.is_completed 
          ? 'opacity-60 bg-muted/30 border-muted' 
          : isSelected
          ? 'border-primary bg-primary/5 shadow-md'
          : 'hover:border-primary/50 border-border'
        }
      `}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2 min-w-0">
            <CardTitle className={`
              flex items-start gap-3 text-lg leading-tight
              ${task.is_completed ? 'line-through text-muted-foreground' : ''}
            `}>
              {onSelectChange && !task.is_completed ? (
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={handleSelect}
                  className="mt-1 shrink-0"
                />
              ) : (
                <Checkbox
                  checked={task.is_completed}
                  onCheckedChange={handleComplete}
                  disabled={isCompleting}
                  className="mt-1 shrink-0"
                />
              )}
              <span className="flex-1 break-words">{task.title}</span>
            </CardTitle>
            {task.description && (
              <CardDescription className={`
                text-sm leading-relaxed break-words
                ${task.is_completed ? 'line-through opacity-60' : ''}
              `}>
                {task.description}
              </CardDescription>
            )}
          </div>
          <Badge 
            variant={task.is_completed ? 'secondary' : 'default'} 
            className="shrink-0 font-medium"
          >
            {task.is_completed ? 'Done' : 'Active'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 pb-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">
            Created {formatDate(task.created_at)}
          </span>
        </div>
      </CardContent>
      
      {!task.is_completed && (
        <CardFooter className="pt-0 flex justify-end gap-2">
          <Button
            onClick={handleComplete}
            disabled={isCompleting}
            variant="default"
            size="sm"
            className="font-medium"
          >
            {isCompleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Completing...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Mark Complete
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

