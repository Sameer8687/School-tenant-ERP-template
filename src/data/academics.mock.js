
export const academicYears = [
    { id: 'AY1', name: '2025-2026', startDate: '2025-06-01', endDate: '2026-05-31', active: false },
    { id: 'AY2', name: '2026-2027', startDate: '2026-06-01', endDate: '2027-05-31', active: true },
];

export const academicClasses = [
    { id: 'C1', name: '6', code: 'CLS-06', teacher: 'Anjali Sharma' },
    { id: 'C2', name: '7', code: 'CLS-07', teacher: 'Mohammed Ali' },
    { id: 'C3', name: '8', code: 'CLS-08', teacher: 'Priya Deshmukh' },
    { id: 'C4', name: '9', code: 'CLS-09', teacher: 'Rahul Patil' },
];

export const academicSections = [
    { id: 'SEC1', classId: 'C1', name: 'A', capacity: 40 },
    { id: 'SEC2', classId: 'C1', name: 'C', capacity: 40 },
    { id: 'SEC3', classId: 'C2', name: 'A', capacity: 40 },
    { id: 'SEC4', classId: 'C2', name: 'B', capacity: 40 },
    { id: 'SEC5', classId: 'C3', name: 'A', capacity: 40 },
    { id: 'SEC6', classId: 'C3', name: 'B', capacity: 40 },
    { id: 'SEC7', classId: 'C4', name: 'A', capacity: 40 },
];

export const academicSubjects = [
    { id: 'SUB1', name: 'English', code: 'ENG', classId: 'C3', teacher: 'Anjali Sharma' },
    { id: 'SUB2', name: 'Mathematics', code: 'MAT', classId: 'C3', teacher: 'Rahul Patil' },
    { id: 'SUB3', name: 'Science', code: 'SCI', classId: 'C3', teacher: 'Priya Deshmukh' },
    { id: 'SUB4', name: 'Social Studies', code: 'SST', classId: 'C3', teacher: 'Mohammed Ali' },
    { id: 'SUB5', name: 'Hindi', code: 'HIN', classId: 'C3', teacher: 'Anjali Sharma' },
    { id: 'SUB6', name: 'English', code: 'ENG', classId: 'C2', teacher: 'Anjali Sharma' },
    { id: 'SUB7', name: 'Mathematics', code: 'MAT', classId: 'C2', teacher: 'Rahul Patil' },
];

export const academicDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const academicPeriods = [
    { id: 1, label: 'Period 1', time: '08:00 - 08:45' },
    { id: 2, label: 'Period 2', time: '08:45 - 09:30' },
    { id: 3, label: 'Period 3', time: '09:30 - 10:15' },
    { id: 4, label: 'Period 4', time: '10:30 - 11:15' },
    { id: 5, label: 'Period 5', time: '11:15 - 12:00' },
    { id: 6, label: 'Period 6', time: '12:00 - 12:45' },
];

export const academicTimetable = [
    { id: 'TT1', classId: 'C3', section: 'A', day: 'Monday', period: 1, subjectId: 'SUB1' },
    { id: 'TT2', classId: 'C3', section: 'A', day: 'Monday', period: 2, subjectId: 'SUB2' },
    { id: 'TT3', classId: 'C3', section: 'A', day: 'Monday', period: 3, subjectId: 'SUB3' },
    { id: 'TT4', classId: 'C3', section: 'A', day: 'Tuesday', period: 1, subjectId: 'SUB2' },
    { id: 'TT5', classId: 'C3', section: 'A', day: 'Tuesday', period: 2, subjectId: 'SUB4' },
    { id: 'TT6', classId: 'C3', section: 'A', day: 'Wednesday', period: 1, subjectId: 'SUB5' },
];
