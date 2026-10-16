import { Icon } from '@iconify/react';
import { useCallback, useEffect, useRef } from 'react';
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';

/**
 * Filters the sidebar menu. Focus with ⌘K / Ctrl+K; when the sidebar is
 * collapsed the search icon expands it and focuses the input.
 */
export function NavSearch({
    value,
    onChange,
    onSubmit,
}: {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const { state, setOpen, isMobile } = useSidebar();
    const isCollapsed = state === 'collapsed' && !isMobile;

    const focusSearch = useCallback(() => {
        if (isCollapsed) {
            setOpen(true);
            window.setTimeout(() => inputRef.current?.focus(), 200);

            return;
        }

        inputRef.current?.focus();
    }, [isCollapsed, setOpen]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                focusSearch();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [focusSearch]);

    return (
        <SidebarGroup className="px-3 py-2 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
            <SidebarMenu className="hidden group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-auto">
                <SidebarMenuItem>
                    <SidebarMenuButton
                        tooltip={{ children: 'Search menu (⌘K)' }}
                        onClick={focusSearch}
                        className="justify-center text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground [&>svg]:size-[18px]"
                    >
                        <Icon icon="solar:magnifer-bold-duotone" />
                        <span className="sr-only">Search menu</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>

            <label className="relative flex items-center group-data-[collapsible=icon]:hidden">
                <Icon
                    icon="solar:magnifer-bold-duotone"
                    className="pointer-events-none absolute left-2.5 size-4 text-sidebar-foreground"
                />
                <input
                    ref={inputRef}
                    type="search"
                    value={value}
                    placeholder="Search menu…"
                    aria-label="Search menu"
                    onChange={(event) => onChange(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            onSubmit();
                        }

                        if (event.key === 'Escape') {
                            onChange('');
                            event.currentTarget.blur();
                        }
                    }}
                    className="h-9 w-full rounded-lg border border-sidebar-border bg-white/70 pr-11 pl-8 text-[13px] text-sidebar-accent-foreground transition-colors outline-none placeholder:text-sidebar-foreground/80 hover:border-sidebar-foreground/30 focus:border-sidebar-primary/60 focus:bg-white focus:ring-2 focus:ring-sidebar-primary/20 dark:bg-white/[0.04] dark:focus:bg-white/[0.06] [&::-webkit-search-cancel-button]:hidden"
                />
                <kbd className="pointer-events-none absolute right-2 rounded border border-sidebar-border bg-sidebar-accent px-1.5 py-px font-sans text-[10px] font-medium text-sidebar-foreground">
                    ⌘K
                </kbd>
            </label>
        </SidebarGroup>
    );
}
