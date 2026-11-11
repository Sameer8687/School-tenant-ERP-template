import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Calendar,
    ChevronDown,
    Maximize,
    Minimize,
    Menu,
    LogOut,
    Settings,
    Check,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { navigation } from '../../config/navigation';
import CommandPalette from './CommandPalette';

const links = navigation.flatMap((group) => group.items);

export default function Header({
    onOpenMobile,
    onOpenDiagnostics,
}) {
    const {
        user,
        school,
        logout,
        academicYear,
        setAcademicYear,
        availableTenants,
        switchTenant,
    } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const [cmdOpen, setCmdOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const [tenantOpen, setTenantOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const userRef = useRef(null);
    const tenantRef = useRef(null);

    const active = links.find(
        (item) =>
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + '/')
    );

    const breadcrumbTitle = active?.label || (location.pathname === '/platform-preview' ? 'SaaS Platform' : 'School workspace');
    const schoolName = school?.name || school?.schoolName || 'Olive English School';
    const userName = user?.name || 'Developer';
    const userInitial = (userName.charAt(0) || 'D').toUpperCase();

    // Global keyboard shortcuts (Cmd+K / Ctrl+K and Esc)
    useEffect(() => {
        function handleKeyDown(event) {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                setCmdOpen((prev) => !prev);
                setUserOpen(false);
                setTenantOpen(false);
            }
        }

        function handleClickOutside(event) {
            if (!userRef.current?.contains(event.target)) setUserOpen(false);
            if (!tenantRef.current?.contains(event.target)) setTenantOpen(false);
        }

        function handleFullscreenChange() {
            setIsFullscreen(!!document.fullscreenElement);
        }

        window.addEventListener('keydown', handleKeyDown);
        document.addEventListener('pointerdown', handleClickOutside);
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('pointerdown', handleClickOutside);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen().catch(() => {});
        }
    };

    const handleSignOut = async () => {
        setUserOpen(false);
        await logout();
        navigate('/login', { replace: true });
    };

    return (
        <>
            <header className="h-14 border-b border-[var(--line)] bg-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 select-none">
                {/* Left: Mobile Toggle & Breadcrumbs */}
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <button
                        type="button"
                        onClick={onOpenMobile}
                        aria-label="Toggle mobile menu"
                        className="lg:hidden h-8 w-8 rounded-lg border border-[var(--line)] bg-white text-[var(--ink)] flex items-center justify-center hover:bg-[var(--hover)] transition shrink-0"
                    >
                        <Menu className="w-4 h-4" />
                    </button>

                    {/* School Name with multi-tenant switcher dropdown */}
                    <div ref={tenantRef} className="relative inline-flex items-center">
                        <button
                            type="button"
                            onClick={() => {
                                setTenantOpen((prev) => !prev);
                                setUserOpen(false);
                            }}
                            className="text-[13.5px] font-semibold text-[var(--ink)] truncate cursor-pointer hover:text-[var(--coral)] transition flex items-center gap-1 border-0 bg-transparent p-0"
                            title="Switch School Tenant"
                        >
                            <span>{schoolName}</span>
                            <ChevronDown className="w-3 h-3 text-[var(--ink-3)]" />
                        </button>

                        {tenantOpen && (
                            <div className="absolute left-0 top-[32px] z-50 w-64 card p-1.5 shadow-md">
                                <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">
                                    Switch School Tenant
                                </p>
                                <div className="max-h-48 overflow-y-auto space-y-0.5">
                                    {availableTenants?.map((t) => (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => {
                                                switchTenant(t);
                                                setTenantOpen(false);
                                            }}
                                            className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition border-0 ${
                                                t.name === schoolName
                                                    ? 'bg-[#EBF3FA] font-semibold text-[var(--coral)]'
                                                    : 'text-[var(--ink)] hover:bg-[var(--hover)] bg-transparent'
                                            }`}
                                        >
                                            <span className="truncate">{t.name}</span>
                                            {t.name === schoolName && <Check className="w-3.5 h-3.5 text-[var(--coral)]" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <span className="text-[13px] text-[var(--ink-3)] hidden xs:inline">/</span>
                    <span id="navTitleBreadcrumb" className="text-[13px] text-[var(--ink-2)] font-normal hidden sm:inline truncate">
                        {breadcrumbTitle}
                    </span>
                </div>

                {/* Right: Academic Year Select, Self-Tester, Fullscreen, Profile */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {/* Academic Session Select (stvacdm) */}
                    <div className="relative flex items-center">
                        <select
                            id="academicYearSelect"
                            value={academicYear || '2026-27'}
                            onChange={(e) => setAcademicYear(e.target.value)}
                            className="h-8 pl-7 pr-6 rounded-lg border border-[var(--line)] bg-white text-[12px] font-semibold text-[var(--ink)] hover:bg-[var(--hover)] cursor-pointer focus:outline-none focus:border-[var(--coral)] transition appearance-none shadow-xs"
                        >
                            <option value="2026-27">2026-27 ★ (Current)</option>
                            <option value="2025-26">2025-26</option>
                            <option value="2024-25">2024-25</option>
                            <option value="all">All Academic Years</option>
                        </select>
                        <Calendar className="w-3.5 h-3.5 text-[var(--coral)] absolute left-2 pointer-events-none" />
                        <ChevronDown className="w-3 h-3 text-[var(--ink-3)] absolute right-2 pointer-events-none" />
                    </div>

                    {/* Self-Tester Button */}
                    <button
                        type="button"
                        onClick={onOpenDiagnostics}
                        className="h-8 px-2.5 sm:px-3 rounded-lg border border-emerald-300 bg-emerald-50 text-[12px] font-bold text-emerald-800 flex items-center gap-1.5 hover:bg-emerald-100 transition shadow-xs cursor-pointer active:scale-95"
                        title="Run 1-Click Application Diagnostics"
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="hidden md:inline">Self-Tester</span>
                    </button>

                    {/* Fullscreen Button */}
                    <button
                        type="button"
                        onClick={toggleFullScreen}
                        className="w-8 h-8 rounded-lg border border-[var(--line)] bg-white text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--hover)] flex items-center justify-center transition"
                        title={isFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen'}
                    >
                        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </button>

                    {/* Profile Initial Pill & Dropdown */}
                    <div ref={userRef} className="relative flex items-center gap-2 pl-1 border-l border-[var(--line)]">
                        <button
                            type="button"
                            onClick={() => {
                                setUserOpen((prev) => !prev);
                                setTenantOpen(false);
                            }}
                            className="w-8 h-8 rounded-lg bg-[#EBF3FA] text-[var(--coral)] font-bold text-xs flex items-center justify-center cursor-pointer border-0 hover:opacity-90 transition"
                            title={`${userName} (Administrator)`}
                        >
                            {userInitial}
                        </button>

                        {userOpen && (
                            <div className="absolute right-0 top-[40px] z-50 w-52 card p-1 shadow-lg text-xs">
                                <div className="px-3 py-2 border-b border-[var(--line)]">
                                    <p className="font-semibold text-[var(--ink)] truncate">{userName}</p>
                                    <p className="text-[11px] text-[var(--ink-3)] truncate">{user?.email || 'admin@oliveschool.edu'}</p>
                                </div>
                                <div className="py-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUserOpen(false);
                                            navigate('/school-settings');
                                        }}
                                        className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-[var(--ink-2)] hover:bg-[var(--hover)] hover:text-[var(--ink)] text-left border-0 bg-transparent"
                                    >
                                        <Settings className="w-3.5 h-3.5" />
                                        <span>School Settings</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSignOut}
                                        className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 text-left font-medium border-0 bg-transparent"
                                    >
                                        <LogOut className="w-3.5 h-3.5" />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Quick Command Palette modal */}
            <CommandPalette
                open={cmdOpen}
                onClose={() => setCmdOpen(false)}
            />
        </>
    );
}
