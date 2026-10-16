import { Icon } from '@iconify/react/offline';
import type { InertiaLinkProps } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
    /** Where to go back to. Without it, the button returns to the previous page in history (keeping its filters). */
    href?: InertiaLinkProps['href'];
    label?: string;
    size?: 'xs' | 'sm' | 'default' | 'lg';
    className?: string;
};

/**
 * Standard "Back" button for page headers. The label collapses to the icon on small screens and is hidden on paper.
 */
export function BackButton({
    href,
    label = 'Back',
    size = 'xs',
    className,
}: Props) {
    const content = (
        <>
            <Icon icon="solar:alt-arrow-left-line-duotone" aria-hidden />
            <span className="hidden md:inline">{label}</span>
        </>
    );

    const classes = cn('print:hidden', className);

    if (href === undefined) {
        return (
            <Button
                type="button"
                variant="white"
                size={size}
                className={classes}
                aria-label={label}
                onClick={() => window.history.back()}
            >
                {content}
            </Button>
        );
    }

    return (
        <Button
            asChild
            variant="white"
            size={size}
            className={classes}
            aria-label={label}
        >
            <Link href={href}>{content}</Link>
        </Button>
    );
}
