'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
}

export function FloatingActionButton({ onClick, className }: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className={cn(
        "h-16 w-16 rounded-full shadow-2xl",
        "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95",
        "transition-all duration-300 hover:scale-110 active:scale-95",
        "flex items-center justify-center p-0",
        "ring-4 ring-primary/30 hover:ring-primary/40",
        "hover:shadow-[0_12px_48px_rgba(59,130,246,0.4)] dark:hover:shadow-[0_12px_48px_rgba(96,165,250,0.5)]",
        className
      )}
      aria-label="Add new task"
    >
      <Plus className="h-7 w-7" strokeWidth={2.5} />
    </Button>
  );
}

