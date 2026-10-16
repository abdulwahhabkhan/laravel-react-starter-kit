import { Icon } from '@iconify/react/offline';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

/**
 * Compact field for list filter bars. On large screens the fields join into
 * one bordered strip with rounded outer ends.
 */
export const filterFieldClassName =
    'h-[34px] w-full min-w-0 rounded-md border border-input bg-card px-3 text-xs font-semibold text-foreground transition-[color,box-shadow] outline-none placeholder:font-normal placeholder:text-muted-foreground focus-visible:relative focus-visible:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 lg:rounded-none';

export function FilterSelect({
    className,
    children,
    ...props
}: ComponentProps<'select'>) {
    return (
        <div
            className={cn(
                'relative h-[34px] lg:-ml-px lg:w-[140px]',
                className,
            )}
        >
            <select
                className={cn(
                    filterFieldClassName,
                    'block cursor-pointer appearance-none pr-8',
                )}
                {...props}
            >
                {children}
            </select>
            <Icon
                icon="solar:alt-arrow-down-linear"
                className="pointer-events-none absolute top-1/2 right-2.5 z-10 size-3.5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
            />
        </div>
    );
}
