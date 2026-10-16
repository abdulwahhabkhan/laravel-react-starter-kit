import { usePage } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <>
            <AppLogoIcon className="size-8 shrink-0" />
            <span className="truncate text-[15px] leading-tight font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
                {name}
            </span>
        </>
    );
}
