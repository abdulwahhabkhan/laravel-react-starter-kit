import { Link, usePage } from '@inertiajs/react';
import { useSyncExternalStore } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import { cn } from '@/lib/utils';

/**
 * The passkey button only renders once the browser reports support,
 * so the card stays hidden until hydration to avoid a visible jump.
 */
const subscribeToNothing = () => () => {};

function LedgerIllustration() {
    return (
        <svg
            viewBox="0 0 420 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            className="w-full max-w-md drop-shadow-2xl"
        >
            <rect
                x="20"
                y="20"
                width="300"
                height="200"
                rx="14"
                fill="#ffffff"
                fillOpacity="0.08"
                stroke="#ffffff"
                strokeOpacity="0.18"
            />
            <rect
                x="44"
                y="44"
                width="90"
                height="10"
                rx="5"
                fill="#ffffff"
                fillOpacity="0.55"
            />
            <rect
                x="44"
                y="62"
                width="56"
                height="8"
                rx="4"
                fill="#ffffff"
                fillOpacity="0.25"
            />
            <rect
                x="60"
                y="150"
                width="22"
                height="46"
                rx="4"
                fill="#7fb2ff"
                fillOpacity="0.55"
            />
            <rect
                x="96"
                y="124"
                width="22"
                height="72"
                rx="4"
                fill="#7fb2ff"
                fillOpacity="0.7"
            />
            <rect
                x="132"
                y="136"
                width="22"
                height="60"
                rx="4"
                fill="#7fb2ff"
                fillOpacity="0.55"
            />
            <rect
                x="168"
                y="102"
                width="22"
                height="94"
                rx="4"
                fill="#7fb2ff"
                fillOpacity="0.85"
            />
            <rect
                x="204"
                y="114"
                width="22"
                height="82"
                rx="4"
                fill="#7fb2ff"
                fillOpacity="0.7"
            />
            <rect
                x="240"
                y="88"
                width="22"
                height="108"
                rx="4"
                fill="#9fd0ff"
            />
            <path
                d="M71 140 L107 112 L143 124 L179 90 L215 100 L251 74"
                stroke="#f5c451"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="251" cy="74" r="5" fill="#f5c451" />

            <g>
                <rect
                    x="236"
                    y="138"
                    width="164"
                    height="122"
                    rx="12"
                    fill="#ffffff"
                    fillOpacity="0.96"
                />
                <rect
                    x="254"
                    y="156"
                    width="64"
                    height="8"
                    rx="4"
                    fill="#07305d"
                />
                <rect
                    x="254"
                    y="172"
                    width="40"
                    height="6"
                    rx="3"
                    fill="#07305d"
                    fillOpacity="0.3"
                />
                <rect
                    x="254"
                    y="192"
                    width="128"
                    height="1.5"
                    fill="#07305d"
                    fillOpacity="0.15"
                />
                <rect
                    x="254"
                    y="202"
                    width="70"
                    height="6"
                    rx="3"
                    fill="#07305d"
                    fillOpacity="0.35"
                />
                <rect
                    x="352"
                    y="202"
                    width="30"
                    height="6"
                    rx="3"
                    fill="#07305d"
                    fillOpacity="0.35"
                />
                <rect
                    x="254"
                    y="216"
                    width="56"
                    height="6"
                    rx="3"
                    fill="#07305d"
                    fillOpacity="0.35"
                />
                <rect
                    x="352"
                    y="216"
                    width="30"
                    height="6"
                    rx="3"
                    fill="#07305d"
                    fillOpacity="0.35"
                />
                <rect
                    x="254"
                    y="236"
                    width="44"
                    height="8"
                    rx="4"
                    fill="#07305d"
                    fillOpacity="0.8"
                />
                <rect
                    x="338"
                    y="234"
                    width="44"
                    height="12"
                    rx="6"
                    fill="#16a34a"
                    fillOpacity="0.9"
                />
            </g>
        </svg>
    );
}

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;
    const isHydrated = useSyncExternalStore(
        subscribeToNothing,
        () => true,
        () => false,
    );

    return (
        <div className="grid min-h-dvh lg:grid-cols-[2fr_3fr]">
            <aside className="relative hidden overflow-hidden bg-[#07305d] p-10 text-white lg:flex lg:flex-col">
                <div
                    aria-hidden
                    className="absolute inset-y-0 right-0 z-10 w-1 bg-[linear-gradient(to_bottom,transparent,#f5c451_10%,#f5c451_90%,transparent)]"
                />
                <div
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(127,178,255,0.35),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(3,20,45,0.9),transparent_60%)]"
                />
                <div
                    aria-hidden
                    className="absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:18px_18px] opacity-20"
                />

                <Link
                    href={home()}
                    className="relative z-10 flex items-center gap-2.5 text-lg font-semibold"
                >
                    <AppLogoIcon className="size-9 rounded-md ring-1 ring-white/20" />
                    {name}
                </Link>

                <div className="relative z-10 my-auto space-y-8 py-10">
                    <div className="space-y-4">
                        <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-[#f5c451] uppercase">
                            <span className="h-px w-8 bg-[#f5c451]" />
                            Business management suite
                        </p>
                        <h2 className="text-4xl leading-tight font-bold tracking-tight text-balance xl:text-5xl">
                            Every sale, purchase and ledger — in sync.
                        </h2>
                        <p className="max-w-md text-base text-blue-100/80">
                            Manage sales, purchases and accounts from one place,
                            with your books always up to date.
                        </p>
                    </div>
                    <LedgerIllustration />
                </div>

                <p className="relative z-10 text-xs text-blue-100/60">
                    &copy; {new Date().getFullYear()} {name}
                </p>
            </aside>

            <main className="relative flex items-center justify-center bg-muted/40 px-4 py-10 sm:px-8">
                <div className="w-full max-w-md space-y-6">
                    <Link
                        href={home()}
                        className="flex items-center justify-center gap-2.5 text-lg font-semibold lg:hidden"
                    >
                        <AppLogoIcon className="size-10 rounded-md" />
                        {name}
                    </Link>

                    <Card
                        className={cn(
                            'gap-6 py-8 shadow-lg',
                            isHydrated
                                ? 'animate-in duration-500 ease-out fade-in slide-in-from-bottom-4'
                                : 'opacity-0',
                        )}
                    >
                        <CardHeader className="px-8">
                            <CardTitle className="text-2xl">{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-8">{children}</CardContent>
                    </Card>

                    <p className="text-center text-xs text-muted-foreground lg:hidden">
                        &copy; {new Date().getFullYear()} {name}
                    </p>
                </div>
            </main>
        </div>
    );
}
