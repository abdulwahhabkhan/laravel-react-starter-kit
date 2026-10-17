import { Icon } from '@iconify/react/offline';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

const options: {
    value: Appearance;
    icon: string;
    label: string;
    hint: string;
}[] = [
    {
        value: 'light',
        icon: 'solar:sun-2-bold-duotone',
        label: 'Light',
        hint: 'Bright surfaces for daytime work.',
    },
    {
        value: 'dark',
        icon: 'solar:moon-bold-duotone',
        label: 'Dark',
        hint: 'Easier on the eyes in low light.',
    },
    {
        value: 'system',
        icon: 'solar:monitor-bold-duotone',
        label: 'System',
        hint: 'Follow your device setting.',
    },
];

/** Theme picker shown as selectable tiles. */
export default function AppearanceTabs() {
    const { appearance, updateAppearance } = useAppearance();

    return (
        <div
            role="radiogroup"
            aria-label="Theme"
            className="grid gap-3 sm:grid-cols-3"
        >
            {options.map(({ value, icon, label, hint }) => {
                const isSelected = appearance === value;

                return (
                    <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => updateAppearance(value)}
                        className={cn(
                            'relative flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors',
                            isSelected
                                ? 'border-sidebar-primary bg-sidebar-primary/5 ring-1 ring-sidebar-primary dark:border-foreground/60 dark:ring-foreground/60'
                                : 'border-border hover:border-sidebar-primary/35 hover:bg-accent/60',
                        )}
                    >
                        <Icon
                            icon={icon}
                            className={cn(
                                'size-7',
                                isSelected
                                    ? 'text-sidebar-primary dark:text-foreground'
                                    : 'text-muted-foreground',
                            )}
                        />
                        <span className="text-sm font-semibold">{label}</span>
                        <span className="text-xs text-muted-foreground">
                            {hint}
                        </span>
                        {isSelected && (
                            <Icon
                                icon="solar:check-circle-bold-duotone"
                                className="absolute top-3 right-3 size-5 text-sidebar-primary dark:text-foreground"
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
