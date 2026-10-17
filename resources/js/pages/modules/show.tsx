import { Icon } from "@iconify/react/offline";
import { Head, setLayoutProps } from "@inertiajs/react";
import type {
    ModuleColumn,
    ModuleStat,
} from "@/components/modules/module-pages";
import { findModulePage } from "@/components/modules/module-pages";
import { StatusBadge } from "@/components/modules/status-badge";
import { Panel } from "@/components/dashboard/panel";
import { PageContent, PageHeader } from "@/components/page";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { dashboard } from "@/routes";
import { show } from "@/routes/modules";
import type { BreadcrumbItem } from "@/types";

function ModuleStatCard({ stat }: { stat: ModuleStat }) {
    return (
        <div className="flex items-start gap-3.5 rounded-xl border border-card-border bg-card p-4 text-card-foreground shadow-card">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-sidebar-primary/[0.08] text-sidebar-primary dark:bg-sidebar-primary/[0.14]">
                <Icon icon={stat.icon} className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                    {stat.label}
                </p>
                <p className="mt-0.5 text-xl font-semibold tracking-tight font-numeric">
                    {stat.value}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {stat.caption}
                </p>
            </div>
        </div>
    );
}

function ModuleCell({
    column,
    value,
}: {
    column: ModuleColumn;
    value: string;
}) {
    switch (column.kind) {
        case "primary":
            return (
                <span className="font-semibold text-sidebar-primary">
                    {value}
                </span>
            );
        case "mono":
            return (
                <span className="font-mono text-xs text-muted-foreground">
                    {value}
                </span>
            );
        case "amount":
            return (
                <span className="font-semibold font-numeric">
                    <span className="mr-1 text-xs font-normal text-muted-foreground">
                        Rs
                    </span>
                    {value}
                </span>
            );
        case "status":
            return <StatusBadge status={value} />;
        default:
            return <span className="font-numeric">{value}</span>;
    }
}

export default function ModuleShow({
    module: moduleSlug,
    page: pageSlug,
}: {
    module: string;
    page: string;
}) {
    const match = findModulePage(moduleSlug, pageSlug);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Dashboard", href: dashboard() },
        ...(match
            ? [
                  {
                      title: `${match.module.title} · ${match.page.title}`,
                      href: show([moduleSlug, pageSlug]),
                  },
              ]
            : []),
    ];

    setLayoutProps({ breadcrumbs });

    if (!match) {
        return null;
    }

    const { module, page } = match;

    return (
        <>
            <Head title={page.title} />
            <div className="flex min-w-0 flex-1 flex-col">
                <PageHeader
                    title={page.title}
                    description={page.description}
                    actions={
                        <>
                            <Button variant="outline">
                                <Icon icon="solar:filter-linear" />
                                Filter
                            </Button>
                            <Button>
                                <Icon icon="solar:add-bold-duotone" />
                                {page.action}
                            </Button>
                        </>
                    }
                />
                <PageContent>
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {page.stats.map((stat) => (
                            <ModuleStatCard key={stat.label} stat={stat} />
                        ))}
                    </section>

                    <Panel
                        title={`All ${page.title.toLowerCase()}`}
                        description={`${module.title} · sample data`}
                    >
                        <div className="-mx-5 overflow-x-auto">
                            <table className="w-full min-w-[560px] animate-table text-[13px]">
                                <thead>
                                    <tr className="border-y border-border text-left text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
                                        {page.columns.map((column) => (
                                            <th
                                                key={column.label}
                                                className={cn(
                                                    "px-3 py-2 font-medium first:pl-5 last:pr-5",
                                                    column.align === "right" &&
                                                        "text-right",
                                                )}
                                            >
                                                {column.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {page.rows.map((row) => (
                                        <tr
                                            key={row[0]}
                                            className="border-b border-border/70 transition-colors last:border-0 hover:bg-accent/60"
                                        >
                                            {page.columns.map(
                                                (column, index) => (
                                                    <td
                                                        key={column.label}
                                                        className={cn(
                                                            "px-3 py-2.5 first:pl-5 last:pr-5",
                                                            column.align ===
                                                                "right" &&
                                                                "text-right",
                                                        )}
                                                    >
                                                        <ModuleCell
                                                            column={column}
                                                            value={row[index]}
                                                        />
                                                    </td>
                                                ),
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Panel>
                </PageContent>
            </div>
        </>
    );
}
