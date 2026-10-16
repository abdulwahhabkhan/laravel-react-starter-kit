import { cn } from '@/lib/utils';

const positiveStatuses = [
    'active',
    'paid',
    'accepted',
    'approved',
    'completed',
    'received',
    'in stock',
    'healthy',
    'up',
];
const warningStatuses = [
    'pending',
    'draft',
    'sent',
    'scheduled',
    'in transit',
    'low stock',
    'flat',
    'on hold',
];
const negativeStatuses = [
    'overdue',
    'inactive',
    'expired',
    'rejected',
    'critical',
    'archived',
    'down',
    'blocked',
];

function statusClassName(status: string): string {
    const normalized = status.toLowerCase();

    if (positiveStatuses.includes(normalized)) {
        return 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-400';
    }

    if (warningStatuses.includes(normalized)) {
        return 'bg-amber-500/15 text-amber-800 dark:text-amber-300';
    }

    if (negativeStatuses.includes(normalized)) {
        return 'bg-rose-600/10 text-rose-700 dark:text-rose-400';
    }

    return 'bg-muted-foreground/10 text-muted-foreground';
}

/** Rounded status pill tinted by the status' tone (positive, warning, negative). */
export function StatusBadge({ status }: { status: string }) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold',
                statusClassName(status),
            )}
        >
            {status}
        </span>
    );
}
