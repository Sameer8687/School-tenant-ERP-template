import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
    const { user, school } = useAuth();
    const navigate = useNavigate();

    const [selectedReport, setSelectedReport] = useState('');
    const [hoveredBar, setHoveredBar] = useState(null);

    const userName = user?.name || 'Developer';

    const currentDate = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date());

    const currentTime = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).format(new Date());

    const classData = [
        { grade: 'Nursery', count: 90 },
        { grade: 'LKG', count: 115 },
        { grade: 'UKG', count: 95 },
        { grade: 'Grade 1', count: 140 },
        { grade: 'Grade 2', count: 80 },
        { grade: 'Grade 3', count: 20 },
        { grade: 'Grade 4', count: 135 },
        { grade: 'Grade 5', count: 118 },
        { grade: 'Grade 6', count: 120 },
        { grade: 'Grade 7', count: 105 },
        { grade: 'Grade 8', count: 55 },
        { grade: 'Grade 9', count: 58 },
        { grade: 'Grade 10', count: 60 },
    ];

    const maxScale = 160;

    const handleOpenReport = () => {
        if (!selectedReport) {
            alert('Please choose a report from the dropdown list first.');
            return;
        }

        if (selectedReport === 'Daily Attendance Summary') navigate('/attendance');
        else if (selectedReport === 'Fee Defaulters List') navigate('/fees');
        else if (selectedReport === 'Class Strength Report') navigate('/students');
        else if (selectedReport === 'HR & Faculty Register') navigate('/staff');
    };

    return (
        <div className="space-y-6">
            {/* Sub Header (Title & Greeting) */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <p id="viewModuleCategory" className="text-[11px] font-bold uppercase tracking-[.08em] text-[var(--ink-3)]">
                        SCHOOL OVERVIEW
                    </p>
                    <h1 id="viewMainHeading" className="text-[24px] sm:text-[28px] font-bold text-[var(--ink)] tracking-[-.02em] mt-1">
                        Dashboard
                    </h1>
                    <p id="viewSubHeading" className="text-[13px] text-[var(--ink-2)] mt-1">
                        Welcome back, {userName}. Here is your school at a glance.
                    </p>
                </div>
            </div>

            {/* 4 KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Active Students */}
                <div
                    onClick={() => navigate('/students')}
                    className="card p-5 cursor-pointer hover:border-[var(--coral)] transition"
                    title="Click to view Students Directory"
                >
                    <p className="text-[10.5px] font-bold uppercase tracking-[.08em] text-[var(--ink-3)]">
                        ACTIVE STUDENTS
                    </p>
                    <p className="text-[28px] font-bold text-[var(--ink)] tracking-[-.02em] mt-2 leading-none">
                        1,378
                    </p>
                    <p className="text-[12px] text-[var(--ink-2)] mt-2">
                        As of {currentDate}
                    </p>
                </div>

                {/* RTE Students */}
                <div
                    onClick={() => navigate('/students')}
                    className="card p-5 cursor-pointer hover:border-[var(--coral)] transition"
                    title="Click to view RTE Students"
                >
                    <p className="text-[10.5px] font-bold uppercase tracking-[.08em] text-[var(--ink-3)]">
                        RTE STUDENTS
                    </p>
                    <p className="text-[28px] font-bold text-[var(--ink)] tracking-[-.02em] mt-2 leading-none">
                        72
                    </p>
                    <p className="text-[12px] text-[var(--ink-2)] mt-2">
                        Current school records
                    </p>
                </div>

                {/* Teachers */}
                <div
                    onClick={() => navigate('/staff')}
                    className="card p-5 cursor-pointer hover:border-[var(--coral)] transition"
                    title="Click to view Teachers Directory"
                >
                    <p className="text-[10.5px] font-bold uppercase tracking-[.08em] text-[var(--ink-3)]">
                        TEACHERS
                    </p>
                    <p className="text-[28px] font-bold text-[var(--ink)] tracking-[-.02em] mt-2 leading-none">
                        39
                    </p>
                    <p className="text-[12px] text-[var(--ink-2)] mt-2">
                        Teacher accounts
                    </p>
                </div>

                {/* Current Login */}
                <div className="card p-5">
                    <p className="text-[10.5px] font-bold uppercase tracking-[.08em] text-[var(--ink-3)]">
                        CURRENT LOGIN
                    </p>
                    <p className="text-[24px] font-bold text-[var(--ink)] tracking-[-.02em] mt-2 leading-none">
                        {currentDate}
                    </p>
                    <p className="text-[12px] text-[var(--ink-2)] mt-2 flex items-center gap-1.5">
                        <span>{currentTime}</span>
                        <span>·</span>
                        <button
                            type="button"
                            onClick={() => alert(`Active session: ${userName} (Administrator)`)}
                            className="text-[var(--coral-ink)] font-medium hover:underline border-0 bg-transparent p-0 cursor-pointer"
                        >
                            View login history
                        </button>
                    </p>
                </div>
            </div>

            {/* Main Two-Column Grid: Students by Class (col-span-2) + Quick Access (col-span-1) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Students by class */}
                <div className="card p-5 sm:p-6 lg:col-span-2 flex flex-col justify-between">
                    <div>
                        <h2 className="text-[16px] font-bold text-[var(--ink)] tracking-[-.01em]">
                            Students by class
                        </h2>
                        <p className="text-[12.5px] text-[var(--ink-2)] mt-0.5">
                            Enrolled student count for each class
                        </p>
                    </div>

                    {/* Pure CSS & SVG Responsive Bar Chart matching Chart.js */}
                    <div className="mt-6 pt-2">
                        <div className="relative h-[230px] flex items-end justify-between gap-1 sm:gap-2 px-1">
                            {/* Horizontal guide lines */}
                            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
                                {[160, 120, 80, 40, 0].map((val) => (
                                    <div key={val} className="w-full border-b border-[#EFEFED] relative">
                                        <span className="absolute -left-1 -top-2.5 text-[10px] text-[#73736F] font-mono">
                                            {val}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Bar Columns */}
                            <div className="relative z-10 w-full h-[190px] flex items-end justify-between gap-1 sm:gap-2.5 pl-6">
                                {classData.map((item, idx) => {
                                    const heightPct = Math.round((item.count / maxScale) * 100);
                                    const isHovered = hoveredBar === idx;

                                    return (
                                        <div
                                            key={item.grade}
                                            className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                                            onMouseEnter={() => setHoveredBar(idx)}
                                            onMouseLeave={() => setHoveredBar(null)}
                                            onClick={() => navigate('/students')}
                                        >
                                            {/* Tooltip */}
                                            {isHovered && (
                                                <div className="absolute -top-10 z-30 bg-[#202020] text-white text-[11px] font-medium px-2 py-1 rounded shadow-md whitespace-nowrap pointer-events-none animate-in fade-in duration-100">
                                                    {item.grade}: {item.count} students
                                                </div>
                                            )}

                                            {/* The Bar */}
                                            <div
                                                className="w-full max-w-[28px] rounded-t transition-all duration-200"
                                                style={{
                                                    height: `${heightPct}%`,
                                                    backgroundColor: isHovered ? '#1d6399' : '#257CBE',
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* X-axis labels */}
                        <div className="flex items-center justify-between gap-1 sm:gap-2.5 pl-7 pr-1 pt-2 border-t border-[var(--line)]">
                            {classData.map((item) => (
                                <div
                                    key={item.grade}
                                    className="flex-1 text-center truncate text-[10px] sm:text-[11px] text-[#73736F] font-medium"
                                    title={item.grade}
                                >
                                    {item.grade.replace('Grade ', 'G')}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Quick access */}
                <div className="card p-5 sm:p-6 flex flex-col justify-between">
                    <div>
                        <h2 className="text-[16px] font-bold text-[var(--ink)] tracking-[-.01em]">
                            Quick access
                        </h2>
                        <p className="text-[12.5px] text-[var(--ink-2)] mt-0.5">
                            Open a report or school workspace
                        </p>

                        <div className="mt-6">
                            <label className="text-[10.5px] font-bold uppercase tracking-[.08em] text-[var(--ink-3)] block mb-2">
                                REPORTS
                            </label>
                            <div className="relative">
                                <select
                                    id="quickReportSelect"
                                    value={selectedReport}
                                    onChange={(e) => setSelectedReport(e.target.value)}
                                    className="w-full h-10 px-3 pr-8 rounded-lg border border-[var(--line)] bg-white text-[13px] text-[var(--ink)] appearance-none focus:border-[var(--coral)] focus:outline-none cursor-pointer"
                                >
                                    <option value="">Choose a report</option>
                                    <option value="Daily Attendance Summary">Daily Attendance Summary</option>
                                    <option value="Fee Defaulters List">Fee Defaulters List</option>
                                    <option value="Class Strength Report">Class Strength Report</option>
                                    <option value="HR & Faculty Register">HR &amp; Faculty Register</option>
                                </select>
                                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-2)] pointer-events-none" />
                            </div>

                            <button
                                type="button"
                                onClick={handleOpenReport}
                                className="w-full h-10 mt-3 rounded-lg text-white font-medium text-[13px] flex items-center justify-center shadow-sm transition hover:opacity-95 cursor-pointer border-0"
                                style={{ background: 'var(--coral)' }}
                            >
                                Open selected report
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2.5 mt-6 pt-6 border-t border-[var(--line)]">
                        <button
                            type="button"
                            onClick={() => navigate('/staff')}
                            className="w-full h-10 rounded-lg border border-[var(--line)] bg-white text-[13px] font-medium text-[var(--ink)] flex items-center justify-center hover:bg-[var(--hover)] transition"
                        >
                            HR portal
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admissions')}
                            className="w-full h-10 rounded-lg border border-[var(--line)] bg-white text-[13px] font-medium text-[var(--ink)] flex items-center justify-center hover:bg-[var(--hover)] transition"
                        >
                            Aadhar card report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
