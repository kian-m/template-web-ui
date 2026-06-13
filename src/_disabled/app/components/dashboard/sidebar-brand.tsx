'use client';
import SailboatLogo from '@/app/components/ui/sailboat-logo';

export default function SidebarBrand() {
  return (
    <div className="flex h-full items-center space-x-3 px-3 py-2 md:px-4">
      <SailboatLogo size={28} className="flex-shrink-0 md:h-8 md:w-8" />
      <div>
        <h1 className="text-sidebar-foreground text-base font-bold md:text-lg">Debark</h1>
        <p className="text-muted-foreground -mt-0.5 hidden text-xs md:block">Analytics Platform</p>
      </div>
    </div>
  );
}
