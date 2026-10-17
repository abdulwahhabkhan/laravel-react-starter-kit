import { Icon } from '@iconify/react/offline';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { PointerEvent } from 'react';
import { mainNavItems } from '@/components/app-sidebar';
import AppLogo from '@/components/app-logo';
import { moduleNavItems } from '@/components/modules/module-pages';
import { isNavParentItem, NavIconTile } from '@/components/nav-main';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { NavEntry, NavItem } from '@/types';

/** The sidebar's menu: Overview links, then one dropdown per workspace module. */
const navEntries: NavEntry[] = [...mainNavItems, ...moduleNavItems];

type MegaMenuFeature = {
    eyebrow: string;
    title: string;
    text: string;
};

/**
 * Modules whose dropdown is a mega menu: a navy feature card opening the
 * first page, beside icon rows with descriptions. The rest are plain lists.
 */
const megaMenuFeatures: Record<string, MegaMenuFeature> = {
    Reports: {
        eyebrow: 'Insights',
        title: 'Reports at a glance',
        text: 'Sales, stock value and profit, ready to review or print.',
    },
};

/** Drops the dropdowns just past the bar's bottom rule instead of under it (triggers are h-9). */
const dropdownOffsetClassName =
    'group-data-[viewport=false]/navigation-menu:mt-[calc((var(--app-header-height)-2.25rem)/2+0.25rem)]';

/**
 * Top bar entry: icon + label, tinted navy on the current page (or, for a
 * dropdown, when one of its links is the current page).
 */
const topItemClassName = cn(
    'h-9 gap-1.5 rounded-lg bg-transparent px-3 text-[13.5px] font-medium text-sidebar-accent-foreground',
    'hover:bg-sidebar-primary/[0.05] hover:text-sidebar-primary focus:bg-sidebar-primary/[0.05] data-[state=open]:bg-sidebar-primary/[0.05] data-[state=open]:text-sidebar-primary',
    'data-[active=true]:bg-sidebar-primary/[0.07] data-[active=true]:font-semibold data-[active=true]:text-sidebar-primary',
    'dark:hover:bg-white/[0.04] dark:data-[active=true]:bg-sidebar-primary/[0.1]',
);

function useIsActiveLink() {
    // Sub-pages such as /catalog/products/create keep their menu entry active.
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (link: NavItem) => isCurrentOrParentUrl(link.href);
}

function DropdownLink({
    link,
    isActive,
}: {
    link: NavItem;
    isActive: boolean;
}) {
    return (
        <NavigationMenuLink asChild data-active={isActive}>
            <Link
                href={link.href}
                prefetch
                className={cn(
                    'rounded-[7px] px-2.5 py-[0.45rem] text-[12.5px] font-medium text-sidebar-accent-foreground hover:bg-sidebar-primary/[0.05] hover:text-sidebar-primary focus:bg-sidebar-primary/[0.05] dark:hover:bg-white/[0.04]',
                    'data-[active=true]:bg-sidebar-highlight/15 data-[active=true]:font-semibold data-[active=true]:text-sidebar-primary data-[active=true]:hover:bg-sidebar-highlight/20 data-[active=true]:focus:bg-sidebar-highlight/20',
                )}
            >
                {link.title}
            </Link>
        </NavigationMenuLink>
    );
}

function MegaMenu({
    items,
    feature,
    isActive,
}: {
    items: NavItem[];
    feature: MegaMenuFeature;
    isActive: (link: NavItem) => boolean;
}) {
    const [firstItem] = items;

    return (
        <div className="grid w-[540px] grid-cols-[210px_1fr] gap-2 p-2">
            <NavigationMenuLink asChild>
                <Link
                    href={firstItem.href}
                    prefetch
                    className="group/feature relative flex flex-col justify-end gap-1.5 overflow-hidden rounded-lg bg-linear-160 from-[#04203f] via-[#07305d] to-[#0d4a8a] p-4 text-white hover:bg-transparent hover:text-white focus:bg-transparent focus:text-white"
                >
                    <span className="absolute inset-0 fabric-weave [--weave-size:16px]" />
                    <span className="absolute inset-1.5 rounded-md border border-dashed border-sidebar-highlight/45 transition-colors group-hover/feature:border-sidebar-highlight/80" />
                    <span className="relative mb-auto grid size-10 place-items-center rounded-lg bg-white/10 ring-1 ring-white/15">
                        <Icon
                            icon="solar:chart-square-bold-duotone"
                            className="size-6 text-white"
                        />
                    </span>
                    <span className="relative mt-6 text-[10px] font-bold tracking-[0.14em] text-sidebar-highlight uppercase">
                        {feature.eyebrow}
                    </span>
                    <span className="relative font-heading text-[15px] leading-snug font-semibold text-white">
                        {feature.title}
                    </span>
                    <span className="relative text-xs leading-relaxed text-white/75">
                        {feature.text}
                    </span>
                    <span className="relative mt-1 inline-flex w-fit items-center gap-1 rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-sidebar-primary">
                        Open {firstItem.title}
                        <Icon
                            icon="solar:arrow-right-linear"
                            className="size-3.5 transition-transform group-hover/feature:translate-x-0.5"
                        />
                    </span>
                </Link>
            </NavigationMenuLink>

            <div className="flex flex-col gap-0.5 py-0.5">
                {items.map((link) => (
                    <NavigationMenuLink
                        key={link.title}
                        asChild
                        data-active={isActive(link)}
                    >
                        <Link
                            href={link.href}
                            prefetch
                            className="group/nav flex-row items-center gap-3 rounded-lg px-2.5 py-2 hover:bg-sidebar-primary/[0.05] focus:bg-sidebar-primary/[0.05] data-[active=true]:bg-sidebar-primary/[0.07] dark:hover:bg-white/[0.04]"
                        >
                            {link.icon && (
                                <NavIconTile
                                    icon={link.icon}
                                    isActive={isActive(link)}
                                />
                            )}
                            <span className="flex min-w-0 flex-col">
                                <span
                                    className={cn(
                                        'text-[13px] font-semibold text-sidebar-accent-foreground',
                                        isActive(link) &&
                                            'text-sidebar-primary',
                                    )}
                                >
                                    {link.title}
                                </span>
                                {link.description && (
                                    <span className="text-xs text-muted-foreground">
                                        {link.description}
                                    </span>
                                )}
                            </span>
                        </Link>
                    </NavigationMenuLink>
                ))}
            </div>
        </div>
    );
}

/** Cancels Radix's hover handling so the dropdowns open and close on click only. */
const ignoreHover = {
    onPointerMove: (event: PointerEvent) => event.preventDefault(),
    onPointerLeave: (event: PointerEvent) => event.preventDefault(),
};

function DesktopNav() {
    const isActive = useIsActiveLink();
    const [openMenu, setOpenMenu] = useState('');

    return (
        <NavigationMenu
            value={openMenu}
            onValueChange={setOpenMenu}
            viewport={false}
            className="hidden lg:flex"
        >
            <NavigationMenuList className="gap-0.5">
                {navEntries.map((entry) =>
                    isNavParentItem(entry) ? (
                        <NavigationMenuItem
                            key={entry.title}
                            value={entry.title}
                        >
                            <NavigationMenuTrigger
                                {...ignoreHover}
                                data-active={entry.items.some(isActive)}
                                className={topItemClassName}
                            >
                                {entry.icon && (
                                    <Icon
                                        icon={entry.icon}
                                        className="size-[18px] opacity-80"
                                    />
                                )}
                                {entry.title}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent
                                {...ignoreHover}
                                className={cn(
                                    'rounded-xl p-0 shadow-[0_12px_28px_-10px_rgb(7_48_93/0.3)]',
                                    dropdownOffsetClassName,
                                    megaMenuFeatures[entry.title] &&
                                        'md:right-0 md:left-auto',
                                )}
                                onClick={(event) => {
                                    // Close once a link is chosen; the page change keeps the bar mounted.
                                    if (
                                        (event.target as Element).closest('a')
                                    ) {
                                        setOpenMenu('');
                                    }
                                }}
                            >
                                {megaMenuFeatures[entry.title] ? (
                                    <MegaMenu
                                        items={entry.items}
                                        feature={megaMenuFeatures[entry.title]}
                                        isActive={isActive}
                                    />
                                ) : (
                                    <div className="flex w-[210px] flex-col gap-[3px] p-1.5">
                                        {entry.items.map((link) => (
                                            <DropdownLink
                                                key={link.title}
                                                link={link}
                                                isActive={isActive(link)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    ) : (
                        <NavigationMenuItem key={entry.title}>
                            <NavigationMenuLink
                                asChild
                                data-active={isActive(entry)}
                                className={cn(
                                    navigationMenuTriggerStyle(),
                                    topItemClassName,
                                    'flex-row items-center',
                                )}
                            >
                                <Link href={entry.href} prefetch>
                                    {entry.icon && (
                                        <Icon
                                            icon={entry.icon}
                                            className="size-[18px] text-current opacity-80"
                                        />
                                    )}
                                    {entry.title}
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    ),
                )}
            </NavigationMenuList>
        </NavigationMenu>
    );
}

function MobileNav() {
    const isActive = useIsActiveLink();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button
                    type="button"
                    aria-label="Open menu"
                    className="grid shrink-0 place-items-center rounded-md text-muted-foreground transition-colors outline-none hover:text-sidebar-primary focus-visible:ring-2 focus-visible:ring-sidebar-highlight lg:hidden"
                >
                    <Icon
                        icon="solar:hamburger-menu-line-duotone"
                        className="size-6"
                    />
                </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 gap-0 bg-sidebar p-0">
                <SheetHeader className="border-b border-sidebar-border px-5 py-4">
                    <SheetTitle className="flex items-center gap-2.5">
                        <AppLogo />
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                        Main navigation
                    </SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col gap-4 overflow-y-auto px-3 py-4">
                    {navEntries.map((entry) => {
                        const links = isNavParentItem(entry)
                            ? entry.items
                            : [entry];

                        return (
                            <div
                                key={entry.title}
                                className="flex flex-col gap-0.5"
                            >
                                {isNavParentItem(entry) && (
                                    <span className="flex items-center gap-2 px-2.5 pb-1 text-[10px] font-bold tracking-[0.12em] text-sidebar-foreground uppercase">
                                        {entry.icon && (
                                            <Icon
                                                icon={entry.icon}
                                                className="size-4"
                                            />
                                        )}
                                        {entry.title}
                                    </span>
                                )}
                                {links.map((link) => (
                                    <Link
                                        key={link.title}
                                        href={link.href}
                                        prefetch
                                        className={cn(
                                            'group/nav flex items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-[13px] font-medium text-sidebar-accent-foreground transition-colors hover:bg-sidebar-primary/[0.05] hover:text-sidebar-primary',
                                            isActive(link) &&
                                                'bg-sidebar-primary/[0.07] font-semibold text-sidebar-primary',
                                        )}
                                    >
                                        {link.icon && (
                                            <NavIconTile
                                                icon={link.icon}
                                                isActive={isActive(link)}
                                            />
                                        )}
                                        {link.title}
                                    </Link>
                                ))}
                            </div>
                        );
                    })}
                </nav>
            </SheetContent>
        </Sheet>
    );
}

function UserMenu() {
    const { auth } = usePage().props;
    const getInitials = useInitials();

    if (!auth.user) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    aria-label="Open user menu"
                    className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-sidebar-highlight"
                >
                    <Avatar className="size-9 overflow-hidden rounded-full">
                        <AvatarImage
                            src={auth.user.avatar}
                            alt={auth.user.name}
                        />
                        <AvatarFallback className="rounded-full bg-sidebar-primary text-xs font-semibold text-white">
                            {getInitials(auth.user.name)}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <UserMenuContent user={auth.user} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/**
 * Sticky top bar carrying the same menu as the sidebar: plain links for the
 * Overview entries and a dropdown per module. Below `lg` the menu moves into
 * a drawer.
 */
export function AppHeader() {
    return (
        <header className="sticky top-0 z-30 bg-sidebar after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:brand-rule-x after:content-[''] print:hidden">
            <div className="flex h-(--app-header-height) w-full items-center gap-3 px-4 md:px-6">
                <MobileNav />
                <Link
                    href={dashboard()}
                    prefetch
                    className="mr-3 flex shrink-0 items-center gap-2.5 text-sidebar-accent-foreground outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                >
                    <AppLogo />
                </Link>

                <DesktopNav />

                <div className="ml-auto flex items-center gap-2">
                    <UserMenu />
                </div>
            </div>
        </header>
    );
}
