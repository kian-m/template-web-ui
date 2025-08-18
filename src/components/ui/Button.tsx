import { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'text';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    onClick?: () => void;
    href?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    className?: string;
}

const Button = ({
                    children,
                    variant = 'primary',
                    size = 'md',
                    fullWidth = false,
                    onClick,
                    href,
                    type = 'button',
                    disabled = false,
                    className = '',
                }: ButtonProps) => {
    // Base classes
    const baseClasses = 'font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

    // Size classes
    const sizeClasses = {
        sm: 'py-2 px-4 text-sm',
        md: 'py-3 px-6 text-base',
        lg: 'py-4 px-8 text-lg',
    };

    // Variant classes
    const variantClasses = {
        primary: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
        secondary: 'bg-navy-800 hover:bg-navy-900 text-white focus:ring-navy-700',
        outline: 'bg-transparent border border-yellow-600 text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-500',
        text: 'bg-transparent text-navy-800 hover:text-navy-900 underline focus:ring-navy-500',
    };

    // Combined classes
    const combinedClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
    ${className}
  `;

    // If href is provided, render an anchor tag
    if (href) {
        return (
            <a
                href={href}
                className={combinedClasses}
                onClick={onClick}
            >
                {children}
            </a>
        );
    }

    // Otherwise, render a button
    return (
        <button
            type={type}
            className={combinedClasses}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;