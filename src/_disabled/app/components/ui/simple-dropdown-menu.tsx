// app/components/ui/simple-dropdown-menu.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'start' | 'end';
}

export function SimpleDropdownMenu({ trigger, children, align = 'end' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate menu position
  const [position, setPosition] = useState<{ top: number; left: string | number; right: string | number }>({ top: 0, left: 0, right: 'auto' });

  useEffect(() => {
    if (isOpen && triggerRef.current && menuRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      
      // Wait for next tick to get menu dimensions
      setTimeout(() => {
        if (!menuRef.current) return;
        
        const menuRect = menuRef.current.getBoundingClientRect();
        const menuHeight = menuRect.height;
        const menuWidth = menuRect.width;
        
        let top = rect.bottom + scrollY + 4;
        let left: string | number = 'auto';
        let right: string | number = 'auto';
        
        // Check if menu would go off bottom of viewport
        if (rect.bottom + menuHeight + 4 > window.innerHeight) {
          // Show above instead
          top = rect.top + scrollY - menuHeight - 4;
        }
        
        // Handle horizontal positioning
        if (align === 'start') {
          left = rect.left + scrollX;
          // Check if menu would go off right edge
          if (rect.left + menuWidth > window.innerWidth) {
            left = window.innerWidth - menuWidth - 10;
          }
        } else {
          // align === 'end'
          right = window.innerWidth - (rect.right + scrollX);
          // Check if menu would go off left edge
          if (rect.right - menuWidth < 0) {
            right = window.innerWidth - menuWidth - 10;
          }
        }
        
        setPosition({ top, left, right });
      }, 0);
    }
  }, [isOpen, align]);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(event.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Portal menu content
  const menuContent = isOpen && mounted ? (
    <div
      ref={menuRef}
      className="fixed z-[99999] min-w-[8rem] max-w-[95vw]"
      style={{
        top: position.top,
        left: position.left !== 'auto' ? Number(position.left) : undefined,
        right: position.right !== 'auto' ? Number(position.right) : undefined,
        maxHeight: '80vh',
        overflowY: 'auto',
      }}
    >
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl dark:border-gray-600 dark:bg-gray-800">
        {children}
      </div>
    </div>
  ) : null;

  return (
    <div className="relative" ref={triggerRef}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {/* Portal the menu to document.body */}
      {mounted && typeof document !== 'undefined' && 
        createPortal(menuContent, document.body)
      }
    </div>
  );
}

// Menu Item
interface MenuItemProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function SimpleMenuItem({ onClick, children, className = '' }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-2.5 text-left text-sm font-medium text-gray-800 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-700 dark:hover:text-white transition-colors duration-150 ${className}`}
    >
      {children}
    </button>
  );
}

// Menu Separator
export function SimpleMenuSeparator() {
  return <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />;
}
