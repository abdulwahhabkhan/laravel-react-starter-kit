import { Icon } from '@iconify/react/offline';
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
                            className="h-auto gap-2.5 rounded-[10px] bg-sidebar-primary/[0.035] p-2 text-sidebar-accent-foreground shadow-[inset_0_0_0_1px_var(--sidebar-border)] transition-colors group-data-[collapsible=icon]:size-auto! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:overflow-visible group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-1! group-data-[collapsible=icon]:shadow-none hover:bg-sidebar-primary/[0.07] data-[state=open]:bg-sidebar-primary/[0.07]"
                            data-test="sidebar-menu-button"
                        >
                            <Avatar className="relative size-[34px] shrink-0 overflow-hidden rounded-full shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_1px_2px_rgb(0_0_0/0.25)] group-data-[collapsible=icon]:shadow-[0_0_0_2px_var(--sidebar),0_0_0_3.5px_var(--sidebar-primary)] after:pointer-events-none after:absolute after:inset-0.5 after:rounded-full after:border after:border-black/15">
                                <AvatarImage
                                    src={auth.user.avatar}
                                    alt={auth.user.name}
                                />
                                <AvatarFallback className="rounded-full bg-[repeating-linear-gradient(45deg,rgb(255_255_255/0.09)_0_1px,transparent_1px_4px),linear-gradient(135deg,#062a52_0%,#0d4886_45%,#07305d_100%)] text-xs font-bold tracking-[0.04em] text-white [text-shadow:0_1px_0_rgb(0_0_0/0.25)]">
                                    {getInitials(auth.user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex min-w-0 flex-1 flex-col text-left leading-[1.3] group-data-[collapsible=icon]:hidden">
                                <span className="truncate text-[13px] font-semibold">
                                    {auth.user.name}
                                </span>
                                <span className="truncate text-[11.5px] text-sidebar-foreground">
                                    {auth.user.email}
                                </span>
                            </div>
                            <Icon
                                icon="solar:sort-vertical-linear"
                                className="ml-auto size-4 shrink-0 text-sidebar-foreground group-data-[collapsible=icon]:hidden"
                            />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl shadow-[0_18px_40px_-12px_rgb(27_37_48/0.35),0_4px_10px_-4px_rgb(27_37_48/0.12)]"
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
