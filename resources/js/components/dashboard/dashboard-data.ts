/**
 * Static sample data for the dashboard until real reporting endpoints exist.
 */

export type StatTileData = {
    label: string;
    value: string;
    unit?: string;
    change: number;
    caption: string;
    icon: string;
    trend: number[];
};

export type MonthlyRevenue = {
    month: string;
    revenue: number;
};

export type CategorySales = {
    category: string;
    revenue: number;
};

export type OrderStatus = 'paid' | 'pending' | 'overdue';

export type RecentOrder = {
    number: string;
    customer: string;
    date: string;
    items: number;
    total: number;
    status: OrderStatus;
};

export type TopProduct = {
    name: string;
    sku: string;
    unitsSold: number;
    revenue: number;
};

export type LowStockItem = {
    name: string;
    sku: string;
    onHand: number;
    reorderLevel: number;
    uom: string;
};

export const statTiles: StatTileData[] = [
    {
        label: 'Revenue',
        value: '4.82M',
        unit: 'Rs',
        change: 12.4,
        caption: 'vs last month',
        icon: 'solar:wallet-money-bold-duotone',
        trend: [3.1, 3.4, 3.2, 3.8, 3.6, 4.1, 4.0, 4.3, 4.2, 4.6, 4.5, 4.82],
    },
    {
        label: 'Orders',
        value: '1,284',
        change: 8.1,
        caption: 'vs last month',
        icon: 'solar:cart-large-2-bold-duotone',
        trend: [
            920, 980, 1010, 990, 1060, 1100, 1080, 1150, 1170, 1210, 1188, 1284,
        ],
    },
    {
        label: 'Active products',
        value: '642',
        change: 2.3,
        caption: '14 added this month',
        icon: 'solar:box-bold-duotone',
        trend: [580, 590, 596, 601, 608, 612, 618, 621, 627, 630, 628, 642],
    },
    {
        label: 'Receivables',
        value: '1.37M',
        unit: 'Rs',
        change: -5.6,
        caption: '23 invoices outstanding',
        icon: 'solar:bill-list-bold-duotone',
        trend: [
            1.6, 1.55, 1.58, 1.52, 1.5, 1.49, 1.47, 1.46, 1.44, 1.45, 1.41,
            1.37,
        ],
    },
];

export const monthlyRevenue: MonthlyRevenue[] = [
    { month: 'Nov', revenue: 3_120_000 },
    { month: 'Dec', revenue: 3_410_000 },
    { month: 'Jan', revenue: 3_180_000 },
    { month: 'Feb', revenue: 3_760_000 },
    { month: 'Mar', revenue: 3_590_000 },
    { month: 'Apr', revenue: 4_080_000 },
    { month: 'May', revenue: 3_970_000 },
    { month: 'Jun', revenue: 4_310_000 },
    { month: 'Jul', revenue: 4_190_000 },
    { month: 'Aug', revenue: 4_620_000 },
    { month: 'Sep', revenue: 4_290_000 },
    { month: 'Oct', revenue: 4_820_000 },
];

export const categorySales: CategorySales[] = [
    { category: 'Cotton', revenue: 1_640_000 },
    { category: 'Linen', revenue: 1_120_000 },
    { category: 'Silk', revenue: 860_000 },
    { category: 'Denim', revenue: 610_000 },
    { category: 'Polyester', revenue: 380_000 },
    { category: 'Accessories', revenue: 210_000 },
];

export const recentOrders: RecentOrder[] = [
    {
        number: 'SO-2610-0148',
        customer: 'Ahmad Textiles',
        date: '16 Oct',
        items: 12,
        total: 248_500,
        status: 'paid',
    },
    {
        number: 'SO-2610-0147',
        customer: 'Noor Garments',
        date: '16 Oct',
        items: 4,
        total: 86_200,
        status: 'pending',
    },
    {
        number: 'SO-2610-0146',
        customer: 'Karachi Fabric House',
        date: '15 Oct',
        items: 21,
        total: 412_900,
        status: 'paid',
    },
    {
        number: 'SO-2610-0145',
        customer: 'Zaib Boutique',
        date: '14 Oct',
        items: 3,
        total: 41_750,
        status: 'overdue',
    },
    {
        number: 'SO-2610-0144',
        customer: 'Lahore Weaves',
        date: '14 Oct',
        items: 9,
        total: 173_300,
        status: 'pending',
    },
    {
        number: 'SO-2610-0143',
        customer: 'Sana Collections',
        date: '13 Oct',
        items: 6,
        total: 95_400,
        status: 'paid',
    },
];

export const topProducts: TopProduct[] = [
    {
        name: 'Premium Lawn 60s',
        sku: 'CTN-LWN-060',
        unitsSold: 2_840,
        revenue: 852_000,
    },
    {
        name: 'Irish Linen White',
        sku: 'LIN-IRS-WHT',
        unitsSold: 1_260,
        revenue: 617_400,
    },
    {
        name: 'Raw Silk Ivory',
        sku: 'SLK-RAW-IVY',
        unitsSold: 540,
        revenue: 486_000,
    },
    {
        name: 'Stretch Denim 12oz',
        sku: 'DNM-STR-012',
        unitsSold: 1_120,
        revenue: 392_000,
    },
    {
        name: 'Cotton Poplin Navy',
        sku: 'CTN-POP-NVY',
        unitsSold: 1_480,
        revenue: 296_000,
    },
];

export const lowStockItems: LowStockItem[] = [
    {
        name: 'Chiffon Dusty Rose',
        sku: 'CHF-DST-RSE',
        onHand: 42,
        reorderLevel: 200,
        uom: 'm',
    },
    {
        name: 'Raw Silk Ivory',
        sku: 'SLK-RAW-IVY',
        onHand: 85,
        reorderLevel: 150,
        uom: 'm',
    },
    {
        name: 'Brass Buttons 18mm',
        sku: 'ACC-BTN-B18',
        onHand: 320,
        reorderLevel: 500,
        uom: 'pcs',
    },
    {
        name: 'Velvet Emerald',
        sku: 'VLV-EMR-001',
        onHand: 64,
        reorderLevel: 100,
        uom: 'm',
    },
];
