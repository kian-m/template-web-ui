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
    phEvent?: string;
    phLabel?: string;
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
                    phEvent,
                    phLabel,
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
        primary: 'bg-academic-gold hover:bg-academic-light-gold text-academic-navy focus:ring-academic-gold',
        secondary: 'bg-academic-navy hover:bg-academic-dark-blue text-white focus:ring-academic-navy',
        outline: 'bg-transparent border border-academic-gold text-academic-gold hover:bg-academic-gold/10 focus:ring-academic-gold',
        text: 'bg-transparent text-academic-navy hover:text-academic-dark-blue underline focus:ring-academic-navy',
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
                data-ph-event={phEvent}
                data-ph-label={phLabel}
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
            data-ph-event={phEvent}
            data-ph-label={phLabel}
        >
            {children}
        </button>
    );
};

export default Button;