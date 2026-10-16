import { Icon } from '@iconify/react/offline';
import { Head, Link, setLayoutProps } from '@inertiajs/react';
import { PageContent, PageHeader } from '@/components/page';
import { ProductForm } from '@/components/products/product-form';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { edit, index, update } from '@/routes/products';
import type { Product, UomOption } from '@/types';

export default function EditProduct({
    product,
    uomOptions,
}: {
    product: Product;
    uomOptions: UomOption[];
}) {
    setLayoutProps({
        breadcrumbs: [
            { title: 'Dashboard', href: dashboard() },
            { title: 'Products', href: index() },
            { title: product.name, href: edit(product.id) },
        ],
    });

    return (
        <>
            <Head title={`Edit ${product.name}`} />
            <div className="flex min-w-0 flex-1 flex-col">
                <PageHeader
                    title="Edit product"
                    description={product.sku}
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
                        product={product}
                        uomOptions={uomOptions}
                        submitUrl={update.url(product.id)}
                        method="put"
                    />
                </PageContent>
            </div>
        </>
    );
}
