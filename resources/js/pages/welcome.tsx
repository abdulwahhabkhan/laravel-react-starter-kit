import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    Landmark,
    ShoppingCart,
    Truck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { dashboard, login } from '@/routes';

type Module = {
    title: string;
    description: string;
    icon: LucideIcon;
    highlights: string[];
};

const modules: Module[] = [
    {
        title: 'Sales',
        description:
            'Create quotations, invoices and receipts, and track every customer balance in one place.',
        icon: ShoppingCart,
        highlights: ['Quotations & invoices', 'Customer ledgers', 'Receipts'],
    },
    {
        title: 'Purchases',
        description:
            'Raise purchase orders, record supplier bills and keep stock moving without the paperwork.',
        icon: Truck,
        highlights: ['Purchase orders', 'Supplier bills', 'Payments'],
    },
    {
        title: 'Accounts',
        description:
            'Double-entry bookkeeping with a chart of accounts, journals and real-time financial reports.',
        icon: Landmark,
        highlights: ['Chart of accounts', 'Journal entries', 'Trial balance'],
    },
];

export default function Welcome() {
    const { auth, name } = usePage().props;

    return (
        <>
            <Head title="Welcome" />
            <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[480px] bg-gradient-to-b from-[#07305d]/10 to-transparent dark:from-[#07305d]/40"
                />

                <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
                    <div className="flex items-center gap-2.5">
                        <AppLogoIcon className="size-9 rounded-md" />
                        <span className="text-lg font-semibold tracking-tight">
                            {name}
                        </span>
                    </div>
                    <nav>
                        <Link
                            href={auth.user ? dashboard() : login()}
                            className="inline-flex items-center gap-2 rounded-md bg-[#07305d] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#0a417d]"
                        >
                            {auth.user ? 'Go to dashboard' : 'Log in'}
                            <ArrowRight className="size-4" />
                        </Link>
                    </nav>
                </header>

                <main className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-8 sm:px-6 lg:py-12">
                    <section className="mx-auto max-w-3xl text-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#07305d]/20 bg-[#07305d]/5 px-3 py-1 text-xs font-medium text-[#07305d] dark:border-white/15 dark:bg-white/5 dark:text-blue-200">
                            <BarChart3 className="size-3.5" />
                            Business management, simplified
                        </span>
                        <h1 className="mt-5 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
                            Sales, purchases and accounts —{' '}
                            <span className="text-[#07305d] dark:text-blue-300">
                                all in one place
                            </span>
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg">
                            {name} keeps your day-to-day trading and your books
                            in sync. Every sale and purchase posts straight to
                            your accounts, so your numbers are always up to
                            date.
                        </p>
                    </section>

                    <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-6">
                        {modules.map((module) => (
                            <article
                                key={module.title}
                                className="group rounded-xl border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#07305d]/30 hover:shadow-md last:sm:col-span-2 last:lg:col-span-1"
                            >
                                <div className="flex size-11 items-center justify-center rounded-lg bg-[#07305d] text-white">
                                    <module.icon className="size-5" />
                                </div>
                                <h2 className="mt-4 text-lg font-semibold">
                                    {module.title}
                                </h2>
                                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                                    {module.description}
                                </p>
                                <ul className="mt-4 flex flex-wrap gap-2">
                                    {module.highlights.map((highlight) => (
                                        <li
                                            key={highlight}
                                            className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                                        >
                                            {highlight}
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        ))}
                    </section>
                </main>

                <footer className="relative mx-auto w-full max-w-6xl px-4 py-5 text-center text-xs text-muted-foreground sm:px-6">
                    &copy; {new Date().getFullYear()} {name}. All rights
                    reserved.
                </footer>
            </div>
        </>
    );
}
