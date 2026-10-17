import { Head, Link, usePage } from '@inertiajs/react';
import { DataList, DataRow, DataSection } from '@/components/data-list';
import type { SecuritySummary } from '@/components/security-overview';
import SecurityOverview from '@/components/security-overview';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, { dateStyle: 'medium' });

export default function Profile({
    mustVerifyEmail,
    status,
    role,
    security,
}: {
    mustVerifyEmail: boolean;
    status?: string;
    role: string | null;
    security: SecuritySummary;
}) {
    const { auth } = usePage<PageProps>().props;
    const { user } = auth;

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="grid items-start gap-4 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <DataSection
                        icon="solar:user-id-bold-duotone"
                        title="Account Details"
                        hint="Managed by your administrator."
                    >
                        <DataList>
                            <DataRow
                                icon="solar:user-rounded-bold-duotone"
                                label="Name"
                            >
                                {user.name}
                            </DataRow>
                            <DataRow
                                icon="solar:letter-bold-duotone"
                                label="Email"
                            >
                                {user.email}
                            </DataRow>
                            <DataRow
                                icon="solar:case-round-bold-duotone"
                                label="Role"
                            >
                                {role}
                            </DataRow>
                            <DataRow
                                icon="solar:verified-check-bold-duotone"
                                label="Email verified"
                            >
                                {user.email_verified_at ? (
                                    formatDate(user.email_verified_at)
                                ) : mustVerifyEmail ? (
                                    <Link
                                        href={send()}
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Re-send verification email
                                    </Link>
                                ) : null}
                            </DataRow>
                            <DataRow
                                icon="solar:calendar-date-bold-duotone"
                                label="Member since"
                            >
                                {formatDate(user.created_at)}
                            </DataRow>
                        </DataList>

                        {status === 'verification-link-sent' && (
                            <p className="pb-3 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </p>
                        )}
                    </DataSection>
                </div>

                <SecurityOverview security={security} />
            </div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};
