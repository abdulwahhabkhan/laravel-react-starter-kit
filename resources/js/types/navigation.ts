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
