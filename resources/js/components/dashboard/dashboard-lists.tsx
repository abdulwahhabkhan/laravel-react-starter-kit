import { Icon } from '@iconify/react/offline';
import type {
    LowStockItem,
    OrderStatus,
    RecentOrder,
    TopProduct,
} from '@/components/dashboard/dashboard-data';
import {
    formatCompactRupees,
    formatRupees,
} from '@/components/dashboard/panel';
import { cn } from '@/lib/utils';

const orderStatusStyles: Record<
    OrderStatus,
    { label: string; icon: string; className: string }
> = {
    paid: {
        label: 'Paid',
        icon: 'solar:check-circle-bold',
        className: 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-400',
    },
    pending: {
        label: 'Pending',
        icon: 'solar:clock-circle-bold',
        className: 'bg-amber-500/15 text-amber-800 dark:text-amber-300',
    },
    overdue: {
        label: 'Overdue',
        icon: 'solar:danger-circle-bold',
        className: 'bg-rose-600/10 text-rose-700 dark:text-rose-400',
    },
};

function OrderStatusBadge({ status }: { status: OrderStatus }) {
    const style = orderStatusStyles[status];

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
                style.className,
            )}
        >
            <Icon icon={style.icon} className="size-3.5" aria-hidden="true" />
            {style.label}
        </span>
    );
}

export function RecentOrdersTable({ orders }: { orders: RecentOrder[] }) {
    return (
        <div className="-mx-5 overflow-x-auto">
            <table className="w-full min-w-[560px] animate-table text-[13px]">
                <thead>
                    <tr className="border-y border-border text-left text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
                        <th className="px-5 py-2 font-medium">Order</th>
                        <th className="px-3 py-2 font-medium">Customer</th>
                        <th className="px-3 py-2 text-right font-medium">
                            Items
                        </th>
                        <th className="px-3 py-2 text-right font-medium">
                            Total
                        </th>
                        <th className="px-5 py-2 font-medium">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr
                            key={order.number}
                            className="border-b border-border/70 transition-colors last:border-0 hover:bg-accent/60"
                        >
                            <td className="px-5 py-2.5">
                                <p className="font-semibold text-sidebar-primary">
                                    {order.number}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {order.date}
                                </p>
                            </td>
                            <td className="px-3 py-2.5 font-medium">
                                {order.customer}
                            </td>
                            <td className="px-3 py-2.5 text-right font-numeric">
                                {order.items}
                            </td>
                            <td className="px-3 py-2.5 text-right font-numeric font-semibold">
                                <span className="mr-1 text-xs font-normal text-muted-foreground">
                                    Rs
                                </span>
                                {formatRupees(order.total)}
                            </td>
                            <td className="px-5 py-2.5">
                                <OrderStatusBadge status={order.status} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function TopProductsList({ products }: { products: TopProduct[] }) {
    return (
        <ol className="flex flex-col divide-y divide-border/70">
            {products.map((product, index) => (
                <li
                    key={product.sku}
                    className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
                >
                    <span
                        className={cn(
                            'grid size-7 shrink-0 place-items-center rounded-full font-numeric text-xs font-bold',
                            index === 0
                                ? 'bg-sidebar-highlight/20 text-[#8a5a1f] dark:text-sidebar-highlight'
                                : 'bg-muted-foreground/10 text-muted-foreground',
                        )}
                    >
                        {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium">
                            {product.name}
                        </p>
                        <p className="font-mono text-[11px] text-muted-foreground">
                            {product.sku}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="font-numeric text-[13px] font-semibold">
                            Rs {formatCompactRupees(product.revenue)}
                        </p>
                        <p className="font-numeric text-[11px] text-muted-foreground">
                            {formatRupees(product.unitsSold)} sold
                        </p>
                    </div>
                </li>
            ))}
        </ol>
    );
}

export function LowStockList({ items }: { items: LowStockItem[] }) {
    return (
        <ul className="flex flex-col gap-3.5">
            {items.map((item) => {
                const fill = Math.min(
                    (item.onHand / item.reorderLevel) * 100,
                    100,
                );
                const isCritical = fill < 35;

                return (
                    <li key={item.sku}>
                        <div className="mb-1.5 flex items-baseline justify-between gap-3">
                            <span className="truncate text-[13px] font-medium">
                                {item.name}
                            </span>
                            <span className="shrink-0 font-numeric text-xs text-muted-foreground">
                                <span
                                    className={cn(
                                        'font-semibold',
                                        isCritical
                                            ? 'text-rose-700 dark:text-rose-400'
                                            : 'text-amber-800 dark:text-amber-300',
                                    )}
                                >
                                    {formatRupees(item.onHand)}
                                </span>{' '}
                                / {formatRupees(item.reorderLevel)} {item.uom}
                            </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-muted-foreground/10">
                            <div
                                className={cn(
                                    'h-full rounded-full',
                                    isCritical ? 'bg-rose-500' : 'bg-amber-500',
                                )}
                                style={{ width: `${fill}%` }}
                            />
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}

const quickActions = [
    {
        title: 'New sale order',
        caption: 'Invoice a customer',
        icon: 'solar:cart-plus-bold-duotone',
    },
    {
        title: 'New purchase',
        caption: 'Record supplier stock',
        icon: 'solar:box-minimalistic-bold-duotone',
    },
    {
        title: 'Add product',
        caption: 'Create a catalog item',
        icon: 'solar:tag-price-bold-duotone',
    },
    {
        title: 'Journal voucher',
        caption: 'Post an entry',
        icon: 'solar:notebook-bold-duotone',
    },
];

export function QuickActions() {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => (
                <button
                    key={action.title}
                    type="button"
                    className="group flex items-center gap-3 rounded-xl border border-card-border bg-card p-3.5 text-left shadow-card transition-colors hover:border-sidebar-primary/40"
                >
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-sidebar-primary/[0.08] text-sidebar-primary dark:bg-sidebar-primary/[0.12]">
                        <Icon icon={action.icon} className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-semibold">
                            {action.title}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                            {action.caption}
                        </span>
                    </span>
                    <Icon
                        icon="solar:alt-arrow-right-linear"
                        className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    />
                </button>
            ))}
        </div>
    );
}
