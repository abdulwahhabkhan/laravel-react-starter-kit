import { Icon } from '@iconify/react/offline';
import { useId } from 'react';
import type { StatTileData } from '@/components/dashboard/dashboard-data';
import { cn } from '@/lib/utils';

function Sparkline({ values }: { values: number[] }) {
    const gradientId = useId();
    const width = 120;
    const height = 36;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const points = values.map((value, index) => [
        (index / (values.length - 1)) * width,
        height - 3 - ((value - min) / range) * (height - 6),
    ]);
    const line = points.map(([x, y]) => `${x},${y}`).join(' ');
    const [lastX, lastY] = points[points.length - 1];

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-9 w-[120px] overflow-visible text-chart-1"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                    <stop
                        offset="0%"
                        stopColor="currentColor"
                        stopOpacity="0.18"
                    />
                    <stop
                        offset="100%"
                        stopColor="currentColor"
                        stopOpacity="0"
                    />
                </linearGradient>
            </defs>
            <polygon
                points={`0,${height} ${line} ${width},${height}`}
                fill={`url(#${gradientId})`}
            />
            <polyline
                points={line}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle
                cx={lastX}
                cy={lastY}
                r="3"
                fill="currentColor"
                className="stroke-card"
                strokeWidth="2"
            />
        </svg>
    );
}

export function StatTile({ tile }: { tile: StatTileData }) {
    const isUp = tile.change >= 0;

    return (
        <div className="relative overflow-hidden rounded-xl border border-card-border bg-card p-5 text-card-foreground shadow-card">
            <div className="flex items-start justify-between gap-3">
                <span className="text-[13px] font-medium text-muted-foreground">
                    {tile.label}
                </span>
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-sidebar-primary/[0.08] text-sidebar-primary dark:bg-sidebar-primary/[0.12]">
                    <Icon icon={tile.icon} className="size-5" />
                </span>
            </div>

            <div className="mt-2 flex items-end justify-between gap-3">
                <div className="min-w-0">
                    <p className="flex items-baseline gap-1 font-numeric text-[28px] leading-none font-semibold tracking-tight">
                        {tile.unit && (
                            <span className="text-sm font-medium text-muted-foreground">
                                {tile.unit}
                            </span>
                        )}
                        {tile.value}
                    </p>
                    <p className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span
                            className={cn(
                                'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-numeric font-semibold',
                                isUp
                                    ? 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-400'
                                    : 'bg-rose-600/10 text-rose-700 dark:text-rose-400',
                            )}
                        >
                            <Icon
                                icon={
                                    isUp
                                        ? 'solar:arrow-right-up-linear'
                                        : 'solar:arrow-right-down-linear'
                                }
                                className="size-3"
                                aria-hidden="true"
                            />
                            <span className="sr-only">
                                {isUp ? 'Up' : 'Down'}
                            </span>
                            {Math.abs(tile.change).toFixed(1)}%
                        </span>
                        <span className="truncate">{tile.caption}</span>
                    </p>
                </div>
                <Sparkline values={tile.trend} />
            </div>
        </div>
    );
}
