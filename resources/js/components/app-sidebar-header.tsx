import { Icon } from '@iconify/react/offline';
import { Link, usePage } from '@inertiajs/react';
import AppLogo from '@/components/app-logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSidebar } from '@/components/ui/sidebar';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { dashboard } from '@/routes';

/**
 * Mobile-only top bar while the sidebar is a drawer: menu toggle, logo and
 * the user menu. On desktop the sidebar and page header take its place.
 */
export function AppSidebarHeader() {
    const { toggleSidebar } = useSidebar();
    const { auth } = usePage().props;
    const getInitials = useInitials();

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
            <Link
                href={dashboard()}
                prefetch
                className="flex min-w-0 items-center gap-2.5 text-sidebar-accent-foreground outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            >
                <AppLogo />
            </Link>
            {auth.user && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            aria-label="Open user menu"
                            className="ml-auto rounded-full outline-none focus-visible:ring-2 focus-visible:ring-sidebar-highlight"
                        >
                            <Avatar className="size-8 overflow-hidden rounded-full">
                                <AvatarImage
                                    src={auth.user.avatar}
                                    alt={auth.user.name}
                                />
                                <AvatarFallback className="rounded-full bg-sidebar-primary text-[11px] font-semibold text-white">
                                    {getInitials(auth.user.name)}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </header>
    );
}
