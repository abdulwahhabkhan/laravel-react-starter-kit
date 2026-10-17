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

export type OrderStatus = 'draft' | 'confirmed' | 'fulfilled' | 'cancelled';

export type CustomerOption = {
    id: number;
    name: string;
    city: string | null;
};

export type ProductOption = {
    id: number;
    name: string;
    sku: string;
    /** Decimal string with two places, e.g. "250.50". */
    price: string;
    uom: string;
};

/** Order row on the orders list. Amounts are decimal strings. */
export type OrderListItem = {
    id: number;
    order_number: string;
    status: OrderStatus;
    status_label: string;
    order_date: string;
    delivery_date: string | null;
    customer: CustomerOption;
    total: string;
};

export type OrderLine = {
    id: number;
    product_id: number;
    sku: string;
    description: string;
    quantity: string;
    uom: string;
    uom_label: string;
    unit_price: string;
    discount: string;
    tax_rate: string;
    line_total: string;
};

export type Order = {
    id: number;
    order_number: string;
    status: OrderStatus;
    status_label: string;
    allows_line_changes: boolean;
    order_date: string;
    delivery_date: string | null;
    notes: string | null;
    subtotal: string;
    discount_total: string;
    tax_total: string;
    total: string;
    created_by: string | null;
    updated_at: string | null;
    customer: Omit<Customer, 'updated_at'>;
    items: OrderLine[];
};
