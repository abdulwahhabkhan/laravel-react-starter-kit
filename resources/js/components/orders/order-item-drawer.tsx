import { Icon } from "@iconify/react/offline";
import { router, useForm } from "@inertiajs/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import InputError from "@/components/input-error";
import { Money, formatQuantity, toNumber } from "@/components/orders/order-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { store, update } from "@/routes/orders/items";
import type { OrderLine, ProductOption, UomOption } from "@/types";

type ItemFormData = {
    product_id: number | null;
    description: string;
    quantity: string;
    uom: string;
    unit_price: string;
    discount: string;
    tax_rate: string;
};

const emptyItem: ItemFormData = {
    product_id: null,
    description: "",
    quantity: "1",
    uom: "each",
    unit_price: "",
    discount: "",
    tax_rate: "0",
};

const taxPresets = ["0", "5", "17"];

function itemFormData(item: OrderLine | null): ItemFormData {
    if (!item) {
        return emptyItem;
    }

    return {
        product_id: item.product_id,
        description: item.description,
        quantity: formatQuantity(item.quantity).replaceAll(",", ""),
        uom: item.uom,
        unit_price: item.unit_price,
        discount: toNumber(item.discount) > 0 ? item.discount : "",
        tax_rate: String(toNumber(item.tax_rate)),
    };
}

function Field({
    id,
    label,
    error,
    className,
    children,
}: {
    id: string;
    label: ReactNode;
    error?: string;
    className?: string;
    children: ReactNode;
}) {
    return (
        <div className={cn("grid content-start gap-1.5", className)}>
            <Label htmlFor={id} className="text-xs font-semibold">
                {label}
            </Label>
            {children}
            <InputError message={error} className="text-xs" />
        </div>
    );
}

function BreakdownRow({
    label,
    value,
    className,
}: {
    label: string;
    value: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "flex items-center justify-between text-xs text-muted-foreground",
                className,
            )}
        >
            <span>{label}</span>
            <span className="font-medium text-foreground">{value}</span>
        </div>
    );
}

/**
 * Right-hand drawer for adding or editing one order line. The order stays
 * visible behind it, and the line total updates as the fields change.
 */
export function OrderItemDrawer({
    open,
    onOpenChange,
    orderId,
    item,
    products,
    uomOptions,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    orderId: number;
    /** The line being edited, or null to add a new one. */
    item: OrderLine | null;
    /** Undefined until the optional prop is loaded. */
    products: ProductOption[] | undefined;
    uomOptions: UomOption[];
}) {
    const form = useForm<ItemFormData>(itemFormData(item));
    const { data, setData, errors, processing } = form;
    const [query, setQuery] = useState("");
    const [isPickingProduct, setIsPickingProduct] = useState(item === null);
    const [discountMode, setDiscountMode] = useState<"amount" | "percent">(
        "amount",
    );
    const addAnother = useRef(false);
    const searchInput = useRef<HTMLInputElement>(null);
    const quantityInput = useRef<HTMLInputElement>(null);

    // Reset whenever the drawer opens for a different line.
    useEffect(() => {
        if (!open) {
            return;
        }

        form.setData(itemFormData(item));
        form.clearErrors();
        setQuery("");
        setDiscountMode("amount");
        setIsPickingProduct(item === null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, item?.id]);

    // Products are an optional prop, fetched the first time the drawer opens.
    useEffect(() => {
        if (open && products === undefined) {
            router.reload({ only: ["productOptions"] });
        }
    }, [open, products]);

    const matches = useMemo(() => {
        const term = query.trim().toLowerCase();
        const list = products ?? [];

        return term === ""
            ? list
            : list.filter((product) =>
                  `${product.name} ${product.sku}`.toLowerCase().includes(term),
              );
    }, [products, query]);

    const selectedProduct = products?.find(
        (product) => product.id === data.product_id,
    );

    const quantity = toNumber(data.quantity);
    const unitPrice = toNumber(data.unit_price);
    const gross = quantity * unitPrice;
    const discountInput = toNumber(data.discount);
    const discount =
        discountMode === "percent"
            ? (gross * Math.min(discountInput, 100)) / 100
            : discountInput;
    const net = gross - discount;
    const tax = (net * toNumber(data.tax_rate)) / 100;

    const chooseProduct = (product: ProductOption) => {
        setData((current) => ({
            ...current,
            product_id: product.id,
            description: product.name,
            uom: product.uom,
            unit_price: product.price,
        }));
        setIsPickingProduct(false);
        requestAnimationFrame(() => quantityInput.current?.select());
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();

        form.transform((current) => ({
            ...current,
            discount: discount > 0 ? discount.toFixed(2) : "0",
        }));

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                if (addAnother.current && !item) {
                    form.setData(emptyItem);
                    setQuery("");
                    setDiscountMode("amount");
                    setIsPickingProduct(true);
                    requestAnimationFrame(() => searchInput.current?.focus());
                } else {
                    onOpenChange(false);
                }
            },
        };

        if (item) {
            form.put(update.url({ order: orderId, item: item.id }), options);
        } else {
            form.post(store.url(orderId), options);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full gap-0 p-0 sm:max-w-[460px]">
                <div className="flex items-start gap-3 border-b border-border bg-linear-to-b from-sidebar-primary/[0.05] to-transparent px-5 pt-5 pb-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-sidebar-primary text-sidebar-highlight shadow-[0_2px_6px_-1px_rgb(7_48_93/0.35)]">
                        <Icon
                            icon={
                                item
                                    ? "solar:pen-2-bold-duotone"
                                    : "solar:box-minimalistic-bold-duotone"
                            }
                            className="size-5"
                        />
                    </span>
                    <div className="grid gap-0.5 pr-6">
                        <SheetTitle className="text-base">
                            {item ? "Edit item" : "Add item"}
                        </SheetTitle>
                        <SheetDescription className="text-xs">
                            {item
                                ? "Change the quantity, price or discount on this line."
                                : "Pick a product, then set the quantity and price."}
                        </SheetDescription>
                    </div>
                </div>

                <form
                    onSubmit={submit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 py-5">
                        {/* Product */}
                        <div className="grid gap-2">
                            <span className="text-xs font-semibold">
                                Product
                            </span>
                            {isPickingProduct ? (
                                <>
                                    <div className="relative">
                                        <Icon
                                            icon="solar:magnifer-linear"
                                            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                                        />
                                        <input
                                            ref={searchInput}
                                            type="search"
                                            value={query}
                                            autoFocus
                                            onChange={(event) =>
                                                setQuery(event.target.value)
                                            }
                                            onKeyDown={(event) => {
                                                if (
                                                    event.key === "Enter" &&
                                                    matches[0]
                                                ) {
                                                    event.preventDefault();
                                                    chooseProduct(matches[0]);
                                                }
                                            }}
                                            placeholder="Search by name or SKU..."
                                            aria-label="Search products"
                                            className="h-10 w-full rounded-lg border border-input bg-card pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                        />
                                    </div>
                                    <ul className="max-h-64 overflow-y-auto rounded-lg border border-border bg-card p-1">
                                        {products === undefined &&
                                            [0, 1, 2, 3].map((row) => (
                                                <li
                                                    key={row}
                                                    className="flex items-center gap-3 px-2.5 py-2"
                                                >
                                                    <Skeleton className="size-8 rounded-md" />
                                                    <div className="grid flex-1 gap-1.5">
                                                        <Skeleton className="h-3 w-2/3" />
                                                        <Skeleton className="h-2.5 w-1/3" />
                                                    </div>
                                                </li>
                                            ))}
                                        {matches.map((product) => (
                                            <li key={product.id}>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        chooseProduct(product)
                                                    }
                                                    className={cn(
                                                        "flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-accent/70",
                                                        product.id ===
                                                            data.product_id &&
                                                            "bg-sidebar-highlight/15",
                                                    )}
                                                >
                                                    <span className="grid size-8 shrink-0 place-items-center rounded-md bg-sidebar-tile text-sidebar-primary">
                                                        <Icon
                                                            icon="solar:box-bold-duotone"
                                                            className="size-4"
                                                        />
                                                    </span>
                                                    <span className="min-w-0 flex-1">
                                                        <span className="block truncate text-sm font-semibold">
                                                            {product.name}
                                                        </span>
                                                        <span className="block truncate font-mono text-[11px] text-muted-foreground">
                                                            {product.sku}
                                                        </span>
                                                    </span>
                                                    <Money
                                                        value={product.price}
                                                        className="text-xs font-semibold"
                                                    />
                                                </button>
                                            </li>
                                        ))}
                                        {products !== undefined &&
                                            matches.length === 0 && (
                                                <li className="px-4 py-6 text-center text-xs text-muted-foreground">
                                                    No products match “{query}”.
                                                </li>
                                            )}
                                    </ul>
                                    {data.product_id !== null && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsPickingProduct(false)
                                            }
                                            className="justify-self-start text-xs font-semibold text-sidebar-primary hover:underline"
                                        >
                                            Keep {data.description}
                                        </button>
                                    )}
                                </>
                            ) : (
                                <div className="flex items-center gap-3 rounded-lg border border-sidebar-highlight/40 bg-sidebar-highlight/[0.08] px-3 py-2.5">
                                    <span className="grid size-9 shrink-0 place-items-center rounded-md bg-sidebar-primary text-sidebar-highlight">
                                        <Icon
                                            icon="solar:box-bold-duotone"
                                            className="size-5"
                                        />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-semibold">
                                            {selectedProduct?.name ??
                                                data.description}
                                        </span>
                                        <span className="block truncate font-mono text-[11px] text-muted-foreground">
                                            {selectedProduct?.sku ?? item?.sku}
                                        </span>
                                    </span>
                                    <Button
                                        type="button"
                                        variant="white"
                                        size="xs"
                                        onClick={() => {
                                            setIsPickingProduct(true);
                                            requestAnimationFrame(() =>
                                                searchInput.current?.focus(),
                                            );
                                        }}
                                    >
                                        <Icon icon="solar:refresh-linear" />
                                        Change
                                    </Button>
                                </div>
                            )}
                            <InputError
                                message={errors.product_id}
                                className="text-xs"
                            />
                        </div>

                        {data.product_id !== null && (
                            <div className="grid animate-fade-up grid-cols-2 gap-4">
                                <Field
                                    id="item-description"
                                    label="Description"
                                    error={errors.description}
                                    className="col-span-2"
                                >
                                    <Input
                                        id="item-description"
                                        value={data.description}
                                        onChange={(event) =>
                                            setData(
                                                "description",
                                                event.target.value,
                                            )
                                        }
                                        aria-invalid={!!errors.description}
                                        className="bg-card"
                                    />
                                </Field>
                                <Field
                                    id="item-quantity"
                                    label="Quantity"
                                    error={errors.quantity}
                                >
                                    <Input
                                        ref={quantityInput}
                                        id="item-quantity"
                                        type="number"
                                        inputMode="decimal"
                                        min="0"
                                        step="any"
                                        value={data.quantity}
                                        onChange={(event) =>
                                            setData(
                                                "quantity",
                                                event.target.value,
                                            )
                                        }
                                        aria-invalid={!!errors.quantity}
                                        className="bg-card font-numeric"
                                    />
                                </Field>
                                <Field
                                    id="item-uom"
                                    label="Unit"
                                    error={errors.uom}
                                >
                                    <select
                                        id="item-uom"
                                        value={data.uom}
                                        onChange={(event) =>
                                            setData("uom", event.target.value)
                                        }
                                        className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                    >
                                        {uomOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                                <Field
                                    id="item-unit-price"
                                    label="Unit price (Rs)"
                                    error={errors.unit_price}
                                >
                                    <Input
                                        id="item-unit-price"
                                        type="number"
                                        inputMode="decimal"
                                        min="0"
                                        step="0.01"
                                        value={data.unit_price}
                                        onChange={(event) =>
                                            setData(
                                                "unit_price",
                                                event.target.value,
                                            )
                                        }
                                        aria-invalid={!!errors.unit_price}
                                        className="bg-card font-numeric"
                                    />
                                </Field>
                                <Field
                                    id="item-discount"
                                    label="Discount"
                                    error={errors.discount}
                                >
                                    <div className="flex">
                                        <Input
                                            id="item-discount"
                                            type="number"
                                            inputMode="decimal"
                                            min="0"
                                            step="0.01"
                                            placeholder="0"
                                            value={data.discount}
                                            onChange={(event) =>
                                                setData(
                                                    "discount",
                                                    event.target.value,
                                                )
                                            }
                                            aria-invalid={!!errors.discount}
                                            className="rounded-r-none bg-card font-numeric"
                                        />
                                        <div
                                            className="flex rounded-r-md border border-l-0 border-input bg-muted/60 p-0.5"
                                            role="group"
                                            aria-label="Discount type"
                                        >
                                            {(
                                                ["amount", "percent"] as const
                                            ).map((mode) => (
                                                <button
                                                    key={mode}
                                                    type="button"
                                                    aria-pressed={
                                                        discountMode === mode
                                                    }
                                                    onClick={() =>
                                                        setDiscountMode(mode)
                                                    }
                                                    className={cn(
                                                        "rounded px-2 text-[11px] font-semibold text-muted-foreground transition-colors",
                                                        discountMode === mode &&
                                                            "bg-card text-sidebar-primary shadow-xs",
                                                    )}
                                                >
                                                    {mode === "amount"
                                                        ? "Rs"
                                                        : "%"}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </Field>
                                <Field
                                    id="item-tax-rate"
                                    label="Tax rate (%)"
                                    error={errors.tax_rate}
                                    className="col-span-2"
                                >
                                    <div className="flex gap-2">
                                        <Input
                                            id="item-tax-rate"
                                            type="number"
                                            inputMode="decimal"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            value={data.tax_rate}
                                            onChange={(event) =>
                                                setData(
                                                    "tax_rate",
                                                    event.target.value,
                                                )
                                            }
                                            aria-invalid={!!errors.tax_rate}
                                            className="w-24 bg-card font-numeric"
                                        />
                                        {taxPresets.map((rate) => (
                                            <button
                                                key={rate}
                                                type="button"
                                                onClick={() =>
                                                    setData("tax_rate", rate)
                                                }
                                                className={cn(
                                                    "rounded-full border px-3 text-xs font-semibold transition-colors",
                                                    toNumber(data.tax_rate) ===
                                                        toNumber(rate)
                                                        ? "border-sidebar-primary bg-sidebar-primary text-white dark:text-sidebar-primary-foreground"
                                                        : "border-border bg-card text-muted-foreground hover:border-sidebar-primary/40 hover:text-sidebar-primary",
                                                )}
                                            >
                                                {rate}%
                                            </button>
                                        ))}
                                    </div>
                                </Field>
                            </div>
                        )}
                    </div>

                    {data.product_id !== null && (
                        <div className="grid gap-1.5 border-t border-border bg-muted/40 px-5 py-4">
                            <BreakdownRow
                                label={`${formatQuantity(quantity)} × Rs ${unitPrice.toFixed(2)}`}
                                value={<Money value={gross} />}
                            />
                            {discount > 0 && (
                                <BreakdownRow
                                    label="Discount"
                                    value={
                                        <span className="text-tone-red">
                                            − <Money value={discount} />
                                        </span>
                                    }
                                />
                            )}
                            {tax > 0 && (
                                <BreakdownRow
                                    label={`Tax ${toNumber(data.tax_rate)}%`}
                                    value={<Money value={tax} />}
                                />
                            )}
                            <div className="mt-1 flex items-center justify-between border-t border-dashed border-border pt-2">
                                <span className="text-sm font-semibold">
                                    Line total
                                    <span className="ml-1 text-[11px] font-normal text-muted-foreground">
                                        (before tax)
                                    </span>
                                </span>
                                <Money
                                    value={net}
                                    className={cn(
                                        "text-lg font-bold text-sidebar-primary",
                                        net < 0 && "text-tone-red",
                                    )}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-5 py-3">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mr-auto"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        {!item && (
                            <Button
                                type="submit"
                                variant="white"
                                size="sm"
                                disabled={
                                    processing || data.product_id === null
                                }
                                onClick={() => (addAnother.current = true)}
                            >
                                <Icon icon="solar:add-circle-linear" />
                                Save & add another
                            </Button>
                        )}
                        <Button
                            type="submit"
                            variant="theme"
                            size="sm"
                            disabled={processing || data.product_id === null}
                            onClick={() => (addAnother.current = false)}
                        >
                            {processing ? (
                                <Spinner />
                            ) : (
                                <Icon icon="solar:check-read-linear" />
                            )}
                            {item ? "Save item" : "Add item"}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}
