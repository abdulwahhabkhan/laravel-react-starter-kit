import { Icon } from '@iconify/react';
import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({
    items,
    label = 'Overview',
}: {
    items: NavItem[];
    label?: string;
}) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-3 py-0 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
            <SidebarGroupLabel className="px-2 text-[11px] tracking-[0.06em] text-sidebar-foreground/70 uppercase">
                {label}
            </SidebarGroupLabel>
            <SidebarMenu className="gap-0.5 group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:items-center">
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentUrl(item.href)}
                            tooltip={{ children: item.title }}
                            className="h-9 gap-2.5 rounded-lg px-2.5 text-sidebar-foreground transition-colors group-data-[collapsible=icon]:justify-center hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary/15 data-[active=true]:text-sidebar-primary [&>svg]:size-[18px]"
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <Icon icon={item.icon} />}
                                <span className="group-data-[collapsible=icon]:hidden">
                                    {item.title}
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
