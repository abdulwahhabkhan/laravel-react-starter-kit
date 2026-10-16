import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Bordered dashboard card with a title row and optional action on the right.
 */
export function Panel({
    title,
    description,
    action,
    className,
    children,
}: {
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
    children: ReactNode;
}) {
    return (
        <section
            className={cn(
                'flex min-w-0 flex-col rounded-xl border border-card-border bg-card text-card-foreground shadow-card',
                className,
            )}
        >
            <header className="flex items-start justify-between gap-4 px-5 pt-4 pb-3">
                <div className="min-w-0">
                    <h2 className="text-[15px] font-semibold tracking-tight">
                        {title}
                    </h2>
                    {description && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
                {action}
            </header>
            <div className="flex-1 px-5 pb-5">{children}</div>
        </section>
    );
}

/** Small text link used in a panel header ("View all →"). */
export function PanelLink({ children }: { children: ReactNode }) {
    return (
        <button
            type="button"
            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-sidebar-primary hover:underline"
        >
            {children}
        </button>
    );
}

/** Formats rupees compactly: 4,820,000 → "4.82M", 86,200 → "86.2K". */
export function formatCompactRupees(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 2,
    }).format(amount);
}

/** Formats rupees in full with grouping: 248500 → "248,500". */
export function formatRupees(amount: number): string {
    return new Intl.NumberFormat('en-US').format(amount);
}
