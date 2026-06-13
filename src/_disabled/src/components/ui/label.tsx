import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        'block text-sm leading-none font-medium text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-200',
        className,
      )}
      {...props}
    />
  );
});
Label.displayName = 'Label';

export { Label };
