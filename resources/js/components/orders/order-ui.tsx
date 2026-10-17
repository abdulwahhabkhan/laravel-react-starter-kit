import { Icon } from '@iconify/react/offline';
import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { formatMoney } from '@/components/products/product-form';
import type { Tone } from '@/components/status-filter';
import { cn } from '@/lib/utils';
import type { OrderStatus, Paginated } from '@/types';

/** Tone, dot and icon for each order status, shared by tabs, badges and the preview. */
export const orderStatusStyles: Record<
    OrderStatus,
    { badge: string; dot: string; icon: string; tone: Tone }
> = {
    draft: {
        tone: 'orange',
        badge: 'bg-tone-orange-bg text-tone-orange ring-tone-orange/20',
        dot: 'bg-tone-orange',
        icon: 'solar:pen-new-square-bold-duotone',
    },
    confirmed: {
        tone: 'navy',
        badge: 'bg-tone-navy-bg text-tone-navy ring-tone-navy/20',
        dot: 'bg-tone-navy',
        icon: 'solar:check-circle-bold-duotone',
    },
    fulfilled: {
        tone: 'green',
        badge: 'bg-tone-green-bg text-tone-green ring-tone-green/20',
        dot: 'bg-tone-green',
        icon: 'solar:box-bold-duotone',
    },
    cancelled: {
        tone: 'red',
        badge: 'bg-tone-red-bg text-tone-red ring-tone-red/20',
        dot: 'bg-tone-red',
        icon: 'solar:close-circle-bold-duotone',
    },
};

export function OrderStatusBadge({
    status,
    label,
    className,
}: {
    status: OrderStatus;
    label: string;
    className?: string;
}) {
    const styles = orderStatusStyles[status];

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-[11.5px] font-semibold whitespace-nowrap ring-1 ring-inset',
                styles.badge,
                className,
            )}
        >
            <span className="size-1.5 rounded-full bg-current" aria-hidden />
            {label}
        </span>
    );
}

export function formatDate(value: string | null): string {
    if (!value) {
        return '—';
    }

    // Date-only strings are parsed as local dates so they never shift a day.
    const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
        ? new Date(`${value}T00:00:00`)
        : new Date(value);

    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export function toNumber(value: string | number | null | undefined): number {
    const number =
        typeof value === 'number' ? value : Number.parseFloat(value ?? '');

    return Number.isFinite(number) ? number : 0;
}

/** Rupee amount with a muted currency prefix. */
export function Money({
    value,
    className,
}: {
    value: string | number;
    className?: string;
}) {
    return (
        <span className={cn('font-numeric', className)}>
            <span className="mr-1 text-[0.8em] font-normal text-muted-foreground">
                Rs
            </span>
            {formatMoney(toNumber(value))}
        </span>
    );
}

/** Formats a quantity without trailing zeros, e.g. "4.000" → "4". */
export function formatQuantity(value: string | number): string {
    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 3,
    }).format(toNumber(value));
}

/** Card section with an icon tile heading, matching the customer and product forms. */
export function OrderCard({
    icon,
    title,
    description,
    actions,
    className,
    children,
}: {
    icon: string;
    title: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
    className?: string;
    children: ReactNode;
}) {
    return (
        <section
            className={cn(
                'rounded-xl border border-card-border bg-card text-card-foreground shadow-card',
                className,
            )}
        >
            <header className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-3.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-sidebar-primary/[0.08] text-sidebar-primary dark:bg-sidebar-primary/[0.14]">
                    <Icon icon={icon} className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-semibold">{title}</h2>
                    {description && (
                        <p className="text-xs text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
                {actions && (
                    <div className="flex items-center gap-2">{actions}</div>
                )}
            </header>
            {children}
        </section>
    );
}

export function Pagination<T>({
    page,
    noun,
}: {
    page: Paginated<T>;
    noun: string;
}) {
    if (page.total === 0) {
        return null;
    }

    return (
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground">
            <span>
                Showing {page.from} to {page.to} of {page.total} {noun}
            </span>
            {page.last_page > 1 && (
                <nav
                    className="flex items-center gap-1"
                    aria-label="Pagination"
                >
                    {page.links.map((link, position) => {
                        const label = link.label
                            .replace('&laquo; Previous', 'Previous')
                            .replace('Next &raquo;', 'Next');
                        const className = cn(
                            'grid h-7 min-w-7 place-items-center rounded-md border px-2 font-semibold',
                            link.active
                                ? 'border-sidebar-primary bg-sidebar-primary text-white dark:text-sidebar-primary-foreground'
                                : 'border-border bg-card text-foreground hover:border-sidebar-primary/40',
                            !link.url && 'pointer-events-none opacity-50',
                        );

                        return link.url ? (
                            <Link
                                key={position}
                                href={link.url}
                                preserveScroll
                                preserveState
                                className={className}
                                aria-current={link.active ? 'page' : undefined}
                            >
                                {label}
                            </Link>
                        ) : (
                            <span key={position} className={className}>
                                {label}
                            </span>
                        );
                    })}
                </nav>
            )}
        </footer>
    );
}
