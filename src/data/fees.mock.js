
import { initialStudents } from './students.mock';

export const feeTypes = [
    { id: 'F1', name: 'Tuition Fee', amount: 3500, frequency: 'Monthly' },
    { id: 'F2', name: 'Transport Fee', amount: 1200, frequency: 'Monthly' },
    { id: 'F3', name: 'Examination Fee', amount: 1500, frequency: 'Termly' },
    { id: 'F4', name: 'Library Fee', amount: 600, frequency: 'Yearly' },
    { id: 'F5', name: 'Activity Fee', amount: 900, frequency: 'Yearly' },
];

const people = [
    ['Aarav', 'Sharma', '8', 'A'],
    ['Fatima', 'Shaikh', '7', 'B'],
    ['Kabir', 'Patil', '9', 'A'],
    ['Zoya', 'Khan', '6', 'C'],
    ['Rehan', 'Ansari', '8', 'B'],
    ['Aisha', 'Khan', '7', 'A'],
    ['Aditya', 'Patil', '9', 'B'],
    ['Sara', 'Shaikh', '6', 'A'],
    ['Ibrahim', 'Qureshi', '8', 'A'],
    ['Ananya', 'Joshi', '7', 'B'],
    ['Yusuf', 'Khan', '9', 'A'],
    ['Meher', 'Deshmukh', '6', 'C'],
    ['Vihaan', 'More', '8', 'B'],
    ['Inaya', 'Siddiqui', '7', 'A'],
    ['Omkar', 'Jadhav', '9', 'B'],
    ['Diya', 'Kulkarni', '6', 'A'],
];

export const feeStudents = [
    ...initialStudents.map((s) => ({
        id: s.id,
        admissionNo: s.admissionNo,
        name: `${s.firstName} ${s.lastName}`,
        className: s.className,
        section: s.section,
        status: s.status,
    })),
    ...people.slice(4).map((p, i) => ({
        id: `FST-${i + 1}`,
        admissionNo: `DEMO-2026-${String(i + 5).padStart(3, '0')}`,
        name: `${p[0]} ${p[1]}`,
        className: p[2],
        section: p[3],
        status: 'Active',
    })),
];

export const initialFeeInvoices = feeStudents.map((student, i) => {
    const amount = 3500 + (i % 3 === 0 ? 1200 : 0);
    const paid = [3500, 0, 1500, 4700, 2000, 3500, 0, 1000][i % 8];

    return {
        id: `INV-${String(i + 1).padStart(4, '0')}`,
        studentId: student.id,
        title: 'October 2026 School Fee',
        dueDate: '2026-10-20',
        amount,
        paid: Math.min(amount, paid),
    };
});

export const initialFeePayments = initialFeeInvoices
    .filter((invoice) => invoice.paid > 0)
    .map((invoice, i) => ({
        id: `PAY-${String(i + 1).padStart(5, '0')}`,
        invoiceId: invoice.id,
        studentId: invoice.studentId,
        amount: invoice.paid,
        date: `2026-10-${String(3 + (i % 18)).padStart(2, '0')}`,
        method: ['UPI', 'Cash', 'Bank Transfer'][i % 3],
        reference: `DEMO-REF-${i + 1}`,
    }));

export function money(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
}

export function invoiceStatus(invoice) {
    if (invoice.paid >= invoice.amount) return 'Paid';
    if (invoice.paid > 0) return 'Partial';
    return 'Unpaid';
}
