'use client';

import { useState, FormEvent } from 'react';
import { createTask, CreateTaskDto } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface TaskFormProps {
  onTaskCreated: () => void;
}

export default function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const taskData: CreateTaskDto = {
        title: title.trim(),
        description: description.trim() || undefined,
      };

      await createTask(taskData);
      setTitle('');
      setDescription('');
      setSuccess(true);
      toast.success('Task created!', {
        description: `"${title.trim()}" has been added to your list.`,
      });
      
      onTaskCreated();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      toast.error('Failed to create task', {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-base font-medium">
          Task Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Complete project proposal"
          disabled={isSubmitting}
          required
          className="text-base"
          autoFocus
        />
        <p className="text-xs text-muted-foreground">
          Give your task a clear, descriptive title
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-base font-medium">
          Description <span className="text-muted-foreground text-xs">(optional)</span>
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          rows={4}
          placeholder="Add any additional details, notes, or context about this task..."
          disabled={isSubmitting}
          className="text-base resize-none"
        />
        <p className="text-xs text-muted-foreground">
          {description.length} characters
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="border-2 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="font-semibold">Error</AlertTitle>
          <AlertDescription className="mt-1">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-2 border-primary/50 bg-primary/5 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <AlertTitle className="font-semibold text-primary">Task Created!</AlertTitle>
          <AlertDescription className="mt-1">
            Your task has been added successfully.
          </AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={isSubmitting || !title.trim()}
        className="w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Creating Task...
          </>
        ) : (
          <>
            <Plus className="mr-2 h-5 w-5" />
            Create Task
          </>
        )}
      </Button>
    </form>
  );
}

