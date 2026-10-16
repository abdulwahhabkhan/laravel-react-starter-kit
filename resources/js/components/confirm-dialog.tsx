import { Icon } from '@iconify/react/offline';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { DialogOverlay, DialogPortal } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

type ConfirmTone = 'danger' | 'warning' | 'info';

export type ConfirmOptions = {
    title?: string;
    description?: ReactNode;
    confirmLabel?: string;
    tone?: ConfirmTone;
    /** Runs on confirm; the dialog shows a spinner until the promise settles. */
    onConfirm: () => void | Promise<unknown>;
};

const toneStyles: Record<
    ConfirmTone,
    { icon: string; badge: string; wash: string }
> = {
    danger: {
        icon: 'solar:trash-bin-trash-bold-duotone',
        badge: 'bg-tone-red-bg text-tone-red ring-tone-red/15',
        wash: 'from-tone-red-bg/70',
    },
    warning: {
        icon: 'solar:danger-triangle-bold-duotone',
        badge: 'bg-tone-orange-bg text-tone-orange ring-tone-orange/15',
        wash: 'from-tone-orange-bg/70',
    },
    info: {
        icon: 'solar:question-circle-bold-duotone',
        badge: 'bg-tone-navy-bg text-tone-navy ring-tone-navy/15',
        wash: 'from-tone-navy-bg/70',
    },
};

const ConfirmContext = createContext<
    ((options: ConfirmOptions) => void) | null
>(null);

/**
 * App-wide "Are you sure?" dialog, opened with `useConfirm()`.
 */
export function ConfirmProvider({ children }: { children: ReactNode }) {
    const [options, setOptions] = useState<ConfirmOptions | null>(null);
    const [processing, setProcessing] = useState(false);

    const confirm = useCallback((next: ConfirmOptions) => {
        setProcessing(false);
        setOptions(next);
    }, []);

    const handleConfirm = async () => {
        if (!options) {
            return;
        }

        setProcessing(true);

        try {
            await options.onConfirm();
        } finally {
            setProcessing(false);
            setOptions(null);
        }
    };

    const tone = options?.tone ?? 'warning';
    const styles = toneStyles[tone];

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}
            <DialogPrimitive.Root
                open={options !== null}
                onOpenChange={(open) =>
                    !open && !processing && setOptions(null)
                }
            >
                <DialogPortal>
                    <DialogOverlay />
                    {/* Behaves like an alert dialog: clicking outside never dismisses it. */}
                    <DialogPrimitive.Content
                        role="alertdialog"
                        onInteractOutside={(event) => event.preventDefault()}
                        className="fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-0 overflow-hidden rounded-lg border border-border/60 bg-card p-0 shadow-2xl duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-md"
                    >
                        <div
                            className={cn(
                                'flex flex-row items-start gap-4 bg-linear-to-b to-transparent px-6 pt-6 pb-5 text-left',
                                styles.wash,
                            )}
                        >
                            <span
                                className={cn(
                                    'flex size-11 shrink-0 items-center justify-center rounded-md ring-1',
                                    styles.badge,
                                )}
                            >
                                <Icon
                                    icon={styles.icon}
                                    aria-hidden
                                    className="size-6 shrink-0"
                                />
                            </span>
                            <div className="grid gap-1.5 pt-0.5">
                                <DialogPrimitive.Title className="text-base leading-snug font-semibold tracking-tight">
                                    {options?.title ?? 'Are you sure?'}
                                </DialogPrimitive.Title>
                                <DialogPrimitive.Description className="text-sm leading-relaxed text-muted-foreground">
                                    {options?.description ??
                                        'Please confirm you want to continue.'}
                                </DialogPrimitive.Description>
                            </div>
                        </div>
                        <div className="flex flex-col-reverse gap-2 border-t border-border/60 bg-muted/60 px-6 py-4 sm:flex-row sm:justify-end">
                            <DialogPrimitive.Close asChild>
                                <Button variant="outline" disabled={processing}>
                                    Cancel
                                </Button>
                            </DialogPrimitive.Close>
                            <Button
                                variant={
                                    tone === 'danger'
                                        ? 'destructive'
                                        : 'default'
                                }
                                disabled={processing}
                                onClick={handleConfirm}
                            >
                                {processing && <Spinner />}
                                {options?.confirmLabel ?? 'Proceed'}
                            </Button>
                        </div>
                    </DialogPrimitive.Content>
                </DialogPortal>
            </DialogPrimitive.Root>
        </ConfirmContext.Provider>
    );
}

export function useConfirm(): (options: ConfirmOptions) => void {
    const confirm = useContext(ConfirmContext);

    if (!confirm) {
        throw new Error('useConfirm must be used within ConfirmProvider.');
    }

    return confirm;
}
