import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

import { authApi } from '../api/auth.api';
import { initialTenants } from '../data/platform.mock';

const AuthContext = createContext(null);

const DEFAULT_SCHOOL = {
    id: 'SCH-001',
    name: 'Olive English School',
    schoolName: 'Olive English School',
    slug: 'olive',
    city: 'Dhule',
    plan: 'Growth',
    status: 'Active',
    color: '#257cbe',
    code: 'OLV-2026',
    campus: 'Main Campus',
    academicYear: '2026-2027',
};

const DEFAULT_USER = {
    id: 'USR-001',
    name: 'Dr. Sameer Khan',
    email: 'admin@olive.edu',
    role: 'SCHOOL_ADMIN',
    title: 'School Principal & Admin',
    avatar: null,
};

const DEMO_USERS = {
    SCHOOL_ADMIN: {
        id: 'USR-001',
        name: 'Dr. Sameer Khan',
        email: 'admin@olive.edu',
        role: 'SCHOOL_ADMIN',
        title: 'School Principal & Admin',
    },
    SUPER_ADMIN: {
        id: 'USR-ROOT',
        name: 'Alex Rivera (SaaS Owner)',
        email: 'root@schoolerp-saas.com',
        role: 'SUPER_ADMIN',
        title: 'Multi-Tenant Platform Super Admin',
    },
    ACADEMIC_HEAD: {
        id: 'USR-002',
        name: 'Pooja Deshmukh',
        email: 'pooja.academic@olive.edu',
        role: 'ACADEMIC_HEAD',
        title: 'Dean of Academics & Exams',
    },
    FINANCE_OFFICER: {
        id: 'USR-003',
        name: 'Rajesh Patil',
        email: 'accounts@olive.edu',
        role: 'FINANCE_OFFICER',
        title: 'Head of Accounts & Billing',
    },
};


export function AuthProvider({ children}) {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('erp_active_user');
            if (saved) return JSON.parse(saved);
        } catch (error) {
            return DEFAULT_USER;
        }
    })
}