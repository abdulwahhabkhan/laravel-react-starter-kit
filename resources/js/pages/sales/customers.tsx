import { Icon } from '@iconify/react/offline';
import { Head, setLayoutProps } from '@inertiajs/react';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import type {
    CreditStanding,
    Customer,
} from '@/components/modules/customers-data';
import {
    creditFilters,
    creditStanding,
    customers,
    uniqueValues,
} from '@/components/modules/customers-data';
import { StatusBadge } from '@/components/modules/status-badge';
import { formatRupees } from '@/components/dashboard/panel';
import { PageContent, PageFilters, PageHeader } from '@/components/page';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { show } from '@/routes/modules';

const cities = uniqueValues('city');
const agents = uniqueValues('agent');
const statuses = uniqueValues('status');

const columns: { label: string; align?: 'right' }[] = [
    { label: 'Customer' },
    { label: 'Contact' },
    { label: 'Address' },
    { label: 'Agent' },
    { label: 'Credit limit', align: 'right' },
    { label: 'Discount' },
    { label: 'Status' },
    { label: 'Actions', align: 'right' },
];

/**
 * Filter-bar field shared by the search input and the dropdowns: on large
 * screens the fields join into one bordered strip with rounded outer ends.
 */
const filterFieldClassName =
    'h-[34px] w-full min-w-0 rounded-md border border-input bg-card px-3 text-xs font-semibold text-foreground transition-[color,box-shadow] outline-none placeholder:font-normal placeholder:text-muted-foreground focus-visible:relative focus-visible:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 lg:rounded-none';

function FilterSelect({
    className,
    children,
    ...props
}: ComponentProps<'select'>) {
    return (
        <div
            className={cn(
                'relative h-[34px] lg:-ml-px lg:w-[124px]',
                className,
            )}
        >
            <select
                className={cn(
                    filterFieldClassName,
                    'block cursor-pointer appearance-none pr-8',
                )}
                {...props}
            >
                {children}
            </select>
            <Icon
                icon="solar:alt-arrow-down-linear"
                className="pointer-events-none absolute top-1/2 right-2.5 z-10 size-3.5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
            />
        </div>
    );
}

function CustomerRow({ customer }: { customer: Customer }) {
    const isOverLimit = creditStanding(customer) === 'over';

    return (
        <tr className="border-b border-border/70 transition-colors last:border-0 hover:bg-accent/60">
            <td>
                <p className="font-semibold text-sidebar-primary">
                    {customer.name}
                </p>
                <p className="font-mono text-[11px] text-muted-foreground">
                    {customer.code}
                </p>
            </td>
            <td>
                <p>{customer.contactPerson}</p>
                <p className="font-mono text-[11px] text-muted-foreground">
                    {customer.phone}
                </p>
            </td>
            <td>
                <p>{customer.address}</p>
                <p className="text-[11px] text-muted-foreground">
                    {customer.city}
                </p>
            </td>
            <td>{customer.agent}</td>
            <td className="text-right tabular-nums">
                {customer.creditLimit > 0 ? (
                    <>
                        <p className="font-semibold">
                            <span className="mr-1 font-normal text-muted-foreground">
                                Rs
                            </span>
                            {formatRupees(customer.creditLimit)}
                        </p>
                        <p
                            className={cn(
                                'text-[11px]',
                                isOverLimit
                                    ? 'font-semibold text-rose-700 dark:text-rose-400'
                                    : 'text-muted-foreground',
                            )}
                        >
                            Bal {formatRupees(customer.balance)}
                        </p>
                    </>
                ) : (
                    <span className="text-muted-foreground">—</span>
                )}
            </td>
            <td className="tabular-nums">
                {customer.discount > 0 ? (
                    `${customer.discount}%`
                ) : (
                    <span className="text-muted-foreground">—</span>
                )}
            </td>
            <td>
                <StatusBadge status={customer.status} />
            </td>
            <td className="text-right">
                <div className="inline-flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground"
                        aria-label={`View ${customer.name}`}
                    >
                        <Icon icon="solar:eye-linear" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground"
                        aria-label={`Edit ${customer.name}`}
                    >
                        <Icon icon="solar:pen-2-bold-duotone" />
                    </Button>
                </div>
            </td>
        </tr>
    );
}

export default function Customers() {
    const [search, setSearch] = useState('');
    const [city, setCity] = useState('');
    const [agent, setAgent] = useState('');
    const [status, setStatus] = useState('');
    const [credit, setCredit] = useState<CreditStanding | ''>('');

    setLayoutProps({
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Sales · Customers', href: show(['sales', 'customers']) },
        ],
    });

    const term = search.trim().toLowerCase();
    const visibleCustomers = customers.filter(
        (customer) =>
            (term === '' ||
                [
                    customer.name,
                    customer.code,
                    customer.contactPerson,
                    customer.phone,
                    customer.city,
                ].some((value) => value.toLowerCase().includes(term))) &&
            (city === '' || customer.city === city) &&
            (agent === '' || customer.agent === agent) &&
            (status === '' || customer.status === status) &&
            (credit === '' || creditStanding(customer) === credit),
    );

    return (
        <>
            <Head title="Customers" />
            <div className="flex min-w-0 flex-1 flex-col">
                <PageHeader
                    title="Customers"
                    actions={
                        <Button
                            variant="theme"
                            size="sm"
                            className="h-[30px] gap-1.5 px-2.5 text-xs font-semibold has-[>svg]:px-2.5"
                        >
                            <Icon
                                icon="solar:add-bold-duotone"
                                className="size-[18px]"
                            />
                            New customer
                        </Button>
                    }
                />

                <PageFilters className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:items-center lg:gap-0">
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by name, code, phone, city..."
                        aria-label="Search customers"
                        className={cn(
                            filterFieldClassName,
                            'col-span-2 sm:col-span-4 lg:flex-1 lg:rounded-l-md',
                        )}
                    />
                    <FilterSelect
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                        aria-label="Filter by city"
                    >
                        <option value="">All Cities</option>
                        {cities.map((value) => (
                            <option key={value}>{value}</option>
                        ))}
                    </FilterSelect>
                    <FilterSelect
                        value={agent}
                        onChange={(event) => setAgent(event.target.value)}
                        aria-label="Filter by agent"
                    >
                        <option value="">All Agents</option>
                        {agents.map((value) => (
                            <option key={value}>{value}</option>
                        ))}
                    </FilterSelect>
                    <FilterSelect
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        aria-label="Filter by status"
                    >
                        <option value="">All Status</option>
                        {statuses.map((value) => (
                            <option key={value}>{value}</option>
                        ))}
                    </FilterSelect>
                    <FilterSelect
                        value={credit}
                        onChange={(event) =>
                            setCredit(event.target.value as CreditStanding | '')
                        }
                        aria-label="Filter by credit"
                        className="[&_select]:lg:rounded-r-md"
                    >
                        <option value="">All Credit</option>
                        {creditFilters.map((filter) => (
                            <option key={filter.value} value={filter.value}>
                                {filter.label}
                            </option>
                        ))}
                    </FilterSelect>
                </PageFilters>

                <PageContent>
                    <section className="overflow-hidden rounded-md border border-card-border bg-card text-card-foreground shadow-card">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] animate-table text-xs leading-[18px] whitespace-nowrap [&_td]:py-2 [&_td]:pr-[9.6px] [&_td]:pl-[14.4px] [&_th]:py-2 [&_th]:pr-[9.6px] [&_th]:pl-[14.4px]">
                                <thead>
                                    <tr className="border-b border-border text-left">
                                        {columns.map((column) => (
                                            <th
                                                key={column.label}
                                                className={cn(
                                                    'font-bold text-foreground',
                                                    column.align === 'right' &&
                                                        'text-right',
                                                )}
                                            >
                                                {column.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {visibleCustomers.map((customer) => (
                                        <CustomerRow
                                            key={customer.code}
                                            customer={customer}
                                        />
                                    ))}
                                    {visibleCustomers.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={columns.length}
                                                className="py-8! text-center"
                                            >
                                                <span className="mx-auto grid size-12 place-items-center rounded-full bg-card shadow-[0_0_0_4px_var(--color-accent)] ring-1 ring-border">
                                                    <Icon
                                                        icon="solar:box-bold-duotone"
                                                        className="size-6 text-[#b08a5a]"
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                                <p className="mt-3 text-sm font-medium text-sidebar-primary">
                                                    No customers found.
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </PageContent>
            </div>
        </>
    );
}
