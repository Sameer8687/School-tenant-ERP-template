
import { initialStudents } from './students.mock';

export const initialBooks = [
    { id: 'BK001', isbn: '9780140449136', title: 'The Odyssey', author: 'Homer', category: 'Literature', shelf: 'A-01', total: 8, cover: 'from-indigo-700 to-blue-400', initials: 'OD' },
    { id: 'BK002', isbn: '9780199535569', title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Literature', shelf: 'A-02', total: 6, cover: 'from-rose-700 to-orange-300', initials: 'PP' },
    { id: 'BK003', isbn: '9780465067107', title: 'A Short History of Nearly Everything', author: 'Bill Bryson', category: 'Science', shelf: 'B-01', total: 5, cover: 'from-cyan-800 to-sky-400', initials: 'SH' },
    { id: 'BK004', isbn: '9780131103627', title: 'The C Programming Language', author: 'Kernighan & Ritchie', category: 'Technology', shelf: 'C-03', total: 4, cover: 'from-slate-800 to-slate-500', initials: 'C' },
    { id: 'BK005', isbn: '9780199604768', title: 'A Very Short Introduction to Mathematics', author: 'Timothy Gowers', category: 'Mathematics', shelf: 'B-04', total: 7, cover: 'from-blue-800 to-indigo-400', initials: 'MX' },
    { id: 'BK006', isbn: '9780062316097', title: 'Sapiens', author: 'Yuval Noah Harari', category: 'History', shelf: 'D-01', total: 5, cover: 'from-amber-800 to-yellow-500', initials: 'SP' },
    { id: 'BK007', isbn: '9780143039952', title: 'The Diary of a Young Girl', author: 'Anne Frank', category: 'Biography', shelf: 'D-03', total: 6, cover: 'from-teal-800 to-emerald-400', initials: 'AF' },
    { id: 'BK008', isbn: '9780553380163', title: 'A Brief History of Time', author: 'Stephen Hawking', category: 'Science', shelf: 'B-02', total: 6, cover: 'from-violet-900 to-purple-400', initials: 'HT' },
];

export const libraryStudents = initialStudents
    .filter((student) => student.status === 'Active')
    .map((student) => ({
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        admissionNo: student.admissionNo,
        className: student.className,
        section: student.section,
    }));

export const initialLoans = [
    { id: 'LN001', bookId: 'BK001', studentId: libraryStudents[0]?.id, issueDate: '2026-10-19', dueDate: '2026-11-02', returnDate: null },
    { id: 'LN002', bookId: 'BK003', studentId: libraryStudents[1]?.id, issueDate: '2026-10-15', dueDate: '2026-10-29', returnDate: null },
    { id: 'LN003', bookId: 'BK005', studentId: libraryStudents[2]?.id, issueDate: '2026-10-20', dueDate: '2026-11-03', returnDate: null },
    { id: 'LN004', bookId: 'BK006', studentId: libraryStudents[0]?.id, issueDate: '2026-10-01', dueDate: '2026-10-15', returnDate: '2026-10-14' },
].filter((loan) => loan.studentId);

export const libraryCategories = [
    'Literature', 'Science', 'Mathematics',
    'Technology', 'History', 'Biography', 'Reference', 'Other',
];

export const dateISO = (d = new Date()) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const addDays = (date, days) => {
    const d = new Date(`${date}T12:00:00`);
    d.setDate(d.getDate() + days);
    return dateISO(d);
};

export const prettyDate = (date) =>
    date ? new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
    }) : '—';
