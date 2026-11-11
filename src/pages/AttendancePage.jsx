import { useState } from 'react';
import { CheckCircle2, Calendar } from 'lucide-react';

export default function AttendancePage() {
    const [selectedDate, setSelectedDate] = useState('2026-11-03');
    const [standard, setStandard] = useState('Grade 8th - Section A');
    const [savedNotice, setSavedNotice] = useState(false);

    const [roster, setRoster] = useState([
        { roll: '01', adm: 'S20230014', name: 'Shaikh Mohammed Bilal', cls: 'Grade 8 - A', status: 'P' },
        { roll: '02', adm: 'S20230018', name: 'Ansari Zaid Farhan', cls: 'Grade 8 - A', status: 'P' },
        { roll: '03', adm: 'S20230025', name: 'Khan Fatima Noor', cls: 'Grade 8 - A', status: 'P' },
        { roll: '04', adm: 'S20230031', name: 'Qureshi Ayesha Imran', cls: 'Grade 8 - A', status: 'A' },
        { roll: '05', adm: 'S20230044', name: 'Patil Reyansh Suresh', cls: 'Grade 8 - A', status: 'P' },
        { roll: '06', adm: 'S20230052', name: 'Shaikh Sarah Danish', cls: 'Grade 8 - A', status: 'L' },
    ]);

    const setStatus = (adm, st) => {
        setRoster((prev) =>
            prev.map((r) => (r.adm === adm ? { ...r, status: st } : r))
        );
    };

    const markAll = (st) => {
        setRoster((prev) => prev.map((r) => ({ ...r, status: st })));
    };

    const handleSave = () => {
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 3000);
    };

    const presentCount = roster.filter((r) => r.status === 'P').length;
    const absentCount = roster.filter((r) => r.status === 'A').length;

    return (
        <section id="view-student-attendance" className="card p-5 space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
                <div>
                    <h3 className="font-bold text-sm text-gray-900">Daily Attendance Register</h3>
                    <p className="text-xs text-gray-500">Classroom Roll Call &amp; Attendance Logging</p>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="input h-8 text-xs w-36"
                    />
                    <button
                        type="button"
                        onClick={handleSave}
                        className="btn btn-primary btn-sm"
                    >
                        Save Register
                    </button>
                </div>
            </div>

            {savedNotice && (
                <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs flex items-center justify-between shadow-xs animate-in fade-in">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold">Attendance Saved to Database for {selectedDate}!</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSavedNotice(false)}
                        className="text-emerald-700 font-bold"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Standard Filter & Bulk Actions Bar */}
            <div className="flex items-center justify-between gap-3 text-xs bg-[var(--surface)] p-3 rounded-xl border border-[var(--line)] flex-wrap">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--ink)]">Standard:</span>
                    <select
                        value={standard}
                        onChange={(e) => setStandard(e.target.value)}
                        className="input h-8 text-xs w-48 bg-white"
                    >
                        <option>Grade 8th - Section A</option>
                        <option>Grade 8th - Section B</option>
                        <option>Grade 9th - Section A</option>
                        <option>Grade 10th - Section A</option>
                    </select>
                    <span className="text-[11px] text-[var(--ink-3)] ml-2">
                        Present: <b className="text-emerald-700">{presentCount}</b> · Absent: <b className="text-red-700">{absentCount}</b>
                    </span>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => markAll('P')}
                        className="btn btn-secondary btn-sm"
                    >
                        Mark All Present
                    </button>
                    <button
                        type="button"
                        onClick={() => markAll('A')}
                        className="btn btn-secondary btn-sm"
                    >
                        Mark All Absent
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="tbl text-xs" id="attTable">
                    <thead>
                        <tr>
                            <th>Roll</th>
                            <th>Admission No</th>
                            <th>Student Full Name</th>
                            <th>Class &amp; Sec</th>
                            <th>Attendance Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roster.map((row) => (
                            <tr key={row.adm}>
                                <td className="font-bold">{row.roll}</td>
                                <td className="font-mono text-gray-500">{row.adm}</td>
                                <td className="font-bold text-[var(--ink)]">{row.name}</td>
                                <td>
                                    <span className="badge" style={{ background: '#EBF3FA', color: '#257CBE' }}>
                                        {row.cls}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => setStatus(row.adm, 'P')}
                                            className={`btn btn-sm ${
                                                row.status === 'P'
                                                    ? 'btn-primary'
                                                    : 'btn-secondary'
                                            }`}
                                        >
                                            Present
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setStatus(row.adm, 'A')}
                                            className={`btn btn-sm ${
                                                row.status === 'A'
                                                    ? 'btn-secondary bg-red-100 text-red-700 border-red-200'
                                                    : 'btn-secondary'
                                            }`}
                                        >
                                            Absent
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setStatus(row.adm, 'L')}
                                            className={`btn btn-sm ${
                                                row.status === 'L'
                                                    ? 'btn-secondary bg-amber-100 text-amber-800 border-amber-200'
                                                    : 'btn-secondary'
                                            }`}
                                        >
                                            Late
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
