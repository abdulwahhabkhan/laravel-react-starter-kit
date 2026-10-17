import {
    DataList,
    DataRow,
    DataSection,
    DataStatus,
} from '@/components/data-list';

export type SecuritySummary = {
    two_factor_enabled: boolean;
    passkeys_count: number;
};

/** Read-only summary of how the account is protected. */
export default function SecurityOverview({
    security,
}: {
    security: SecuritySummary;
}) {
    return (
        <DataSection
            icon="solar:shield-check-bold-duotone"
            title="Security Overview"
            hint="How your account is protected."
        >
            <DataList>
                <DataRow
                    icon="solar:smartphone-bold-duotone"
                    label="Two-factor"
                >
                    {security.two_factor_enabled ? (
                        <DataStatus tone="success">Enabled</DataStatus>
                    ) : (
                        <DataStatus tone="warning">Disabled</DataStatus>
                    )}
                </DataRow>
                <DataRow
                    icon="solar:key-minimalistic-bold-duotone"
                    label="Passkeys"
                >
                    {security.passkeys_count}
                </DataRow>
            </DataList>
        </DataSection>
    );
}
