import { Icon } from '@iconify/react/offline';
import { Head, Link, setLayoutProps } from '@inertiajs/react';
import { PageContent, PageHeader } from '@/components/page';
import { CustomerForm } from '@/components/customers/customer-form';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { create, index, store } from '@/routes/customers';

export default function CreateCustomer() {
    setLayoutProps({
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Customers', href: index() },
            { title: 'New customer', href: create() },
        ],
    });

    return (
        <>
            <Head title="New customer" />
            <div className="flex min-w-0 flex-1 flex-col">
                <PageHeader
                    title="New customer"
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
                    <CustomerForm submitUrl={store.url()} method="post" />
                </PageContent>
            </div>
        </>
    );
}
