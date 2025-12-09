'use client';

import { useState } from 'react';
import TaskList from '@/components/TaskList';
import TaskFormDialog from '@/components/TaskFormDialog';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card, CardContent } from '@/components/ui/card';
import {  Sparkles, ListTodo } from 'lucide-react';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTaskCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-200 flex flex-col">      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80 shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-primary/15 border-2 border-primary/30 shadow-sm">
                <ListTodo className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  To-Do App
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Stay organized & productive</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
              Your Tasks, Your Way
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Organize your life one task at a time. Create, manage, and complete your to-dos with ease.
          </p>
        </div>

        <Card className="shadow-lg border-2">
          <CardContent className="pt-6">
            <TaskList key={refreshKey} />
          </CardContent>
        </Card>
      </main>

      <div className="fixed md:bottom-24 bottom-12 md:right-12 right-6 z-50">
        <FloatingActionButton onClick={() => setIsDialogOpen(true)} />
      </div>

      <TaskFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onTaskCreated={handleTaskCreated}
      />

      <footer className="mt-auto border-t bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
            </p>
            <p className="text-xs text-muted-foreground">
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
