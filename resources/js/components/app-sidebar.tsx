import { Icon } from '@iconify/react';
import { Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
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
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: 'solar:widget-5-bold-duotone',
    },
];

const footerNavItems: NavItem[] = [];

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

    const filteredNavItems = useMemo(() => {
        const query = menuSearch.trim().toLowerCase();

        if (query === '') {
            return mainNavItems;
        }

        return mainNavItems.filter((item) =>
            item.title.toLowerCase().includes(query),
        );
    }, [menuSearch]);

    const visitFirstMatch = () => {
        if (menuSearch.trim() !== '' && filteredNavItems.length > 0) {
            router.visit(filteredNavItems[0].href);
            setMenuSearch('');
        }
    };

    return (
        <Sidebar collapsible="icon" variant="sidebar">
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
                {filteredNavItems.length > 0 ? (
                    <NavMain items={filteredNavItems} />
                ) : (
                    <p className="px-5 py-2 text-[13px] text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                        No menu items match “{menuSearch}”.
                    </p>
                )}
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border px-3 py-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
