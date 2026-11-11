
export const initialDepartments = [
    { id: 'D1', name: 'Academic Faculty', code: 'ACA', color: '#257cbe' },
    { id: 'D2', name: 'Administration', code: 'ADM', color: '#8b5cf6' },
    { id: 'D3', name: 'Finance & Accounts', code: 'FIN', color: '#f59e0b' },
    { id: 'D4', name: 'Support Staff', code: 'SUP', color: '#10b981' },
    { id: 'D5', name: 'Transport', code: 'TRN', color: '#ec4899' },
];

export const initialStaff = [
    {
        id: 'EMP-1001', name: 'Anjali Sharma', email: 'anjali@example.com',
        phone: '9000000001', departmentId: 'D1', designation: 'Senior English Teacher',
        employeeType: 'Teaching', joiningDate: '2021-06-15', salary: 42000,
        status: 'Active', initials: 'AS',
    },
    {
        id: 'EMP-1002', name: 'Rahul Patil', email: 'rahul@example.com',
        phone: '9000000002', departmentId: 'D1', designation: 'Mathematics Teacher',
        employeeType: 'Teaching', joiningDate: '2022-07-01', salary: 38000,
        status: 'Active', initials: 'RP',
    },
    {
        id: 'EMP-1003', name: 'Priya Deshmukh', email: 'priya@example.com',
        phone: '9000000003', departmentId: 'D1', designation: 'Science Teacher',
        employeeType: 'Teaching', joiningDate: '2020-06-10', salary: 46000,
        status: 'Active', initials: 'PD',
    },
    {
        id: 'EMP-1004', name: 'Mohammed Ali', email: 'mohammed@example.com',
        phone: '9000000004', departmentId: 'D1', designation: 'Social Studies Teacher',
        employeeType: 'Teaching', joiningDate: '2023-06-12', salary: 35000,
        status: 'Active', initials: 'MA',
    },
    {
        id: 'EMP-1005', name: 'Neha Kulkarni', email: 'neha@example.com',
        phone: '9000000005', departmentId: 'D2', designation: 'School Administrator',
        employeeType: 'Non-Teaching', joiningDate: '2019-04-01', salary: 48000,
        status: 'Active', initials: 'NK',
    },
    {
        id: 'EMP-1006', name: 'Sameer Khan', email: 'sameer@example.com',
        phone: '9000000006', departmentId: 'D3', designation: 'Accounts Executive',
        employeeType: 'Non-Teaching', joiningDate: '2022-01-18', salary: 32000,
        status: 'Active', initials: 'SK',
    },
    {
        id: 'EMP-1007', name: 'Ritika Joshi', email: 'ritika@example.com',
        phone: '9000000007', departmentId: 'D2', designation: 'Front Office Executive',
        employeeType: 'Non-Teaching', joiningDate: '2024-06-03', salary: 25000,
        status: 'Active', initials: 'RJ',
    },
    {
        id: 'EMP-1008', name: 'Imran Shaikh', email: 'imran@example.com',
        phone: '9000000008', departmentId: 'D5', designation: 'Transport Coordinator',
        employeeType: 'Non-Teaching', joiningDate: '2021-08-10', salary: 28000,
        status: 'On Leave', initials: 'IS',
    },
    {
        id: 'EMP-1009', name: 'Farah Ansari', email: 'farah@example.com',
        phone: '9000000009', departmentId: 'D4', designation: 'Librarian',
        employeeType: 'Non-Teaching', joiningDate: '2023-03-14', salary: 29000,
        status: 'Active', initials: 'FA',
    },
    {
        id: 'EMP-1010', name: 'Vikram Jadhav', email: 'vikram@example.com',
        phone: '9000000010', departmentId: 'D4', designation: 'Lab Assistant',
        employeeType: 'Non-Teaching', joiningDate: '2024-07-11', salary: 24000,
        status: 'Inactive', initials: 'VJ',
    },
];

export const initialLeaveRequests = [
    {
        id: 'LV-101', staffId: 'EMP-1008', type: 'Medical Leave',
        from: '2026-10-29', to: '2026-11-03',
        reason: 'Medical appointment and recovery',
        status: 'Approved',
    },
    {
        id: 'LV-102', staffId: 'EMP-1001', type: 'Casual Leave',
        from: '2026-11-05', to: '2026-11-06',
        reason: 'Personal commitments',
        status: 'Pending',
    },
    {
        id: 'LV-103', staffId: 'EMP-1003', type: 'Casual Leave',
        from: '2026-11-09', to: '2026-11-09',
        reason: 'Family function',
        status: 'Pending',
    },
    {
        id: 'LV-104', staffId: 'EMP-1006', type: 'Earned Leave',
        from: '2026-10-20', to: '2026-10-22',
        reason: 'Personal travel',
        status: 'Approved',
    },
    {
        id: 'LV-105', staffId: 'EMP-1007', type: 'Casual Leave',
        from: '2026-10-18', to: '2026-10-18',
        reason: 'Personal work',
        status: 'Rejected',
    },
];

export const hrAvatarColors = [
    'bg-blue-100 text-blue-700',
    'bg-violet-100 text-violet-700',
    'bg-amber-100 text-amber-700',
    'bg-pink-100 text-pink-700',
    'bg-cyan-100 text-cyan-700',
    'bg-indigo-100 text-indigo-700',
];

export const hrMoney = (value) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(Number(value) || 0);

export const hrDate = (value) =>
    value
        ? new Date(`${value}T12:00:00`).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
        : '—';
