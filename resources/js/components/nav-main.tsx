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

/**
 * Menu row: icon tile + label. The row tints and the tile turns navy/gold when
 * it (or one of its children) is the current page. Collapsed, the row shrinks
 * to a larger centered tile.
 */
const menuButtonClassName = cn(
    'group/nav h-10 gap-2.5 rounded-[10px] pr-2 pl-[5px] text-[13.5px] font-semibold text-sidebar-accent-foreground transition-colors',
    'hover:bg-sidebar-primary/[0.05] hover:text-sidebar-primary',
    'data-[active=true]:bg-sidebar-primary/[0.07] data-[active=true]:font-semibold data-[active=true]:text-sidebar-primary',
    'dark:hover:bg-white/[0.04] dark:data-[active=true]:bg-sidebar-primary/[0.1]',
    'group-data-[collapsible=icon]:size-11! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:hover:bg-transparent group-data-[collapsible=icon]:data-[active=true]:bg-transparent',
);

/** Rounded square behind a menu icon. */
export function NavIconTile({
    icon,
    isActive = false,
}: {
    icon: string;
    isActive?: boolean;
}) {
    return (
        <span
            className={cn(
                'grid size-[30px] shrink-0 place-items-center rounded-lg transition-[background-color,color,box-shadow] duration-150 group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:rounded-[10px]',
                isActive
                    ? 'bg-sidebar-tile-active text-sidebar-tile-active-foreground shadow-[0_2px_6px_-1px_rgb(7_48_93/0.35)] group-data-[collapsible=icon]:shadow-[0_2px_6px_-1px_rgb(7_48_93/0.35),0_0_0_4px_rgb(7_48_93/0.08)] dark:shadow-none dark:group-data-[collapsible=icon]:shadow-[0_0_0_4px_rgb(234_161_89/0.15)]'
                    : 'bg-sidebar-tile text-sidebar-foreground group-hover/nav:bg-white group-hover/nav:text-sidebar-primary group-hover/nav:shadow-[0_1px_2px_rgb(7_48_93/0.12)] dark:group-hover/nav:bg-white/10',
            )}
        >
            <Icon
                icon={icon}
                className="size-[18px] group-data-[collapsible=icon]:size-5"
            />
        </span>
    );
}

export function isNavParentItem(item: NavEntry): item is NavParentItem {
    return 'items' in item;
}

export function NavMain({
    items,
    label = 'Overview',
    showCollapsedDivider = true,
    forceOpen = false,
}: {
    items: NavEntry[];
    label?: string;
    /** Show a short rule above the group in the icon-only sidebar. */
    showCollapsedDivider?: boolean;
    /** Expand every parent, e.g. while the menu is being searched. */
    forceOpen?: boolean;
}) {
    return (
        <SidebarGroup className="px-3 py-0 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
            <SidebarGroupLabel className="h-auto gap-2 px-2.5 pt-4 pb-1.5 text-[10px] font-bold tracking-[0.12em] text-sidebar-foreground uppercase after:h-px after:flex-1 after:bg-sidebar-border/70 after:content-['']">
                {label}
            </SidebarGroupLabel>
            {showCollapsedDivider && (
                <div className="hidden h-px w-6 bg-sidebar-border group-data-[collapsible=icon]:mt-1 group-data-[collapsible=icon]:mb-1.5 group-data-[collapsible=icon]:block" />
            )}
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
    const isActive = isCurrentUrl(item.href);

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={{ children: item.title }}
                className={menuButtonClassName}
            >
                <Link href={item.href} prefetch>
                    {item.icon && (
                        <NavIconTile icon={item.icon} isActive={isActive} />
                    )}
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

    if (state === 'collapsed' && !isMobile) {
        return (
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            isActive={hasActiveChild}
                            tooltip={{ children: item.title }}
                            className={cn(
                                menuButtonClassName,
                                'data-[state=open]:[&>span]:bg-sidebar-tile-active data-[state=open]:[&>span]:text-sidebar-tile-active-foreground',
                            )}
                        >
                            {item.icon && (
                                <NavIconTile
                                    icon={item.icon}
                                    isActive={hasActiveChild}
                                />
                            )}
                            <span className="sr-only">{item.title}</span>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        side="right"
                        align="start"
                        sideOffset={14}
                        className="min-w-[210px] rounded-xl p-1.5 shadow-[0_12px_28px_-10px_rgb(7_48_93/0.3)]"
                    >
                        <DropdownMenuLabel className="px-2.5 pt-2 pb-1.5 text-xs font-semibold text-sidebar-primary">
                            {item.title}
                        </DropdownMenuLabel>
                        <div className="flex flex-col gap-[3px]">
                            {item.items.map((child) => (
                                <DropdownMenuItem key={child.title} asChild>
                                    <Link
                                        href={child.href}
                                        prefetch
                                        className={cn(
                                            'cursor-pointer rounded-[7px] px-2.5 py-[0.45rem] text-[12.5px] font-medium',
                                            isCurrentUrl(child.href) &&
                                                'bg-sidebar-highlight/15 font-semibold text-[#7a4f1c] focus:bg-sidebar-highlight/20 dark:text-sidebar-highlight',
                                        )}
                                    >
                                        {child.title}
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </div>
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
                    <SidebarMenuButton
                        isActive={hasActiveChild}
                        className={menuButtonClassName}
                    >
                        {item.icon && (
                            <NavIconTile
                                icon={item.icon}
                                isActive={hasActiveChild}
                            />
                        )}
                        <span>{item.title}</span>
                        <Icon
                            icon="solar:alt-arrow-down-linear"
                            className="ml-auto size-4! text-sidebar-foreground opacity-70 transition-transform duration-200 group-hover/nav:opacity-100 group-data-[state=open]/collapsible:rotate-180"
                        />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                    <SidebarMenuSub className="mt-1 mr-0 mb-1.5 ml-[1.2rem] translate-x-0 gap-[3px] border-l-[1.5px] border-sidebar-border/80 py-0 pr-0 pl-3">
                        {item.items.map((child) => (
                            <SidebarMenuSubItem key={child.title}>
                                <SidebarMenuSubButton
                                    asChild
                                    isActive={isCurrentUrl(child.href)}
                                    className="h-auto translate-x-0 rounded-[7px] px-2.5 py-[0.42rem] text-[12.5px] font-medium text-sidebar-accent-foreground/85 hover:bg-sidebar-primary/[0.05] hover:text-sidebar-primary data-[active=true]:relative data-[active=true]:overflow-visible data-[active=true]:bg-sidebar-highlight/15 data-[active=true]:font-bold data-[active=true]:text-sidebar-primary data-[active=true]:before:absolute data-[active=true]:before:inset-y-1.5 data-[active=true]:before:-left-[14px] data-[active=true]:before:w-[2.5px] data-[active=true]:before:rounded-full data-[active=true]:before:bg-sidebar-highlight data-[active=true]:before:content-[''] dark:hover:bg-white/[0.04]"
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
