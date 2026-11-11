
export const reportMonths = [
    { id: '2026-05', label: 'May', revenue: 175000, target: 210000, attendance: 89, passRate: 83 },
    { id: '2026-06', label: 'Jun', revenue: 198000, target: 215000, attendance: 92, passRate: 86 },
    { id: '2026-07', label: 'Jul', revenue: 186000, target: 220000, attendance: 91, passRate: 85 },
    { id: '2026-08', label: 'Aug', revenue: 234000, target: 240000, attendance: 94, passRate: 89 },
    { id: '2026-09', label: 'Sep', revenue: 218000, target: 245000, attendance: 93, passRate: 88 },
    { id: '2026-10', label: 'Oct', revenue: 252000, target: 260000, attendance: 95, passRate: 91 },
];

export const reportClasses = [
    { name: 'Class 6', students: 32, attendance: 93, passRate: 88 },
    { name: 'Class 7', students: 36, attendance: 91, passRate: 85 },
    { name: 'Class 8', students: 42, attendance: 95, passRate: 92 },
    { name: 'Class 9', students: 38, attendance: 89, passRate: 86 },
];

export const reportGradeDistribution = [
    { grade: 'A+', count: 18, color: '#257cbe' },
    { grade: 'A', count: 32, color: '#5b9fdb' },
    { grade: 'B+', count: 41, color: '#8b5cf6' },
    { grade: 'B', count: 28, color: '#b5a1f5' },
    { grade: 'C', count: 19, color: '#f59e0b' },
    { grade: 'D', count: 8, color: '#fb923c' },
    { grade: 'F', count: 2, color: '#f43f5e' },
];

export const reportCategories = [
    { id: 'overview', label: 'Overview' },
    { id: 'finance', label: 'Finance' },
    { id: 'academics', label: 'Academics' },
    { id: 'operations', label: 'Operations' },
];

export const reportCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(Number(value) || 0);

export const reportCompactCurrency = (value) => {
    const amount = Number(value) || 0;
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
};
