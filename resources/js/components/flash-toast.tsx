import { Icon } from '@iconify/react/offline';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { FlashToast } from '@/types/ui';

const DURATION = 5000;

const variants: Record<
    FlashToast['type'],
    { title: string; icon: string; tile: string; wash: string; bar: string }
> = {
    success: {
        title: 'Done',
        icon: 'solar:check-circle-bold',
        tile: 'bg-linear-135 from-[#1f9d63] to-[#127347] shadow-[0_6px_16px_-6px_rgb(18_115_71/0.7)]',
        wash: 'from-tone-green-bg',
        bar: 'bg-tone-green',
    },
    info: {
        title: 'Good to know',
        icon: 'solar:info-circle-bold',
        tile: 'bg-linear-135 from-[#0d4a8a] to-[#04203f] shadow-[0_6px_16px_-6px_rgb(7_48_93/0.7)]',
        wash: 'from-tone-navy-bg',
        bar: 'bg-tone-navy',
    },
    warning: {
        title: 'Heads up',
        icon: 'solar:danger-triangle-bold',
        tile: 'bg-linear-135 from-[#f0a95f] to-[#c9772c] shadow-[0_6px_16px_-6px_rgb(201_119_44/0.7)]',
        wash: 'from-tone-orange-bg',
        bar: 'bg-tone-orange',
    },
    error: {
        title: 'Something went wrong',
        icon: 'solar:close-circle-bold',
        tile: 'bg-linear-135 from-[#d9534f] to-[#a12a26] shadow-[0_6px_16px_-6px_rgb(161_42_38/0.7)]',
        wash: 'from-tone-red-bg',
        bar: 'bg-tone-red',
    },
};

function sentence(message: string): string {
    return message.charAt(0).toUpperCase() + message.slice(1);
}

function FlashToastCard({
    id,
    type,
    message,
}: FlashToast & { id: string | number }) {
    const variant = variants[type];

    return (
        <div
            role={type === 'error' || type === 'warning' ? 'alert' : 'status'}
            className="relative flex w-[356px] max-w-[calc(100vw-2rem)] items-start gap-3.5 overflow-hidden rounded-xl bg-popover p-4 pr-10 text-popover-foreground shadow-lift ring-1 ring-border"
        >
            <span
                className={cn(
                    'pointer-events-none absolute inset-y-0 left-0 w-28 bg-linear-to-r to-transparent opacity-80',
                    variant.wash,
                )}
            />
            <span
                className={cn(
                    'relative flex size-10 shrink-0 animate-toast-icon items-center justify-center overflow-hidden rounded-xl text-white',
                    variant.tile,
                )}
            >
                <span className="absolute inset-0 fabric-weave" />
                <Icon
                    icon={variant.icon}
                    aria-hidden
                    className="relative size-[22px] shrink-0"
                />
            </span>
            <div className="relative min-w-0 flex-1 pt-0.5">
                <div className="text-sm font-semibold">{variant.title}</div>
                <p className="mt-0.5 text-[13px] leading-snug text-text-2">
                    {sentence(message)}
                </p>
            </div>
            <button
                type="button"
                onClick={() => toast.dismiss(id)}
                aria-label="Dismiss"
                className="absolute top-3 right-3 flex size-6 items-center justify-center rounded-md text-text-3 transition-colors hover:bg-muted hover:text-foreground"
            >
                <Icon
                    icon="solar:close-linear"
                    aria-hidden
                    className="size-4"
                />
            </button>
            <span className="absolute inset-x-0 bottom-0 h-[3px] bg-border/60">
                <span
                    className={cn(
                        'block h-full origin-left animate-toast-progress in-data-[expanded=true]:[animation-play-state:paused]',
                        variant.bar,
                    )}
                    style={{ animationDuration: `${DURATION}ms` }}
                />
            </span>
        </div>
    );
}

/**
 * Branded toast: tone icon tile, title, message and a draining progress bar.
 */
export function showToast({ type, message }: FlashToast): void {
    toast.custom(
        (id) => <FlashToastCard id={id} type={type} message={message} />,
        { duration: DURATION },
    );
}
