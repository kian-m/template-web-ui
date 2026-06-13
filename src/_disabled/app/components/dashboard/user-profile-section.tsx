// app/components/dashboard/user-profile-section.tsx
'use client';

import { useState, useCallback, useMemo } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/app/hooks/use-auth';
import { SimpleAlertDialog } from '@/app/components/ui/simple-alert-dialog';
import Image from 'next/image';

export default function UserProfileSection() {
  const { user, logout, getUserInitials } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Show default avatar and name if user is not available yet
  const displayName = useMemo(
    () => user?.displayName || user?.email?.split('@')[0] || 'User',
    [user],
  );
  const userInitials = useMemo(() => getUserInitials(), [getUserInitials]);
  const profilePicture = user?.photoURL;
  const isBetaUser = true; // This could be determined from user metadata or claims

  // Theme-based gradient selection for fallback avatar
  const getThemeGradient = useCallback(() => {
    // Get the current theme colors from CSS variables
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

  const handleLogout = useCallback(async () => {
    await logout();
    // Note: No need to redirect here as the auth context already handles this
  }, [logout]);

  return (
    <>
      <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
        <div className="flex min-w-0 flex-1 items-center">
          {profilePicture && !imageError ? (
            <div className="relative h-8 w-8">
              <Image
                src={profilePicture}
                alt={displayName}
                fill
                className="rounded-full object-cover"
                onError={() => setImageError(true)}
                sizes="32px"
              />
            </div>
          ) : (
            <div 
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-white shadow-sm"
              style={{ background: avatarGradient }}
            >
              {userInitials}
            </div>
          )}
          <div className="ml-3 min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
              {displayName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {isBetaUser ? 'Beta User' : 'Free Account'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="ml-2 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          aria-label="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <SimpleAlertDialog
          isOpen={true}
          onClose={() => setShowLogoutConfirm(false)}
          title="Logout Confirmation"
          description="Are you sure you want to log out of your account?"
          confirmLabel="Logout"
          cancelLabel="Cancel"
          onConfirm={handleLogout}
        />
      )}
    </>
  );
}
