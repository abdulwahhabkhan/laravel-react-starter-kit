import { Icon } from '@iconify/react/offline';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

export type Tone = 'navy' | 'green' | 'red' | 'orange';

export type StatusFilterOption = {
    value: string;
    label: string;
    tone?: Tone;
    count?: number;
};

/** Selected item: soft tone background, tone text and a tone ring; "All" is solid navy. */
const activeClasses: Record<Tone | 'all', string> = {
    all: 'data-[state=on]:bg-sidebar-primary data-[state=on]:text-white data-[state=on]:ring-sidebar-primary dark:data-[state=on]:text-sidebar-primary-foreground',
    navy: 'data-[state=on]:bg-tone-navy-bg data-[state=on]:text-tone-navy data-[state=on]:ring-tone-navy/30',
    green: 'data-[state=on]:bg-tone-green-bg data-[state=on]:text-tone-green data-[state=on]:ring-tone-green/30',
    red: 'data-[state=on]:bg-tone-red-bg data-[state=on]:text-tone-red data-[state=on]:ring-tone-red/30',
    orange: 'data-[state=on]:bg-tone-orange-bg data-[state=on]:text-tone-orange data-[state=on]:ring-tone-orange/30',
};

const dotClasses: Record<Tone, string> = {
    navy: 'bg-tone-navy',
    green: 'bg-tone-green',
    red: 'bg-tone-red',
    orange: 'bg-tone-orange',
};

function ToneDot({ tone, active }: { tone: Tone; active?: boolean }) {
    return (
        <span
            aria-hidden
            className={cn(
                'size-1.5 shrink-0 rounded-full transition-transform',
                dotClasses[tone],
                active && 'scale-125 ring-2 ring-current/20',
            )}
        />
    );
}

function CountChip({ count, className }: { count: number; className: string }) {
    return (
        <span
            className={cn(
                'min-w-5 rounded-full px-1.5 text-center text-[11px] font-semibold tabular-nums',
                className,
            )}
        >
            {count}
        </span>
    );
}

/**
 * Compact status picker for smaller screens, so the header actions stay on one line.
 */
function StatusDropdown({
    value,
    onChange,
    items,
    className,
}: {
    value: string;
    onChange: (value: string) => void;
    items: StatusFilterOption[];
    className?: string;
}) {
    const selected = items.find((item) => item.value === value) ?? items[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    aria-label="Filter by status"
                    className={cn(
                        'h-[30px] gap-1.5 bg-card px-2.5 text-[13px]',
                        className,
                    )}
                >
                    {selected.tone && <ToneDot tone={selected.tone} active />}
                    <span className="font-semibold">{selected.label}</span>
                    {selected.count !== undefined && (
                        <CountChip
                            count={selected.count}
                            className="bg-muted text-muted-foreground"
                        />
                    )}
                    <Icon
                        icon="solar:alt-arrow-down-linear"
                        className="size-3.5 text-muted-foreground"
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-44">
                <DropdownMenuRadioGroup
                    value={value === '' ? '__all' : value}
                    onValueChange={(next) =>
                        onChange(next === '__all' ? '' : next)
                    }
                >
                    {items.map((item) => (
                        <DropdownMenuRadioItem
                            key={item.value || '__all'}
                            value={item.value || '__all'}
                            className="gap-2 text-[13px]"
                        >
                            {item.tone && <ToneDot tone={item.tone} />}
                            <span className="flex-1">{item.label}</span>
                            {item.count !== undefined && (
                                <CountChip
                                    count={item.count}
                                    className="bg-muted text-muted-foreground"
                                />
                            )}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/**
 * Segmented status switch for list headers: "All" plus one item per status,
 * each with a tone dot and an optional count. `''` means all statuses.
 * Below 1200px it collapses into a dropdown so it shares one line with the header buttons.
 */
export function StatusFilter({
    value,
    onChange,
    options,
    total,
    className,
}: {
    value: string;
    onChange: (value: string) => void;
    options: StatusFilterOption[];
    /** Count shown on "All". */
    total?: number;
    className?: string;
}) {
    const items: StatusFilterOption[] = [
        { value: '', label: 'All', count: total },
        ...options,
    ];

    return (
        <>
            <StatusDropdown
                value={value}
                onChange={onChange}
                items={items}
                className={cn('min-[1200px]:hidden', className)}
            />
            <div
                className={cn(
                    'max-w-full overflow-x-auto max-[1200px]:hidden',
                    className,
                )}
            >
                <ToggleGroup
                    type="single"
                    aria-label="Filter by status"
                    value={value === '' ? '__all' : value}
                    onValueChange={(next) =>
                        // Clicking the active item again keeps it selected.
                        next !== '' && onChange(next === '__all' ? '' : next)
                    }
                    className="w-max gap-0.5 rounded-lg border border-input bg-card p-0.5"
                >
                    {items.map((item) => {
                        const active = value === item.value;

                        return (
                            <ToggleGroupItem
                                key={item.value || '__all'}
                                value={item.value || '__all'}
                                className={cn(
                                    'h-7 min-w-0 gap-1.5 rounded-md px-2.5 text-[13px] font-medium text-text-2 transition-all duration-200 ease-out data-[state=off]:hover:bg-accent data-[state=off]:hover:text-foreground',
                                    'data-[state=on]:font-semibold data-[state=on]:shadow-xs data-[state=on]:ring-1 data-[state=on]:ring-inset data-[state=on]:hover:brightness-[0.98]',
                                    activeClasses[item.tone ?? 'all'],
                                )}
                            >
                                {item.tone && (
                                    <ToneDot tone={item.tone} active={active} />
                                )}
                                {item.label}
                                {item.count !== undefined && (
                                    <CountChip
                                        count={item.count}
                                        className={
                                            active
                                                ? item.tone
                                                    ? 'bg-white/70 text-current dark:bg-black/20'
                                                    : 'bg-white/20 text-white dark:text-sidebar-primary-foreground'
                                                : 'bg-muted text-muted-foreground'
                                        }
                                    />
                                )}
                            </ToggleGroupItem>
                        );
                    })}
                </ToggleGroup>
            </div>
        </>
    );
}
