import { Icon } from '@iconify/react/offline';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Card section with a Solar icon, title and hint, wrapping a listing or form. */
export function DataSection({
    icon,
    title,
    hint,
    className,
    children,
}: {
    icon: string;
    title: string;
    hint?: string;
    /** Body padding; defaults to a tight listing. Pass `p-5` for forms. */
    className?: string;
    children: ReactNode;
}) {
    return (
        <section className="overflow-hidden rounded-xl border border-card-border bg-card text-card-foreground shadow-card">
            <header className="flex items-center gap-3 border-b border-border px-5 py-4">
                <Icon
                    icon={icon}
                    className="size-6 shrink-0 text-sidebar-primary dark:text-foreground"
                />
                <div className="min-w-0">
                    <h2 className="text-sm font-semibold">{title}</h2>
                    {hint && (
                        <p className="text-xs text-muted-foreground">{hint}</p>
                    )}
                </div>
            </header>
            <div className={cn('px-5 py-2', className)}>{children}</div>
        </section>
    );
}

/** Key/value listing with a dashed divider between rows. */
export function DataList({ children }: { children: ReactNode }) {
    return <dl className="divide-y divide-dashed divide-border">{children}</dl>;
}

export function DataRow({
    icon,
    label,
    children,
}: {
    icon: string;
    label: ReactNode;
    children?: ReactNode;
}) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3 text-sm">
            <dt className="flex items-center gap-2 text-muted-foreground">
                <Icon icon={icon} className="size-4.5 shrink-0" />
                {label}
            </dt>
            <dd className="min-w-0 font-medium break-words">
                {children ?? <span className="text-muted-foreground">—</span>}
            </dd>
        </div>
    );
}

/** Small pill showing a state such as Enabled or Disabled. */
export function DataStatus({
    tone,
    children,
}: {
    tone: 'success' | 'warning' | 'muted';
    children: ReactNode;
}) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
                {
                    'bg-tone-green-bg text-tone-green': tone === 'success',
                    'bg-tone-orange-bg text-tone-orange': tone === 'warning',
                    'bg-muted text-muted-foreground': tone === 'muted',
                },
            )}
        >
            {children}
        </span>
    );
}
