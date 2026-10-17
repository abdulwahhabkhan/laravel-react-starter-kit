import { Icon } from '@iconify/react/offline';
import { Link, useForm } from '@inertiajs/react';
import type { FormEvent, ReactNode } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { index } from '@/routes/customers';
import type { Customer } from '@/types';

export type CustomerFormData = {
    name: string;
    phone: string;
    email: string;
    address_line_1: string;
    city: string;
    region: string;
};

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

export function CustomerForm({
    customer,
    submitUrl,
    method,
}: {
    customer?: Customer;
    submitUrl: string;
    method: 'post' | 'put';
}) {
    const form = useForm<CustomerFormData>({
        name: customer?.name ?? '',
        phone: customer?.phone ?? '',
        email: customer?.email ?? '',
        address_line_1: customer?.address_line_1 ?? '',
        city: customer?.city ?? '',
        region: customer?.region ?? '',
    });

    const { data, setData, errors, processing } = form;

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form[method](submitUrl, { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <section className="rounded-xl border border-card-border bg-card text-card-foreground shadow-card">
                <header className="flex items-center gap-3 border-b border-border px-5 py-4">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-sidebar-primary/[0.08] text-sidebar-primary dark:bg-sidebar-primary/[0.14]">
                        <Icon
                            icon="solar:user-bold-duotone"
                            className="size-5"
                            aria-hidden="true"
                        />
                    </span>
                    <div>
                        <h2 className="text-sm font-semibold">
                            Customer details
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            {customer
                                ? 'Update the customer information below.'
                                : 'The customer will appear in orders and reports after saving.'}
                        </p>
                    </div>
                </header>
                <div className="grid gap-4 p-5 sm:grid-cols-2">
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
                            placeholder="e.g. ABC Trading Co."
                            aria-invalid={!!errors.name}
                            onChange={(event) =>
                                setData('name', event.target.value)
                            }
                            className="bg-card"
                        />
                    </Field>
                    <Field id="phone" label="Phone" hint="(optional)">
                        <Input
                            id="phone"
                            value={data.phone}
                            placeholder="e.g. +94 77 123 4567"
                            onChange={(event) =>
                                setData('phone', event.target.value)
                            }
                            className="bg-card"
                        />
                    </Field>
                    <Field id="email" label="Email" hint="(optional)">
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            placeholder="e.g. info@example.com"
                            aria-invalid={!!errors.email}
                            onChange={(event) =>
                                setData('email', event.target.value)
                            }
                            className="bg-card"
                        />
                    </Field>
                    <Field
                        id="address_line_1"
                        label="Address"
                        hint="(optional)"
                        error={errors.address_line_1}
                        className="sm:col-span-2"
                    >
                        <Input
                            id="address_line_1"
                            value={data.address_line_1}
                            placeholder="Street address"
                            onChange={(event) =>
                                setData('address_line_1', event.target.value)
                            }
                            className="bg-card"
                        />
                    </Field>
                    <Field id="city" label="City" hint="(optional)">
                        <Input
                            id="city"
                            value={data.city}
                            placeholder="e.g. Colombo"
                            onChange={(event) =>
                                setData('city', event.target.value)
                            }
                            className="bg-card"
                        />
                    </Field>
                    <Field id="region" label="Region" hint="(optional)">
                        <Input
                            id="region"
                            value={data.region}
                            placeholder="e.g. Western"
                            onChange={(event) =>
                                setData('region', event.target.value)
                            }
                            className="bg-card"
                        />
                    </Field>
                </div>
            </section>

            <div className="sticky bottom-3 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-card-border bg-card/95 px-5 py-3 shadow-card backdrop-blur">
                <p className="text-xs text-muted-foreground">
                    {customer
                        ? 'Changes apply to new orders and stock movements.'
                        : 'The customer can be added to orders right after saving.'}
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
                        {customer ? 'Save changes' : 'Create customer'}
                    </Button>
                </div>
            </div>
        </form>
    );
}
