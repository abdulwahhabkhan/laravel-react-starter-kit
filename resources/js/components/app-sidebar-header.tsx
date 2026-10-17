import { Icon } from '@iconify/react/offline';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useSidebar } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

/**
 * Mobile-only top bar that opens the sidebar drawer. On desktop the page
 * header inside the content takes its place.
 */
export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { toggleSidebar } = useSidebar();

    return (
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4 md:hidden">
            <button
                type="button"
                onClick={toggleSidebar}
                aria-label="Open sidebar"
                className="grid shrink-0 place-items-center rounded-md text-muted-foreground transition-colors outline-none hover:text-sidebar-primary focus-visible:ring-2 focus-visible:ring-sidebar-highlight"
            >
                <Icon icon="solar:panel-left-line-duotone" className="size-5" />
            </button>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
        </header>
    );
}
