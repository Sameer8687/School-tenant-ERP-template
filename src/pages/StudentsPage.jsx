import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Download,
    Eye,
    ArrowLeft,
    Printer,
    CreditCard,
    Plus,
} from 'lucide-react';

import { initialStudents } from '../data/students.mock';

export default function StudentsPage() {
    const navigate = useNavigate();
    const [students] = useState(() => initialStudents.map((item) => ({ ...item })));
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'A' | 'I'
    const [selectedStudent, setSelectedStudent] = useState(null);

    const filtered = useMemo(() => {
        let list = students;
        if (statusFilter === 'A') list = list.filter((s) => s.status === 'Active');
        if (statusFilter === 'I') list = list.filter((s) => s.status === 'Inactive');

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (s) =>
                    s.firstName?.toLowerCase().includes(q) ||
                    s.lastName?.toLowerCase().includes(q) ||
                    s.admissionNo?.toLowerCase().includes(q) ||
                    s.className?.toLowerCase().includes(q)
            );
        }
        return list;
    }, [students, statusFilter, search]);

    const activeCount = useMemo(() => students.filter((s) => s.status === 'Active').length, [students]);
    const inactiveCount = useMemo(() => students.filter((s) => s.status === 'Inactive').length, [students]);

    const exportCSV = () => {
        const headers = ['Admission No', 'Student Name', 'Roll No', 'Class', 'Section', 'Status'];
        const rows = filtered.map((s) => [
            s.admissionNo,
            `${s.firstName} ${s.lastName}`,
            s.rollNo || '01',
            `Grade ${s.className}`,
            s.section || 'A',
            s.status,
        ]);
        const csvContent = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Students_Directory.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    // If a student dossier is open:
    if (selectedStudent) {
        return (
            <section id="view-student-profile-view" className="space-y-6">
                {/* Dossier Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--line-2)]">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSelectedStudent(null)}
                            className="w-9 h-9 rounded-lg border border-[var(--line)] bg-white flex items-center justify-center text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--hover)] transition shadow-sm border-0 cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="badge b-ok font-bold uppercase tracking-wider text-[10px]">
                                    Student Master Dossier
                                </span>
                                <span className="text-xs text-[var(--ink-3)] font-mono">
                                    {selectedStudent.admissionNo}
                                </span>
                            </div>
                            <h1 className="text-xl font-bold text-[var(--ink)] mt-0.5">
                                {selectedStudent.firstName} {selectedStudent.lastName}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="btn btn-secondary btn-sm"
                        >
                            <Printer className="w-3.5 h-3.5" /> Print Dossier
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/fees')}
                            className="btn btn-primary btn-sm"
                        >
                            <CreditCard className="w-3.5 h-3.5" /> Collect Fee
                        </button>
                    </div>
                </div>

                {/* 4 Financial / Clearance KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="card p-4">
                        <p className="text-[10px] font-bold text-[var(--ink-3)] uppercase tracking-wider">Annual Target Fee</p>
                        <p className="text-xl font-bold text-[var(--ink)] mt-1">₹ 18,000</p>
                    </div>
                    <div className="card p-4">
                        <p className="text-[10px] font-bold text-[var(--ink-3)] uppercase tracking-wider">Total Paid</p>
                        <p className="text-xl font-bold text-emerald-700 mt-1">₹ 18,000</p>
                    </div>
                    <div className="card p-4">
                        <p className="text-[10px] font-bold text-[var(--ink-3)] uppercase tracking-wider">Balance Due</p>
                        <p className="text-xl font-bold text-amber-700 mt-1">₹ 0</p>
                    </div>
                    <div className="card p-4">
                        <p className="text-[10px] font-bold text-[var(--ink-3)] uppercase tracking-wider">Clearance Status</p>
                        <p className="text-xl font-bold text-emerald-700 mt-1">100% Cleared</p>
                    </div>
                </div>

                {/* Timeline & Fee Installments */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Academic Progression History */}
                    <div className="card p-5">
                        <h4 className="font-bold text-sm text-[var(--ink)] mb-3">Academic Progression History</h4>
                        <div className="tl space-y-3 text-xs">
                            <div className="tl-i">
                                <div className="font-bold text-[var(--ink)]">
                                    Grade {selectedStudent.className || '8th'} - Sec {selectedStudent.section || 'A'} (Current)
                                </div>
                                <div className="text-[var(--ink-2)]">Academic Year: 2026-27 • Roll: {selectedStudent.rollNo || '01'}</div>
                            </div>
                            <div className="tl-i">
                                <div className="font-bold text-[var(--ink)]">
                                    Grade {Math.max(1, (parseInt(selectedStudent.className) || 8) - 1)}th - Sec A
                                </div>
                                <div className="text-[var(--ink-2)]">Academic Year: 2025-26 • Promoted</div>
                            </div>
                        </div>
                    </div>

                    {/* Fee Installments */}
                    <div className="card p-5 lg:col-span-2">
                        <h4 className="font-bold text-sm text-[var(--ink)] mb-3">Fee Installments from MySQL sprfees</h4>
                        <table className="tbl text-xs">
                            <thead>
                                <tr>
                                    <th>Receipt No</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Mode</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="font-bold text-[var(--coral)]">RCP-2026-104</td>
                                    <td>15 Oct 2026</td>
                                    <td className="font-bold text-[var(--ink)]">₹ 9,000</td>
                                    <td>UPI / Online</td>
                                    <td className="text-right">
                                        <button
                                            type="button"
                                            onClick={() => window.print()}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            <Printer className="w-3 h-3" />
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-bold text-[var(--coral)]">RCP-2026-042</td>
                                    <td>10 Jul 2026</td>
                                    <td className="font-bold text-[var(--ink)]">₹ 9,000</td>
                                    <td>Cash Counter</td>
                                    <td className="text-right">
                                        <button
                                            type="button"
                                            onClick={() => window.print()}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            <Printer className="w-3 h-3" />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        );
    }

    // Main Students Master Directory Table View (Matching View 2)
    return (
        <section id="view-students" className="card p-5 space-y-4">
            {/* Header Strip */}
            <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-gray-900">Students Master Directory</h3>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Status Filter Toggle Pills */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Status:</span>
                        <div className="inline-flex p-0.5 rounded-lg bg-gray-100 border border-gray-200 text-xs">
                            <button
                                type="button"
                                onClick={() => setStatusFilter('all')}
                                className={`px-2.5 py-1 rounded-md transition ${
                                    statusFilter === 'all'
                                        ? 'font-bold bg-white text-gray-900 shadow-xs'
                                        : 'font-medium text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                All ({students.length.toLocaleString()})
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('A')}
                                className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition ${
                                    statusFilter === 'A'
                                        ? 'font-bold bg-white text-gray-900 shadow-xs'
                                        : 'font-medium text-gray-600 hover:text-emerald-700'
                                }`}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Active (A) ({activeCount})
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('I')}
                                className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition ${
                                    statusFilter === 'I'
                                        ? 'font-bold bg-white text-gray-900 shadow-xs'
                                        : 'font-medium text-gray-600 hover:text-amber-800'
                                }`}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                Inactive (I) ({inactiveCount})
                            </button>
                        </div>
                    </div>

                    {/* Export and Add Student buttons */}
                    <button
                        type="button"
                        onClick={exportCSV}
                        className="h-8 px-2.5 rounded-lg border border-[var(--line)] bg-white text-xs font-medium text-[var(--ink)] flex items-center gap-1.5 hover:bg-[var(--hover)] transition"
                    >
                        <Download className="w-3.5 h-3.5 text-emerald-700" /> Excel Export
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admissions')}
                        className="btn btn-primary btn-sm flex items-center gap-1"
                    >
                        <Plus className="w-3.5 h-3.5" /> New Student
                    </button>
                </div>
            </div>

            {/* Search Input matching HTML */}
            <div className="relative w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Type student name or ID to search across database..."
                    className="w-full h-9 pl-9 pr-8 text-xs rounded-lg border border-[var(--line)] bg-[var(--hover)] focus:bg-white focus:outline-none focus:border-[var(--coral)] transition"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="tbl text-xs" id="studentTable">
                    <thead>
                        <tr>
                            <th>Adm No</th>
                            <th>Student Name</th>
                            <th>Roll</th>
                            <th>Standard &amp; Section</th>
                            <th>Academic Session</th>
                            <th>Status</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-8 text-slate-400">
                                    No students matching criteria found
                                </td>
                            </tr>
                        ) : (
                            filtered.map((s) => {
                                const isActive = s.status === 'Active';
                                return (
                                    <tr key={s.id || s.admissionNo}>
                                        <td className="font-bold text-[var(--coral)]">{s.admissionNo}</td>
                                        <td className="font-bold text-[var(--ink)]">{s.firstName} {s.lastName}</td>
                                        <td>{s.rollNo || '01'}</td>
                                        <td>
                                            <span
                                                className="badge font-medium"
                                                style={{ background: '#EBF3FA', color: '#257CBE' }}
                                            >
                                                Grade {s.className || '8th'} - Sec {s.section || 'A'}
                                            </span>
                                        </td>
                                        <td>2026-27</td>
                                        <td>
                                            <span className={`badge ${isActive ? 'b-ok' : 'b-warn'}`}>
                                                <span className="dot" />
                                                {isActive ? 'Active (A)' : 'Inactive (I)'}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedStudent(s)}
                                                className="btn btn-secondary btn-sm inline-flex items-center gap-1 cursor-pointer"
                                            >
                                                <Eye className="w-3 h-3" />
                                                <span>View Student</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
