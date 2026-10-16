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
import { dashboard } from '@/routes';
import type { NavEntry, NavItem } from '@/types';

const mainNavItems: NavItem[] = [
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

function SidebarCollapseButton() {
    const { state, toggleSidebar } = useSidebar();
    const isCollapsed = state === 'collapsed';

    return (
        <button
            type="button"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={
                isCollapsed ? 'Expand sidebar (⌘B)' : 'Collapse sidebar (⌘B)'
            }
            className="ml-auto hidden size-8 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground transition-colors outline-none group-data-[collapsible=icon]:ml-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring md:flex"
        >
            <Icon
                icon={
                    isCollapsed
                        ? 'solar:double-alt-arrow-right-bold-duotone'
                        : 'solar:double-alt-arrow-left-bold-duotone'
                }
                className="size-[18px]"
            />
        </button>
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
            className="md:animate-sidebar-in"
        >
            <SidebarHeader className="flex-row items-center gap-2 border-b border-sidebar-border px-4 py-4 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
                <Link
                    href={dashboard()}
                    prefetch
                    className="flex min-w-0 items-center gap-2.5 text-sidebar-accent-foreground outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                >
                    <AppLogo />
                </Link>
                <SidebarCollapseButton />
            </SidebarHeader>

            <SidebarContent className="gap-1">
                <NavSearch
                    value={menuSearch}
                    onChange={setMenuSearch}
                    onSubmit={visitFirstMatch}
                />
                {filteredMainItems.length > 0 && (
                    <NavMain items={filteredMainItems} />
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
        </Sidebar>
    );
}
