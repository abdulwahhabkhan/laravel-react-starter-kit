import { Icon } from '@iconify/react/offline';
import { Link, useForm } from '@inertiajs/react';
import type { FormEvent, ReactNode } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { index } from '@/routes/products';
import type { Product, UomOption } from '@/types';

export type ProductFormData = {
    name: string;
    sku: string;
    upc: string;
    cost: string;
    price: string;
    uom: string;
};

function FormCard({
    icon,
    title,
    description,
    children,
}: {
    icon: string;
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <section className="rounded-xl border border-card-border bg-card text-card-foreground shadow-card">
            <header className="flex items-center gap-3 border-b border-border px-5 py-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-sidebar-primary/[0.08] text-sidebar-primary dark:bg-sidebar-primary/[0.14]">
                    <Icon icon={icon} className="size-5" aria-hidden="true" />
                </span>
                <div>
                    <h2 className="text-sm font-semibold">{title}</h2>
                    <p className="text-xs text-muted-foreground">
                        {description}
                    </p>
                </div>
            </header>
            <div className="grid gap-4 p-5 sm:grid-cols-2">{children}</div>
        </section>
    );
}

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

/** Amount input with a fixed "Rs" prefix. */
function MoneyInput({
    id,
    value,
    invalid,
    onChange,
}: {
    id: string;
    value: string;
    invalid: boolean;
    onChange: (value: string) => void;
}) {
    return (
        <div className="flex">
            <span className="grid place-items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-xs font-semibold text-muted-foreground">
                Rs
            </span>
            <Input
                id={id}
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={value}
                placeholder="0.00"
                aria-invalid={invalid}
                onChange={(event) => onChange(event.target.value)}
                className="rounded-l-none bg-card tabular-nums"
            />
        </div>
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
        <div className="flex items-center justify-between gap-3 py-2 text-[13px]">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-semibold tabular-nums">{children}</span>
        </div>
    );
}

/** Formats an amount with two decimals and grouping: 250.5 → "250.50". */
export function formatMoney(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

function formatAmount(value: string): string {
    const amount = Number.parseFloat(value);

    return Number.isFinite(amount) ? `Rs ${formatMoney(amount)}` : '—';
}

/** Live preview of the product being edited, with its unit margin. */
function ProductSummary({
    data,
    uomOptions,
}: {
    data: ProductFormData;
    uomOptions: UomOption[];
}) {
    const cost = Number.parseFloat(data.cost);
    const price = Number.parseFloat(data.price);
    const hasMargin = Number.isFinite(cost) && Number.isFinite(price);
    const margin = hasMargin ? price - cost : 0;
    const marginPercent =
        hasMargin && price > 0 ? (margin / price) * 100 : null;
    const uomLabel = uomOptions.find(
        (option) => option.value === data.uom,
    )?.label;
    const initials = data.name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join('');

    return (
        <aside className="rounded-xl border border-card-border bg-card p-5 text-card-foreground shadow-card lg:sticky lg:top-5">
            <div className="flex items-center gap-3 border-b border-border pb-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[repeating-linear-gradient(45deg,rgb(255_255_255/0.09)_0_1px,transparent_1px_4px),linear-gradient(135deg,#062a52_0%,#0d4886_45%,#07305d_100%)] text-sm font-bold text-white">
                    {initials || '?'}
                </span>
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-sidebar-primary">
                        {data.name || 'Product name'}
                    </p>
                    <p className="truncate font-mono text-xs text-muted-foreground">
                        {data.sku || 'No SKU yet'}
                    </p>
                </div>
            </div>
            <div className="divide-y divide-border/70 pt-1">
                <SummaryRow label="Unit">{uomLabel ?? '—'}</SummaryRow>
                <SummaryRow label="UPC">{data.upc || '—'}</SummaryRow>
                <SummaryRow label="Cost">{formatAmount(data.cost)}</SummaryRow>
                <SummaryRow label="Price">
                    {formatAmount(data.price)}
                </SummaryRow>
                <SummaryRow label="Unit margin">
                    {hasMargin ? (
                        <span
                            className={cn(
                                margin < 0
                                    ? 'text-rose-700 dark:text-rose-400'
                                    : 'text-emerald-700 dark:text-emerald-400',
                            )}
                        >
                            Rs {formatMoney(margin)}
                            {marginPercent !== null && (
                                <span className="ml-1 text-xs font-medium">
                                    ({marginPercent.toFixed(1)}%)
                                </span>
                            )}
                        </span>
                    ) : (
                        '—'
                    )}
                </SummaryRow>
            </div>
            {hasMargin && margin < 0 && (
                <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">
                    <Icon
                        icon="solar:danger-triangle-linear"
                        className="mt-px size-4 shrink-0"
                        aria-hidden="true"
                    />
                    The price is below cost, so each unit sells at a loss.
                </p>
            )}
        </aside>
    );
}

/**
 * Create/edit form for a product. Pass `product` to edit an existing one.
 */
export function ProductForm({
    product,
    uomOptions,
    submitUrl,
    method,
}: {
    product?: Product;
    uomOptions: UomOption[];
    submitUrl: string;
    method: 'post' | 'put';
}) {
    const form = useForm<ProductFormData>({
        name: product?.name ?? '',
        sku: product?.sku ?? '',
        upc: product?.upc ?? '',
        cost: product?.cost ?? '',
        price: product?.price ?? '',
        uom: product?.uom ?? uomOptions[0]?.value ?? '',
    });
    const { data, setData, errors, processing } = form;

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.transform((values) => ({ ...values, upc: values.upc || null }));
        form[method](submitUrl, { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
                <div className="flex flex-col gap-4">
                    <FormCard
                        icon="solar:tag-price-bold-duotone"
                        title="Product details"
                        description="How the product appears on invoices and stock reports."
                    >
                        <Field
                            id="name"
                            label="Name"
                            error={errors.name}
                            className="sm:col-span-2"
                        >
                            <Input
                                id="name"
                                value={data.name}
                                autoFocus
                                placeholder="e.g. Premium Lawn 60s"
                                aria-invalid={!!errors.name}
                                onChange={(event) =>
                                    setData('name', event.target.value)
                                }
                                className="bg-card"
                            />
                        </Field>
                        <Field id="sku" label="SKU" error={errors.sku}>
                            <Input
                                id="sku"
                                value={data.sku}
                                placeholder="e.g. CTN-LWN-060"
                                aria-invalid={!!errors.sku}
                                onChange={(event) =>
                                    setData('sku', event.target.value)
                                }
                                className="bg-card font-mono"
                            />
                        </Field>
                        <Field
                            id="upc"
                            label="UPC"
                            hint="(optional)"
                            error={errors.upc}
                        >
                            <Input
                                id="upc"
                                value={data.upc}
                                inputMode="numeric"
                                placeholder="Barcode number"
                                aria-invalid={!!errors.upc}
                                onChange={(event) =>
                                    setData('upc', event.target.value)
                                }
                                className="bg-card font-mono"
                            />
                        </Field>
                    </FormCard>

                    <FormCard
                        icon="solar:wallet-money-bold-duotone"
                        title="Unit & pricing"
                        description="What one unit costs you and what it sells for."
                    >
                        <Field
                            id="uom"
                            label="Unit of measure"
                            error={errors.uom}
                            className="sm:col-span-2"
                        >
                            <Select
                                value={data.uom}
                                onValueChange={(value) => setData('uom', value)}
                            >
                                <SelectTrigger
                                    id="uom"
                                    aria-invalid={!!errors.uom}
                                    className="w-full bg-card sm:w-1/2"
                                >
                                    <SelectValue placeholder="Select a unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {uomOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field id="cost" label="Cost" error={errors.cost}>
                            <MoneyInput
                                id="cost"
                                value={data.cost}
                                invalid={!!errors.cost}
                                onChange={(value) => setData('cost', value)}
                            />
                        </Field>
                        <Field
                            id="price"
                            label="Sale price"
                            error={errors.price}
                        >
                            <MoneyInput
                                id="price"
                                value={data.price}
                                invalid={!!errors.price}
                                onChange={(value) => setData('price', value)}
                            />
                        </Field>
                    </FormCard>
                </div>

                <ProductSummary data={data} uomOptions={uomOptions} />
            </div>

            <div className="sticky bottom-3 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-card-border bg-card/95 px-5 py-3 shadow-card backdrop-blur">
                <p className="text-xs text-muted-foreground">
                    {product
                        ? 'Changes apply to new orders and stock movements.'
                        : 'The product can be purchased and sold right after saving.'}
                </p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={index()}>
                            <Icon icon="solar:arrow-left-linear" />
                            Cancel
                        </Link>
                    </Button>
                    <Button
                        type="submit"
                        variant="theme"
                        size="sm"
                        disabled={processing}
                    >
                        {processing ? (
                            <Spinner />
                        ) : (
                            <Icon icon="solar:clipboard-check-bold-duotone" />
                        )}
                        {product ? 'Save changes' : 'Create product'}
                    </Button>
                </div>
            </div>
        </form>
    );
}
