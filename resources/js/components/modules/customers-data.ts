/**
 * Static sample customers for the Sales · Customers page until the real
 * endpoint exists.
 */

export type Customer = {
    code: string;
    name: string;
    contactPerson: string;
    phone: string;
    address: string;
    city: string;
    agent: string;
    creditLimit: number;
    balance: number;
    discount: number;
    status: 'Active' | 'On hold' | 'Inactive';
};

export type CreditStanding = 'within' | 'over' | 'none';

export const creditFilters: { value: CreditStanding; label: string }[] = [
    { value: 'within', label: 'Within limit' },
    { value: 'over', label: 'Over limit' },
    { value: 'none', label: 'No credit' },
];

export const customers: Customer[] = [
    {
        code: 'CUS-0001',
        name: 'Al-Noor Traders',
        contactPerson: 'Imran Qureshi',
        phone: '0300-4512876',
        address: 'Shop 14, Liberty Market',
        city: 'Lahore',
        agent: 'Bilal Ahmed',
        creditLimit: 500000,
        balance: 248500,
        discount: 5,
        status: 'Active',
    },
    {
        code: 'CUS-0002',
        name: 'Hamza Electronics',
        contactPerson: 'Hamza Siddiqui',
        phone: '0321-8890123',
        address: 'Plot 7, Saddar',
        city: 'Karachi',
        agent: 'Usman Tariq',
        creditLimit: 250000,
        balance: 96200,
        discount: 3,
        status: 'Active',
    },
    {
        code: 'CUS-0003',
        name: 'Sadia Fabrics',
        contactPerson: 'Sadia Malik',
        phone: '0333-2201457',
        address: 'Kotwali Road',
        city: 'Faisalabad',
        agent: 'Bilal Ahmed',
        creditLimit: 400000,
        balance: 412750,
        discount: 7.5,
        status: 'On hold',
    },
    {
        code: 'CUS-0004',
        name: 'Green Valley Mart',
        contactPerson: 'Asad Khan',
        phone: '0345-7781290',
        address: 'F-10 Markaz',
        city: 'Islamabad',
        agent: 'Ayesha Noor',
        creditLimit: 0,
        balance: 0,
        discount: 0,
        status: 'Active',
    },
    {
        code: 'CUS-0005',
        name: 'Rehman & Sons',
        contactPerson: 'Abdul Rehman',
        phone: '0301-6654321',
        address: 'Hussain Agahi Bazaar',
        city: 'Multan',
        agent: 'Usman Tariq',
        creditLimit: 150000,
        balance: 58900,
        discount: 2.5,
        status: 'Inactive',
    },
    {
        code: 'CUS-0006',
        name: 'Karachi Wholesale Hub',
        contactPerson: 'Faisal Memon',
        phone: '0322-3349870',
        address: 'Jodia Bazaar',
        city: 'Karachi',
        agent: 'Ayesha Noor',
        creditLimit: 750000,
        balance: 805300,
        discount: 10,
        status: 'Active',
    },
    {
        code: 'CUS-0007',
        name: 'City Super Store',
        contactPerson: 'Nadia Hussain',
        phone: '0312-5567781',
        address: 'Main Boulevard, Gulberg',
        city: 'Lahore',
        agent: 'Bilal Ahmed',
        creditLimit: 300000,
        balance: 121000,
        discount: 4,
        status: 'Active',
    },
    {
        code: 'CUS-0008',
        name: 'Peshawar General Store',
        contactPerson: 'Gul Zaman',
        phone: '0315-9087123',
        address: 'Qissa Khwani Bazaar',
        city: 'Peshawar',
        agent: 'Usman Tariq',
        creditLimit: 0,
        balance: 0,
        discount: 0,
        status: 'On hold',
    },
];

/** Where a customer's outstanding balance stands against their credit limit. */
export function creditStanding(customer: Customer): CreditStanding {
    if (customer.creditLimit === 0) {
        return 'none';
    }

    return customer.balance > customer.creditLimit ? 'over' : 'within';
}

/** Sorted unique values of a customer field, for filter dropdowns. */
export function uniqueValues(field: 'city' | 'agent' | 'status'): string[] {
    return [...new Set(customers.map((customer) => customer[field]))].sort();
}
