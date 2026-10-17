import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import { DataSection } from '@/components/data-list';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    return (
        <>
            <Head title="Appearance settings" />

            <h1 className="sr-only">Appearance settings</h1>

            <div className="xl:w-2/3">
                <DataSection
                    icon="solar:pallete-2-bold-duotone"
                    title="Theme"
                    hint="Saved in this browser."
                    className="p-5"
                >
                    <AppearanceTabs />
                </DataSection>
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Appearance settings',
            href: editAppearance(),
        },
    ],
};
