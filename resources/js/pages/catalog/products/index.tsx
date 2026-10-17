import { Icon } from '@iconify/react/offline';
import { Head, Link, router, setLayoutProps } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { FilterSelect, filterFieldClassName } from '@/components/filter-field';
import { PageContent, PageFilters, PageHeader } from '@/components/page';
import { formatMoney } from '@/components/products/product-form';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { create, destroy, edit, index } from '@/routes/products';
import type { Paginated, Product, UomOption } from '@/types';

type Filters = {
    search: string;
    uom: string;
};

function formatDate(value: string | null): string {
    return value
        ? new Date(value).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
          })
        : '—';
}

function Amount({ value }: { value: string }) {
    return (
        <>
            <span className="mr-1 text-[10px] text-muted-foreground">Rs</span>
            <span className="font-semibold">
                {formatMoney(Number.parseFloat(value))}
            </span>
        </>
    );
}

function Margin({ product }: { product: Product }) {
    const cost = Number.parseFloat(product.cost);
    const price = Number.parseFloat(product.price);

    if (price <= 0) {
        return <span className="text-muted-foreground">—</span>;
    }

    const percent = ((price - cost) / price) * 100;

    return (
        <span
            className={cn(
                'inline-flex rounded-full px-2 py-0.5 font-numeric text-[11px] font-semibold',
                percent < 0
                    ? 'bg-rose-600/10 text-rose-700 dark:text-rose-400'
                    : 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-400',
            )}
        >
            {percent.toFixed(1)}%
        </span>
    );
}

function Pagination({ products }: { products: Paginated<Product> }) {
    if (products.total === 0) {
        return null;
    }

    return (
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground">
            <span>
                Showing {products.from} to {products.to} of {products.total}{' '}
                products
            </span>
            {products.last_page > 1 && (
                <nav
                    className="flex items-center gap-1"
                    aria-label="Pagination"
                >
                    {products.links.map((link, position) => {
                        const label = link.label
                            .replace('&laquo; Previous', 'Previous')
                            .replace('Next &raquo;', 'Next');
                        const className = cn(
                            'grid h-7 min-w-7 place-items-center rounded-md border px-2 font-semibold',
                            link.active
                                ? 'border-sidebar-primary bg-sidebar-primary text-white dark:text-sidebar-primary-foreground'
                                : 'border-border bg-card text-foreground hover:border-sidebar-primary/40',
                            !link.url && 'pointer-events-none opacity-50',
                        );

                        return link.url ? (
                            <Link
                                key={position}
                                href={link.url}
                                preserveScroll
                                className={className}
                                aria-current={link.active ? 'page' : undefined}
                            >
                                {label}
                            </Link>
                        ) : (
                            <span key={position} className={className}>
                                {label}
                            </span>
                        );
                    })}
                </nav>
            )}
        </footer>
    );
}

export default function ProductsIndex({
    products,
    filters,
    uomOptions,
}: {
    products: Paginated<Product>;
    filters: Filters;
    uomOptions: UomOption[];
}) {
    const [search, setSearch] = useState(filters.search);
    const [productToDelete, setProductToDelete] = useState<Product | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);
    const isFirstRender = useRef(true);

    setLayoutProps({
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Products', href: index() },
        ],
    });

    const applyFilters = (next: Filters) => {
        router.get(
            index.url(),
            {
                search: next.search || undefined,
                uom: next.uom || undefined,
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
            () => applyFilters({ search: search.trim(), uom: filters.uom }),
            300,
        );

        return () => window.clearTimeout(timer);
        // Only the typed search term should trigger a debounced visit.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const deleteProduct = () => {
        if (!productToDelete) {
            return;
        }

        router.delete(destroy.url(productToDelete.id), {
            preserveScroll: true,
            onStart: () => setIsDeleting(true),
            onFinish: () => {
                setIsDeleting(false);
                setProductToDelete(null);
            },
        });
    };

    const hasFilters = filters.search !== '' || filters.uom !== '';
    const firstRowNumber = products.from ?? 1;

    return (
        <>
            <Head title="Products" />
            <div className="flex min-w-0 flex-1 flex-col">
                <PageHeader
                    title="Products"
                    description={`${products.total} ${products.total === 1 ? 'product' : 'products'}`}
                    actions={
                        <Button
                            variant="theme"
                            size="sm"
                            className="h-[30px] gap-1.5 px-2.5 text-xs font-semibold has-[>svg]:px-2.5"
                            asChild
                        >
                            <Link href={create()}>
                                <Icon
                                    icon="solar:add-bold-duotone"
                                    className="size-[18px]"
                                />
                                New product
                            </Link>
                        </Button>
                    }
                />

                <PageFilters className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto] lg:flex lg:items-center lg:gap-0">
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by name, SKU or UPC..."
                        aria-label="Search products"
                        className={cn(
                            filterFieldClassName,
                            'lg:flex-1 lg:rounded-l-md',
                        )}
                    />
                    <FilterSelect
                        value={filters.uom}
                        onChange={(event) =>
                            applyFilters({
                                search: search.trim(),
                                uom: event.target.value,
                            })
                        }
                        aria-label="Filter by unit"
                        className="[&_select]:lg:rounded-r-md"
                    >
                        <option value="">All units</option>
                        {uomOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </FilterSelect>
                </PageFilters>

                <PageContent>
                    <section className="overflow-hidden rounded-md border border-card-border bg-card text-card-foreground shadow-card">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[860px] animate-table text-xs leading-[18px] whitespace-nowrap [&_td]:px-3.5 [&_td]:py-2 [&_th]:px-3.5 [&_th]:py-2">
                                <thead>
                                    <tr className="border-b border-border text-left font-bold">
                                        <th className="w-10">#</th>
                                        <th>Product</th>
                                        <th>Unit</th>
                                        <th className="text-right">Cost</th>
                                        <th className="text-right">Price</th>
                                        <th className="text-right">Margin</th>
                                        <th>Updated</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.data.map((product, position) => (
                                        <tr
                                            key={product.id}
                                            className="border-b border-border/70 transition-colors last:border-0 hover:bg-accent/50"
                                        >
                                            <td className="font-numeric text-muted-foreground">
                                                {firstRowNumber + position}
                                            </td>
                                            <td>
                                                <Link
                                                    href={edit(product.id)}
                                                    prefetch
                                                    className="text-[13px] font-semibold text-sidebar-primary hover:underline"
                                                >
                                                    {product.name}
                                                </Link>
                                                <p className="font-mono text-[11px] text-muted-foreground">
                                                    {product.sku}
                                                    {product.upc && (
                                                        <>
                                                            <span className="mx-1.5">
                                                                ·
                                                            </span>
                                                            {product.upc}
                                                        </>
                                                    )}
                                                </p>
                                            </td>
                                            <td>
                                                <span className="inline-flex items-center gap-1 rounded-full bg-sidebar-primary/[0.08] px-2 py-0.5 text-[11px] font-semibold text-sidebar-primary dark:bg-sidebar-primary/[0.14]">
                                                    <Icon
                                                        icon="solar:ruler-linear"
                                                        className="size-3"
                                                        aria-hidden="true"
                                                    />
                                                    {product.uom_label}
                                                </span>
                                            </td>
                                            <td className="text-right font-numeric">
                                                <Amount value={product.cost} />
                                            </td>
                                            <td className="text-right font-numeric">
                                                <Amount value={product.price} />
                                            </td>
                                            <td className="text-right">
                                                <Margin product={product} />
                                            </td>
                                            <td className="text-muted-foreground">
                                                {formatDate(product.updated_at)}
                                            </td>
                                            <td>
                                                <div className="flex justify-end gap-1.5">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="size-7"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={edit(
                                                                product.id,
                                                            )}
                                                            aria-label={`Edit ${product.name}`}
                                                        >
                                                            <Icon icon="solar:pen-2-bold-duotone" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="size-7 text-rose-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/10"
                                                        aria-label={`Delete ${product.name}`}
                                                        onClick={() =>
                                                            setProductToDelete(
                                                                product,
                                                            )
                                                        }
                                                    >
                                                        <Icon icon="solar:trash-bin-trash-linear" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {products.data.length === 0 && (
                                        <tr>
                                            <td colSpan={8}>
                                                <div className="flex flex-col items-center gap-2 py-12 text-center">
                                                    <span className="grid size-12 place-items-center rounded-full bg-sidebar-primary/[0.08] text-sidebar-primary">
                                                        <Icon
                                                            icon="solar:box-bold-duotone"
                                                            className="size-6"
                                                        />
                                                    </span>
                                                    <p className="text-sm font-semibold">
                                                        {hasFilters
                                                            ? 'No products match these filters'
                                                            : 'No products yet'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {hasFilters
                                                            ? 'Try a different search or unit.'
                                                            : 'Create your first product to start selling.'}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination products={products} />
                    </section>
                </PageContent>
            </div>

            <Dialog
                open={productToDelete !== null}
                onOpenChange={(open) => !open && setProductToDelete(null)}
            >
                <DialogContent>
                    <DialogTitle>Delete this product?</DialogTitle>
                    <DialogDescription>
                        <span className="font-semibold text-foreground">
                            {productToDelete?.name}
                        </span>{' '}
                        ({productToDelete?.sku}) will be permanently removed.
                        This cannot be undone.
                    </DialogDescription>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            disabled={isDeleting}
                            onClick={deleteProduct}
                        >
                            {isDeleting && <Spinner />}
                            Delete product
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
