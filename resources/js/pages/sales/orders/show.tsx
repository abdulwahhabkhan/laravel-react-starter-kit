import { Icon } from '@iconify/react/offline';
import { Head, Link, setLayoutProps, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    Money,
    OrderStatusBadge,
    formatDate,
    formatQuantity,
    toNumber,
} from '@/components/orders/order-ui';
import { PageContent, PageHeader } from '@/components/page';
import { EditAction, PrintAction } from '@/components/row-actions';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { edit, index, show } from '@/routes/orders';
import type { Order } from '@/types';

function Meta({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-[10px] font-bold tracking-[0.12em] text-muted-foreground uppercase">
                {label}
            </dt>
            <dd className="mt-0.5 text-sm font-semibold">{value}</dd>
        </div>
    );
}

export default function ShowOrder({ order }: { order: Order }) {
    const { name: appName } = usePage<{ name: string }>().props;
    const { customer } = order;
    const address = [customer.address_line_1, customer.city, customer.region]
        .filter(Boolean)
        .join(', ');

    // Opened from a "Print" action: print straight away.
    useEffect(() => {
        if (new URLSearchParams(window.location.search).has('print')) {
            const timer = window.setTimeout(() => window.print(), 400);

            return () => window.clearTimeout(timer);
        }
    }, []);

    setLayoutProps({
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Orders', href: index() },
            { title: order.order_number, href: show(order.id) },
        ],
    });

    return (
        <>
            <Head title={`${order.order_number} preview`} />
            <div className="flex min-w-0 flex-1 flex-col">
                <div className="print:hidden">
                    <PageHeader
                        title="Order preview"
                        description={order.order_number}
                        icon="solar:document-text-bold-duotone"
                        actions={
                            <>
                                <Button variant="white" size="sm" asChild>
                                    <Link href={index()}>
                                        <Icon icon="solar:arrow-left-linear" />
                                        Orders
                                    </Link>
                                </Button>
                                <PrintAction
                                    label="Print order"
                                    className="h-8 w-[34px]"
                                />
                                <EditAction
                                    label="Edit order"
                                    href={edit(order.id)}
                                    className="h-8 w-[34px]"
                                />
                            </>
                        }
                    />
                </div>
                <PageContent>
                    <article className="mx-auto w-full max-w-4xl overflow-hidden rounded-xl border border-card-border bg-card text-card-foreground shadow-card print:max-w-none print:rounded-none print:border-0 print:shadow-none">
                        <div className="h-1 brand-rule-x" />
                        <header className="flex flex-wrap items-start justify-between gap-6 px-8 pt-8 pb-6">
                            <div className="flex items-center gap-3">
                                <span className="grid size-11 place-items-center rounded-lg bg-sidebar-primary">
                                    <AppLogoIcon className="size-7" />
                                </span>
                                <div>
                                    <p className="text-base font-bold">
                                        {appName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Sales order
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold tracking-tight text-sidebar-primary tabular-nums">
                                    {order.order_number}
                                </p>
                                <OrderStatusBadge
                                    status={order.status}
                                    label={order.status_label}
                                    className="mt-1.5"
                                />
                            </div>
                        </header>

                        <div className="grid gap-6 border-y border-border bg-muted/30 px-8 py-5 sm:grid-cols-[1.4fr_1fr]">
                            <div>
                                <p className="text-[10px] font-bold tracking-[0.12em] text-muted-foreground uppercase">
                                    Bill to
                                </p>
                                <p className="mt-1 text-sm font-semibold">
                                    {customer.name}
                                </p>
                                {address && (
                                    <p className="text-xs text-muted-foreground">
                                        {address}
                                    </p>
                                )}
                                {(customer.phone || customer.email) && (
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {[customer.phone, customer.email]
                                            .filter(Boolean)
                                            .join(' · ')}
                                    </p>
                                )}
                            </div>
                            <dl className="grid grid-cols-2 gap-4">
                                <Meta
                                    label="Order date"
                                    value={formatDate(order.order_date)}
                                />
                                <Meta
                                    label="Delivery"
                                    value={formatDate(order.delivery_date)}
                                />
                                <Meta
                                    label="Prepared by"
                                    value={order.created_by ?? '—'}
                                />
                            </dl>
                        </div>

                        <div className="overflow-x-auto px-8 py-6">
                            <table className="w-full min-w-[560px] text-xs leading-[18px] [&_td]:py-2.5 [&_th]:pb-2">
                                <thead>
                                    <tr className="border-b-2 border-sidebar-primary/80 text-left text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
                                        <th className="w-8">#</th>
                                        <th>Description</th>
                                        <th className="text-right">Qty</th>
                                        <th className="text-right">
                                            Unit price
                                        </th>
                                        <th className="text-right">Discount</th>
                                        <th className="text-right">Tax</th>
                                        <th className="text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item, position) => (
                                        <tr
                                            key={item.id}
                                            className="border-b border-border/70"
                                        >
                                            <td className="text-muted-foreground tabular-nums">
                                                {position + 1}
                                            </td>
                                            <td>
                                                <p className="font-semibold">
                                                    {item.description}
                                                </p>
                                                <p className="font-mono text-[10px] text-muted-foreground">
                                                    {item.sku}
                                                </p>
                                            </td>
                                            <td className="text-right whitespace-nowrap tabular-nums">
                                                {formatQuantity(item.quantity)}{' '}
                                                <span className="text-muted-foreground">
                                                    {item.uom_label}
                                                </span>
                                            </td>
                                            <td className="text-right whitespace-nowrap">
                                                <Money
                                                    value={item.unit_price}
                                                />
                                            </td>
                                            <td className="text-right whitespace-nowrap">
                                                {toNumber(item.discount) > 0 ? (
                                                    <Money
                                                        value={item.discount}
                                                    />
                                                ) : (
                                                    '—'
                                                )}
                                            </td>
                                            <td className="text-right tabular-nums">
                                                {toNumber(item.tax_rate) > 0
                                                    ? `${toNumber(item.tax_rate)}%`
                                                    : '—'}
                                            </td>
                                            <td className="text-right font-semibold whitespace-nowrap">
                                                <Money
                                                    value={item.line_total}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    {order.items.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="py-10 text-center text-muted-foreground"
                                            >
                                                This order has no items yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-wrap items-start justify-between gap-6 px-8 pb-8">
                            <div className="max-w-sm min-w-0 flex-1">
                                {order.notes && (
                                    <>
                                        <p className="text-[10px] font-bold tracking-[0.12em] text-muted-foreground uppercase">
                                            Notes
                                        </p>
                                        <p className="mt-1 text-xs whitespace-pre-line">
                                            {order.notes}
                                        </p>
                                    </>
                                )}
                            </div>
                            <dl className="grid w-full max-w-[280px] gap-2 text-xs">
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">
                                        Subtotal
                                    </dt>
                                    <dd>
                                        <Money value={order.subtotal} />
                                    </dd>
                                </div>
                                {toNumber(order.discount_total) > 0 && (
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Discount
                                        </dt>
                                        <dd className="text-tone-red">
                                            −{' '}
                                            <Money
                                                value={order.discount_total}
                                            />
                                        </dd>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">
                                        Tax
                                    </dt>
                                    <dd>
                                        <Money value={order.tax_total} />
                                    </dd>
                                </div>
                                <div className="mt-1 flex items-baseline justify-between rounded-lg bg-sidebar-primary px-3 py-2.5 text-white dark:bg-sidebar-primary/15 dark:text-foreground print:bg-transparent print:px-0 print:text-foreground">
                                    <dt className="text-xs font-semibold tracking-wide uppercase">
                                        Total
                                    </dt>
                                    <dd className="text-lg font-bold">
                                        <Money
                                            value={order.total}
                                            className="[&>span]:text-sidebar-highlight"
                                        />
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </article>
                </PageContent>
            </div>
        </>
    );
}
