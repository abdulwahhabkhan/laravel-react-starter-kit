import { Icon } from '@iconify/react/offline';
import type { ReactNode } from 'react';
import { useOptionalSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

/**
 * Page building blocks matching the AFI shell. Each block fades up in turn:
 * the content area at 100ms (layout), header 120ms, filters 250ms, body 350ms.
 */

/**
 * Desktop sidebar toggle shown before the page title. Mobile uses the
 * drawer trigger in the top bar, and the header layout has no sidebar.
 */
function SidebarToggle() {
    const sidebar = useOptionalSidebar();

    if (!sidebar) {
        return null;
    }

    const isCollapsed = sidebar.state === 'collapsed';

    return (
        <button
            type="button"
            onClick={sidebar.toggleSidebar}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={
                isCollapsed ? 'Expand sidebar (⌘B)' : 'Collapse sidebar (⌘B)'
            }
            className="hidden size-9 shrink-0 place-items-center rounded-[10px] border border-border bg-card text-sidebar-primary shadow-xs transition-[color,background-color,box-shadow] outline-none hover:bg-accent hover:shadow-card focus-visible:ring-2 focus-visible:ring-sidebar-highlight md:grid dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
        >
            <Icon icon="solar:panel-left-line-duotone" className="size-5" />
        </button>
    );
}

/**
 * Page title row: title, optional description shown as an accent pill,
 * and optional action buttons aligned to the right.
 */
export function PageHeader({
    title,
    description,
    actions,
}: {
    title: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
}) {
    return (
        <div className="mb-4 flex animate-fade-up flex-col gap-3 [animation-delay:120ms] lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
                <SidebarToggle />
                <h1 className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-2xl leading-[1.35] font-medium tracking-[-0.025em] text-foreground">
                    {title}
                    {description && (
                        <small className="inline-flex max-w-full animate-in items-center gap-[0.45rem] rounded-full border border-[#b08a5a]/30 bg-linear-135 from-[#f4efe8] to-[#b08a5a]/4 py-1 pr-[0.7rem] pl-[0.6rem] text-xs leading-[1.35] font-semibold tracking-[0.02em] text-[#614b2e] shadow-[0_1px_2px_rgb(176_138_90/0.14),inset_0_1px_0_rgb(255_255_255/0.6)] delay-[400ms] duration-500 fill-mode-backwards fade-in slide-in-from-left-2 before:size-1.5 before:flex-none before:rounded-full before:bg-[#b08a5a] before:shadow-[0_0_0_3px_rgb(176_138_90/0.2)] before:content-[''] motion-reduce:animate-none dark:border-[#b08a5a]/35 dark:from-[#b08a5a]/15 dark:to-[#b08a5a]/5 dark:text-[#e2c9a6] dark:shadow-none">
                            {description}
                        </small>
                    )}
                </h1>
            </div>
            {actions && (
                <div className="flex flex-wrap items-center gap-3">
                    {actions}
                </div>
            )}
        </div>
    );
}

/** Filter/toolbar row between the header and the page body. */
export function PageFilters({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    return (
        <div
            className={cn(
                'mb-4 animate-fade-up [animation-delay:250ms]',
                className,
            )}
        >
            {children}
        </div>
    );
}

/** Main body of the page. */
export function PageContent({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    return (
        <div
            className={cn(
                'flex flex-1 animate-fade-up flex-col gap-4 [animation-delay:350ms]',
                className,
            )}
        >
            {children}
        </div>
    );
}
