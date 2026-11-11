
import { initialStudents } from './students.mock';

export const initialVehicles = [
    { id: 'VH01', number: 'MH-18-AB-2041', name: 'School Bus 01', type: 'Bus', capacity: 40, routeId: 'RT01', driverId: 'DR01', status: 'Active' },
    { id: 'VH02', number: 'MH-18-CD-3812', name: 'School Bus 02', type: 'Bus', capacity: 35, routeId: 'RT02', driverId: 'DR02', status: 'Active' },
    { id: 'VH03', number: 'MH-18-EF-1198', name: 'School Bus 03', type: 'Bus', capacity: 45, routeId: 'RT03', driverId: 'DR03', status: 'Maintenance' },
    { id: 'VH04', number: 'MH-18-GH-5620', name: 'School Van 01', type: 'Van', capacity: 15, routeId: 'RT04', driverId: 'DR04', status: 'Active' },
    { id: 'VH05', number: 'MH-18-JK-7733', name: 'School Van 02', type: 'Van', capacity: 15, routeId: '', driverId: '', status: 'Inactive' },
];

export const initialRoutes = [
    {
        id: 'RT01', name: 'Central City Express', code: 'R-101',
        start: 'Central Bus Stand', end: 'Olive English School',
        stops: ['Central Bus Stand', 'Market Square', 'Civil Lines', 'Olive English School'],
        departure: '07:10', fee: 1400, status: 'Active',
    },
    {
        id: 'RT02', name: 'East Residential Loop', code: 'R-102',
        start: 'East Colony', end: 'Olive English School',
        stops: ['East Colony', 'Garden Road', 'New Town', 'Olive English School'],
        departure: '07:20', fee: 1200, status: 'Active',
    },
    {
        id: 'RT03', name: 'North Campus Route', code: 'R-103',
        start: 'North Junction', end: 'Olive English School',
        stops: ['North Junction', 'Lake View', 'Hospital Road', 'Olive English School'],
        departure: '07:05', fee: 1500, status: 'Active',
    },
    {
        id: 'RT04', name: 'West Park Shuttle', code: 'R-104',
        start: 'West Park', end: 'Olive English School',
        stops: ['West Park', 'Green Avenue', 'Olive English School'],
        departure: '07:35', fee: 1000, status: 'Active',
    },
];

export const initialDrivers = [
    { id: 'DR01', name: 'Ramesh Patil', phone: '9000001001', license: 'DL-DEMO-1001', experience: 9, status: 'Available' },
    { id: 'DR02', name: 'Salim Shaikh', phone: '9000001002', license: 'DL-DEMO-1002', experience: 12, status: 'Available' },
    { id: 'DR03', name: 'Suresh Jadhav', phone: '9000001003', license: 'DL-DEMO-1003', experience: 7, status: 'On Leave' },
    { id: 'DR04', name: 'Imran Ansari', phone: '9000001004', license: 'DL-DEMO-1004', experience: 6, status: 'Available' },
    { id: 'DR05', name: 'Akash More', phone: '9000001005', license: 'DL-DEMO-1005', experience: 4, status: 'Available' },
];

export const transportStudents = [
    ...initialStudents.map((student) => ({
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        admissionNo: student.admissionNo,
        className: student.className,
        section: student.section,
    })),
    ...[
        ['Aarav', 'Sharma', '8', 'A'],
        ['Fatima', 'Khan', '7', 'B'],
        ['Kabir', 'Patil', '9', 'A'],
        ['Zoya', 'Shaikh', '6', 'A'],
        ['Rehan', 'Ansari', '8', 'B'],
        ['Sara', 'Qureshi', '7', 'A'],
        ['Vihaan', 'More', '9', 'B'],
        ['Meher', 'Joshi', '6', 'B'],
    ].map(([first, last, className, section], i) => ({
        id: `TR-ST-${i + 1}`,
        name: `${first} ${last}`,
        admissionNo: `TR-DEMO-${String(i + 1).padStart(3, '0')}`,
        className,
        section,
    })),
];

export const initialAllocations = transportStudents.slice(0, 9).map((student, i) => {
    const routeId = ['RT01', 'RT02', 'RT04'][i % 3];
    const route = initialRoutes.find((r) => r.id === routeId);
    return {
        id: `AL-${i + 1}`,
        studentId: student.id,
        routeId,
        pickup: route.stops[1],
    };
});

export const transportMoney = (value) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(Number(value) || 0);
