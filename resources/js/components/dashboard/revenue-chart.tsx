import { useEffect, useId, useRef, useState } from 'react';
import type { MonthlyRevenue } from '@/components/dashboard/dashboard-data';
import {
    formatCompactRupees,
    formatRupees,
} from '@/components/dashboard/panel';

const HEIGHT = 260;
const PADDING = { top: 16, right: 12, bottom: 28, left: 44 };

/**
 * Single-series area chart with a hover crosshair and tooltip.
 */
export function RevenueChart({ data }: { data: MonthlyRevenue[] }) {
    const gradientId = useId();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [chartWidth, setChartWidth] = useState(640);

    useEffect(() => {
        const container = containerRef.current;

        if (!container) {
            return;
        }

        const observer = new ResizeObserver(([entry]) =>
            setChartWidth(Math.max(entry.contentRect.width, 280)),
        );
        observer.observe(container);

        return () => observer.disconnect();
    }, []);

    const plotWidth = chartWidth - PADDING.left - PADDING.right;
    const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
    const maxValue =
        Math.ceil(Math.max(...data.map((d) => d.revenue)) / 1_000_000) *
        1_000_000;
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((step) => step * maxValue);

    const xFor = (index: number) =>
        PADDING.left + (index / (data.length - 1)) * plotWidth;
    const yFor = (value: number) =>
        PADDING.top + plotHeight - (value / maxValue) * plotHeight;

    const line = data
        .map((d, index) => `${xFor(index)},${yFor(d.revenue)}`)
        .join(' ');
    const area = `${xFor(0)},${yFor(0)} ${line} ${xFor(data.length - 1)},${yFor(0)}`;

    const active = activeIndex === null ? null : data[activeIndex];
    const previous =
        activeIndex !== null && activeIndex > 0 ? data[activeIndex - 1] : null;
    const changeFromPrevious =
        active && previous
            ? ((active.revenue - previous.revenue) / previous.revenue) * 100
            : null;

    return (
        <div ref={containerRef} className="relative">
            <svg
                width={chartWidth}
                height={HEIGHT}
                viewBox={`0 0 ${chartWidth} ${HEIGHT}`}
                className="block overflow-visible"
                role="img"
                aria-label={`Monthly revenue from ${data[0].month} to ${data[data.length - 1].month}`}
                onMouseLeave={() => setActiveIndex(null)}
            >
                <defs>
                    <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                        <stop
                            offset="0%"
                            stopColor="var(--chart-1)"
                            stopOpacity="0.2"
                        />
                        <stop
                            offset="100%"
                            stopColor="var(--chart-1)"
                            stopOpacity="0"
                        />
                    </linearGradient>
                </defs>

                {ticks.map((tick) => (
                    <g key={tick}>
                        <line
                            x1={PADDING.left}
                            x2={chartWidth - PADDING.right}
                            y1={yFor(tick)}
                            y2={yFor(tick)}
                            className="stroke-border"
                            strokeDasharray={tick === 0 ? undefined : '3 4'}
                        />
                        <text
                            x={PADDING.left - 10}
                            y={yFor(tick)}
                            textAnchor="end"
                            dominantBaseline="middle"
                            className="fill-muted-foreground font-numeric text-[11px]"
                        >
                            {tick === 0 ? '0' : formatCompactRupees(tick)}
                        </text>
                    </g>
                ))}

                {data.map((d, index) => (
                    <text
                        key={d.month}
                        x={xFor(index)}
                        y={HEIGHT - 6}
                        textAnchor="middle"
                        className="fill-muted-foreground text-[11px]"
                    >
                        {d.month}
                    </text>
                ))}

                <polygon points={area} fill={`url(#${gradientId})`} />
                <polyline
                    points={line}
                    fill="none"
                    stroke="var(--chart-1)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {active && activeIndex !== null && (
                    <g>
                        <line
                            x1={xFor(activeIndex)}
                            x2={xFor(activeIndex)}
                            y1={PADDING.top}
                            y2={yFor(0)}
                            className="stroke-muted-foreground/40"
                        />
                        <circle
                            cx={xFor(activeIndex)}
                            cy={yFor(active.revenue)}
                            r="5"
                            fill="var(--chart-1)"
                            className="stroke-card"
                            strokeWidth="2"
                        />
                    </g>
                )}

                {data.map((d, index) => (
                    <rect
                        key={d.month}
                        x={xFor(index) - plotWidth / (data.length - 1) / 2}
                        y={PADDING.top}
                        width={plotWidth / (data.length - 1)}
                        height={plotHeight}
                        fill="transparent"
                        onMouseEnter={() => setActiveIndex(index)}
                    />
                ))}
            </svg>

            {active && activeIndex !== null && (
                <div
                    className="pointer-events-none absolute top-0 z-10 min-w-36 -translate-x-1/2 rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg"
                    style={{
                        left: `${Math.min(Math.max((xFor(activeIndex) / chartWidth) * 100, 12), 88)}%`,
                    }}
                >
                    <p className="font-semibold">{active.month}</p>
                    <p className="mt-1 flex items-center justify-between gap-4">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                            <span className="size-2 rounded-full bg-chart-1" />
                            Revenue
                        </span>
                        <span className="font-numeric font-semibold">
                            Rs {formatRupees(active.revenue)}
                        </span>
                    </p>
                    {changeFromPrevious !== null && (
                        <p className="mt-0.5 font-numeric text-muted-foreground">
                            {changeFromPrevious >= 0 ? '+' : ''}
                            {changeFromPrevious.toFixed(1)}% vs{' '}
                            {previous?.month}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
