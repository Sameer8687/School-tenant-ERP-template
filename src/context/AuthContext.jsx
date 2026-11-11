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

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('erp_active_user');
            if (saved) return JSON.parse(saved);
        } catch { }
        // Default to demo school admin so the client can immediately preview the UI
        return DEFAULT_USER;
    });

    const [school, setSchool] = useState(() => {
        try {
            const saved = localStorage.getItem('erp_active_school');
            if (saved) return JSON.parse(saved);
        } catch { }
        return DEFAULT_SCHOOL;
    });

    const [academicYear, setAcademicYearState] = useState(() => {
        return localStorage.getItem('erp_academic_year') || '2026-2027';
    });

    const [density, setDensity] = useState(() => {
        return localStorage.getItem('erp_ui_density') || 'compact';
    });

    const [csrfToken, setCsrfToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isDemoMode, setIsDemoMode] = useState(true);

    const clearAuth = useCallback(() => {
        setUser(null);
        setSchool(null);
        setCsrfToken(null);
        localStorage.removeItem('erp_active_user');
        localStorage.removeItem('erp_active_school');
    }, []);

    // Try to restore live backend session if available; if not, keep demo session
    useEffect(() => {
        let active = true;

        async function restoreSession() {
            try {
                const [userResponse, csrfResponse] = await Promise.all([
                    authApi.me(),
                    authApi.csrf(),
                ]);

                if (active) {
                    setUser(userResponse.data.data.user);
                    setSchool(userResponse.data.data.school);
                    setCsrfToken(csrfResponse.data.data.csrfToken);
                    setIsDemoMode(false);
                }
            } catch {
                // Backend not connected or session expired:
                // If user had an active session stored, maintain it for client preview
                if (active) {
                    setIsDemoMode(true);
                }
            } finally {
                if (active) setLoading(false);
            }
        }

        restoreSession();

        return () => {
            active = false;
        };
    }, []);

    const setAcademicYear = (year) => {
        setAcademicYearState(year);
        localStorage.setItem('erp_academic_year', year);
    };

    const toggleDensity = () => {
        const next = density === 'compact' ? 'comfortable' : 'compact';
        setDensity(next);
        localStorage.setItem('erp_ui_density', next);
    };

    const switchTenant = (tenant) => {
        const selected = typeof tenant === 'string'
            ? initialTenants.find((t) => t.id === tenant || t.slug === tenant) || DEFAULT_SCHOOL
            : tenant;

        const updated = {
            ...selected,
            schoolName: selected.name,
            academicYear,
        };

        setSchool(updated);
        try {
            localStorage.setItem('erp_active_school', JSON.stringify(updated));
        } catch { }
    };

    const switchRole = (roleKey) => {
        const target = DEMO_USERS[roleKey] || DEFAULT_USER;
        setUser(target);
        try {
            localStorage.setItem('erp_active_user', JSON.stringify(target));
        } catch { }
    };

    const login = async (credentials) => {
        try {
            const response = await authApi.login(credentials);
            const data = response.data.data;

            setUser(data.user);
            setSchool(data.school);
            setCsrfToken(data.csrfToken);
            setIsDemoMode(false);

            try {
                localStorage.setItem('erp_active_user', JSON.stringify(data.user));
                localStorage.setItem('erp_active_school', JSON.stringify(data.school));
            } catch { }

            return data;
        } catch (err) {
            // If backend is unavailable or credentials provided in offline demo:
            const demoUser = credentials.role === 'SUPER_ADMIN'
                ? DEMO_USERS.SUPER_ADMIN
                : {
                    ...DEFAULT_USER,
                    email: credentials.email || DEFAULT_USER.email,
                };

            setUser(demoUser);
            setSchool(DEFAULT_SCHOOL);
            setIsDemoMode(true);

            try {
                localStorage.setItem('erp_active_user', JSON.stringify(demoUser));
                localStorage.setItem('erp_active_school', JSON.stringify(DEFAULT_SCHOOL));
            } catch { }

            return { user: demoUser, school: DEFAULT_SCHOOL };
        }
    };

    const logout = async () => {
        let token = csrfToken;

        try {
            if (!token) {
                const response = await authApi.csrf();
                token = response.data.data.csrfToken;
            }
            await authApi.logout(token);
        } catch {
            // Ignore API logout error in offline/demo mode
        }

        clearAuth();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                school,
                loading,
                isAuthenticated: Boolean(user),
                isDemoMode,
                academicYear,
                density,
                availableTenants: initialTenants,
                switchTenant,
                switchRole,
                setAcademicYear,
                toggleDensity,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }

    return context;
}
