import { Head, usePage } from '@inertiajs/react';
import { CategoryBars } from '@/components/dashboard/category-bars';
import {
    categorySales,
    lowStockItems,
    monthlyRevenue,
    recentOrders,
    statTiles,
    topProducts,
} from '@/components/dashboard/dashboard-data';
import {
    LowStockList,
    QuickActions,
    RecentOrdersTable,
    TopProductsList,
} from '@/components/dashboard/dashboard-lists';
import { Panel, PanelLink } from '@/components/dashboard/panel';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { StatTile } from '@/components/dashboard/stat-tile';
import { PageContent, PageHeader } from '@/components/page';
import { dashboard } from '@/routes';

function greetingFor(hour: number): string {
    if (hour < 12) {
        return 'Good morning';
    }

    if (hour < 17) {
        return 'Good afternoon';
    }

    return 'Good evening';
}

export default function Dashboard() {
    const { auth } = usePage().props;
    const now = new Date();
    const firstName = auth.user?.name.split(' ')[0];
    const greeting = greetingFor(now.getHours());

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex min-w-0 flex-1 flex-col">
                <PageHeader
                    title={firstName ? `${greeting}, ${firstName}` : greeting}
                    description={now.toLocaleDateString('en-GB', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    })}
                />
                <PageContent>
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {statTiles.map((tile) => (
                            <StatTile key={tile.label} tile={tile} />
                        ))}
                    </section>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                        <Panel
                            title="Revenue"
                            description="Confirmed sales, last 12 months"
                            action={<PanelLink>Report →</PanelLink>}
                            className="xl:col-span-2"
                        >
                            <RevenueChart data={monthlyRevenue} />
                        </Panel>
                        <Panel
                            title="Sales by category"
                            description="This month"
                        >
                            <CategoryBars data={categorySales} />
                        </Panel>
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                        <Panel
                            title="Recent orders"
                            description="Latest sale orders across all customers"
                            action={<PanelLink>All orders →</PanelLink>}
                            className="xl:col-span-2"
                        >
                            <RecentOrdersTable orders={recentOrders} />
                        </Panel>
                        <Panel
                            title="Top products"
                            description="By revenue this month"
                        >
                            <TopProductsList products={topProducts} />
                        </Panel>
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                        <Panel
                            title="Low stock"
                            description="Below reorder level"
                            action={<PanelLink>Stock →</PanelLink>}
                        >
                            <LowStockList items={lowStockItems} />
                        </Panel>
                        <div className="flex flex-col gap-2.5 xl:col-span-2">
                            <h2 className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                                Quick actions
                            </h2>
                            <QuickActions />
                        </div>
                    </div>
                </PageContent>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
