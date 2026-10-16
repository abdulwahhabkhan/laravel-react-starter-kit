export type UomOption = {
    value: string;
    label: string;
};

export type Product = {
    id: number;
    name: string;
    sku: string;
    upc: string | null;
    /** Decimal string with two places, e.g. "250.50". */
    cost: string;
    price: string;
    uom: string;
    uom_label: string;
    updated_at: string | null;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

/** Laravel's LengthAwarePaginator serialized to JSON. */
export type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    from: number | null;
    to: number | null;
    total: number;
    links: PaginationLink[];
    prev_page_url: string | null;
    next_page_url: string | null;
};
