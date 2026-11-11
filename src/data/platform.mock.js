
export const initialTenants = [
    { id: 'SCH-001', name: 'Olive English School', slug: 'olive', city: 'Dhule', contact: 'admin@olive.example', plan: 'Growth', status: 'Active', students: 1362, staff: 48, joined: '2026-06-10', renewal: '2027-06-10', color: '#257cbe' },
    { id: 'SCH-002', name: 'Horizon International School', slug: 'horizon', city: 'Pune', contact: 'hello@horizon.example', plan: 'Enterprise', status: 'Active', students: 2480, staff: 96, joined: '2026-03-12', renewal: '2027-03-12', color: '#7c3aed' },
    { id: 'SCH-003', name: 'Bright Future Academy', slug: 'bright-future', city: 'Nashik', contact: 'office@brightfuture.example', plan: 'Starter', status: 'Trial', students: 540, staff: 25, joined: '2026-10-20', renewal: '2026-11-20', color: '#0891b2' },
    { id: 'SCH-004', name: 'Sunrise Public School', slug: 'sunrise', city: 'Mumbai', contact: 'admin@sunrise.example', plan: 'Growth', status: 'Active', students: 1850, staff: 72, joined: '2026-05-01', renewal: '2027-05-01', color: '#db2777' },
    { id: 'SCH-005', name: 'Green Valley School', slug: 'green-valley', city: 'Aurangabad', contact: 'contact@greenvalley.example', plan: 'Starter', status: 'Suspended', students: 620, staff: 31, joined: '2026-02-14', renewal: '2026-10-14', color: '#d97706' },
    { id: 'SCH-006', name: 'Scholars English Medium', slug: 'scholars', city: 'Nagpur', contact: 'office@scholars.example', plan: 'Growth', status: 'Trial', students: 890, staff: 38, joined: '2026-10-25', renewal: '2026-11-25', color: '#4f46e5' },
];

export const initialPlans = [
    { id: 'starter', name: 'Starter', price: 2999, studentsLimit: 500, features: ['Student Management', 'Attendance', 'Academics', 'Basic Reports'] },
    { id: 'growth', name: 'Growth', price: 6999, studentsLimit: 2000, features: ['Everything in Starter', 'Fees & Payments', 'Staff & HR', 'Transport', 'Library'] },
    { id: 'enterprise', name: 'Enterprise', price: 14999, studentsLimit: 10000, features: ['Everything in Growth', 'Advanced Analytics', 'Custom Branding', 'Priority Support'] },
];

export const platformTrend = [
    { month: 'May', revenue: 34000, schools: 2 },
    { month: 'Jun', revenue: 42000, schools: 3 },
    { month: 'Jul', revenue: 47000, schools: 3 },
    { month: 'Aug', revenue: 56000, schools: 4 },
    { month: 'Sep', revenue: 61000, schools: 4 },
    { month: 'Oct', revenue: 75000, schools: 6 },
];

export const platformMoney = (value) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(Number(value) || 0);
