import { usePage } from '@inertiajs/react';
import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import ErrorBoundary from '@/components/error-boundary';
import type { AppLayoutProps } from '@/types';

export default function AppHeaderLayout({
    children,
    breadcrumbs,
}: AppLayoutProps) {
    const { url } = usePage();

    return (
        <AppShell variant="header">
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent variant="header">
                {/* Keyed by URL so the boundary resets on every visit. */}
                <ErrorBoundary key={url}>{children}</ErrorBoundary>
            </AppContent>
        </AppShell>
    );
}
