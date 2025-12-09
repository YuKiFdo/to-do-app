'use client';

import { useEffect, useState } from 'react';
import { getRecentTasks, Task, markTasksComplete } from '@/lib/api';
import TaskCard from './TaskCard';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {  CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle, Inbox, RefreshCw, CheckCircle2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [isCompleting, setIsCompleting] = useState(false);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getRecentTasks();
      setTasks(data);
      // Clear selection when tasks are refreshed
      setSelectedTasks(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskSelect = (taskId: string, isSelected: boolean) => {
    setSelectedTasks(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(taskId);
      } else {
        newSet.delete(taskId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const pendingTasks = tasks.filter(t => !t.is_completed);
    if (selectedTasks.size === pendingTasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(pendingTasks.map(t => t.id)));
    }
  };

  const handleBulkComplete = async () => {
    if (selectedTasks.size === 0) return;

    setIsCompleting(true);
    try {
      await markTasksComplete(Array.from(selectedTasks));
      toast.success('Tasks completed!', {
        description: `${selectedTasks.size} task${selectedTasks.size !== 1 ? 's' : ''} marked as complete.`,
      });
      await fetchTasks();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete tasks';
      setError(errorMessage);
      toast.error('Failed to complete tasks', {
        description: errorMessage,
      });
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Loading your tasks...</p>
        <p className="text-sm text-muted-foreground mt-1">Please wait a moment</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="border-2">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="text-lg font-semibold">Error Loading Tasks</AlertTitle>
        <AlertDescription className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="text-sm">{error}</span>
          <Button 
            onClick={fetchTasks} 
            variant="outline" 
            size="sm" 
            className="w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="relative">
          <Inbox className="h-16 w-16 text-muted-foreground/50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Inbox className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">No tasks yet</h3>
          <p className="text-muted-foreground max-w-sm">
            Get started by creating your first task above. You'll see it here once you add it!
          </p>
        </div>
      </div>
    );
  }

  const completedCount = tasks.filter(t => t.is_completed).length;
  const pendingCount = tasks.length - completedCount;
  const pendingTasks = tasks.filter(t => !t.is_completed);
  const allSelected = pendingTasks.length > 0 && selectedTasks.size === pendingTasks.length;
  const someSelected = selectedTasks.size > 0 && selectedTasks.size < pendingTasks.length;

  return (
    <div className="space-y-6">
      <CardHeader className="px-0 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Your Tasks
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and track your progress
            </p>
          </div>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <Badge variant="default" className="text-sm">
                {pendingCount} Pending
              </Badge>
            )}
            {completedCount > 0 && (
              <Badge variant="secondary" className="text-sm">
                {completedCount} Done
              </Badge>
            )}
            <Badge variant="outline" className="text-sm">
              {tasks.length} Total
            </Badge>
          </div>
        </div>
      </CardHeader>

      {/* Bulk Action Bar */}
      {selectedTasks.size > 0 && (
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border rounded-lg p-4 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="flex items-center gap-2"
              >
                {allSelected ? (
                  <>
                    <X className="h-4 w-4" />
                    Deselect All
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Select All
                  </>
                )}
              </Button>
              <span className="text-sm text-muted-foreground">
                {selectedTasks.size} task{selectedTasks.size !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTasks(new Set())}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleBulkComplete}
                disabled={isCompleting}
                className="flex items-center gap-2"
              >
                {isCompleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Completing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Mark Complete ({selectedTasks.size})
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Select All Checkbox (when no tasks selected) */}
      {selectedTasks.size === 0 && pendingTasks.length > 0 && (
        <div className="flex items-center gap-2 pb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            className="text-muted-foreground hover:text-foreground"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Select all pending tasks
          </Button>
        </div>
      )}
      
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className="animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <TaskCard 
              task={task} 
              onTaskCompleted={fetchTasks}
              isSelected={selectedTasks.has(task.id)}
              onSelectChange={(isSelected) => handleTaskSelect(task.id, isSelected)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

