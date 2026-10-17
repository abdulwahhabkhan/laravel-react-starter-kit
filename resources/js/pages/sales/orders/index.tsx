import { Icon } from '@iconify/react/offline';
import { Head, Link, router, setLayoutProps } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { useConfirm } from '@/components/confirm-dialog';
import { FilterSelect, filterFieldClassName } from '@/components/filter-field';
import { NewOrderDialog } from '@/components/orders/new-order-dialog';
import {
    Money,
    OrderStatusBadge,
    Pagination,
    formatDate,
    orderStatusStyles,
} from '@/components/orders/order-ui';
import { PageContent, PageFilters, PageHeader } from '@/components/page';
import {
    RowActions,
    RowMenu,
    ViewAction,
    actionIcons,
    pinnedActionsCellClass,
    pinnedActionsHeadClass,
} from '@/components/row-actions';
import { StatusFilter } from '@/components/status-filter';
import { Button } from '@/components/ui/button';
import { useOverflowEnd } from '@/hooks/use-overflow-end';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { destroy, edit, index, show } from '@/routes/orders';
import type {
    CustomerOption,
    FilterOption,
    OrderListItem,
    OrderStatus,
    Paginated,
} from '@/types';

/** Columns that collapse to their content width. */
const shrink = 'w-1 whitespace-nowrap';

type Filters = {
    search: string;
    status: string;
    customer: number | '';
    from: string;
    to: string;
};

function DateField({
    label,
    value,
    min,
    max,
    onChange,
}: {
    label: string;
    value: string;
    min?: string;
    max?: string;
    onChange: (value: string) => void;
}) {
    return (
        <label className="relative block lg:-ml-px lg:w-[168px]">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[10px] font-bold tracking-wide text-muted-foreground uppercase">
                {label}
            </span>
            <input
                type="date"
                value={value}
                min={min}
                max={max}
                onChange={(event) => onChange(event.target.value)}
                aria-label={`Order date ${label.toLowerCase()}`}
                className={cn(
                    filterFieldClassName,
                    'pl-11 [&::-webkit-calendar-picker-indicator]:opacity-50',
                    value === '' && 'text-muted-foreground',
                )}
            />
        </label>
    );
}

export default function OrdersIndex({
    orders,
    filters,
    statusCounts,
    statusOptions,
    customerOptions,
}: {
    orders: Paginated<OrderListItem>;
    filters: Filters;
    statusCounts: Partial<Record<OrderStatus, number>>;
    statusOptions: FilterOption[];
    customerOptions: CustomerOption[];
}) {
    const [search, setSearch] = useState(filters.search);
    const [isCreating, setIsCreating] = useState(false);
    const isFirstRender = useRef(true);
    const confirm = useConfirm();
    const { ref: tableScroll, hasOverflowEnd } =
        useOverflowEnd<HTMLDivElement>();

    setLayoutProps({
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Orders', href: index() },
        ],
    });

    const applyFilters = (changes: Partial<Filters>) => {
        const next = { ...filters, search: search.trim(), ...changes };

        router.get(
            index.url(),
            {
                search: next.search || undefined,
                status: next.status || undefined,
                customer: next.customer || undefined,
                from: next.from || undefined,
                to: next.to || undefined,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;

            return;
        }

        const timer = window.setTimeout(
            () => applyFilters({ search: search.trim() }),
            300,
        );

        return () => window.clearTimeout(timer);
        // Only the typed search term should trigger a debounced visit.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const deleteOrder = (order: OrderListItem) =>
        confirm({
            tone: 'danger',
            title: `Delete ${order.order_number}?`,
            description: (
                <>
                    The order for{' '}
                    <span className="font-semibold text-foreground">
                        {order.customer.name}
                    </span>{' '}
                    and all of its items will be permanently removed.
                </>
            ),
            confirmLabel: 'Delete order',
            onConfirm: () =>
                new Promise((resolve) =>
                    router.delete(destroy.url(order.id), {
                        preserveScroll: true,
                        onFinish: resolve,
                    }),
                ),
        });

    const hasFilters =
        filters.search !== '' ||
        filters.customer !== '' ||
        filters.from !== '' ||
        filters.to !== '';
    const clearFilters = () => {
        setSearch('');
        applyFilters({ search: '', customer: '', from: '', to: '' });
    };

    return (
        <>
            <Head title="Orders" />
            <div className="flex min-w-0 flex-1 flex-col">
                <PageHeader
                    title="Orders"
                    icon="solar:cart-large-4-bold-duotone"
                    description={`${orders.total} ${orders.total === 1 ? 'order' : 'orders'}`}
                    actions={
                        <>
                            <StatusFilter
                                value={filters.status}
                                onChange={(status) => applyFilters({ status })}
                                total={Object.values(statusCounts).reduce(
                                    (sum, count) => sum + (count ?? 0),
                                    0,
                                )}
                                options={statusOptions.map((option) => ({
                                    ...option,
                                    tone: orderStatusStyles[
                                        option.value as OrderStatus
                                    ].tone,
                                    count:
                                        statusCounts[
                                            option.value as OrderStatus
                                        ] ?? 0,
                                }))}
                            />
                            <Button
                                variant="theme"
                                size="sm"
                                className="h-[30px] gap-1.5 px-2.5 text-xs font-semibold has-[>svg]:px-2.5"
                                onClick={() => setIsCreating(true)}
                            >
                                <Icon
                                    icon="solar:add-bold-duotone"
                                    className="size-[18px]"
                                />
                                New order
                            </Button>
                        </>
                    }
                />

                <PageFilters className="grid grid-cols-2 gap-2 lg:flex lg:items-center lg:gap-0">
                    <div className="relative col-span-2 lg:flex-1">
                        <Icon
                            icon="solar:magnifer-linear"
                            className="pointer-events-none absolute top-1/2 left-3 z-20 size-4 -translate-y-1/2 text-muted-foreground"
                        />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search order number or customer..."
                            aria-label="Search orders"
                            className={cn(
                                filterFieldClassName,
                                'pl-9 lg:rounded-l-md',
                            )}
                        />
                    </div>
                    <FilterSelect
                        value={filters.customer}
                        onChange={(event) =>
                            applyFilters({
                                customer: event.target.value
                                    ? Number(event.target.value)
                                    : '',
                            })
                        }
                        aria-label="Filter by customer"
                        className="col-span-2 lg:w-[190px]"
                    >
                        <option value="">All customers</option>
                        {customerOptions.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                                {customer.name}
                            </option>
                        ))}
                    </FilterSelect>
                    <DateField
                        label="From"
                        value={filters.from}
                        max={filters.to || undefined}
                        onChange={(from) => applyFilters({ from })}
                    />
                    <DateField
                        label="To"
                        value={filters.to}
                        min={filters.from || undefined}
                        onChange={(to) => applyFilters({ to })}
                    />
                    <button
                        type="button"
                        onClick={clearFilters}
                        disabled={!hasFilters}
                        className={cn(
                            filterFieldClassName,
                            'col-span-2 flex w-auto cursor-pointer items-center justify-center gap-1.5 text-muted-foreground hover:text-tone-red disabled:cursor-default disabled:opacity-50 disabled:hover:text-muted-foreground lg:-ml-px lg:rounded-r-md',
                        )}
                    >
                        <Icon
                            icon="solar:eraser-bold-duotone"
                            className="size-4"
                        />
                        Clear
                    </button>
                </PageFilters>

                <PageContent>
                    <section className="overflow-clip rounded-md border border-card-border bg-card text-card-foreground shadow-card">
                        <div
                            ref={tableScroll}
                            data-overflow-end={hasOverflowEnd || undefined}
                            className="group/table relative max-xl:max-h-[calc(100dvh-13rem)] max-xl:overflow-auto"
                        >
                            <table className="w-full animate-table text-xs leading-[18px] [&_td]:px-3 [&_td]:py-2.5 [&_td:first-child]:pl-5 [&_td:last-child]:pr-5 [&_th]:h-11 [&_th]:px-3 [&_th]:text-[13px] [&_th:first-child]:pl-5 [&_th:last-child]:pr-5">
                                <thead className="sticky top-0 z-20 bg-card shadow-[inset_0_-1px_0_var(--border)] xl:top-[var(--app-header-height,0px)]">
                                    <tr className="text-left font-bold">
                                        <th className={shrink}>Order</th>
                                        <th>Customer</th>
                                        <th className={shrink}>Order date</th>
                                        <th className={shrink}>Delivery</th>
                                        <th
                                            className={cn(shrink, 'text-right')}
                                        >
                                            Total
                                        </th>
                                        <th className={shrink}>Status</th>
                                        <th
                                            className={cn(
                                                shrink,
                                                pinnedActionsHeadClass,
                                            )}
                                        >
                                            <span className="sr-only">
                                                Actions
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.data.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="border-b border-border/70 transition-colors last:border-0 hover:bg-accent/50"
                                        >
                                            <td className={shrink}>
                                                <Link
                                                    href={show(order.id)}
                                                    prefetch
                                                    className="font-numeric text-[12.5px] font-semibold text-sidebar-primary hover:underline"
                                                >
                                                    {order.order_number}
                                                </Link>
                                            </td>
                                            <td className="min-w-48">
                                                <p className="text-[13px] font-semibold text-sidebar-primary">
                                                    {order.customer.name}
                                                </p>
                                                {order.customer.city && (
                                                    <p className="text-[11px] text-muted-foreground">
                                                        {order.customer.city}
                                                    </p>
                                                )}
                                            </td>
                                            <td
                                                className={cn(
                                                    shrink,
                                                    'text-muted-foreground',
                                                )}
                                            >
                                                {formatDate(order.order_date)}
                                            </td>
                                            <td
                                                className={cn(
                                                    shrink,
                                                    'text-muted-foreground',
                                                )}
                                            >
                                                {formatDate(
                                                    order.delivery_date,
                                                )}
                                            </td>
                                            <td
                                                className={cn(
                                                    shrink,
                                                    'text-right',
                                                )}
                                            >
                                                <Money
                                                    value={order.total}
                                                    className="text-[13px] font-semibold"
                                                />
                                            </td>
                                            <td className={shrink}>
                                                <OrderStatusBadge
                                                    status={order.status}
                                                    label={order.status_label}
                                                />
                                            </td>
                                            <td
                                                className={cn(
                                                    shrink,
                                                    pinnedActionsCellClass,
                                                )}
                                            >
                                                <RowActions>
                                                    <ViewAction
                                                        label="Preview order"
                                                        href={show(order.id)}
                                                    />
                                                    <RowMenu
                                                        items={[
                                                            {
                                                                label: 'Edit order',
                                                                icon: actionIcons.edit,
                                                                href: edit(
                                                                    order.id,
                                                                ),
                                                            },
                                                            {
                                                                label: 'Print order',
                                                                icon: actionIcons.print,
                                                                href: show(
                                                                    order.id,
                                                                    {
                                                                        query: {
                                                                            print: 1,
                                                                        },
                                                                    },
                                                                ),
                                                                external: true,
                                                            },
                                                            {
                                                                label: 'Delete order',
                                                                icon: actionIcons.delete,
                                                                variant:
                                                                    'danger',
                                                                onSelect: () =>
                                                                    deleteOrder(
                                                                        order,
                                                                    ),
                                                            },
                                                        ]}
                                                    />
                                                </RowActions>
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.data.length === 0 && (
                                        <tr>
                                            <td colSpan={7}>
                                                <div className="flex flex-col items-center gap-2 py-14 text-center">
                                                    <span className="grid size-14 place-items-center rounded-full bg-sidebar-primary/[0.08] text-sidebar-primary">
                                                        <Icon
                                                            icon="solar:bag-4-bold-duotone"
                                                            className="size-7"
                                                        />
                                                    </span>
                                                    <p className="text-sm font-semibold">
                                                        {hasFilters ||
                                                        filters.status
                                                            ? 'No orders match these filters'
                                                            : 'No orders yet'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {hasFilters ||
                                                        filters.status
                                                            ? 'Try a different search, status or date range.'
                                                            : 'Start your first order by choosing a customer.'}
                                                    </p>
                                                    {hasFilters ||
                                                    filters.status ? (
                                                        <Button
                                                            variant="outline"
                                                            size="xs"
                                                            className="mt-1"
                                                            onClick={() => {
                                                                setSearch('');
                                                                applyFilters({
                                                                    search: '',
                                                                    status: '',
                                                                    customer:
                                                                        '',
                                                                    from: '',
                                                                    to: '',
                                                                });
                                                            }}
                                                        >
                                                            <Icon icon="solar:eraser-bold-duotone" />
                                                            Clear all filters
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="theme"
                                                            size="xs"
                                                            className="mt-1"
                                                            onClick={() =>
                                                                setIsCreating(
                                                                    true,
                                                                )
                                                            }
                                                        >
                                                            <Icon icon="solar:add-bold-duotone" />
                                                            New order
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination page={orders} noun="orders" />
                    </section>
                </PageContent>
            </div>

            <NewOrderDialog
                open={isCreating}
                onOpenChange={setIsCreating}
                customers={customerOptions}
            />
        </>
    );
}
