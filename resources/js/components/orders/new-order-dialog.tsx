import { Icon } from '@iconify/react/offline';
import { Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { create as createCustomer } from '@/routes/customers';
import { store } from '@/routes/orders';
import type { CustomerOption } from '@/types';

function initials(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');
}

/**
 * Step one of a new order: pick the customer. The server creates a draft and
 * redirects to the editor, where dates, notes and items are filled in.
 */
export function NewOrderDialog({
    open,
    onOpenChange,
    customers,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customers: CustomerOption[];
}) {
    const [query, setQuery] = useState('');
    const [highlighted, setHighlighted] = useState(0);
    const form = useForm<{ account_id: number | null }>({ account_id: null });

    const matches = useMemo(() => {
        const term = query.trim().toLowerCase();

        return term === ''
            ? customers
            : customers.filter((customer) =>
                  `${customer.name} ${customer.city ?? ''}`
                      .toLowerCase()
                      .includes(term),
              );
    }, [customers, query]);

    const selected = customers.find(
        (customer) => customer.id === form.data.account_id,
    );

    const close = (next: boolean) => {
        if (!next) {
            setQuery('');
            setHighlighted(0);
            form.reset();
            form.clearErrors();
        }

        onOpenChange(next);
    };

    const submit = (accountId = form.data.account_id) => {
        if (accountId === null) {
            return;
        }

        form.transform(() => ({ account_id: accountId }));
        form.post(store.url());
    };

    const onSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setHighlighted((index) => Math.min(index + 1, matches.length - 1));
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setHighlighted((index) => Math.max(index - 1, 0));
        } else if (event.key === 'Enter') {
            event.preventDefault();
            const customer = matches[highlighted];

            if (customer) {
                form.setData('account_id', customer.id);
                submit(customer.id);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={close}>
            <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
                <div className="flex items-start gap-3 border-b border-border bg-linear-to-b from-sidebar-primary/[0.05] to-transparent px-5 pt-5 pb-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-sidebar-primary text-sidebar-highlight shadow-[0_2px_6px_-1px_rgb(7_48_93/0.35)]">
                        <Icon
                            icon="solar:cart-plus-bold-duotone"
                            className="size-5"
                        />
                    </span>
                    <div className="grid gap-0.5">
                        <DialogTitle className="text-base">
                            New order
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Choose a customer to start a draft. You'll add items
                            and delivery details next.
                        </DialogDescription>
                    </div>
                </div>

                <div className="px-5 pt-4">
                    <div className="relative">
                        <Icon
                            icon="solar:magnifer-linear"
                            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                        />
                        <input
                            type="search"
                            value={query}
                            autoFocus
                            onChange={(event) => {
                                setQuery(event.target.value);
                                setHighlighted(0);
                            }}
                            onKeyDown={onSearchKeyDown}
                            placeholder="Search customers by name or city..."
                            aria-label="Search customers"
                            aria-controls="new-order-customers"
                            className="h-10 w-full rounded-lg border border-input bg-card pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                    </div>
                </div>

                <ul
                    id="new-order-customers"
                    role="listbox"
                    aria-label="Customers"
                    className="mx-5 my-3 max-h-72 overflow-y-auto rounded-lg border border-border bg-card p-1"
                >
                    {matches.map((customer, position) => {
                        const isSelected = customer.id === form.data.account_id;

                        return (
                            <li
                                key={customer.id}
                                role="option"
                                aria-selected={isSelected}
                            >
                                <button
                                    type="button"
                                    onMouseEnter={() =>
                                        setHighlighted(position)
                                    }
                                    onClick={() =>
                                        form.setData('account_id', customer.id)
                                    }
                                    onDoubleClick={() => submit(customer.id)}
                                    className={cn(
                                        'flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left transition-colors',
                                        position === highlighted &&
                                            'bg-accent/70',
                                        isSelected &&
                                            'bg-sidebar-highlight/15 ring-1 ring-sidebar-highlight/40 ring-inset',
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'grid size-8 shrink-0 place-items-center rounded-full text-[11px] font-bold',
                                            isSelected
                                                ? 'bg-sidebar-primary text-sidebar-highlight'
                                                : 'bg-sidebar-primary/[0.08] text-sidebar-primary',
                                        )}
                                    >
                                        {initials(customer.name)}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-semibold">
                                            {customer.name}
                                        </span>
                                        <span className="block truncate text-xs text-muted-foreground">
                                            {customer.city ?? 'No city'}
                                        </span>
                                    </span>
                                    {isSelected && (
                                        <Icon
                                            icon="solar:check-circle-bold"
                                            className="size-5 shrink-0 text-sidebar-highlight"
                                        />
                                    )}
                                </button>
                            </li>
                        );
                    })}
                    {matches.length === 0 && (
                        <li className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                            <Icon
                                icon="solar:user-cross-rounded-bold-duotone"
                                className="size-8 text-muted-foreground"
                            />
                            <p className="text-sm font-semibold">
                                {customers.length === 0
                                    ? 'No customers yet'
                                    : `No customers match “${query}”`}
                            </p>
                            <Button variant="outline" size="xs" asChild>
                                <Link href={createCustomer()}>
                                    <Icon icon="solar:user-plus-bold-duotone" />
                                    Add a customer
                                </Link>
                            </Button>
                        </li>
                    )}
                </ul>
                <InputError
                    message={form.errors.account_id}
                    className="mx-5 -mt-1 mb-2 text-xs"
                />

                <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/50 px-5 py-3">
                    <p className="hidden text-[11px] text-muted-foreground sm:block">
                        <kbd className="rounded border border-border bg-card px-1">
                            ↑↓
                        </kbd>{' '}
                        to move,{' '}
                        <kbd className="rounded border border-border bg-card px-1">
                            Enter
                        </kbd>{' '}
                        to start
                    </p>
                    <div className="ml-auto flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => close(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="theme"
                            size="sm"
                            disabled={!selected || form.processing}
                            onClick={() => submit()}
                        >
                            {form.processing ? (
                                <Spinner />
                            ) : (
                                <Icon icon="solar:arrow-right-linear" />
                            )}
                            {selected
                                ? `Start order for ${selected.name}`
                                : 'Start order'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
