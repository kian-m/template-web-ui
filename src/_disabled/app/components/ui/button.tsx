// app/components/ui/button.tsx
import React from 'react';

// Define button variants and sizes
type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'default', size = 'default', className = '', asChild = false, children, ...props },
    ref,
  ) => {
    // Base button classes
    const baseClass =
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50';

    // Variant classes
    const variantClasses = {
      default: 'bg-blue-600 text-white hover:bg-blue-700',
      outline:
        'border border-gray-700 bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white',
      ghost: 'bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white',
      destructive: 'bg-red-600 text-white hover:bg-red-700',
    };

    // Size classes
    const sizeClasses = {
      default: 'h-10 px-4 py-2',
      sm: 'h-8 px-3 text-sm',
      lg: 'h-12 px-6 text-lg',
      icon: 'h-8 w-8 p-0',
    };

    const classes = `${baseClass} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
