import { usePage } from '@inertiajs/react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const { url, props } = usePage();

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="min-w-0 overflow-x-clip">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />

                {/* Keyed by path so the entrance animation replays on every page visit,
                    but not when only the query string changes (search, filters, pagination). */}
                <div
                    key={url.split('?')[0]}
                    id="content"
                    className="flex flex-1 animate-fade-up flex-col px-5 pt-5 pb-5 [animation-delay:100ms] md:px-[30px] md:pt-7"
                >
                    {children}
                </div>

                <footer
                    id="footer"
                    className="flex animate-fade-up flex-wrap justify-between gap-2 border-t border-border px-5 py-4 text-xs text-muted-foreground [animation-delay:200ms] md:px-[30px]"
                >
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
                </footer>
            </AppContent>
        </AppShell>
    );
}
