interface ParentReviewBadgeProps {
    name: string;
    location: string;
    quote: string;
    size?: 'sm' | 'md' | 'lg';
}

const ParentReviewBadge = ({ name, location, quote, size = 'md' }: ParentReviewBadgeProps) => {
    const sizeClasses = {
        sm: 'text-xs p-2',
        md: 'text-sm p-3',
        lg: 'text-base p-4'
    };

    return (
        <div className={`bg-white rounded-lg shadow border border-gray-100 ${sizeClasses[size]}`}>
            <div className="flex items-center gap-2 mb-1">

                <span className="text-xs font-semibold text-navy-700">Verified Parent</span>
            </div>
            <p className="text-navy-600 italic mb-2 text-xs">{`"${quote}"`}</p>
            <p className="text-xs text-gray-500">{`${name} • ${location}`}</p>
        </div>
    );
};

export default ParentReviewBadge;