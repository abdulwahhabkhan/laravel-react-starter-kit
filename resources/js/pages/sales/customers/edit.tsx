import { Icon } from '@iconify/react/offline';
import { Head, Link, setLayoutProps } from '@inertiajs/react';
import { PageContent, PageHeader } from '@/components/page';
import { CustomerForm } from '@/components/customers/customer-form';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { edit, index, update } from '@/routes/customers';
import type { Customer } from '@/types';

export default function EditCustomer({ customer }: { customer: Customer }) {
    setLayoutProps({
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Customers', href: index() },
            { title: customer.name, href: edit(customer.id) },
        ],
    });

    return (
        <>
            <Head title={`Edit ${customer.name}`} />
            <div className="flex min-w-0 flex-1 flex-col">
                <PageHeader
                    title="Edit customer"
                    description={customer.name}
                    actions={
                        <Button variant="outline" size="sm" asChild>
                            <Link href={index()}>
                                <Icon icon="solar:arrow-left-linear" />
                                Customers
                            </Link>
                        </Button>
                    }
                />
                <PageContent>
                    <CustomerForm
                        customer={customer}
                        submitUrl={update.url(customer.id)}
                        method="put"
                    />
                </PageContent>
            </div>
        </>
    );
}
