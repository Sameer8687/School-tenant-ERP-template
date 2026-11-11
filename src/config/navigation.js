import {
    LayoutDashboard,
    Users,
    UserRoundPlus,
    BookOpen,
    CalendarCheck,
    Wallet,
    ClipboardList,
    GraduationCap,
    BarChart3,
    School,
    Bus,
    LibraryBig,
    Building2,
} from 'lucide-react';

export const navigation = [
    {
        title: 'Overview',
        items: [
            { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
            { label: 'Admissions', icon: UserRoundPlus, path: '/admissions' },
            { label: 'Students', icon: Users, path: '/students' },
        ],
    },
    {
        title: 'Academics',
        items: [
            { label: 'Academics', icon: BookOpen, path: '/academics' },
            { label: 'Attendance', icon: CalendarCheck, path: '/attendance' },
            { label: 'Examinations', icon: ClipboardList, path: '/examinations' },
        ],
    },
    {
        title: 'Management',
        items: [
            { label: 'Fees & Payments', icon: Wallet, path: '/fees' },
            { label: 'Staff & HR', icon: GraduationCap, path: '/staff' },
            { label: 'Transport', icon: Bus, path: '/transport' },
            { label: 'Library', icon: LibraryBig, path: '/library' },
            { label: 'Reports', icon: BarChart3, path: '/reports' },
        ],
    },
    {
        title: 'Settings',
        items: [
            { label: 'School Settings', icon: School, path: '/school-settings' },
            { label: 'SaaS Platform', icon: Building2, path: '/platform-preview' },
        ],
    },
];
