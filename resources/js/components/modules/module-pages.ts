/**
 * Sidebar modules and the static sample data shown on each module page
 * until the real endpoints exist. Module and page slugs must match
 * `ModulePageController::PAGES`.
 */
import { show } from '@/routes/modules';
import type { NavParentItem } from '@/types';

export type ModuleColumn = {
    label: string;
    /** How cells render: `primary` is the bold row identifier. */
    kind?: 'primary' | 'mono' | 'amount' | 'status';
    align?: 'right';
};

export type ModuleStat = {
    label: string;
    value: string;
    caption: string;
    icon: string;
};

export type ModulePage = {
    slug: string;
    title: string;
    description: string;
    action: string;
    stats: ModuleStat[];
    columns: ModuleColumn[];
    rows: string[][];
};

export type Module = {
    slug: string;
    title: string;
    icon: string;
    pages: ModulePage[];
};

export const modules: Module[] = [
    {
        slug: 'sales',
        title: 'Sales',
        icon: 'solar:cart-large-2-bold-duotone',
        pages: [
            {
                slug: 'customers',
                title: 'Customers',
                description: '1,284 accounts',
                action: 'New customer',
                stats: [
                    {
                        label: 'Active customers',
                        value: '1,126',
                        caption: '+38 this month',
                        icon: 'solar:users-group-rounded-bold-duotone',
                    },
                    {
                        label: 'Receivables',
                        value: 'Rs 2.14M',
                        caption: 'Across 214 accounts',
                        icon: 'solar:wallet-money-bold-duotone',
                    },
                    {
                        label: 'Avg. order value',
                        value: 'Rs 18.6K',
                        caption: 'Last 90 days',
                        icon: 'solar:tag-price-bold-duotone',
                    },
                ],
                columns: [
                    { label: 'Customer', kind: 'primary' },
                    { label: 'City' },
                    { label: 'Phone', kind: 'mono' },
                    { label: 'Balance', kind: 'amount', align: 'right' },
                    { label: 'Status', kind: 'status' },
                ],
                rows: [
                    [
                        'Al-Noor Traders',
                        'Lahore',
                        '0300-4512876',
                        '248,500',
                        'Active',
                    ],
                    [
                        'Hamza Electronics',
                        'Karachi',
                        '0321-8890123',
                        '96,200',
                        'Active',
                    ],
                    [
                        'Sadia Fabrics',
                        'Faisalabad',
                        '0333-2201457',
                        '412,750',
                        'Overdue',
                    ],
                    [
                        'Green Valley Mart',
                        'Islamabad',
                        '0345-7781290',
                        '0',
                        'Active',
                    ],
                    [
                        'Rehman & Sons',
                        'Multan',
                        '0301-6654321',
                        '58,900',
                        'Inactive',
                    ],
                ],
            },
            {
                slug: 'orders',
                title: 'Orders',
                description: '86 open orders',
                action: 'New order',
                stats: [
                    {
                        label: 'Orders this month',
                        value: '412',
                        caption: '+12.4% vs last month',
                        icon: 'solar:bag-4-bold-duotone',
                    },
                    {
                        label: 'Awaiting dispatch',
                        value: '37',
                        caption: '9 due today',
                        icon: 'solar:delivery-bold-duotone',
                    },
                    {
                        label: 'Order value',
                        value: 'Rs 4.82M',
                        caption: 'Confirmed this month',
                        icon: 'solar:chart-2-bold-duotone',
                    },
                ],
                columns: [
                    { label: 'Order', kind: 'primary' },
                    { label: 'Customer' },
                    { label: 'Date' },
                    { label: 'Total', kind: 'amount', align: 'right' },
                    { label: 'Status', kind: 'status' },
                ],
                rows: [
                    [
                        'SO-10482',
                        'Al-Noor Traders',
                        '16 Oct 2026',
                        '86,400',
                        'Paid',
                    ],
                    [
                        'SO-10481',
                        'Hamza Electronics',
                        '16 Oct 2026',
                        '142,000',
                        'Pending',
                    ],
                    [
                        'SO-10480',
                        'Sadia Fabrics',
                        '15 Oct 2026',
                        '58,250',
                        'Overdue',
                    ],
                    [
                        'SO-10479',
                        'Green Valley Mart',
                        '15 Oct 2026',
                        '23,900',
                        'Paid',
                    ],
                    [
                        'SO-10478',
                        'Rehman & Sons',
                        '14 Oct 2026',
                        '310,600',
                        'Draft',
                    ],
                ],
            },
            {
                slug: 'quotations',
                title: 'Quotations',
                description: '24 awaiting reply',
                action: 'New quotation',
                stats: [
                    {
                        label: 'Sent this month',
                        value: '68',
                        caption: '41 converted',
                        icon: 'solar:document-text-bold-duotone',
                    },
                    {
                        label: 'Conversion rate',
                        value: '60.3%',
                        caption: '+4.1 pts vs last month',
                        icon: 'solar:graph-up-bold-duotone',
                    },
                    {
                        label: 'Pipeline value',
                        value: 'Rs 1.36M',
                        caption: 'Open quotations',
                        icon: 'solar:hourglass-bold-duotone',
                    },
                ],
                columns: [
                    { label: 'Quotation', kind: 'primary' },
                    { label: 'Customer' },
                    { label: 'Valid until' },
                    { label: 'Amount', kind: 'amount', align: 'right' },
                    { label: 'Status', kind: 'status' },
                ],
                rows: [
                    [
                        'QT-2291',
                        'Green Valley Mart',
                        '30 Oct 2026',
                        '184,000',
                        'Sent',
                    ],
                    [
                        'QT-2290',
                        'Hamza Electronics',
                        '28 Oct 2026',
                        '76,500',
                        'Accepted',
                    ],
                    [
                        'QT-2289',
                        'Sadia Fabrics',
                        '22 Oct 2026',
                        '220,300',
                        'Pending',
                    ],
                    [
                        'QT-2288',
                        'Rehman & Sons',
                        '12 Oct 2026',
                        '42,800',
                        'Expired',
                    ],
                ],
            },
            {
                slug: 'invoices',
                title: 'Invoices',
                description: 'Rs 2.14M outstanding',
                action: 'New invoice',
                stats: [
                    {
                        label: 'Invoiced this month',
                        value: 'Rs 4.21M',
                        caption: '388 invoices',
                        icon: 'solar:bill-list-bold-duotone',
                    },
                    {
                        label: 'Collected',
                        value: 'Rs 3.07M',
                        caption: '72.9% of invoiced',
                        icon: 'solar:card-recive-bold-duotone',
                    },
                    {
                        label: 'Overdue',
                        value: 'Rs 612K',
                        caption: '23 invoices',
                        icon: 'solar:danger-triangle-bold-duotone',
                    },
                ],
                columns: [
                    { label: 'Invoice', kind: 'primary' },
                    { label: 'Customer' },
                    { label: 'Due date' },
                    { label: 'Amount', kind: 'amount', align: 'right' },
                    { label: 'Status', kind: 'status' },
                ],
                rows: [
                    [
                        'INV-8820',
                        'Al-Noor Traders',
                        '31 Oct 2026',
                        '86,400',
                        'Paid',
                    ],
                    [
                        'INV-8819',
                        'Hamza Electronics',
                        '30 Oct 2026',
                        '142,000',
                        'Pending',
                    ],
                    [
                        'INV-8818',
                        'Sadia Fabrics',
                        '05 Oct 2026',
                        '58,250',
                        'Overdue',
                    ],
                    [
                        'INV-8817',
                        'Green Valley Mart',
                        '29 Oct 2026',
                        '23,900',
                        'Paid',
                    ],
                ],
            },
            {
                slug: 'returns',
                title: 'Returns',
                description: '7 to inspect',
                action: 'New return',
                stats: [
                    {
                        label: 'Returns this month',
                        value: '19',
                        caption: '1.6% of orders',
                        icon: 'solar:undo-left-round-bold-duotone',
                    },
                    {
                        label: 'Refunded',
                        value: 'Rs 94.2K',
                        caption: '12 credit notes',
                        icon: 'solar:card-send-bold-duotone',
                    },
                    {
                        label: 'Restocked',
                        value: '146',
                        caption: 'Units back in stock',
                        icon: 'solar:box-bold-duotone',
                    },
                ],
                columns: [
                    { label: 'Return', kind: 'primary' },
                    { label: 'Order', kind: 'mono' },
                    { label: 'Reason' },
                    { label: 'Credit', kind: 'amount', align: 'right' },
                    { label: 'Status', kind: 'status' },
                ],
                rows: [
                    [
                        'RT-0412',
                        'SO-10466',
                        'Damaged in transit',
                        '12,400',
                        'Pending',
                    ],
                    ['RT-0411', 'SO-10451', 'Wrong size', '4,800', 'Completed'],
                    [
                        'RT-0410',
                        'SO-10439',
                        'Not as described',
                        '18,950',
                        'Rejected',
                    ],
                    [
                        'RT-0409',
                        'SO-10420',
                        'Customer cancelled',
                        '7,200',
                        'Completed',
                    ],
                ],
            },
        ],
    },
    {
        slug: 'catalog',
        title: 'Catalog',
        icon: 'solar:box-minimalistic-bold-duotone',
        pages: [
            {
                slug: 'products',
                title: 'Products',
                description: '642 SKUs',
                action: 'New product',
                stats: [
                    {
                        label: 'Active products',
                        value: '598',
                        caption: '44 archived',
                        icon: 'solar:box-bold-duotone',
                    },
                    {
                        label: 'Low stock',
                        value: '18',
                        caption: 'Below reorder level',
                        icon: 'solar:danger-triangle-bold-duotone',
                    },
                    {
                        label: 'Avg. margin',
                        value: '27.8%',
                        caption: 'Across active SKUs',
                        icon: 'solar:pie-chart-2-bold-duotone',
                    },
                ],
                columns: [
                    { label: 'Product', kind: 'primary' },
                    { label: 'SKU', kind: 'mono' },
                    { label: 'Category' },
                    { label: 'Price', kind: 'amount', align: 'right' },
                    { label: 'Status', kind: 'status' },
                ],
                rows: [
                    [
                        'Basmati Rice 5kg',
                        'GRC-RICE-005',
                        'Grocery',
                        '2,450',
                        'Active',
                    ],
                    [
                        'Cooking Oil 3L',
                        'GRC-OIL-003',
                        'Grocery',
                        '1,890',
                        'Low stock',
                    ],
                    [
                        'LED Bulb 12W',
                        'ELC-LED-012',
                        'Electronics',
                        '450',
                        'Active',
                    ],
                    [
                        'Lawn Suit 3pc',
                        'FAB-LAWN-301',
                        'Fabrics',
                        '6,800',
                        'Active',
                    ],
                    [
                        'Ceiling Fan 56"',
                        'ELC-FAN-056',
                        'Electronics',
                        '12,900',
                        'Archived',
                    ],
                ],
            },
            {
                slug: 'categories',
                title: 'Categories',
                description: '14 categories',
                action: 'New category',
                stats: [
                    {
                        label: 'Categories',
                        value: '14',
                        caption: '3 with sub-categories',
                        icon: 'solar:folder-with-files-bold-duotone',
                    },
                    {
                        label: 'Top category',
                        value: 'Grocery',
                        caption: '38% of revenue',
                        icon: 'solar:crown-bold-duotone',
                    },
                    {
                        label: 'Uncategorised',
                        value: '9',
                        caption: 'Products to tidy up',
                        icon: 'solar:question-circle-bold-duotone',
                    },
                ],
                columns: [
                    { label: 'Category', kind: 'primary' },
                    { label: 'Code', kind: 'mono' },
                    { label: 'Products', align: 'right' },
                    { label: 'Revenue', kind: 'amount', align: 'right' },
                    { label: 'Status', kind: 'status' },
                ],
                rows: [
                    ['Grocery', 'GRC', '214', '1,832,000', 'Active'],
                    ['Electronics', 'ELC', '126', '1,204,500', 'Active'],
                    ['Fabrics', 'FAB', '98', '986,300', 'Active'],
                    ['Home & Kitchen', 'HMK', '142', '612,800', 'Active'],
                    ['Stationery', 'STN', '62', '184,200', 'Inactive'],
                ],
            },
            {
                slug: 'brands',
                title: 'Brands',
                description: '48 brands',
                action: 'New brand',
                stats: [
                    {
                        label: 'Brands',
                        value: '48',
                        caption: '6 added this quarter',
                        icon: 'solar:star-bold-duotone',
                    },
                    {
                        label: 'Own label',
                        value: '5',
                        caption: '11% of revenue',
                        icon: 'solar:tag-bold-duotone',
                    },
                    {
                        label: 'Top brand share',
                        value: '14.2%',
                        caption: 'Of monthly revenue',
                        icon: 'solar:chart-bold-duotone',
                    },
                ],
                columns: [
                    { label: 'Brand', kind: 'primary' },
                    { label: 'Supplier' },
                    { label: 'Products', align: 'right' },
                    { label: 'Revenue', kind: 'amount', align: 'right' },
                    { label: 'Status', kind: 'status' },
                ],
                rows: [
                    ['Guard', 'Guard Agricultural', '18', '684,000', 'Active'],
                    ['Dawlance', 'Dawlance Pvt Ltd', '24', '592,400', 'Active'],
                    ['Khaadi', 'Khaadi Wholesale', '41', '488,900', 'Active'],
                    [
                        'Philips',
                        'Signify Pakistan',
                        '33',
                        '206,700',
                        'Inactive',
                    ],
                ],
            },
            {
                slug: 'price-lists',
                title: 'Price Lists',
                description: '4 active lists',
                action: 'New price list',
                stats: [
                    {
                        label: 'Active lists',
                        value: '4',
                        caption: '1 scheduled',
                        icon: 'solar:tag-price-bold-duotone',
                    },
                    {
                        label: 'Customers on lists',
                        value: '312',
                        caption: '24% of customers',
                        icon: 'solar:users-group-rounded-bold-duotone',
                    },
                    {
                        label: 'Avg. discount',
                        value: '6.5%',
                        caption: 'Off retail price',
                        icon: 'solar:sale-bold-duotone',
                    },
                ],
                columns: [
                    { label: 'Price list', kind: 'primary' },
                    { label: 'Applies to' },
                    { label: 'Discount', align: 'right' },
                    { label: 'Valid from' },
                    { label: 'Status', kind: 'status' },
                ],
                rows: [
                    ['Retail', 'All customers', '0%', '01 Jan 2026', 'Active'],
                    [
                        'Wholesale',
                        'Wholesale group',
                        '8%',
                        '01 Jan 2026',
                        'Active',
                    ],
                    [
                        'Distributor',
                        'Distributors',
                        '12%',
                        '01 Mar 2026',
                        'Active',
                    ],
                    [
                        'Winter Promo',
                        'All customers',
                        '5%',
                        '01 Nov 2026',
                        'Scheduled',
                    ],
                ],
            },
        ],
    },
    {
        slug: 'inventory',
        title: 'Inventory',
        icon: 'solar:box-bold-duotone',
        pages: [
            {
                slug: 'stock-levels',
                title: 'Stock Levels',
                description: 'Rs 8.6M on hand',
                action: 'Count stock',
                stats: [
                    {
                        label: 'Units on hand',
                        value: '24,812',
                        caption: 'Across 3 warehouses',
                        icon: 'solar:box-bold-duotone',
                    },
                    {
                        label: 'Below reorder',
                        value: '18',
                        caption: '6 critical',
                        icon: 'solar:danger-triangle-bold-duotone',
                    },
                    {
                        label: 'Stock value',
                        value: 'Rs 8.6M',
                        caption: 'At average cost',
                        icon: 'solar:wallet-money-bold-duotone',
                    },
                ],
                columns: [
                    { label: 'Product', kind: 'primary' },
                    { label: 'SKU', kind: 'mono' },
                    { label: 'On hand', align: 'right' },
                    { label: 'Reorder at', align: 'right' },
                    { label: 'Status', kind: 'status' },
                ],
                rows: [
                    ['Cooking Oil 3L', 'GRC-OIL-003', '14', '60', 'Critical'],
                    ['LED Bulb 12W', 'ELC-LED-012', '82', '120', 'Low stock'],
                    [
                        'Basmati Rice 5kg',
                        'GRC-RICE-005',
                        '640',
                        '200',
                        'In stock',
                    ],
                    ['Lawn Suit 3pc', 'FAB-LAWN-301', '118', '40', 'In stock'],
                ],
            },
            {
                slug: 'warehouses',
                title: 'Warehouses',
                description: '3 locations',
                action: 'New warehouse',
                stats: [
                    {
                        label: 'Locations',
                        value: '3',
                        caption: 'Lahore, Karachi, Multan',
                        icon: 'solar:buildings-2-bold-duotone',
                    },
                    {
                        label: 'Capacity used',
                        value: '71%',
                        caption: 'Across all locations',
                        icon: 'solar:pie-chart-2-bold-duotone',
                    },
                    {
                        label: 'Pick accuracy',
                        value: '99.2%',
                        caption: 'Last 30 days',
                        icon: 'solar:check-circle-bold-duotone',
                    },
                ],
                columns: [
                    { label: 'Warehouse', kind: 'primary' },
                    { label: 'Code', kind: 'mono' },
                    { label: 'Manager' },
                    { label: 'Stock value', kind: 'amount', align: 'right' },
                    { label: 'Status', kind: 'status' },
                ],
                rows: [
                    [
                        'Lahore Main',
                        'WH-LHR',
                        'Imran Qureshi',
                        '4,820,000',
                        'Active',
                    ],
                    [
                        'Karachi Port',
                        'WH-KHI',
                        'Ayesha Siddiqui',
                        '2,960,000',
                        'Active',
                    ],
                    [
                        'Multan Depot',
                        'WH-MUX',
                        'Bilal Ahmed',
                        '820,000',
                        'Inactive',
                    ],
                ],
            },
            {
                slug: 'transfers',
                title: 'Transfers',
                description: '5 in transit',
                action: 'New transfer',
                stats: [
                    {
                        label: 'Transfers this month',
                        value: '28',
                        caption: '23 received',
                        icon: 'solar:transfer-horizontal-bold-duotone',
                    },
                    {
                        label: 'In transit',
                        value: '5',
                        caption: '1,240 units',
                        icon: 'solar:delivery-bold-duotone',
                    },
                    {
                        label: 'Avg. lead time',
                        value: '2.4 days',
                        caption: 'Lahore ↔ Karachi',
                        icon: 'solar:clock-circle-bold-duotone',
                    },
                ],
                columns: [
                    { label: 'Transfer', kind: 'primary' },
                    { label: 'From' },
                    { label: 'To' },
                    { label: 'Units', align: 'right' },
                    { label: 'Status', kind: 'status' },
                ],
                rows: [
                    [
                        'TR-0318',
                        'Lahore Main',
                        'Karachi Port',
                        '420',
                        'In transit',
                    ],
                    [
                        'TR-0317',
                        'Karachi Port',
                        'Multan Depot',
                        '160',
                        'Received',
                    ],
                    [
                        'TR-0316',
                        'Lahore Main',
                        'Multan Depot',
                        '275',
                        'Received',
                    ],
                    ['TR-0315', 'Multan Depot', 'Lahore Main', '90', 'Draft'],
                ],
            },
            {
                slug: 'adjustments',
                title: 'Adjustments',
                description: '3 awaiting approval',
                action: 'New adjustment',
                stats: [
                    {
                        label: 'Adjustments this month',
                        value: '14',
                        caption: '11 approved',
                        icon: 'solar:tuning-2-bold-duotone',
                    },
                    {
                        label: 'Net change',
                        value: '−86',
                        caption: 'Units written off',
                        icon: 'solar:graph-down-bold-duotone',
                    },
                    {
                        label: 'Write-off value',
                        value: 'Rs 41.3K',
                        caption: 'At average cost',
                        icon: 'solar:wallet-money-bold-duotone',
                    },
                ],
                columns: [
                    { label: 'Adjustment', kind: 'primary' },
                    { label: 'Warehouse' },
                    { label: 'Reason' },
                    { label: 'Units', align: 'right' },
                    { label: 'Status', kind: 'status' },
                ],
                rows: [
                    ['ADJ-0144', 'Lahore Main', 'Damaged', '−24', 'Pending'],
                    [
                        'ADJ-0143',
                        'Karachi Port',
                        'Stock count',
                        '+12',
                        'Approved',
                    ],
                    ['ADJ-0142', 'Lahore Main', 'Expired', '−48', 'Approved'],
                    ['ADJ-0141', 'Multan Depot', 'Theft', '−6', 'Pending'],
                ],
            },
        ],
    },
    {
        slug: 'purchasing',
        title: 'Purchasing',
        icon: 'solar:bag-4-bold-duotone',
        pages: [
            {
                slug: 'suppliers',
                title: 'Suppliers',
                description: '62 suppliers',
                action: 'New supplier',
                stats: [
                    {
                        label: 'Active suppliers',
                        value: '54',
                        caption: '8 inactive',
                        icon: 'solar:shop-2-bold-duotone',
                    },
                    {
                        label: 'Payables',
                        value: 'Rs 1.48M',
                        caption: 'Due within 30 days',
                        icon: 'solar:card-send-bold-duotone',
                    },
                    {
                        label: 'On-time delivery',
                        value: '93%',
                        caption: 'Last 90 days',
                        icon: 'solar:delivery-bold-duotone',
                    },
                ],
                columns: [
                    { label: 'Supplier', kind: 'primary' },
                    { label: 'City' },
                    { label: 'Contact' },
                    { label: 'Payable', kind: 'amount', align: 'right' },
                    { label: 'Status', kind: 'status' },
                ],
                rows: [
                    [
                        'Guard Agricultural',
                        'Lahore',
                        'Usman Tariq',
                        '412,000',
                        'Active',
                    ],
                    [
                        'Dawlance Pvt Ltd',
                        'Karachi',
                        'Sana Mirza',
                        '386,500',
                        'Active',
                    ],
                    [
                        'Khaadi Wholesale',
                        'Karachi',
                        'Faraz Ali',
                        '214,900',
                        'Active',
                    ],
                    [
                        'Signify Pakistan',
                        'Lahore',
                        'Nadia Khan',
                        '0',
                        'Inactive',
                    ],
                ],
            },
            {
                slug: 'purchase-orders',
                title: 'Purchase Orders',
                description: '11 open',
                action: 'New purchase order',
                stats: [
                    {
                        label: 'POs this month',
                        value: '46',
                        caption: 'Rs 3.9M ordered',
                        icon: 'solar:clipboard-list-bold-duotone',
                    },
                    {
                        label: 'Awaiting delivery',
                        value: '11',
                        caption: '3 overdue',
                        icon: 'solar:delivery-bold-duotone',
                    },
                    {
                        label: 'Avg. lead time',
                        value: '5.2 days',
                        caption: 'Order to receipt',
                        icon: 'solar:clock-circle-bold-duotone',
                    },
                ],
                columns: [
                    { label: 'PO', kind: 'primary' },
                    { label: 'Supplier' },
                    { label: 'Expected' },
                    { label: 'Total', kind: 'amount', align: 'right' },
                    { label: 'Status', kind: 'status' },
                ],
                rows: [
                    [
                        'PO-5521',
                        'Guard Agricultural',
                        '20 Oct 2026',
                        '286,000',
                        'Pending',
                    ],
                    [
                        'PO-5520',
                        'Dawlance Pvt Ltd',
                        '18 Oct 2026',
                        '512,400',
                        'Received',
                    ],
                    [
                        'PO-5519',
                        'Khaadi Wholesale',
                        '10 Oct 2026',
                        '148,700',
                        'Overdue',
                    ],
                    [
                        'PO-5518',
                        'Signify Pakistan',
                        '24 Oct 2026',
                        '62,300',
                        'Draft',
                    ],
                ],
            },
            {
                slug: 'bills',
                title: 'Bills',
                description: 'Rs 1.48M to pay',
                action: 'New bill',
                stats: [
                    {
                        label: 'Bills this month',
                        value: '39',
                        caption: 'Rs 3.4M billed',
                        icon: 'solar:bill-list-bold-duotone',
                    },
                    {
                        label: 'Paid',
                        value: 'Rs 1.92M',
                        caption: '56% of billed',
                        icon: 'solar:check-circle-bold-duotone',
                    },
                    {
                        label: 'Overdue',
                        value: 'Rs 208K',
                        caption: '4 bills',
                        icon: 'solar:danger-triangle-bold-duotone',
                    },
                ],
                columns: [
                    { label: 'Bill', kind: 'primary' },
                    { label: 'Supplier' },
                    { label: 'Due date' },
                    { label: 'Amount', kind: 'amount', align: 'right' },
                    { label: 'Status', kind: 'status' },
                ],
                rows: [
                    [
                        'BL-3310',
                        'Dawlance Pvt Ltd',
                        '25 Oct 2026',
                        '512,400',
                        'Pending',
                    ],
                    [
                        'BL-3309',
                        'Guard Agricultural',
                        '12 Oct 2026',
                        '208,000',
                        'Overdue',
                    ],
                    [
                        'BL-3308',
                        'Khaadi Wholesale',
                        '08 Oct 2026',
                        '96,500',
                        'Paid',
                    ],
                    [
                        'BL-3307',
                        'Signify Pakistan',
                        '02 Oct 2026',
                        '41,200',
                        'Paid',
                    ],
                ],
            },
        ],
    },
    {
        slug: 'reports',
        title: 'Reports',
        icon: 'solar:chart-square-bold-duotone',
        pages: [
            {
                slug: 'sales-summary',
                title: 'Sales Summary',
                description: 'October 2026',
                action: 'Export',
                stats: [
                    {
                        label: 'Net sales',
                        value: 'Rs 4.82M',
                        caption: '+12.4% vs September',
                        icon: 'solar:chart-2-bold-duotone',
                    },
                    {
                        label: 'Orders',
                        value: '412',
                        caption: '+31 vs September',
                        icon: 'solar:bag-4-bold-duotone',
                    },
                    {
                        label: 'Gross margin',
                        value: '27.8%',
                        caption: '+0.6 pts vs September',
                        icon: 'solar:pie-chart-2-bold-duotone',
                    },
                ],
                columns: [
                    { label: 'Category', kind: 'primary' },
                    { label: 'Orders', align: 'right' },
                    { label: 'Units', align: 'right' },
                    { label: 'Revenue', kind: 'amount', align: 'right' },
                    { label: 'Trend', kind: 'status' },
                ],
                rows: [
                    ['Grocery', '186', '3,420', '1,832,000', 'Up'],
                    ['Electronics', '94', '612', '1,204,500', 'Up'],
                    ['Fabrics', '78', '488', '986,300', 'Flat'],
                    ['Home & Kitchen', '54', '402', '612,800', 'Down'],
                ],
            },
            {
                slug: 'stock-valuation',
                title: 'Stock Valuation',
                description: 'As of today',
                action: 'Export',
                stats: [
                    {
                        label: 'Stock value',
                        value: 'Rs 8.6M',
                        caption: 'At average cost',
                        icon: 'solar:wallet-money-bold-duotone',
                    },
                    {
                        label: 'Retail value',
                        value: 'Rs 11.9M',
                        caption: 'At list price',
                        icon: 'solar:tag-price-bold-duotone',
                    },
                    {
                        label: 'Slow movers',
                        value: 'Rs 640K',
                        caption: 'No sale in 90 days',
                        icon: 'solar:hourglass-bold-duotone',
                    },
                ],
                columns: [
                    { label: 'Warehouse', kind: 'primary' },
                    { label: 'SKUs', align: 'right' },
                    { label: 'Units', align: 'right' },
                    { label: 'Value', kind: 'amount', align: 'right' },
                    { label: 'Health', kind: 'status' },
                ],
                rows: [
                    ['Lahore Main', '582', '14,206', '4,820,000', 'Healthy'],
                    ['Karachi Port', '411', '8,140', '2,960,000', 'Healthy'],
                    ['Multan Depot', '126', '2,466', '820,000', 'Low stock'],
                ],
            },
            {
                slug: 'profit-and-loss',
                title: 'Profit & Loss',
                description: 'Year to date',
                action: 'Export',
                stats: [
                    {
                        label: 'Revenue',
                        value: 'Rs 41.2M',
                        caption: 'Jan – Oct 2026',
                        icon: 'solar:graph-up-bold-duotone',
                    },
                    {
                        label: 'Expenses',
                        value: 'Rs 9.8M',
                        caption: '23.8% of revenue',
                        icon: 'solar:card-send-bold-duotone',
                    },
                    {
                        label: 'Net profit',
                        value: 'Rs 3.6M',
                        caption: '8.7% net margin',
                        icon: 'solar:wallet-money-bold-duotone',
                    },
                ],
                columns: [
                    { label: 'Line', kind: 'primary' },
                    { label: 'This month', kind: 'amount', align: 'right' },
                    { label: 'Last month', kind: 'amount', align: 'right' },
                    { label: 'Year to date', kind: 'amount', align: 'right' },
                    { label: 'Trend', kind: 'status' },
                ],
                rows: [
                    ['Revenue', '4,820,000', '4,288,000', '41,200,000', 'Up'],
                    [
                        'Cost of goods',
                        '3,480,000',
                        '3,110,000',
                        '27,800,000',
                        'Up',
                    ],
                    [
                        'Operating expenses',
                        '980,000',
                        '1,020,000',
                        '9,800,000',
                        'Down',
                    ],
                    ['Net profit', '360,000', '158,000', '3,600,000', 'Up'],
                ],
            },
        ],
    },
];

export function findModulePage(
    moduleSlug: string,
    pageSlug: string,
): { module: Module; page: ModulePage } | null {
    const module = modules.find((candidate) => candidate.slug === moduleSlug);
    const page = module?.pages.find((candidate) => candidate.slug === pageSlug);

    return module && page ? { module, page } : null;
}

/** Sidebar entries: one expandable parent per module. */
export const moduleNavItems: NavParentItem[] = modules.map((module) => ({
    title: module.title,
    icon: module.icon,
    items: module.pages.map((page) => ({
        title: page.title,
        href: show([module.slug, page.slug]),
    })),
}));
