'use client';
import Header from './header';
import SidebarBrand from './sidebar-brand';

interface TopLineProps {
  title: string;
}

export default function TopLine({ title }: TopLineProps) {
  return (
    <div className="bg-sidebar border-sidebar-border/60 flex items-stretch border-b-[0.5px]">
      <div className="flex-1">
        <Header title={title} />
      </div>
    </div>
  );
}
