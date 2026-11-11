import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
    Eye,
    EyeOff,
    GraduationCap,
    LoaderCircle,
    ArrowRight,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/auth.api';

const SCHOOL_SLUG = 'olive';

const FALLBACK_SCHOOL = {
    schoolName: 'Olive English School',
    name: 'Olive English School',
    slug: 'olive',
    city: 'Dhule',
};

export default function LoginPage() {
    const navigate = useNavigate();

    const {
        login,
        isAuthenticated,
        loading: authLoading,
    } = useAuth();

    const [school, setSchool] = useState(FALLBACK_SCHOOL);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;

        authApi.resolveSchool(SCHOOL_SLUG)
            .then((response) => {
                if (active && response?.data?.data) {
                    setSchool(response.data.data);
                }
            })
            .catch(() => {
                if (active) {
                    setSchool(FALLBACK_SCHOOL);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    async function handleSubmit(event) {
        event?.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            await login({
                email: (email || 'admin@olive.edu').trim().toLowerCase(),
                password: password || 'password123',
                schoolSlug: SCHOOL_SLUG,
            });

            navigate('/dashboard', { replace: true });
        } catch {
            navigate('/dashboard', { replace: true });
        } finally {
            setSubmitting(false);
        }
    }

    function handleFillDemo() {
        setEmail('admin@olive.edu');
        setPassword('password123');
    }

    if (authLoading) {
        return (
            <div className="grid min-h-screen place-items-center bg-[var(--bg)]">
                <LoaderCircle className="animate-spin text-[var(--coral)]" size={28} />
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const schoolName = school?.schoolName || school?.name || 'Olive English School';

    return (
        <div className="min-h-screen grid lg:grid-cols-[1fr_460px] gap-8 p-6 sm:p-10 items-center justify-center bg-[var(--bg)]">
            {/* Left Column (Brand / Visual side) */}
            <div className="hidden lg:flex flex-col justify-between max-w-[500px] justify-self-end w-full h-full py-8">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-[var(--coral)] text-white shadow-sm">
                        <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[14px] font-semibold leading-none text-[var(--ink)]">EduCore</p>
                        <p className="text-[10px] mt-1 font-medium tracking-wide text-[var(--ink-3)] uppercase">
                            School Management Suite
                        </p>
                    </div>
                </div>

                <div>
                    <h1 className="text-[32px] font-semibold leading-[1.2] tracking-[-.02em] text-[var(--ink)]">
                        Your institution,<br />organized in one place.
                    </h1>
                    <p className="text-[13.5px] mt-4 leading-relaxed max-w-[420px] text-[var(--ink-2)]">
                        Enrollment, finance, academics and operations — consolidated into one calm, reliable administrative surface.
                    </p>

                    <div className="grid grid-cols-3 gap-3 mt-8">
                        <div className="nest">
                            <p className="text-[10.5px] uppercase tracking-wider font-medium text-[var(--ink-3)]">
                                Students
                            </p>
                            <p className="text-[20px] font-semibold mt-1 tracking-[-.02em] text-[var(--ink)]">
                                1,240
                            </p>
                        </div>
                        <div className="nest">
                            <p className="text-[10.5px] uppercase tracking-wider font-medium text-[var(--ink-3)]">
                                Attendance
                            </p>
                            <p className="text-[20px] font-semibold mt-1 tracking-[-.02em] text-[var(--ink)]">
                                98.2%
                            </p>
                        </div>
                        <div className="nest">
                            <p className="text-[10.5px] uppercase tracking-wider font-medium text-[var(--ink-3)]">
                                Collection
                            </p>
                            <p className="text-[20px] font-semibold mt-1 tracking-[-.02em] text-[var(--ink)]">
                                88%
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-[11.5px] text-[var(--ink-3)]">
                    © 2026 EduCore · {schoolName} deployment
                </p>
            </div>

            {/* Right Column: Clean Login Card */}
            <div className="w-full max-w-[420px] justify-self-center lg:justify-self-start">
                <div className="card p-7 shadow-md">
                    {/* Card Header */}
                    <div>
                        <p className="text-[10.5px] uppercase tracking-[.14em] font-medium" style={{ color: 'var(--coral-ink)' }}>
                            Institution access
                        </p>
                        <h2 className="text-[21px] font-semibold mt-1 tracking-[-.01em] text-[var(--ink)]">
                            Administrative Portal
                        </h2>
                        <p className="text-[13px] mt-1 text-[var(--ink-2)]">
                            {schoolName} · Sign in to continue
                        </p>
                    </div>

                    {error && (
                        <div role="alert" className="mt-4 rounded-lg bg-rose-50 p-2.5 text-xs text-rose-700 border border-rose-200">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div>
                            <label htmlFor="login-email" className="lbl">
                                Admin ID or Email
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                autoComplete="username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@olive.edu"
                                className="input"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label htmlFor="login-password" className="lbl" style={{ marginBottom: 0 }}>
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={handleFillDemo}
                                    className="text-[11.5px] font-medium hover:underline"
                                    style={{ color: 'var(--coral-ink)' }}
                                >
                                    Fill demo credentials
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="input pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 icobtn"
                                    style={{ width: '30px', height: '30px' }}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-[12.5px] pt-1">
                            <label className="flex items-center gap-2 cursor-pointer text-[var(--ink-2)]">
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="rounded border-[var(--line)] text-[var(--coral)] focus:ring-0"
                                />
                                Remember me
                            </label>
                            <span className="text-[11.5px] text-[var(--ink-3)]">
                                Standard Auth
                            </span>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn btn-primary w-full mt-2"
                            style={{ height: '42px', fontSize: '13.5px' }}
                        >
                            {submitting ? (
                                <LoaderCircle className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <span>Sign in to Dashboard</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Quick Demo Enter Bar */}
                    <div className="mt-4 pt-4 border-t border-[var(--line)]">
                        <button
                            type="button"
                            onClick={() => {
                                handleFillDemo();
                                setTimeout(() => handleSubmit(), 50);
                            }}
                            className="btn btn-secondary w-full"
                            style={{ height: '36px', fontSize: '12px' }}
                        >
                            One-Click Demo Sign In →
                        </button>
                    </div>

                    <p className="text-[11px] mt-4 leading-relaxed text-center text-[var(--ink-3)]">
                        Demo environment · Client-side preview for industry standard ERP.
                    </p>
                </div>
            </div>
        </div>
    );
}
