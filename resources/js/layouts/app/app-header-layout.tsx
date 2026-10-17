import { usePage } from '@inertiajs/react';
import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import ErrorBoundary from '@/components/error-boundary';
import type { AppLayoutProps } from '@/types';

export default function AppHeaderLayout({ children }: AppLayoutProps) {
    const { url, props } = usePage();

    return (
        <AppShell variant="header">
            <AppHeader />
            <AppContent
                variant="header"
                className="flex w-full min-w-0 flex-1 flex-col overflow-x-clip"
            >
                {/* Keyed by path so the entrance animation replays and the error boundary resets on every
                    page visit, but not when only the query string changes (search, filters, pagination). */}
                <div
                    key={url.split('?')[0]}
                    id="content"
                    className="flex flex-1 animate-fade-up flex-col p-4 [animation-delay:100ms] md:p-6"
                >
                    <ErrorBoundary>{children}</ErrorBoundary>
                </div>
            </AppContent>

            <footer
                id="footer"
                className="animate-fade-up border-t border-border [animation-delay:200ms]"
            >
                <div className="flex flex-wrap justify-between gap-2 px-4 py-3.5 text-xs text-muted-foreground md:px-6">
                    <span>
                        &copy; {new Date().getFullYear()} {props.name}. All
                        rights reserved.
                    </span>
                    <span>
                        Developed by{' '}
                        <a
                            href="https://sudotech.co.uk"
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-sidebar-primary hover:underline"
                        >
                            SUDOTECH
                        </a>
                    </span>
                </div>
            </footer>
        </AppShell>
    );
}
