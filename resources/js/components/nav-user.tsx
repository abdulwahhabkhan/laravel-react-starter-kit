import { Icon } from '@iconify/react';
import { usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { useIsMobile } from '@/hooks/use-mobile';

export function NavUser() {
    const { auth } = usePage().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();
    const getInitials = useInitials();

    if (!auth.user) {
        return null;
    }

    return (
        <SidebarMenu className="group-data-[collapsible=icon]:w-auto">
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="h-12 gap-2.5 rounded-lg px-2 group-data-[collapsible=icon]:justify-center hover:bg-sidebar-accent data-[state=open]:bg-sidebar-accent"
                            data-test="sidebar-menu-button"
                        >
                            <Avatar className="size-8 shrink-0 overflow-hidden rounded-full">
                                <AvatarImage
                                    src={auth.user.avatar}
                                    alt={auth.user.name}
                                />
                                <AvatarFallback className="rounded-full bg-sidebar-primary/15 text-xs font-semibold text-sidebar-primary">
                                    {getInitials(auth.user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                                <span className="truncate text-[13px] font-medium text-sidebar-accent-foreground">
                                    {auth.user.name}
                                </span>
                                <span className="truncate text-[11px] text-sidebar-foreground/80">
                                    {auth.user.email}
                                </span>
                            </div>
                            <Icon
                                icon="solar:alt-arrow-down-line-duotone"
                                className="ml-auto size-4 text-sidebar-foreground transition-transform group-data-[collapsible=icon]:hidden in-data-[state=open]:rotate-180"
                            />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="end"
                        side={
                            isMobile
                                ? 'bottom'
                                : state === 'collapsed'
                                  ? 'left'
                                  : 'top'
                        }
                    >
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
