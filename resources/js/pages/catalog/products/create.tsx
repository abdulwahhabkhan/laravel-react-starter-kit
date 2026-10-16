import { Icon } from '@iconify/react/offline';
import { Head, Link, setLayoutProps } from '@inertiajs/react';
import { PageContent, PageHeader } from '@/components/page';
import { ProductForm } from '@/components/products/product-form';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { create, index, store } from '@/routes/products';
import type { UomOption } from '@/types';

export default function CreateProduct({
    uomOptions,
}: {
    uomOptions: UomOption[];
}) {
    setLayoutProps({
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Products', href: index() },
            { title: 'New product', href: create() },
        ],
    });

    return (
        <>
            <Head title="New product" />
            <div className="flex min-w-0 flex-1 flex-col">
                <PageHeader
                    title="New product"
                    actions={
                        <Button variant="outline" size="sm" asChild>
                            <Link href={index()}>
                                <Icon icon="solar:arrow-left-linear" />
                                Products
                            </Link>
                        </Button>
                    }
                />
                <PageContent>
                    <ProductForm
                        uomOptions={uomOptions}
                        submitUrl={store.url()}
                        method="post"
                    />
                </PageContent>
            </div>
        </>
    );
}
