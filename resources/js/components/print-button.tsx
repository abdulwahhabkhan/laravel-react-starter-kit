import { Icon } from '@iconify/react/offline';
import type { ComponentProps } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = Omit<ComponentProps<typeof Button>, 'variant' | 'onClick'>;

/**
 * Standard "Print" button: prints the current page and is itself hidden on paper.
 */
export function PrintButton({
    size = 'xs',
    className,
    children = 'Print',
    ...props
}: Props) {
    return (
        <Button
            type="button"
            variant="white"
            size={size}
            className={cn('print:hidden', className)}
            onClick={() => window.print()}
            {...props}
        >
            <Icon icon="solar:printer-bold-duotone" aria-hidden />
            {children}
        </Button>
    );
}
