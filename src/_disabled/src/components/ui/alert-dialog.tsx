'use client';

import * as React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

function AlertDialog(props: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger(props: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
}

function AlertDialogPortal(props: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />;
}

/** Translucent dimmer UNDER the panel */
function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        'fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
        'data-[state=closed]:duration-200 data-[state=open]:duration-300',
        className,
      )}
      {...props}
    />
  );
}

/** Fully opaque panel ABOVE the overlay */
function AlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          'z-[1001] grid w-full max-w-[calc(100%-2rem)] gap-6 sm:max-w-lg',
          'border-border rounded-xl border-2 p-8 shadow-2xl outline-none',
          // Solid background with high contrast
          'bg-white dark:bg-gray-900',
          'ring-1 ring-black/10 dark:ring-white/20',
          // Improved animations with spring-like motion
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95',
          'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
          'data-[state=open]:slide-in-from-top-2 data-[state=closed]:slide-out-to-top-2',
          'data-[state=closed]:duration-200 data-[state=open]:duration-300',
          'data-[state=closed]:ease-in data-[state=open]:ease-out',
          className,
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn('flex flex-col gap-3 text-center sm:text-left', className)}
      {...props}
    />
  );
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        'flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end sm:gap-2',
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(
        'text-gray-900 dark:text-white text-xl leading-tight font-semibold tracking-tight',
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn('text-gray-600 dark:text-gray-300 text-sm leading-relaxed', className)}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  return (
    <AlertDialogPrimitive.Action
      className={cn(
        buttonVariants(),
        'transition-all duration-300 ease-in-out',
        'hover:scale-110 hover:shadow-xl hover:shadow-red-500/30',
        'hover:border hover:border-black hover:bg-red-500 hover:text-white',
        'active:scale-[0.95] active:duration-100',
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(
        buttonVariants({ variant: 'outline' }),
        'transition-all duration-300 ease-in-out',
        'hover:shadow-muted/30 hover:scale-110 hover:shadow-xl',
        'hover:bg-muted hover:text-foreground hover:border-muted-foreground',
        'active:scale-[0.95] active:duration-100',
        className,
      )}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
