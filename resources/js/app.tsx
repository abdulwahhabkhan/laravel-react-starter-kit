import { addCollection } from '@iconify/react/offline';
import { createInertiaApp } from '@inertiajs/react';
import solarIcons from 'virtual:solar-icons';
import { ConfirmProvider } from '@/components/confirm-dialog';
import ErrorBoundary from '@/components/error-boundary';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

addCollection(solarIcons);

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <ErrorBoundary fullScreen>
                <TooltipProvider delayDuration={0}>
                    <ConfirmProvider>
                        {app}
                        <Toaster
                            closeButton
                            toastOptions={{
                                classNames: {
                                    toast: 'rounded-xl! shadow-lift! border-border! font-sans!',
                                    title: 'text-sm! font-semibold!',
                                },
                            }}
                        />
                    </ConfirmProvider>
                </TooltipProvider>
            </ErrorBoundary>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
