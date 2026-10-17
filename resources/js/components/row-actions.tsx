import { Icon } from '@iconify/react/offline';
import { Link, router } from '@inertiajs/react';
import type { InertiaLinkProps } from '@inertiajs/react';
import { Fragment } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'danger';

type Href = NonNullable<InertiaLinkProps['href']>;

/** The one icon per action used on every page, so actions look the same everywhere. */
export const actionIcons = {
    view: 'solar:documents-bold-duotone',
    edit: 'solar:pen-2-bold-duotone',
    print: 'solar:printer-minimalistic-bold-duotone',
    delete: 'solar:trash-bin-trash-bold-duotone',
    more: 'solar:menu-dots-bold',
} as const;

const variantClasses: Record<Variant, string> = {
    default: 'text-text-2 hover:text-sidebar-primary',
    danger: 'text-tone-red hover:bg-tone-red-bg hover:text-tone-red',
};

/** Boxed square icon button used in action columns and page headers. */
const boxClass =
    'h-7 w-[30px] rounded-md border-border bg-card p-0 shadow-xs transition-colors hover:border-sidebar-primary/35 hover:bg-accent/60 [&_svg]:size-[17px]';

type ActionButtonProps = {
    icon: string;
    label: string;
    variant?: Variant;
    href?: Href;
    /** Open the link in a new tab instead of an Inertia visit. */
    external?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
};

/**
 * Icon-only action with a tooltip naming it.
 */
export function ActionButton({
    icon,
    label,
    variant = 'default',
    href,
    external,
    onClick,
    disabled,
    className: extraClassName,
}: ActionButtonProps) {
    const className = cn(boxClass, variantClasses[variant], extraClassName);
    const content = <Icon icon={icon} />;

    let trigger: ReactNode;

    if (href && external) {
        trigger = (
            <Button variant="outline" className={className} asChild>
                <a
                    href={typeof href === 'string' ? href : href.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                >
                    {content}
                </a>
            </Button>
        );
    } else if (href) {
        trigger = (
            <Button variant="outline" className={className} asChild>
                <Link href={href} prefetch aria-label={label}>
                    {content}
                </Link>
            </Button>
        );
    } else {
        trigger = (
            <Button
                type="button"
                variant="outline"
                className={className}
                onClick={onClick}
                disabled={disabled}
                aria-label={label}
            >
                {content}
            </Button>
        );
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>{trigger}</TooltipTrigger>
            <TooltipContent side="bottom">{label}</TooltipContent>
        </Tooltip>
    );
}

type PresetProps = Omit<ActionButtonProps, 'icon' | 'label'> & {
    label?: string;
};

/** Standard "view / preview" action. */
export function ViewAction({ label = 'View', ...props }: PresetProps) {
    return <ActionButton icon={actionIcons.view} label={label} {...props} />;
}

/** Standard "edit" action. */
export function EditAction({ label = 'Edit', ...props }: PresetProps) {
    return <ActionButton icon={actionIcons.edit} label={label} {...props} />;
}

/** Standard "print" action; prints the current page unless given a link or handler. */
export function PrintAction({ label = 'Print', ...props }: PresetProps) {
    return (
        <ActionButton
            icon={actionIcons.print}
            label={label}
            onClick={props.href ? undefined : () => window.print()}
            {...props}
            className={cn('print:hidden', props.className)}
        />
    );
}

/** Standard "delete" action. */
export function DeleteAction({ label = 'Delete', ...props }: PresetProps) {
    return (
        <ActionButton
            icon={actionIcons.delete}
            label={label}
            variant="danger"
            {...props}
        />
    );
}

export type RowMenuItem = {
    label: string;
    icon: string;
    variant?: Variant;
    /** Navigate with Inertia, or open in a new tab when `external`. */
    href?: Href;
    external?: boolean;
    onSelect?: () => void;
    hidden?: boolean;
};

/**
 * "⋯" button that opens the secondary row actions as a menu.
 */
export function RowMenu({
    items,
    label = 'More actions',
}: {
    items: RowMenuItem[];
    label?: string;
}) {
    const visible = items.filter((item) => !item.hidden);

    if (visible.length === 0) {
        return null;
    }

    const run = (item: RowMenuItem) => {
        if (item.onSelect) {
            item.onSelect();

            return;
        }

        if (!item.href) {
            return;
        }

        const url = typeof item.href === 'string' ? item.href : item.href.url;

        if (item.external) {
            window.open(url, '_blank', 'noopener');
        } else {
            router.visit(item.href);
        }
    };

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    aria-label={label}
                    className={cn(
                        boxClass,
                        'text-text-2 data-[state=open]:border-sidebar-primary/35 data-[state=open]:bg-accent/60 data-[state=open]:text-sidebar-primary',
                    )}
                >
                    <Icon icon={actionIcons.more} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="min-w-52 overflow-hidden rounded-xl p-0 shadow-lift"
            >
                <DropdownMenuGroup>
                    {visible.map((item, index) => (
                        <Fragment key={item.label}>
                            {index > 0 && (
                                <DropdownMenuSeparator className="my-0" />
                            )}
                            <DropdownMenuItem
                                onSelect={() => run(item)}
                                className={cn(
                                    'cursor-pointer gap-3 rounded-none px-4 py-2.5 text-sm font-medium [&_svg]:size-5',
                                    item.variant === 'danger' &&
                                        'text-tone-red focus:bg-tone-red-bg focus:text-tone-red',
                                )}
                            >
                                <Icon
                                    icon={item.icon}
                                    className={
                                        item.variant === 'danger'
                                            ? 'text-tone-red'
                                            : 'text-text-2'
                                    }
                                />
                                {item.label}
                            </DropdownMenuItem>
                        </Fragment>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function RowActions({ children }: { children: ReactNode }) {
    return (
        <div className="flex items-center justify-end gap-1.5">{children}</div>
    );
}

/**
 * Below `xl` the actions column sticks to the right edge of its scrolling table
 * (a `group/table` container with `data-overflow-end` from `useOverflowEnd`).
 * While columns are still hidden underneath, content fades out under it (`before`)
 * and its edge casts a shadow with a border (`after`).
 */
const pinnedClass =
    "max-xl:sticky max-xl:right-0 max-xl:bg-card before:pointer-events-none before:absolute before:inset-y-0 before:right-full before:hidden before:w-10 before:bg-linear-to-l before:from-card before:via-card/70 before:to-transparent before:content-[''] after:pointer-events-none after:absolute after:inset-y-0 after:right-full after:hidden after:w-2 after:border-r after:border-border after:bg-linear-to-l after:from-black/10 after:to-transparent after:content-[''] max-xl:group-data-[overflow-end]/table:before:block max-xl:group-data-[overflow-end]/table:after:block";

export const pinnedActionsHeadClass = cn(pinnedClass, 'z-20');

/** Body cells keep the row's hover tint over their solid background. */
export const pinnedActionsCellClass = cn(
    pinnedClass,
    'z-10 max-xl:[tr:hover>&]:bg-[color-mix(in_oklab,var(--accent)_50%,var(--card))]',
);
