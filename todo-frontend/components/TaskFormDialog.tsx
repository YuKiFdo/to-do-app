'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TaskForm from './TaskForm';

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreated: () => void;
}

export default function TaskFormDialog({ 
  open, 
  onOpenChange, 
  onTaskCreated 
}: TaskFormDialogProps) {
  const [key, setKey] = useState(0);

  const handleTaskCreated = () => {
    // Close dialog first
    onOpenChange(false);
    // Reset form by remounting
    setTimeout(() => {
      setKey(prev => prev + 1);
      onTaskCreated();
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <span>Create New Task</span>
          </DialogTitle>
          <DialogDescription>
            Add a new task to your to-do list and start getting things done
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <TaskForm key={key} onTaskCreated={handleTaskCreated} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

