import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, UserPlus, List } from 'lucide-react';

export default function AdmissionsPage() {
    const navigate = useNavigate();
    const [savedNotice, setSavedNotice] = useState(false);
    const [viewTab, setViewTab] = useState('form'); // 'form' | 'list'

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        fatherName: '',
        dob: '2014-06-15',
        standard: 'Grade 8th',
        section: 'Section A',
        phone: '',
        address: '',
    });

    const [applications, setApplications] = useState([
        { id: 'ADM-2026-001', name: 'Mohammed Bilal', standard: 'Grade 8th', guardian: 'Abdul Qadir', phone: '+91 98765 43210', date: '28 Oct 2026', status: 'Approved' },
        { id: 'ADM-2026-002', name: 'Fatima Noor Khan', standard: 'Grade 5th', guardian: 'Tariq Noor', phone: '+91 98765 43211', date: '30 Oct 2026', status: 'Applied' },
        { id: 'ADM-2026-003', name: 'Zaid Ahmed Qureshi', standard: 'Grade 2nd', guardian: 'Ahmed Qureshi', phone: '+91 98765 43212', date: '01 Nov 2026', status: 'Enquiry' },
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newApp = {
            id: `ADM-2026-${String(applications.length + 1).padStart(3, '0')}`,
            name: `${form.firstName} ${form.lastName}`.trim() || 'New Applicant',
            standard: form.standard,
            guardian: form.fatherName || 'Parent',
            phone: form.phone || '+91 98765 00000',
            date: new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date()),
            status: 'Applied',
        };

        setApplications([newApp, ...applications]);
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 3500);

        // Reset
        setForm({
            firstName: '',
            lastName: '',
            fatherName: '',
            dob: '2014-06-15',
            standard: 'Grade 8th',
            section: 'Section A',
            phone: '',
            address: '',
        });
    };

    return (
        <div className="space-y-6">
            {/* View Switcher Bar */}
            <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-[var(--line-2)]">
                <div>
                    <h2 className="text-xl font-bold text-[var(--ink)]">Admissions &amp; Registration</h2>
                    <p className="text-xs text-[var(--ink-2)] mt-0.5">Manage new admissions and candidate applications</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setViewTab('form')}
                        className={`btn btn-sm ${viewTab === 'form' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        <UserPlus className="w-3.5 h-3.5" /> Admission Form
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewTab('list')}
                        className={`btn btn-sm ${viewTab === 'list' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        <List className="w-3.5 h-3.5" /> Enquiries ({applications.length})
                    </button>
                </div>
            </div>

            {savedNotice && (
                <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs flex items-center justify-between shadow-xs animate-in fade-in">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold">Student Admission Record Saved into database!</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSavedNotice(false)}
                        className="text-emerald-700 hover:text-emerald-900 font-bold"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* VIEW 8: ADMISSION FORM (Matching template exactly) */}
            {viewTab === 'form' && (
                <section id="view-student-admission" className="card p-6 space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                        <div>
                            <h3 className="text-base font-bold text-[var(--ink)]">Student Admission Form</h3>
                            <p className="text-xs text-[var(--ink-2)] mt-0.5">
                                Register new student candidate into spriden and stvclas tables
                            </p>
                        </div>
                        <span className="badge b-ok text-[11px]">
                            <span className="dot" />
                            UI Form Ready
                        </span>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                            <div>
                                <label className="font-semibold block mb-1 text-[var(--ink)]">First Name *</label>
                                <input
                                    type="text"
                                    value={form.firstName}
                                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                    className="input"
                                    placeholder="e.g. Mohammed"
                                    required
                                />
                            </div>
                            <div>
                                <label className="font-semibold block mb-1 text-[var(--ink)]">Surname / Last Name *</label>
                                <input
                                    type="text"
                                    value={form.lastName}
                                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                    className="input"
                                    placeholder="e.g. Bilal"
                                    required
                                />
                            </div>
                            <div>
                                <label className="font-semibold block mb-1 text-[var(--ink)]">Father Name *</label>
                                <input
                                    type="text"
                                    value={form.fatherName}
                                    onChange={(e) => setForm({ ...form, fatherName: e.target.value })}
                                    className="input"
                                    placeholder="e.g. Abdul Qadir"
                                    required
                                />
                            </div>
                            <div>
                                <label className="font-semibold block mb-1 text-[var(--ink)]">Date of Birth *</label>
                                <input
                                    type="date"
                                    value={form.dob}
                                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                                    className="input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="font-semibold block mb-1 text-[var(--ink)]">Standard / Class *</label>
                                <select
                                    value={form.standard}
                                    onChange={(e) => setForm({ ...form, standard: e.target.value })}
                                    className="input"
                                    required
                                >
                                    <option value="">Select Standard</option>
                                    <option>Grade 1st</option>
                                    <option>Grade 2nd</option>
                                    <option>Grade 5th</option>
                                    <option>Grade 8th</option>
                                    <option>Grade 10th</option>
                                </select>
                            </div>
                            <div>
                                <label className="font-semibold block mb-1 text-[var(--ink)]">Section</label>
                                <select
                                    value={form.section}
                                    onChange={(e) => setForm({ ...form, section: e.target.value })}
                                    className="input"
                                >
                                    <option>Section A</option>
                                    <option>Section B</option>
                                </select>
                            </div>
                            <div>
                                <label className="font-semibold block mb-1 text-[var(--ink)]">Primary Mobile Number *</label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className="input"
                                    placeholder="+91 98765 00000"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="font-semibold block mb-1 text-[var(--ink)]">Residential Address</label>
                                <input
                                    type="text"
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    className="input"
                                    placeholder="House / Flat No, Street, Landmark, City"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-[var(--line)]">
                            <button
                                type="button"
                                onClick={() => navigate('/students')}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Save Student Record
                            </button>
                        </div>
                    </form>
                </section>
            )}

            {/* Applications List Table */}
            {viewTab === 'list' && (
                <section className="card p-5 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <h3 className="font-bold text-sm text-gray-900">Enquiries &amp; Applicants</h3>
                        <span className="text-xs text-gray-500">{applications.length} applications logged</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="tbl text-xs">
                            <thead>
                                <tr>
                                    <th>App No</th>
                                    <th>Candidate</th>
                                    <th>Grade</th>
                                    <th>Guardian</th>
                                    <th>Contact</th>
                                    <th>Applied Date</th>
                                    <th className="text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((app) => (
                                    <tr key={app.id}>
                                        <td className="font-bold text-[var(--coral)]">{app.id}</td>
                                        <td className="font-bold text-[var(--ink)]">{app.name}</td>
                                        <td>
                                            <span className="badge" style={{ background: '#EBF3FA', color: '#257CBE' }}>
                                                {app.standard}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--ink-2)' }}>{app.guardian}</td>
                                        <td style={{ color: 'var(--ink-2)' }}>{app.phone}</td>
                                        <td style={{ color: 'var(--ink-3)' }}>{app.date}</td>
                                        <td className="text-right">
                                            <span className={`badge ${app.status === 'Approved' ? 'b-ok' : app.status === 'Applied' ? 'b-warn' : 'b-mut'}`}>
                                                <span className="dot" />
                                                {app.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </div>
    );
}
