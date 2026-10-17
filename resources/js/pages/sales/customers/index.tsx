import { Icon } from '@iconify/react/offline';
import { Head, Link, router, setLayoutProps } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { FilterSelect, filterFieldClassName } from '@/components/filter-field';
import { PageContent, PageFilters, PageHeader } from '@/components/page';
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
import { create, destroy, edit, index } from '@/routes/customers';
import type { Customer, FilterOption, Paginated } from '@/types';

type Filters = {
    search: string;
    city: string;
    region: string;
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

function Pagination({ customers }: { customers: Paginated<Customer> }) {
    if (customers.total === 0) {
        return null;
    }

    return (
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground">
            <span>
                Showing {customers.from} to {customers.to} of {customers.total}{' '}
                customers
            </span>
            {customers.last_page > 1 && (
                <nav
                    className="flex items-center gap-1"
                    aria-label="Pagination"
                >
                    {customers.links.map((link, position) => {
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

export default function CustomersIndex({
    customers,
    filters,
    cityOptions,
    regionOptions,
}: {
    customers: Paginated<Customer>;
    filters: Filters;
    cityOptions: FilterOption[];
    regionOptions: FilterOption[];
}) {
    const [search, setSearch] = useState(filters.search);
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);
    const isFirstRender = useRef(true);

    setLayoutProps({
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Customers', href: index() },
        ],
    });

    const applyFilters = (next: Filters) => {
        router.get(
            index.url(),
            {
                search: next.search || undefined,
                city: next.city || undefined,
                region: next.region || undefined,
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
            () =>
                applyFilters({
                    search: search.trim(),
                    city: filters.city,
                    region: filters.region,
                }),
            300,
        );

        return () => window.clearTimeout(timer);
        // Only the typed search term should trigger a debounced visit.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const deleteCustomer = () => {
        if (!customerToDelete) {
            return;
        }

        router.delete(destroy.url(customerToDelete.id), {
            preserveScroll: true,
            onStart: () => setIsDeleting(true),
            onFinish: () => {
                setIsDeleting(false);
                setCustomerToDelete(null);
            },
        });
    };

    const hasFilters =
        filters.search !== '' ||
        filters.city !== '' ||
        filters.region !== '';
    const firstRowNumber = customers.from ?? 1;

    return (
        <>
            <Head title="Customers" />
            <div className="flex min-w-0 flex-1 flex-col">
                <PageHeader
                    title="Customers"
                    description={`${customers.total} ${customers.total === 1 ? 'customer' : 'customers'}`}
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
                                New customer
                            </Link>
                        </Button>
                    }
                />

                <PageFilters className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_auto] lg:flex lg:items-center lg:gap-0">
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by name, phone or email..."
                        aria-label="Search customers"
                        className={cn(
                            filterFieldClassName,
                            'lg:flex-1 lg:rounded-l-md',
                        )}
                    />
                    <FilterSelect
                        value={filters.city}
                        onChange={(event) =>
                            applyFilters({
                                search: search.trim(),
                                city: event.target.value,
                                region: filters.region,
                            })
                        }
                        aria-label="Filter by city"
                    >
                        <option value="">All cities</option>
                        {cityOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </FilterSelect>
                    <FilterSelect
                        value={filters.region}
                        onChange={(event) =>
                            applyFilters({
                                search: search.trim(),
                                city: filters.city,
                                region: event.target.value,
                            })
                        }
                        aria-label="Filter by region"
                        className="[&_select]:lg:rounded-r-md"
                    >
                        <option value="">All regions</option>
                        {regionOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </FilterSelect>
                </PageFilters>

                <PageContent>
                    <section className="overflow-hidden rounded-md border border-card-border bg-card text-card-foreground shadow-card">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] animate-table text-xs leading-[18px] whitespace-nowrap [&_td]:px-3.5 [&_td]:py-2 [&_th]:px-3.5 [&_th]:py-2">
                                <thead>
                                    <tr className="border-b border-border text-left font-bold">
                                        <th className="w-10">#</th>
                                        <th>Customer</th>
                                        <th>Phone</th>
                                        <th>City</th>
                                        <th>Region</th>
                                        <th>Updated</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.data.map(
                                        (customer, position) => (
                                            <tr
                                                key={customer.id}
                                                className="border-b border-border/70 transition-colors last:border-0 hover:bg-accent/50"
                                            >
                                                <td className="text-muted-foreground tabular-nums">
                                                    {firstRowNumber +
                                                        position}
                                                </td>
                                                <td>
                                                    <Link
                                                        href={edit(
                                                            customer.id,
                                                        )}
                                                        prefetch
                                                        className="text-[13px] font-semibold text-sidebar-primary hover:underline"
                                                    >
                                                        {customer.name}
                                                    </Link>
                                                    {customer.email && (
                                                        <p className="text-[11px] text-muted-foreground">
                                                            {customer.email}
                                                        </p>
                                                    )}
                                                </td>
                                                <td>
                                                    {customer.phone || (
                                                        <span className="text-muted-foreground">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    {customer.city || (
                                                        <span className="text-muted-foreground">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    {customer.region || (
                                                        <span className="text-muted-foreground">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="text-muted-foreground">
                                                    {formatDate(
                                                        customer.updated_at,
                                                    )}
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
                                                                    customer.id,
                                                                )}
                                                                aria-label={`Edit ${customer.name}`}
                                                            >
                                                                <Icon icon="solar:pen-2-bold-duotone" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="size-7 text-rose-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/10"
                                                            aria-label={`Delete ${customer.name}`}
                                                            onClick={() =>
                                                                setCustomerToDelete(
                                                                    customer,
                                                                )
                                                            }
                                                        >
                                                            <Icon icon="solar:trash-bin-trash-linear" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                    {customers.data.length === 0 && (
                                        <tr>
                                            <td colSpan={7}>
                                                <div className="flex flex-col items-center gap-2 py-12 text-center">
                                                    <span className="grid size-12 place-items-center rounded-full bg-sidebar-primary/[0.08] text-sidebar-primary">
                                                        <Icon
                                                            icon="solar:box-bold-duotone"
                                                            className="size-6"
                                                        />
                                                    </span>
                                                    <p className="text-sm font-semibold">
                                                        {hasFilters
                                                            ? 'No customers match these filters'
                                                            : 'No customers yet'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {hasFilters
                                                            ? 'Try a different search or filter.'
                                                            : 'Create your first customer to start selling.'}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination customers={customers} />
                    </section>
                </PageContent>
            </div>

            <Dialog
                open={customerToDelete !== null}
                onOpenChange={(open) =>
                    !open && setCustomerToDelete(null)
                }
            >
                <DialogContent>
                    <DialogTitle>Delete this customer?</DialogTitle>
                    <DialogDescription>
                        <span className="font-semibold text-foreground">
                            {customerToDelete?.name}
                        </span>{' '}
                        will be permanently removed. This cannot be undone.
                    </DialogDescription>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            disabled={isDeleting}
                            onClick={deleteCustomer}
                        >
                            {isDeleting && <Spinner />}
                            Delete customer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
