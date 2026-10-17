import { Icon } from '@iconify/react/offline';
import { Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { PageHeader } from '@/components/page';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { Auth, NavItem } from '@/types';

type SettingsTab = NavItem & {
    icon: string;
    /** Opening the tab asks for the user's password first. */
    locked?: boolean;
};

const settingsTabs: SettingsTab[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: 'solar:user-id-bold-duotone',
    },
    {
        title: 'Security',
        href: editSecurity(),
        icon: 'solar:shield-keyhole-bold-duotone',
        locked: true,
    },
    {
        title: 'Appearance',
        href: editAppearance(),
        icon: 'solar:pallete-2-bold-duotone',
    },
];

/**
 * Identity hero with the settings tabs across the top, above the active page.
 */
export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const { user } = usePage<{ auth: Auth }>().props.auth;
    const getInitials = useInitials();
    const role = typeof user.role === 'string' ? user.role : null;

    return (
        <div>
            <PageHeader
                title="Settings"
                icon="solar:settings-bold-duotone"
                description="Manage your profile and account settings"
            />

            <div className="animate-fade-up [animation-delay:250ms]">
                <div className="mb-5 overflow-hidden rounded-xl border border-card-border bg-card text-card-foreground shadow-card">
                    <div className="flex items-center gap-4 bg-linear-to-b from-sidebar-primary/6 to-transparent to-85% px-5 pt-5 pb-4">
                        <Avatar className="size-14 shrink-0 shadow-[0_0_0_4px_var(--color-card),0_0_0_5px_var(--color-border)]">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="relative bg-linear-135 from-[#04203f] via-[#07305d] to-[#0d4a8a] text-white">
                                <span className="absolute inset-0 fabric-weave" />
                                <span className="absolute inset-[3px] rounded-full border border-dashed border-sidebar-highlight/70" />
                                <span className="relative text-lg font-bold tracking-[0.04em]">
                                    {getInitials(user.name)}
                                </span>
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <h2 className="truncate text-lg font-semibold tracking-[-0.01em]">
                                {user.name}
                            </h2>
                            <p className="truncate text-[13px] text-muted-foreground">
                                {user.email}
                                {role && (
                                    <span className="capitalize">
                                        {' '}
                                        · {role}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    <nav
                        className="flex [scrollbar-width:none] gap-1 overflow-x-auto border-t border-border px-4 [&::-webkit-scrollbar]:hidden"
                        aria-label="Settings"
                    >
                        {settingsTabs.map((tab) => {
                            const isActive = isCurrentOrParentUrl(tab.href);

                            return (
                                <Link
                                    key={toUrl(tab.href)}
                                    href={tab.href}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={cn(
                                        'relative inline-flex items-center gap-2 px-3 py-3 text-[13px] font-semibold whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground',
                                        "after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:scale-x-0 after:rounded-t-sm after:bg-sidebar-primary after:transition-transform after:content-['']",
                                        isActive &&
                                            'text-sidebar-primary after:scale-x-100 hover:text-sidebar-primary dark:text-foreground',
                                    )}
                                >
                                    <Icon
                                        icon={tab.icon}
                                        className="size-4.5"
                                    />
                                    {tab.title}
                                    {tab.locked && !isActive && (
                                        <Icon
                                            icon="solar:lock-bold-duotone"
                                            className="size-3.5"
                                            aria-label="Requires your password"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="animate-fade-up [animation-delay:350ms]">
                    {children}
                </div>
            </div>
        </div>
    );
}
