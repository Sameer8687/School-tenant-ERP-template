
import { initialStudents } from './students.mock';

export const examStudents = initialStudents
    .filter((student) => student.status === 'Active')
    .map((student) => ({
        id: student.id,
        admissionNo: student.admissionNo,
        name: `${student.firstName} ${student.lastName}`,
        className: student.className,
        section: student.section,
        rollNo: student.rollNo,
    }));

export const examSubjects = [
    { id: 'ENG', name: 'English', maxMarks: 100 },
    { id: 'MAT', name: 'Mathematics', maxMarks: 100 },
    { id: 'SCI', name: 'Science', maxMarks: 100 },
    { id: 'SST', name: 'Social Studies', maxMarks: 100 },
    { id: 'HIN', name: 'Hindi', maxMarks: 100 },
];

export const initialExams = [
    {
        id: 'EX-001',
        name: 'Unit Test I',
        className: '8',
        subjectId: 'ENG',
        date: '2026-08-10',
        startTime: '09:00',
        duration: 60,
        maxMarks: 50,
        passMarks: 18,
        status: 'Completed',
    },
    {
        id: 'EX-002',
        name: 'Half Yearly Examination',
        className: '8',
        subjectId: 'MAT',
        date: '2026-10-12',
        startTime: '09:00',
        duration: 120,
        maxMarks: 100,
        passMarks: 35,
        status: 'Completed',
    },
    {
        id: 'EX-003',
        name: 'Half Yearly Examination',
        className: '8',
        subjectId: 'SCI',
        date: '2026-10-14',
        startTime: '09:00',
        duration: 120,
        maxMarks: 100,
        passMarks: 35,
        status: 'Completed',
    },
    {
        id: 'EX-004',
        name: 'Annual Examination',
        className: '8',
        subjectId: 'ENG',
        date: '2027-03-08',
        startTime: '09:00',
        duration: 120,
        maxMarks: 100,
        passMarks: 35,
        status: 'Scheduled',
    },
    {
        id: 'EX-005',
        name: 'Annual Examination',
        className: '7',
        subjectId: 'MAT',
        date: '2027-03-09',
        startTime: '09:00',
        duration: 120,
        maxMarks: 100,
        passMarks: 35,
        status: 'Scheduled',
    },
];

export const initialMarks = [
    { examId: 'EX-001', studentId: 'STU-0001', marks: 44 },
    { examId: 'EX-001', studentId: 'STU-0005', marks: 38 },
    { examId: 'EX-002', studentId: 'STU-0001', marks: 91 },
    { examId: 'EX-002', studentId: 'STU-0005', marks: 76 },
    { examId: 'EX-003', studentId: 'STU-0001', marks: 86 },
    { examId: 'EX-003', studentId: 'STU-0005', marks: 82 },
];

export const examClasses = ['6', '7', '8', '9'];

export function getGrade(percentage) {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 35) return 'D';
    return 'F';
}

export function formatExamDate(date) {
    if (!date) return '—';
    return new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}
