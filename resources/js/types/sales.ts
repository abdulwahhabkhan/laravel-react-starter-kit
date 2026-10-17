export type Customer = {
    id: number;
    name: string;
    phone: string | null;
    email: string | null;
    address_line_1: string | null;
    city: string | null;
    region: string | null;
    updated_at: string | null;
};

export type FilterOption = {
    value: string;
    label: string;
};
