import { Icon } from '@iconify/react/offline';
import { Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { moduleNavItems } from '@/components/modules/module-pages';
import { isNavParentItem, NavMain } from '@/components/nav-main';
import { NavSearch } from '@/components/nav-search';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    useSidebar,
} from '@/components/ui/sidebar';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { dashboard } from '@/routes';
import type { NavEntry, NavItem } from '@/types';

export const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: 'solar:widget-5-bold-duotone',
    },
];

const footerNavItems: NavItem[] = [];

/**
 * Keeps entries whose title matches; a matching parent keeps all its
 * children, otherwise only the matching children are kept.
 */
function filterNavEntries(entries: NavEntry[], query: string): NavEntry[] {
    if (query === '') {
        return entries;
    }

    const matches = (title: string) => title.toLowerCase().includes(query);

    return entries.flatMap((entry) => {
        if (matches(entry.title)) {
            return [entry];
        }

        if (!isNavParentItem(entry)) {
            return [];
        }

        const items = entry.items.filter((child) => matches(child.title));

        return items.length > 0 ? [{ ...entry, items }] : [];
    });
}

function firstLink(entries: NavEntry[]): NavItem | undefined {
    const [entry] = entries;

    return entry && isNavParentItem(entry) ? entry.items[0] : entry;
}

/**
 * Desktop collapse/expand tab straddling the middle of the sidebar's right
 * edge, revealed on sidebar hover or keyboard focus. Mobile opens the drawer
 * from the top bar instead.
 */
function SidebarEdgeToggle() {
    const { state, toggleSidebar } = useSidebar();
    const isCollapsed = state === 'collapsed';
    const label = isCollapsed ? 'Expand sidebar' : 'Collapse sidebar';

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    type="button"
                    onClick={toggleSidebar}
                    aria-label={label}
                    className="absolute top-1/2 -right-3.5 z-30 grid size-7 -translate-y-1/2 place-items-center rounded-md bg-sidebar text-muted-foreground opacity-0 transition-[color,opacity] outline-none group-hover:opacity-100 hover:text-sidebar-primary focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-sidebar-highlight"
                >
                    <Icon
                        icon={
                            isCollapsed
                                ? 'solar:panel-left-open-line-duotone'
                                : 'solar:panel-left-close-line-duotone'
                        }
                        className="size-6"
                    />
                </button>
            </TooltipTrigger>
            <TooltipContent side="right">{label} (⌘B)</TooltipContent>
        </Tooltip>
    );
}

export function AppSidebar() {
    const [menuSearch, setMenuSearch] = useState('');

    const query = menuSearch.trim().toLowerCase();
    const isSearching = query !== '';

    const filteredMainItems = useMemo(
        () => filterNavEntries(mainNavItems, query),
        [query],
    );
    const filteredModuleItems = useMemo(
        () => filterNavEntries(moduleNavItems, query),
        [query],
    );
    const hasMatches =
        filteredMainItems.length > 0 || filteredModuleItems.length > 0;

    const visitFirstMatch = () => {
        const match = firstLink([...filteredMainItems, ...filteredModuleItems]);

        if (isSearching && match) {
            router.visit(match.href);
            setMenuSearch('');
        }
    };

    return (
        <Sidebar
            collapsible="icon"
            variant="sidebar"
            className="group-data-[side=left]:border-r-0 after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-px after:brand-rule-y after:content-[''] md:animate-sidebar-in"
        >
            <SidebarHeader className="flex-row items-center gap-2 border-b border-sidebar-border px-4 py-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
                <Link
                    href={dashboard()}
                    prefetch
                    className="flex min-w-0 items-center gap-2.5 text-sidebar-accent-foreground outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                >
                    <AppLogo />
                </Link>
            </SidebarHeader>

            <SidebarContent className="gap-1">
                <NavSearch
                    value={menuSearch}
                    onChange={setMenuSearch}
                    onSubmit={visitFirstMatch}
                />
                {filteredMainItems.length > 0 && (
                    <NavMain
                        items={filteredMainItems}
                        showCollapsedDivider={false}
                    />
                )}
                {filteredModuleItems.length > 0 && (
                    <NavMain
                        items={filteredModuleItems}
                        label="Workspace"
                        forceOpen={isSearching}
                    />
                )}
                {!hasMatches && (
                    <p className="px-5 py-2 text-[13px] text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                        No menu items match “{menuSearch}”.
                    </p>
                )}
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border px-3 py-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
                {footerNavItems.length > 0 && (
                    <NavFooter items={footerNavItems} className="mt-auto" />
                )}
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
            <SidebarEdgeToggle />
        </Sidebar>
    );
}
