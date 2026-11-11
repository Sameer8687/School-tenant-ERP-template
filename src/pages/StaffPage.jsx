import { useState } from 'react';
import {
    Download,
    Calendar,
    ArrowLeft,
    Printer,
    Search,
} from 'lucide-react';

export default function StaffPage() {
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [search, setSearch] = useState('');

    const teachers = [
        {
            id: 'E20200023',
            name: 'Shaikh Sarfarz Burhanoddin',
            designation: 'Senior Math & Science',
            assigned: 'Grade 8th, Grade 9th (Science, Math)',
            email: 'sarfarz@oliveschool.edu',
            phone: '+91 98765 11122',
            status: 'Active (A)',
        },
        {
            id: 'E20200024',
            name: 'Syed Imran Ali',
            designation: 'English Faculty',
            assigned: 'Grade 9th, Grade 10th (English, Urdu)',
            email: 'imran.ali@oliveschool.edu',
            phone: '+91 98765 11123',
            status: 'Active (A)',
        },
        {
            id: 'E20210035',
            name: 'Ansari Fatima Begum',
            designation: 'Primary In-Charge',
            assigned: 'Grade 3rd, Grade 4th (Social Studies)',
            email: 'fatima.ansari@oliveschool.edu',
            phone: '+91 98765 11124',
            status: 'Active (A)',
        },
        {
            id: 'E20220048',
            name: 'Patil Suresh Madhav',
            designation: 'Physical Education & Sports',
            assigned: 'All Grades (Sports & Activity)',
            email: 'suresh.patil@oliveschool.edu',
            phone: '+91 98765 11125',
            status: 'Active (A)',
        },
    ];

    const filtered = teachers.filter(
        (t) =>
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.id.toLowerCase().includes(search.toLowerCase()) ||
            t.assigned.toLowerCase().includes(search.toLowerCase())
    );

    const exportCSV = () => {
        const headers = ['Teacher ID', 'Full Name', 'Assigned Classes', 'Email', 'Status'];
        const rows = filtered.map((t) => [t.id, t.name, t.assigned, t.email, t.status]);
        const csvContent = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Faculty_Directory.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    // If viewing timetable / dossier:
    if (selectedTeacher) {
        return (
            <section id="view-teacher-profile-view" className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--line-2)]">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSelectedTeacher(null)}
                            className="w-9 h-9 rounded-lg border border-[var(--line)] bg-white flex items-center justify-center text-[var(--ink-2)] hover:text-[var(--ink)] shadow-sm cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div>
                            <span className="badge b-ok text-[10px] uppercase font-bold">
                                <span className="dot" /> Faculty Profile &amp; Timetable
                            </span>
                            <h1 className="text-xl font-bold mt-0.5 text-[var(--ink)]">
                                {selectedTeacher.name} ({selectedTeacher.designation})
                            </h1>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="btn btn-secondary btn-sm flex items-center gap-1.5"
                    >
                        <Printer className="w-3.5 h-3.5" /> Print Schedule
                    </button>
                </div>

                <div className="card p-6 space-y-4">
                    <h3 className="card-title">Daily Period Schedule</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="slot mine now">
                            <div className="slot-time">
                                <b>09:00</b>
                                <span>Period 1</span>
                            </div>
                            <div className="slot-bar" />
                            <div className="text-xs">
                                <p className="font-bold text-[var(--ink)]">Grade 8th - Mathematics</p>
                                <p className="text-[var(--ink-2)]">Room 104 • Algebra &amp; Equations</p>
                                <span className="badge b-ok text-[10px] mt-1">
                                    <span className="dot" /> Ongoing Now
                                </span>
                            </div>
                        </div>

                        <div className="slot mine">
                            <div className="slot-time">
                                <b>10:15</b>
                                <span>Period 2</span>
                            </div>
                            <div className="slot-bar" />
                            <div className="text-xs">
                                <p className="font-bold text-[var(--ink)]">Grade 9th - Science</p>
                                <p className="text-[var(--ink-2)]">Physics Lab</p>
                            </div>
                        </div>

                        <div className="slot other">
                            <div className="slot-time">
                                <b>11:30</b>
                                <span>Break</span>
                            </div>
                            <div className="slot-bar" />
                            <div className="text-xs">
                                <p className="font-bold text-[var(--ink-2)]">Staff Recess</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Main Directory Table
    return (
        <section id="view-teachers" className="card p-5 space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-gray-100">
                <h3 className="font-bold text-sm text-gray-900">Faculty &amp; Teachers Directory</h3>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={exportCSV}
                        className="h-8 px-2.5 rounded-lg border border-[var(--line)] bg-white text-xs font-medium text-[var(--ink)] flex items-center gap-1.5 hover:bg-[var(--hover)] transition"
                    >
                        <Download className="w-3.5 h-3.5 text-emerald-700" /> Excel Export
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by faculty name, employee ID, or subject..."
                    className="w-full h-9 pl-9 pr-8 text-xs rounded-lg border border-[var(--line)] bg-[var(--hover)] focus:bg-white focus:outline-none focus:border-[var(--coral)] transition"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="tbl text-xs" id="teacherTable">
                    <thead>
                        <tr>
                            <th>Teacher ID</th>
                            <th>Teacher Full Name</th>
                            <th>Assigned Classes (spatesd)</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((t) => (
                            <tr key={t.id}>
                                <td className="font-bold text-[var(--coral)]">{t.id}</td>
                                <td className="font-bold text-[var(--ink)]">{t.name}</td>
                                <td style={{ color: 'var(--ink-2)' }}>{t.assigned}</td>
                                <td style={{ color: 'var(--ink-2)' }}>{t.email}</td>
                                <td>
                                    <span className="badge b-ok">
                                        <span className="dot" /> {t.status}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedTeacher(t)}
                                        className="btn btn-secondary btn-sm inline-flex items-center gap-1 cursor-pointer"
                                    >
                                        <Calendar className="w-3 h-3" /> Timetable
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
