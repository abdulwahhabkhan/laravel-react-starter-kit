import type { CategorySales } from '@/components/dashboard/dashboard-data';
import { formatCompactRupees } from '@/components/dashboard/panel';

/**
 * Horizontal bars ranking categories by revenue, each with its share of the total.
 */
export function CategoryBars({ data }: { data: CategorySales[] }) {
    const total = data.reduce((sum, item) => sum + item.revenue, 0);
    const max = Math.max(...data.map((item) => item.revenue));

    return (
        <ul className="flex h-full flex-col justify-between gap-4">
            {data.map((item) => {
                const share = (item.revenue / total) * 100;

                return (
                    <li
                        key={item.category}
                        className="group"
                        title={`${item.category}: Rs ${formatCompactRupees(item.revenue)} (${share.toFixed(1)}%)`}
                    >
                        <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[13px]">
                            <span className="font-medium">{item.category}</span>
                            <span className="font-numeric text-muted-foreground">
                                <span className="font-semibold text-foreground">
                                    Rs {formatCompactRupees(item.revenue)}
                                </span>
                                <span className="ml-1.5 text-xs">
                                    {share.toFixed(0)}%
                                </span>
                            </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted-foreground/10">
                            <div
                                className="h-full rounded-full bg-chart-1 transition-opacity group-hover:opacity-80"
                                style={{
                                    width: `${(item.revenue / max) * 100}%`,
                                }}
                            />
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
