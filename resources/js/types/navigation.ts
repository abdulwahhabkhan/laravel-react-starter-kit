import type { InertiaLinkProps } from '@inertiajs/react';

export type BreadcrumbItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
};

export type NavItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    /** Iconify icon name, e.g. `solar:widget-5-bold-duotone`. */
    icon?: string | null;
    isActive?: boolean;
};

/** A sidebar entry that expands to show nested links instead of navigating. */
export type NavParentItem = {
    title: string;
    /** Iconify icon name, e.g. `solar:cart-large-2-bold-duotone`. */
    icon?: string | null;
    items: NavItem[];
};

export type NavEntry = NavItem | NavParentItem;
