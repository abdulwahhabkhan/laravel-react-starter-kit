import { Icon } from '@iconify/react/offline';
import { Head, Link, router, setLayoutProps, useForm } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { useConfirm } from '@/components/confirm-dialog';
import InputError from '@/components/input-error';
import { OrderItemDrawer } from '@/components/orders/order-item-drawer';
import {
    Money,
    OrderCard,
    OrderStatusBadge,
    formatDate,
    formatQuantity,
    toNumber,
} from '@/components/orders/order-ui';
import { PageContent, PageHeader } from '@/components/page';
import {
    DeleteAction,
    EditAction,
    PrintAction,
    ViewAction,
} from '@/components/row-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { destroy, edit, index, show, update } from '@/routes/orders';
import { destroy as destroyItem } from '@/routes/orders/items';
import type {
    CustomerOption,
    FilterOption,
    Order,
    OrderLine,
    ProductOption,
    UomOption,
} from '@/types';

type DetailsFormData = {
    account_id: number;
    status: string;
    order_date: string;
    delivery_date: string;
    notes: string;
};

const fieldClassName =
    'h-9 w-full rounded-md border border-input bg-card px-3 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive';

function Field({
    id,
    label,
    hint,
    error,
    className,
    children,
}: {
    id: string;
    label: string;
    hint?: string;
    error?: string;
    className?: string;
    children: ReactNode;
}) {
    return (
        <div className={cn('grid content-start gap-1.5', className)}>
            <Label htmlFor={id} className="text-xs font-semibold">
                {label}
                {hint && (
                    <span className="ml-1 font-normal text-muted-foreground">
                        {hint}
                    </span>
                )}
            </Label>
            {children}
            <InputError message={error} className="text-xs" />
        </div>
    );
}

function OrderDetailsForm({
    order,
    customers,
    statusOptions,
}: {
    order: Order;
    customers: CustomerOption[];
    statusOptions: FilterOption[];
}) {
    const form = useForm<DetailsFormData>({
        account_id: order.customer.id,
        status: order.status,
        order_date: order.order_date,
        delivery_date: order.delivery_date ?? '',
        notes: order.notes ?? '',
    });
    const { data, setData, errors, processing, isDirty } = form;

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.put(update.url(order.id), {
            preserveScroll: true,
            onSuccess: () => form.setDefaults(),
        });
    };

    return (
        <OrderCard
            icon="solar:document-text-bold-duotone"
            title="Order details"
            description="Customer, status and delivery schedule."
        >
            <form onSubmit={submit}>
                <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
                    <Field
                        id="account_id"
                        label="Customer"
                        error={errors.account_id}
                        className="sm:col-span-2"
                    >
                        <select
                            id="account_id"
                            value={data.account_id}
                            onChange={(event) =>
                                setData(
                                    'account_id',
                                    Number(event.target.value),
                                )
                            }
                            aria-invalid={!!errors.account_id}
                            className={fieldClassName}
                        >
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name}
                                    {customer.city ? ` — ${customer.city}` : ''}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field
                        id="status"
                        label="Status"
                        error={errors.status}
                        className="sm:col-span-2"
                    >
                        <div
                            role="radiogroup"
                            aria-label="Status"
                            className="grid grid-cols-2 gap-1 rounded-md border border-input bg-muted/50 p-1 sm:grid-cols-4"
                        >
                            {statusOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    role="radio"
                                    aria-checked={data.status === option.value}
                                    onClick={() =>
                                        setData('status', option.value)
                                    }
                                    className={cn(
                                        'rounded px-2 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground',
                                        data.status === option.value &&
                                            'bg-card text-sidebar-primary shadow-xs',
                                    )}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </Field>
                    <Field
                        id="order_date"
                        label="Order date"
                        error={errors.order_date}
                    >
                        <Input
                            id="order_date"
                            type="date"
                            value={data.order_date}
                            onChange={(event) =>
                                setData('order_date', event.target.value)
                            }
                            aria-invalid={!!errors.order_date}
                            className="bg-card"
                        />
                    </Field>
                    <Field
                        id="delivery_date"
                        label="Delivery date"
                        hint="(optional)"
                        error={errors.delivery_date}
                    >
                        <Input
                            id="delivery_date"
                            type="date"
                            min={data.order_date}
                            value={data.delivery_date}
                            onChange={(event) =>
                                setData('delivery_date', event.target.value)
                            }
                            aria-invalid={!!errors.delivery_date}
                            className="bg-card"
                        />
                    </Field>
                    <Field
                        id="notes"
                        label="Notes"
                        hint="(optional)"
                        error={errors.notes}
                        className="sm:col-span-2"
                    >
                        <textarea
                            id="notes"
                            rows={1}
                            value={data.notes}
                            placeholder="Delivery instructions, references..."
                            onChange={(event) =>
                                setData('notes', event.target.value)
                            }
                            className={cn(
                                fieldClassName,
                                'h-auto min-h-9 resize-y py-1.5',
                            )}
                        />
                    </Field>
                </div>
                <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-3">
                    <p
                        className={cn(
                            'mr-auto flex items-center gap-1.5 text-xs text-muted-foreground transition-opacity',
                            !isDirty && 'opacity-0',
                        )}
                        aria-live="polite"
                    >
                        <span className="size-1.5 rounded-full bg-sidebar-highlight" />
                        Unsaved changes
                    </p>
                    {isDirty && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => form.reset()}
                        >
                            Discard
                        </Button>
                    )}
                    <Button
                        type="submit"
                        variant="theme"
                        size="sm"
                        disabled={processing || !isDirty}
                    >
                        {processing ? (
                            <Spinner />
                        ) : (
                            <Icon icon="solar:diskette-bold-duotone" />
                        )}
                        Save details
                    </Button>
                </div>
            </form>
        </OrderCard>
    );
}

function LineItems({
    order,
    onAdd,
    onEdit,
    onDelete,
}: {
    order: Order;
    onAdd: () => void;
    onEdit: (item: OrderLine) => void;
    onDelete: (item: OrderLine) => void;
}) {
    const canEdit = order.allows_line_changes;

    return (
        <OrderCard
            icon="solar:box-minimalistic-bold-duotone"
            title="Items"
            description={
                !canEdit
                    ? `Items are locked while the order is ${order.status_label.toLowerCase()}.`
                    : order.items.length > 0
                      ? 'Click a line to edit it. Totals update automatically.'
                      : 'Products, quantities and prices for this order.'
            }
            actions={
                canEdit &&
                order.items.length > 0 && (
                    <Button variant="theme" size="sm" onClick={onAdd}>
                        <Icon icon="solar:add-circle-bold-duotone" />
                        Add item
                    </Button>
                )
            }
            className="overflow-hidden"
        >
            {!canEdit && (
                <div className="flex items-center gap-2 border-b border-border bg-tone-orange-bg/60 px-5 py-2 text-xs text-tone-orange">
                    <Icon
                        icon="solar:lock-keyhole-bold-duotone"
                        className="size-4"
                    />
                    Change the status back to Draft or Confirmed to edit items.
                </div>
            )}
            {order.items.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
                    <span className="grid size-14 place-items-center rounded-full bg-sidebar-highlight/15 text-[#b9772f] dark:text-sidebar-highlight">
                        <Icon
                            icon="solar:cart-large-minimalistic-bold-duotone"
                            className="size-7"
                        />
                    </span>
                    <p className="text-sm font-semibold">No items yet</p>
                    <p className="max-w-xs text-xs text-muted-foreground">
                        Add the products this customer is ordering. You can
                        change quantities and prices at any time.
                    </p>
                    {canEdit && (
                        <Button
                            variant="theme"
                            size="sm"
                            className="mt-2"
                            onClick={onAdd}
                        >
                            <Icon icon="solar:add-circle-bold-duotone" />
                            Add first item
                        </Button>
                    )}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] animate-table text-xs leading-[18px] whitespace-nowrap [&_td]:px-3.5 [&_td]:py-2.5 [&_th]:px-3.5 [&_th]:py-2">
                        <thead>
                            <tr className="border-b border-border bg-muted/40 text-left font-bold">
                                <th className="w-8">#</th>
                                <th>Product</th>
                                <th className="text-right">Qty</th>
                                <th className="text-right">Unit price</th>
                                <th className="text-right">Discount</th>
                                <th className="text-right">Tax</th>
                                <th className="text-right">Line total</th>
                                {canEdit && (
                                    <th className="w-[76px] text-right">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item, position) => (
                                <tr
                                    key={item.id}
                                    onClick={() => canEdit && onEdit(item)}
                                    className={cn(
                                        'border-b border-border/70 transition-colors last:border-0',
                                        canEdit &&
                                            'cursor-pointer hover:bg-accent/50',
                                    )}
                                >
                                    <td className="text-muted-foreground tabular-nums">
                                        {position + 1}
                                    </td>
                                    <td className="max-w-[260px]">
                                        <p className="truncate text-[13px] font-semibold">
                                            {item.description}
                                        </p>
                                        <p className="font-mono text-[11px] text-muted-foreground">
                                            {item.sku}
                                        </p>
                                    </td>
                                    <td className="text-right tabular-nums">
                                        <span className="font-semibold">
                                            {formatQuantity(item.quantity)}
                                        </span>{' '}
                                        <span className="text-muted-foreground">
                                            {item.uom_label}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <Money value={item.unit_price} />
                                    </td>
                                    <td className="text-right">
                                        {toNumber(item.discount) > 0 ? (
                                            <span className="text-tone-red">
                                                −{' '}
                                                <Money value={item.discount} />
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">
                                                —
                                            </span>
                                        )}
                                    </td>
                                    <td className="text-right tabular-nums">
                                        {toNumber(item.tax_rate) > 0 ? (
                                            `${toNumber(item.tax_rate)}%`
                                        ) : (
                                            <span className="text-muted-foreground">
                                                —
                                            </span>
                                        )}
                                    </td>
                                    <td className="text-right">
                                        <Money
                                            value={item.line_total}
                                            className="text-[13px] font-semibold"
                                        />
                                    </td>
                                    {canEdit && (
                                        <td
                                            onClick={(event) =>
                                                event.stopPropagation()
                                            }
                                        >
                                            <div className="flex justify-end gap-1.5">
                                                <EditAction
                                                    label="Edit item"
                                                    onClick={() => onEdit(item)}
                                                />
                                                <DeleteAction
                                                    label="Remove item"
                                                    onClick={() =>
                                                        onDelete(item)
                                                    }
                                                />
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </OrderCard>
    );
}

function SummaryRow({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{label}</span>
            {children}
        </div>
    );
}

function OrderSummary({ order }: { order: Order }) {
    return (
        <section className="overflow-hidden rounded-xl border border-card-border bg-card shadow-card">
            <div className="grid gap-2.5 p-5">
                <h2 className="mb-1 text-sm font-semibold">Summary</h2>
                <SummaryRow label="Subtotal">
                    <Money value={order.subtotal} className="font-medium" />
                </SummaryRow>
                <SummaryRow label="Discount">
                    {toNumber(order.discount_total) > 0 ? (
                        <span className="font-medium text-tone-red">
                            − <Money value={order.discount_total} />
                        </span>
                    ) : (
                        <span className="text-muted-foreground">—</span>
                    )}
                </SummaryRow>
                <SummaryRow label="Tax">
                    <Money value={order.tax_total} className="font-medium" />
                </SummaryRow>
            </div>
            <div className="flex items-end justify-between bg-sidebar-primary px-5 py-4 text-white dark:bg-sidebar-primary/15 dark:text-foreground">
                <span className="text-xs font-semibold tracking-wide uppercase opacity-80">
                    Total
                </span>
                <span className="text-2xl font-bold tracking-tight tabular-nums">
                    <span className="mr-1 text-xs font-semibold text-sidebar-highlight">
                        Rs
                    </span>
                    {new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(toNumber(order.total))}
                </span>
            </div>
        </section>
    );
}

function CustomerCard({ order }: { order: Order }) {
    const { customer } = order;
    const address = [customer.address_line_1, customer.city, customer.region]
        .filter(Boolean)
        .join(', ');
    const rows = [
        { icon: 'solar:phone-bold-duotone', value: customer.phone },
        { icon: 'solar:letter-bold-duotone', value: customer.email },
        { icon: 'solar:map-point-bold-duotone', value: address },
    ].filter((row) => row.value);

    return (
        <section className="rounded-xl border border-card-border bg-card p-5 shadow-card">
            <p className="mb-2 text-[10px] font-bold tracking-[0.12em] text-muted-foreground uppercase">
                Customer
            </p>
            <p className="text-sm font-semibold">{customer.name}</p>
            <ul className="mt-2 grid gap-1.5">
                {rows.map((row) => (
                    <li
                        key={row.icon}
                        className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                        <Icon
                            icon={row.icon}
                            className="mt-px size-3.5 shrink-0 text-sidebar-primary/70"
                        />
                        <span className="break-words">{row.value}</span>
                    </li>
                ))}
                {rows.length === 0 && (
                    <li className="text-xs text-muted-foreground">
                        No contact details on file.
                    </li>
                )}
            </ul>
            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs">
                <div>
                    <dt className="text-muted-foreground">Created by</dt>
                    <dd className="font-medium">{order.created_by ?? '—'}</dd>
                </div>
                <div>
                    <dt className="text-muted-foreground">Last updated</dt>
                    <dd className="font-medium">
                        {formatDate(order.updated_at)}
                    </dd>
                </div>
            </dl>
        </section>
    );
}

export default function EditOrder({
    order,
    customerOptions,
    statusOptions,
    uomOptions,
    productOptions,
}: {
    order: Order;
    customerOptions: CustomerOption[];
    statusOptions: FilterOption[];
    uomOptions: UomOption[];
    productOptions?: ProductOption[];
}) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<OrderLine | null>(null);
    const confirm = useConfirm();

    setLayoutProps({
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Orders', href: index() },
            { title: order.order_number, href: edit(order.id) },
        ],
    });

    const openDrawer = (item: OrderLine | null) => {
        setEditingItem(item);
        setIsDrawerOpen(true);
    };

    const deleteItem = (item: OrderLine) =>
        confirm({
            tone: 'danger',
            title: 'Remove this item?',
            description: (
                <>
                    <span className="font-semibold text-foreground">
                        {item.description}
                    </span>{' '}
                    will be removed and the order totals recalculated.
                </>
            ),
            confirmLabel: 'Remove item',
            onConfirm: () =>
                new Promise((resolve) =>
                    router.delete(
                        destroyItem.url({ order: order.id, item: item.id }),
                        { preserveScroll: true, onFinish: resolve },
                    ),
                ),
        });

    const deleteOrder = () =>
        confirm({
            tone: 'danger',
            title: `Delete ${order.order_number}?`,
            description:
                'The order and all of its items will be permanently removed.',
            confirmLabel: 'Delete order',
            onConfirm: () =>
                new Promise((resolve) =>
                    router.delete(destroy.url(order.id), { onFinish: resolve }),
                ),
        });

    return (
        <>
            <Head title={`Edit ${order.order_number}`} />
            <div className="flex min-w-0 flex-1 flex-col">
                <PageHeader
                    icon="solar:cart-large-4-bold-duotone"
                    title={
                        <span className="flex items-center gap-3">
                            <span className="font-mono">
                                {order.order_number}
                            </span>
                            <OrderStatusBadge
                                status={order.status}
                                label={order.status_label}
                                className="text-xs"
                            />
                        </span>
                    }
                    actions={
                        <>
                            <Button variant="white" size="sm" asChild>
                                <Link href={index()}>
                                    <Icon icon="solar:arrow-left-linear" />
                                    Orders
                                </Link>
                            </Button>
                            <ViewAction
                                label="Preview order"
                                href={show(order.id)}
                                className="h-8 w-[34px]"
                            />
                            <PrintAction
                                label="Print order"
                                href={show(order.id, { query: { print: 1 } })}
                                external
                                className="h-8 w-[34px]"
                            />
                            <DeleteAction
                                label="Delete order"
                                onClick={deleteOrder}
                                className="h-8 w-[34px]"
                            />
                        </>
                    }
                />
                <PageContent className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
                    <div className="grid min-w-0 gap-4">
                        <OrderDetailsForm
                            order={order}
                            customers={customerOptions}
                            statusOptions={statusOptions}
                        />
                        <LineItems
                            order={order}
                            onAdd={() => openDrawer(null)}
                            onEdit={openDrawer}
                            onDelete={deleteItem}
                        />
                    </div>
                    <aside className="grid gap-4 lg:sticky lg:top-4">
                        <OrderSummary order={order} />
                        <CustomerCard order={order} />
                    </aside>
                </PageContent>
            </div>

            <OrderItemDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                orderId={order.id}
                item={editingItem}
                products={productOptions}
                uomOptions={uomOptions}
            />
        </>
    );
}
