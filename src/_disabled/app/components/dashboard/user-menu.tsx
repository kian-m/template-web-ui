'use client';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/app/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { toast } from '@/lib/toast';
import Image from 'next/image';

export default function UserMenu() {
  const { user, signOut, getUserInitials } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const userInitials = useMemo(() => getUserInitials(), [getUserInitials]);
  const profilePicture = user?.photoURL;

  // Theme-based gradient selection for fallback avatar
  const getThemeGradient = useCallback(() => {
    // Get the current theme colors from CSS variables
    if (typeof document === 'undefined') {
      return 'linear-gradient(135deg, #1d4aff, #c21be9)';
    }
    
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    // Try to get chart colors from theme
    const chartColor1 = computedStyle.getPropertyValue('--chart-color-1').trim() || '#1d4aff';
    const chartColor2 = computedStyle.getPropertyValue('--chart-color-2').trim() || '#c21be9';
    const chartColor3 = computedStyle.getPropertyValue('--chart-color-3').trim() || '#17c3ce';
    const chartColor4 = computedStyle.getPropertyValue('--chart-color-4').trim() || '#fb617f';
    const chartColor5 = computedStyle.getPropertyValue('--chart-color-5').trim() || '#fed319';

    const gradients = [
      `linear-gradient(135deg, ${chartColor1}, ${chartColor2})`,
      `linear-gradient(135deg, ${chartColor2}, ${chartColor3})`,
      `linear-gradient(135deg, ${chartColor3}, ${chartColor4})`,
      `linear-gradient(135deg, ${chartColor4}, ${chartColor5})`,
      `linear-gradient(135deg, ${chartColor5}, ${chartColor1})`,
      `linear-gradient(135deg, ${chartColor1}, ${chartColor3})`,
      `linear-gradient(135deg, ${chartColor2}, ${chartColor4})`,
    ];
    // Use email or uid to consistently pick a gradient
    const seed = user?.email || user?.uid || 'default';
    const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
  }, [user]);

  const avatarGradient = useMemo(() => getThemeGradient(), [getThemeGradient]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Failed to log out:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="relative">
      {/* User Avatar Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-8 w-8 overflow-hidden rounded-full transition-shadow hover:shadow-lg"
        aria-label="User menu"
      >
        {profilePicture && !imageError ? (
          <Image
            src={profilePicture}
            alt={user?.displayName || user?.email || 'User'}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            sizes="32px"
          />
        ) : (
          <div 
            className="flex h-full w-full items-center justify-center text-sm font-semibold text-white"
            style={{ background: avatarGradient }}
          >
            {userInitials}
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
        >
          {/* User Info */}
          <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                {profilePicture && !imageError ? (
                  <Image
                    src={profilePicture}
                    alt={user?.displayName || user?.email || 'User'}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                ) : (
                  <div 
                    className="flex h-full w-full items-center justify-center font-semibold text-white"
                    style={{ background: avatarGradient }}
                  >
                    {userInitials}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user?.displayName || user?.email || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.uid ? `ID: ${user.uid.slice(0, 8)}...` : 'Not logged in'}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={handleLogout}
              className="flex w-full items-center space-x-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
