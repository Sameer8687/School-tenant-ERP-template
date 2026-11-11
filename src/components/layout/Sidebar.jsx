import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    GraduationCap,
    House,
    LayoutGrid,
    Search,
    Folder,
    CircleHelp,
    LogOut,
    CheckSquare,
    Users,
    DollarSign,
    FileCheck,
    User,
    Layers,
    Server,
    ChevronRight,
    UserPlus,
    Receipt,
    Calendar,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

export default function Sidebar({
    sbMode,
    setSbMode,
    mobileOpen,
    setMobileOpen,
    onOpenDiagnostics,
}) {
    const { user, school, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [accordions, setAccordions] = useState({
        attendance: true,
        student: true,
        fees: false,
        feesReconciliation: false,
        teacher: false,
    });

    const [searchQuery, setSearchQuery] = useState('');

    const schoolName = school?.name || school?.schoolName || 'Olive English School';
    const userName = user?.name || 'Developer';
    const userInitial = (userName.charAt(0) || 'D').toUpperCase();

    const toggleAccordion = (key) => {
        setAccordions((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleRailClick = (mode) => {
        if (mode === 'overview') {
            setSbMode('compact');
            navigate('/dashboard');
            setMobileOpen(false);
            return;
        }

        if (mode === 'logout') {
            logout();
            navigate('/login');
            return;
        }

        // Toggle if already in this mode
        setSbMode((prev) => (prev === mode ? 'compact' : mode));
        if (window.innerWidth < 1024) {
            setMobileOpen(true);
        }
    };

    const handleNav = (path) => {
        navigate(path);
        setSbMode('compact');
        setMobileOpen(false);
    };

    // Live search mock data matching template
    const mockSearchData = [
        { name: 'Shaikh Mohammed Bilal', id: 'S20230014', type: 'Student', cls: 'Grade 8 - Sec A', path: '/students' },
        { name: 'Khan Fatima Noor', id: 'S20230022', type: 'Student', cls: 'Grade 5 - Sec B', path: '/students' },
        { name: 'Qureshi Zaid Ahmed', id: 'S20220089', type: 'Student', cls: 'Grade 2 - Sec A', path: '/students' },
        { name: 'Shaikh Sarfarz Burhanoddin', id: 'E20200023', type: 'Teacher', cls: 'Senior Math', path: '/staff' },
        { name: 'Syed Imran Ali', id: 'E20200024', type: 'Teacher', cls: 'English Faculty', path: '/staff' },
    ];

    const filteredSearch = searchQuery.trim()
        ? mockSearchData.filter(
            (item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.cls.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : mockSearchData;

    const isCompact = sbMode === 'compact';

    return (
        <aside id="sidebar" className={mobileOpen ? 'open' : ''}>
            {/* 1. RAIL (56px) */}
            <div className="sb-rail">
                {/* Brand Logo */}
                <div
                    className="sb-brand"
                    title={schoolName}
                    onClick={() => handleRailClick('overview')}
                >
                    <GraduationCap className="w-5 h-5 text-white" />
                </div>

                {/* Home / Dashboard */}
                <button
                    type="button"
                    className={`sb-rail-btn ${location.pathname === '/dashboard' && isCompact ? 'active' : ''}`}
                    onClick={() => handleRailClick('overview')}
                    data-tip="Dashboard"
                    title="Dashboard"
                >
                    <House />
                </button>

                {/* Grid / Menu */}
                <button
                    type="button"
                    className={`sb-rail-btn ${sbMode === 'grid' ? 'active' : ''}`}
                    onClick={() => handleRailClick('grid')}
                    data-tip="Menu"
                    title="Menu"
                >
                    <LayoutGrid />
                </button>

                {/* Search */}
                <button
                    type="button"
                    className={`sb-rail-btn ${sbMode === 'search' ? 'active' : ''}`}
                    onClick={() => handleRailClick('search')}
                    data-tip="Search"
                    title="Search"
                >
                    <Search />
                </button>

                {/* Recent Forms */}
                <button
                    type="button"
                    className={`sb-rail-btn ${sbMode === 'folder' ? 'active' : ''}`}
                    onClick={() => handleRailClick('folder')}
                    data-tip="Recent"
                    title="Recent Forms"
                >
                    <Folder />
                </button>

                {/* Help */}
                <button
                    type="button"
                    className={`sb-rail-btn ${sbMode === 'help' ? 'active' : ''}`}
                    onClick={() => handleRailClick('help')}
                    data-tip="Help"
                    title="Help"
                >
                    <CircleHelp />
                </button>

                <div className="sb-rail-spacer" />

                {/* Sign Out */}
                <button
                    type="button"
                    className="sb-rail-btn hover:text-red-600"
                    onClick={() => handleRailClick('logout')}
                    data-tip="Sign out"
                    title="Sign out"
                >
                    <LogOut />
                </button>

                {/* User Avatar Pill */}
                <div className="mt-1 p-1">
                    <button
                        type="button"
                        className="w-9 h-9 rounded-[10px] flex items-center justify-center font-semibold text-[13px] text-[var(--coral)] cursor-pointer hover:opacity-90 transition border-0"
                        style={{ background: '#EBF3FA' }}
                        title={`${userName} (Super Admin)`}
                        onClick={() => handleRailClick('overview')}
                    >
                        {userInitial}
                    </button>
                </div>
            </div>

            {/* 2. FLYOUT PANEL (236px) - ONLY RENDERED WHEN NOT COMPACT */}
            {!isCompact && (
                <div id="flyoutPanel" className="sb-panel-inner">
                    {/* Flyout Header */}
                    <div className="flex items-center justify-between p-3.5 border-b border-[var(--line)]">
                        <h3 className="text-[12px] font-bold uppercase tracking-wider text-[var(--ink)]">
                            {sbMode === 'grid' && 'MENU'}
                            {sbMode === 'search' && 'SEARCH'}
                            {sbMode === 'folder' && 'RECENT FORMS'}
                            {sbMode === 'help' && 'HELP'}
                        </h3>
                        <button
                            type="button"
                            onClick={() => {
                                setSbMode('compact');
                                setMobileOpen(false);
                            }}
                            className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--hover)] text-base font-bold transition border-0 bg-transparent"
                            aria-label="Close flyout"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Flyout Body */}
                    <div className="p-3 max-h-[calc(100vh-65px)] overflow-y-auto flex-1">
                        {/* PANE: MENU (GRID) */}
                        {sbMode === 'grid' && (
                            <div className="space-y-4">
                                {/* 1. ACADEMICS */}
                                <div>
                                    <p className="text-[11.5px] font-bold uppercase tracking-[.06em] text-[#8A92A6] px-2.5 pt-1 pb-1.5">
                                        ACADEMICS
                                    </p>

                                    {/* Attendance Accordion */}
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => toggleAccordion('attendance')}
                                            className="w-full flex items-center justify-between px-2.5 py-2.5 rounded-lg text-[13.5px] font-medium text-[#1E293B] hover:bg-[#F8FAFC] transition-colors border-0 bg-transparent cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <CheckSquare className="w-[18px] h-[18px] text-[#475569] shrink-0" />
                                                <span className="truncate">Attendance</span>
                                            </div>
                                            <span className={`inline-flex items-center justify-center transition-transform duration-200 ${accordions.attendance ? 'rotate-90' : ''}`}>
                                                <ChevronRight className="w-4 h-4 text-[#8A92A6]" />
                                            </span>
                                        </button>
                                        {accordions.attendance && (
                                            <div className="ml-6 pl-3 border-l border-[#E2E8F0] space-y-1 my-1">
                                                <button type="button" onClick={() => handleNav('/attendance')} className="w-full text-left py-1.5 px-2 rounded-md text-[13px] text-[#475569] hover:text-[#257CBE] hover:bg-[#F8FAFC] border-0 bg-transparent cursor-pointer">
                                                    Student Attendance
                                                </button>
                                                <button type="button" onClick={() => handleNav('/attendance')} className="w-full text-left py-1.5 px-2 rounded-md text-[13px] text-[#475569] hover:text-[#257CBE] hover:bg-[#F8FAFC] border-0 bg-transparent cursor-pointer">
                                                    Teacher Attendance
                                                </button>
                                                <button type="button" onClick={() => handleNav('/attendance')} className="w-full text-left py-1.5 px-2 rounded-md text-[13px] text-[#475569] hover:text-[#257CBE] hover:bg-[#F8FAFC] border-0 bg-transparent cursor-pointer">
                                                    Monthly Register
                                                </button>
                                                <button type="button" onClick={() => handleNav('/attendance')} className="w-full text-left py-1.5 px-2 rounded-md text-[13px] text-[#475569] hover:text-[#257CBE] hover:bg-[#F8FAFC] border-0 bg-transparent cursor-pointer">
                                                    Leave Application
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Student Accordion */}
                                    <div className="mt-0.5">
                                        <button
                                            type="button"
                                            onClick={() => toggleAccordion('student')}
                                            className="w-full flex items-center justify-between px-2.5 py-2.5 rounded-lg text-[13.5px] font-medium text-[#1E293B] hover:bg-[#F8FAFC] transition-colors border-0 bg-transparent cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <Users className="w-[18px] h-[18px] text-[#475569] shrink-0" />
                                                <span className="truncate">Student</span>
                                            </div>
                                            <span className={`inline-flex items-center justify-center transition-transform duration-200 ${accordions.student ? 'rotate-90' : ''}`}>
                                                <ChevronRight className="w-4 h-4 text-[#8A92A6]" />
                                            </span>
                                        </button>
                                        {accordions.student && (
                                            <div className="ml-6 pl-3 border-l border-[#E2E8F0] space-y-1 my-1">
                                                <button type="button" onClick={() => handleNav('/students')} className="w-full text-left py-1.5 px-2 rounded-md text-[13px] text-[#475569] hover:text-[#257CBE] hover:bg-[#F8FAFC] border-0 bg-transparent cursor-pointer">
                                                    Student Directory
                                                </button>
                                                <button type="button" onClick={() => handleNav('/admissions')} className="w-full text-left py-1.5 px-2 rounded-md text-[13px] text-[#475569] hover:text-[#257CBE] hover:bg-[#F8FAFC] border-0 bg-transparent cursor-pointer">
                                                    Admission Form
                                                </button>
                                                <button type="button" onClick={() => handleNav('/students')} className="w-full text-left py-1.5 px-2 rounded-md text-[13px] text-[#475569] hover:text-[#257CBE] hover:bg-[#F8FAFC] border-0 bg-transparent cursor-pointer">
                                                    Profile &amp; Documents
                                                </button>
                                                <button type="button" onClick={() => handleNav('/students')} className="w-full text-left py-1.5 px-2 rounded-md text-[13px] text-[#475569] hover:text-[#257CBE] hover:bg-[#F8FAFC] border-0 bg-transparent cursor-pointer">
                                                    Promotion &amp; Transfer
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 2. OPERATIONS */}
                                <div className="pt-2">
                                    <p className="text-[11.5px] font-bold uppercase tracking-[.06em] text-[#8A92A6] px-2.5 pb-1.5">
                                        OPERATIONS
                                    </p>

                                    {/* Fees Accordion */}
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => toggleAccordion('fees')}
                                            className="w-full flex items-center justify-between px-2.5 py-2.5 rounded-lg text-[13.5px] font-medium text-[#1E293B] hover:bg-[#F8FAFC] transition-colors border-0 bg-transparent cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <DollarSign className="w-[18px] h-[18px] text-[#475569] shrink-0" />
                                                <span className="truncate">Fees</span>
                                            </div>
                                            <span className={`inline-flex items-center justify-center transition-transform duration-200 ${accordions.fees ? 'rotate-90' : ''}`}>
                                                <ChevronRight className="w-4 h-4 text-[#8A92A6]" />
                                            </span>
                                        </button>
                                        {accordions.fees && (
                                            <div className="ml-6 pl-3 border-l border-[#E2E8F0] space-y-1 my-1">
                                                <button type="button" onClick={() => handleNav('/fees')} className="w-full text-left py-1.5 px-2 rounded-md text-[13px] text-[#475569] hover:text-[#257CBE] hover:bg-[#F8FAFC] border-0 bg-transparent cursor-pointer">
                                                    Fee Collection &amp; Receipt
                                                </button>
                                                <button type="button" onClick={() => handleNav('/fees')} className="w-full text-left py-1.5 px-2 rounded-md text-[13px] text-[#475569] hover:text-[#257CBE] hover:bg-[#F8FAFC] border-0 bg-transparent cursor-pointer">
                                                    Fee Structure &amp; Master
                                                </button>
                                                <button type="button" onClick={() => handleNav('/fees')} className="w-full text-left py-1.5 px-2 rounded-md text-[13px] text-[#475569] hover:text-[#257CBE] hover:bg-[#F8FAFC] border-0 bg-transparent cursor-pointer">
                                                    Defaulters List
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Fees Reconciliation Accordion */}
                                    <div className="mt-0.5">
                                        <button
                                            type="button"
                                            onClick={() => toggleAccordion('feesReconciliation')}
                                            className="w-full flex items-center justify-between px-2.5 py-2.5 rounded-lg text-[13.5px] font-medium text-[#1E293B] hover:bg-[#F8FAFC] transition-colors border-0 bg-transparent cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <FileCheck className="w-[18px] h-[18px] text-[#475569] shrink-0" />
                                                <span className="truncate">Fees Reconciliation</span>
                                            </div>
                                            <span className={`inline-flex items-center justify-center transition-transform duration-200 ${accordions.feesReconciliation ? 'rotate-90' : ''}`}>
                                                <ChevronRight className="w-4 h-4 text-[#8A92A6]" />
                                            </span>
                                        </button>
                                        {accordions.feesReconciliation && (
                                            <div className="ml-6 pl-3 border-l border-[#E2E8F0] space-y-1 my-1">
                                                <button type="button" onClick={() => handleNav('/fees')} className="w-full text-left py-1.5 px-2 rounded-md text-[13px] text-[#475569] hover:text-[#257CBE] hover:bg-[#F8FAFC] border-0 bg-transparent cursor-pointer">
                                                    Reconciliation &amp; Ledger
                                                </button>
                                                <button type="button" onClick={() => handleNav('/fees')} className="w-full text-left py-1.5 px-2 rounded-md text-[13px] text-[#475569] hover:text-[#257CBE] hover:bg-[#F8FAFC] border-0 bg-transparent cursor-pointer">
                                                    Daily Daybook Summary
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Teacher Accordion */}
                                    <div className="mt-0.5">
                                        <button
                                            type="button"
                                            onClick={() => toggleAccordion('teacher')}
                                            className="w-full flex items-center justify-between px-2.5 py-2.5 rounded-lg text-[13.5px] font-medium text-[#1E293B] hover:bg-[#F8FAFC] transition-colors border-0 bg-transparent cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <User className="w-[18px] h-[18px] text-[#475569] shrink-0" />
                                                <span className="truncate">Teacher</span>
                                            </div>
                                            <span className={`inline-flex items-center justify-center transition-transform duration-200 ${accordions.teacher ? 'rotate-90' : ''}`}>
                                                <ChevronRight className="w-4 h-4 text-[#8A92A6]" />
                                            </span>
                                        </button>
                                        {accordions.teacher && (
                                            <div className="ml-6 pl-3 border-l border-[#E2E8F0] space-y-1 my-1">
                                                <button type="button" onClick={() => handleNav('/staff')} className="w-full text-left py-1.5 px-2 rounded-md text-[13px] text-[#475569] hover:text-[#257CBE] hover:bg-[#F8FAFC] border-0 bg-transparent cursor-pointer">
                                                    Teacher Directory
                                                </button>
                                                <button type="button" onClick={() => handleNav('/staff')} className="w-full text-left py-1.5 px-2 rounded-md text-[13px] text-[#475569] hover:text-[#257CBE] hover:bg-[#F8FAFC] border-0 bg-transparent cursor-pointer">
                                                    Faculty Dossier &amp; Schedule
                                                </button>
                                                <button type="button" onClick={() => handleNav('/staff')} className="w-full text-left py-1.5 px-2 rounded-md text-[13px] text-[#475569] hover:text-[#257CBE] hover:bg-[#F8FAFC] border-0 bg-transparent cursor-pointer">
                                                    Class &amp; Subject Allocation
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 3. OTHER */}
                                <div className="pt-2">
                                    <p className="text-[11.5px] font-bold uppercase tracking-[.06em] text-[#8A92A6] px-2.5 pb-1.5">
                                        OTHER
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => handleNav('/school-settings')}
                                        className="w-full flex items-center justify-between px-2.5 py-2.5 rounded-lg text-[13.5px] font-medium text-[#1E293B] hover:bg-[#F8FAFC] border-0 bg-transparent cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <Layers className="w-[18px] h-[18px] text-[#475569] shrink-0" />
                                            <span className="truncate">Account Management</span>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSbMode('compact');
                                            if (onOpenDiagnostics) onOpenDiagnostics();
                                        }}
                                        className="w-full flex items-center justify-between px-2.5 py-2.5 rounded-lg text-[13.5px] font-medium text-[#1E293B] hover:bg-[#F8FAFC] border-0 bg-transparent cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <Server className="w-[18px] h-[18px] text-emerald-600 shrink-0" />
                                            <span className="truncate">System Diagnostics</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* PANE: SEARCH */}
                        {sbMode === 'search' && (
                            <div className="space-y-4 pt-1">
                                <div>
                                    <label className="text-[12px] font-semibold text-[var(--ink)] block mb-1.5">
                                        Search students, staff...
                                    </label>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search by name, ID (e.g. S20230014)..."
                                        className="w-full h-9 px-3 rounded-lg border-2 border-[var(--coral)] bg-white text-[12.5px] text-[var(--ink)] focus:outline-none"
                                        autoFocus
                                    />
                                    <p className="text-[11px] text-[var(--ink-3)] mt-1.5 leading-snug">
                                        Type student name or ID. Click to open details.
                                    </p>
                                    <div className="mt-2.5 space-y-1.5 border-t border-[var(--line-2)] pt-2 max-h-72 overflow-y-auto">
                                        {filteredSearch.length === 0 ? (
                                            <p className="text-[11px] text-gray-400 p-2">No matching records found.</p>
                                        ) : (
                                            filteredSearch.map((item) => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => handleNav(item.path)}
                                                    className="w-full text-left p-2 rounded-lg hover:bg-[var(--hover)] flex items-center justify-between text-[12px] group border-0 bg-transparent transition cursor-pointer"
                                                >
                                                    <div className="truncate pr-2">
                                                        <p className="font-semibold text-[var(--ink)] truncate group-hover:text-[var(--coral)]">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-[10.5px] text-[var(--ink-3)] font-mono">
                                                            {item.id} · {item.cls}
                                                        </p>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-[var(--coral)] bg-[#EBF3FA] px-1.5 py-0.5 rounded shrink-0">
                                                        {item.type}
                                                    </span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PANE: RECENT FORMS (FOLDER) */}
                        {sbMode === 'folder' && (
                            <div className="space-y-2">
                                <p className="text-[11.5px] font-bold uppercase tracking-[.06em] text-[#8A92A6] px-1 pb-1">
                                    FREQUENT FORMS
                                </p>
                                <button
                                    type="button"
                                    onClick={() => handleNav('/admissions')}
                                    className="w-full text-left p-2.5 rounded-lg hover:bg-[var(--hover)] flex items-center gap-3 text-xs border-0 bg-transparent transition cursor-pointer"
                                >
                                    <UserPlus className="w-4 h-4 text-[var(--coral)] shrink-0" />
                                    <div>
                                        <p className="font-bold text-[var(--ink)]">Student Admission Form</p>
                                        <p className="text-[10px] text-[var(--ink-2)]">spriden + stvclas</p>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleNav('/fees')}
                                    className="w-full text-left p-2.5 rounded-lg hover:bg-[var(--hover)] flex items-center gap-3 text-xs border-0 bg-transparent transition cursor-pointer"
                                >
                                    <Receipt className="w-4 h-4 text-[var(--coral)] shrink-0" />
                                    <div>
                                        <p className="font-bold text-[var(--ink)]">Fee Collection &amp; Receipt</p>
                                        <p className="text-[10px] text-[var(--ink-2)]">sprfees table</p>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleNav('/attendance')}
                                    className="w-full text-left p-2.5 rounded-lg hover:bg-[var(--hover)] flex items-center gap-3 text-xs border-0 bg-transparent transition cursor-pointer"
                                >
                                    <Calendar className="w-4 h-4 text-[var(--coral)] shrink-0" />
                                    <div>
                                        <p className="font-bold text-[var(--ink)]">Monthly Attendance Register</p>
                                        <p className="text-[10px] text-[var(--ink-2)]">Classroom attendance</p>
                                    </div>
                                </button>
                            </div>
                        )}

                        {/* PANE: HELP */}
                        {sbMode === 'help' && (
                            <div className="space-y-3 text-xs text-[var(--ink-2)]">
                                <p><strong>EduCore Clean Architecture:</strong></p>
                                <p>Divided into 3 independent portals: Admin (spruser), Teacher (spriden tc), Student (spriden st).</p>
                                <div className="p-2.5 rounded-lg bg-[var(--surface)] space-y-1">
                                    <p className="font-semibold text-[var(--ink)]">Keyboard Navigation:</p>
                                    <p>
                                        <kbd className="px-1.5 py-0.5 bg-white border border-[var(--line)] rounded">Esc</kbd> Close flyout panel
                                    </p>
                                    <p>
                                        <kbd className="px-1.5 py-0.5 bg-white border border-[var(--line)] rounded">Ctrl+K</kbd> Quick search
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </aside>
    );
}
