import { Icon } from '@iconify/react/offline';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import type { NavEntry, NavItem, NavParentItem } from '@/types';

const menuButtonClassName =
    "relative h-9 gap-2.5 rounded-lg px-2.5 text-sidebar-foreground transition-colors group-data-[collapsible=icon]:justify-center hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary/[0.08] data-[active=true]:font-semibold data-[active=true]:text-sidebar-primary data-[active=true]:before:absolute data-[active=true]:before:inset-y-2 data-[active=true]:before:left-0 data-[active=true]:before:w-[3px] data-[active=true]:before:rounded-r-full data-[active=true]:before:bg-sidebar-highlight data-[active=true]:before:content-[''] group-data-[collapsible=icon]:data-[active=true]:before:hidden dark:data-[active=true]:bg-sidebar-primary/[0.12] [&>svg]:size-[18px]";

export function isNavParentItem(item: NavEntry): item is NavParentItem {
    return 'items' in item;
}

export function NavMain({
    items,
    label = 'Overview',
    forceOpen = false,
}: {
    items: NavEntry[];
    label?: string;
    /** Expand every parent, e.g. while the menu is being searched. */
    forceOpen?: boolean;
}) {
    return (
        <SidebarGroup className="px-3 py-0 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
            <SidebarGroupLabel className="px-2 text-[11px] tracking-[0.06em] text-sidebar-foreground/70 uppercase">
                {label}
            </SidebarGroupLabel>
            <SidebarMenu className="gap-0.5 group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:items-center">
                {items.map((item) =>
                    isNavParentItem(item) ? (
                        <NavParent
                            key={item.title}
                            item={item}
                            forceOpen={forceOpen}
                        />
                    ) : (
                        <NavLink key={item.title} item={item} />
                    ),
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}

function NavLink({ item }: { item: NavItem }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                isActive={isCurrentUrl(item.href)}
                tooltip={{ children: item.title }}
                className={menuButtonClassName}
            >
                <Link href={item.href} prefetch>
                    {item.icon && <Icon icon={item.icon} />}
                    <span className="group-data-[collapsible=icon]:hidden">
                        {item.title}
                    </span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

/**
 * Expandable menu entry. In the icon-only sidebar the children open in a
 * flyout menu instead, since there is no room to nest them inline.
 */
function NavParent({
    item,
    forceOpen,
}: {
    item: NavParentItem;
    forceOpen: boolean;
}) {
    const { isCurrentUrl } = useCurrentUrl();
    const { state, isMobile } = useSidebar();
    const hasActiveChild = item.items.some((child) => isCurrentUrl(child.href));
    const [isOpen, setIsOpen] = useState(hasActiveChild);

    const parentClassName = cn(
        menuButtonClassName,
        hasActiveChild && 'font-semibold text-sidebar-accent-foreground',
    );

    if (state === 'collapsed' && !isMobile) {
        return (
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            isActive={hasActiveChild}
                            tooltip={{ children: item.title }}
                            className={menuButtonClassName}
                        >
                            {item.icon && <Icon icon={item.icon} />}
                            <span className="sr-only">{item.title}</span>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        side="right"
                        align="start"
                        sideOffset={8}
                        className="min-w-48"
                    >
                        <DropdownMenuLabel className="text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
                            {item.title}
                        </DropdownMenuLabel>
                        {item.items.map((child) => (
                            <DropdownMenuItem key={child.title} asChild>
                                <Link
                                    href={child.href}
                                    prefetch
                                    className={cn(
                                        'cursor-pointer',
                                        isCurrentUrl(child.href) &&
                                            'font-semibold text-sidebar-primary',
                                    )}
                                >
                                    {child.title}
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        );
    }

    return (
        <Collapsible
            asChild
            open={forceOpen || isOpen}
            onOpenChange={setIsOpen}
            className="group/collapsible"
        >
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton className={parentClassName}>
                        {item.icon && <Icon icon={item.icon} />}
                        <span>{item.title}</span>
                        <Icon
                            icon="solar:alt-arrow-right-linear"
                            className="ml-auto size-4! transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                        />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                    <SidebarMenuSub className="mr-0 ml-[19px] gap-0.5 py-1 pr-0 pl-2.5">
                        {item.items.map((child) => (
                            <SidebarMenuSubItem key={child.title}>
                                <SidebarMenuSubButton
                                    asChild
                                    isActive={isCurrentUrl(child.href)}
                                    className="h-8 rounded-lg px-2.5 text-[13px] text-sidebar-foreground data-[active=true]:bg-sidebar-primary/[0.08] data-[active=true]:font-semibold data-[active=true]:text-sidebar-primary dark:data-[active=true]:bg-sidebar-primary/[0.12]"
                                >
                                    <Link href={child.href} prefetch>
                                        <span>{child.title}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
}
