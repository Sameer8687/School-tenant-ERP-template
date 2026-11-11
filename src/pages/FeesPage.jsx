import { useState, useMemo } from 'react';
import { Printer, Download, Search, Plus } from 'lucide-react';

export default function FeesPage() {
    const [search, setSearch] = useState('');
    const [showCollectModal, setShowCollectModal] = useState(false);

    const [payments, setPayments] = useState([
        { rcpt: 'RCP-2026-891', studentId: 'S20230014', studentName: 'Shaikh Mohammed Bilal', date: '02 Nov 2026', method: 'UPI / Online', amount: 8500, status: 'Verified' },
        { rcpt: 'RCP-2026-890', studentId: 'S20230022', studentName: 'Khan Fatima Noor', date: '01 Nov 2026', method: 'Cash Counter', amount: 6800, status: 'Verified' },
        { rcpt: 'RCP-2026-889', studentId: 'S20220089', studentName: 'Qureshi Zaid Ahmed', date: '30 Oct 2026', method: 'Bank Transfer', amount: 7000, status: 'Verified' },
        { rcpt: 'RCP-2026-888', studentId: 'S20230045', studentName: 'Ansari Aisha Arif', date: '28 Oct 2026', method: 'UPI / Online', amount: 9200, status: 'Verified' },
        { rcpt: 'RCP-2026-887', studentId: 'S20230062', studentName: 'Patil Reyansh Suresh', date: '26 Oct 2026', method: 'Cheque', amount: 11000, status: 'Verified' },
    ]);

    const [newFee, setNewFee] = useState({
        studentId: 'S20230014',
        studentName: 'Shaikh Mohammed Bilal',
        amount: '8500',
        method: 'UPI / Online',
    });

    const filtered = useMemo(() => {
        if (!search.trim()) return payments;
        const q = search.toLowerCase();
        return payments.filter(
            (p) =>
                p.rcpt.toLowerCase().includes(q) ||
                p.studentId.toLowerCase().includes(q) ||
                p.studentName.toLowerCase().includes(q) ||
                p.method.toLowerCase().includes(q)
        );
    }, [payments, search]);

    const filteredTotal = useMemo(
        () => filtered.reduce((sum, p) => sum + p.amount, 0),
        [filtered]
    );

    const handleRecordPayment = (e) => {
        e.preventDefault();
        const payment = {
            rcpt: `RCP-2026-${Math.floor(892 + Math.random() * 100)}`,
            studentId: newFee.studentId,
            studentName: newFee.studentName,
            date: new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date()),
            method: newFee.method,
            amount: Number(newFee.amount) || 0,
            status: 'Verified',
        };
        setPayments([payment, ...payments]);
        setShowCollectModal(false);
    };

    const exportCSV = () => {
        const headers = ['Receipt No', 'Student ID', 'Student Name', 'Date', 'Method', 'Amount', 'Status'];
        const rows = filtered.map((p) => [p.rcpt, p.studentId, p.studentName, p.date, p.method, `₹ ${p.amount.toLocaleString('en-IN')}`, p.status]);
        const csvContent = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Fee_Collections.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <section id="view-fees" className="card p-5 space-y-4">
            {/* Header with Totals */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
                <div>
                    <h3 className="font-bold text-sm text-gray-900">Fee Collection &amp; Financial Reports</h3>
                    <p className="text-xs text-gray-500">Live transaction records from MySQL <b>sprfees</b> table</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <span className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider block">Filtered Total:</span>
                        <p className="text-base font-bold text-blue-600">₹ {filteredTotal.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="text-right border-l border-gray-200 pl-4">
                        <span className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider block">Total Realized in Batch:</span>
                        <p className="text-lg font-extrabold text-emerald-600">₹ 47,30,000</p>
                    </div>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by receipt no, student name, or ID..."
                        className="w-full h-9 pl-9 pr-3 text-xs rounded-lg border border-[var(--line)] bg-[var(--hover)] focus:bg-white focus:outline-none focus:border-[var(--coral)] transition"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={exportCSV}
                        className="h-8 px-2.5 rounded-lg border border-[var(--line)] bg-white text-xs font-medium text-[var(--ink)] flex items-center gap-1.5 hover:bg-[var(--hover)] transition"
                    >
                        <Download className="w-3.5 h-3.5 text-emerald-700" /> Excel Export
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowCollectModal(true)}
                        className="btn btn-primary btn-sm flex items-center gap-1"
                    >
                        <Plus className="w-3.5 h-3.5" /> Collect Fee
                    </button>
                </div>
            </div>

            {/* Fees Table */}
            <div className="overflow-x-auto">
                <table className="tbl text-xs" id="feesTable">
                    <thead>
                        <tr>
                            <th>Receipt No</th>
                            <th>Student ID &amp; Name</th>
                            <th>Payment Date</th>
                            <th>Payment Method</th>
                            <th>Amount (INR)</th>
                            <th>Status</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((p) => (
                            <tr key={p.rcpt}>
                                <td className="font-bold text-[var(--coral)]">{p.rcpt}</td>
                                <td>
                                    <span className="font-bold text-[var(--ink)]">{p.studentName}</span>
                                    <span className="text-[11px] text-[var(--ink-3)] ml-1.5">({p.studentId})</span>
                                </td>
                                <td>{p.date}</td>
                                <td>
                                    <span className="badge" style={{ background: '#EBF3FA', color: '#257CBE' }}>
                                        {p.method}
                                    </span>
                                </td>
                                <td className="font-bold text-[var(--ink)]">₹ {p.amount.toLocaleString('en-IN')}</td>
                                <td>
                                    <span className="badge b-ok">
                                        <span className="dot" /> {p.status}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <button
                                        type="button"
                                        onClick={() => window.print()}
                                        className="btn btn-secondary btn-sm"
                                        title="Print Receipt"
                                    >
                                        <Printer className="w-3 h-3" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Collect Fee Modal */}
            {showCollectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                    <div className="card w-full max-w-md p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                            <h3 className="font-bold text-sm text-[var(--ink)]">Collect Fee &amp; Generate Receipt</h3>
                            <button
                                type="button"
                                onClick={() => setShowCollectModal(false)}
                                className="text-[var(--ink-2)] hover:text-[var(--ink)] font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
                            <div>
                                <label className="font-semibold block mb-1">Student</label>
                                <select
                                    value={newFee.studentId}
                                    onChange={(e) => {
                                        const id = e.target.value;
                                        const name = id === 'S20230014' ? 'Shaikh Mohammed Bilal' : 'Khan Fatima Noor';
                                        setNewFee({ ...newFee, studentId: id, studentName: name });
                                    }}
                                    className="input"
                                >
                                    <option value="S20230014">Shaikh Mohammed Bilal (S20230014)</option>
                                    <option value="S20230022">Khan Fatima Noor (S20230022)</option>
                                </select>
                            </div>

                            <div>
                                <label className="font-semibold block mb-1">Fee Amount (₹) *</label>
                                <input
                                    type="number"
                                    value={newFee.amount}
                                    onChange={(e) => setNewFee({ ...newFee, amount: e.target.value })}
                                    className="input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="font-semibold block mb-1">Payment Method</label>
                                <select
                                    value={newFee.method}
                                    onChange={(e) => setNewFee({ ...newFee, method: e.target.value })}
                                    className="input"
                                >
                                    <option>UPI / Online</option>
                                    <option>Cash Counter</option>
                                    <option>Bank Transfer</option>
                                    <option>Cheque</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--line)]">
                                <button
                                    type="button"
                                    onClick={() => setShowCollectModal(false)}
                                    className="btn btn-secondary btn-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-sm"
                                >
                                    Issue Receipt
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
