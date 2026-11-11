import { useState, useMemo } from 'react';
import {
    FileText,
    Plus,
    Calendar,
    Users,
    CheckCircle2,
    Clock,
    Search,
    Download,
    Eye,
    Upload,
    Paperclip,
    AlertCircle,
    X,
    Filter,
} from 'lucide-react';
import { initialHomework, mockSubmissions } from '../data/homework.mock';

export default function HomeworkPage() {
    const [assignments, setAssignments] = useState(initialHomework);
    const [submissions, setSubmissions] = useState(mockSubmissions);
    const [search, setSearch] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [evaluatingStudent, setEvaluatingStudent] = useState(null);
    const [toastMessage, setToastMessage] = useState('');

    const [newForm, setNewForm] = useState({
        title: '',
        subject: 'Mathematics',
        className: 'Grade 8',
        section: 'A',
        assignedBy: 'Rahul Patil',
        dueDate: '2026-11-20',
        priority: 'High',
        description: '',
    });

    const [gradeForm, setGradeForm] = useState({
        score: '19/20',
        feedback: 'Good presentation of solutions.',
    });

    const filtered = useMemo(() => {
        return assignments.filter((item) => {
            const matchesSearch =
                item.title.toLowerCase().includes(search.toLowerCase()) ||
                item.subject.toLowerCase().includes(search.toLowerCase()) ||
                item.assignedBy.toLowerCase().includes(search.toLowerCase());
            const matchesSubject = subjectFilter === 'All' || item.subject === subjectFilter;
            const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
            return matchesSearch && matchesSubject && matchesStatus;
        });
    }, [assignments, search, subjectFilter, statusFilter]);

    const activeCount = assignments.filter((a) => a.status === 'Active').length;
    const completedCount = assignments.filter((a) => a.status === 'Completed' || a.status === 'Evaluated').length;

    const handleCreateAssignment = (e) => {
        e.preventDefault();
        const newEntry = {
            id: `HW-${Math.floor(106 + Math.random() * 50)}`,
            ...newForm,
            assignedDate: new Intl.DateTimeFormat('en-CA').format(new Date()),
            totalSubmissions: 0,
            evaluatedSubmissions: 0,
            totalStudents: 42,
            status: 'Active',
            attachments: ['Assignment_Brief.pdf'],
        };

        setAssignments([newEntry, ...assignments]);
        setShowCreateModal(false);
        setToastMessage(`Assignment "${newForm.title}" published successfully!`);
        setTimeout(() => setToastMessage(''), 3000);

        setNewForm({
            title: '',
            subject: 'Mathematics',
            className: 'Grade 8',
            section: 'A',
            assignedBy: 'Rahul Patil',
            dueDate: '2026-11-20',
            priority: 'High',
            description: '',
        });
    };

    const handleSaveGrade = (e) => {
        e.preventDefault();
        if (!evaluatingStudent) return;
        setSubmissions((prev) =>
            prev.map((s) =>
                s.id === evaluatingStudent.id
                    ? { ...s, score: gradeForm.score, feedback: gradeForm.feedback, status: 'Graded' }
                    : s
            )
        );
        setToastMessage(`Grade awarded for ${evaluatingStudent.studentName}`);
        setEvaluatingStudent(null);
        setTimeout(() => setToastMessage(''), 3000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#257cbe]" />
                        Homework &amp; Assignments
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Create coursework tasks, track student submissions, and manage digital gradebook evaluations
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={() => setShowCreateModal(true)}
                        className="h-8 px-3 rounded-lg bg-[#257cbe] hover:bg-[#1b6299] text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                    >
                        <Plus className="w-3.5 h-3.5" /> Post Assignment
                    </button>
                </div>
            </div>

            {/* Quick KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase">Total Tasks</div>
                    <div className="text-xl font-bold text-slate-900 mt-1">{assignments.length}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Across current term</div>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
                    <div className="text-[11px] font-semibold text-amber-600 uppercase">Active / Open</div>
                    <div className="text-xl font-bold text-amber-600 mt-1">{activeCount}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Submissions in progress</div>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
                    <div className="text-[11px] font-semibold text-emerald-600 uppercase">Evaluated</div>
                    <div className="text-xl font-bold text-emerald-600 mt-1">{completedCount}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Feedback released</div>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
                    <div className="text-[11px] font-semibold text-blue-600 uppercase">Avg Submission Rate</div>
                    <div className="text-xl font-bold text-blue-600 mt-1">89.4%</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Grade 8 Cohort</div>
                </div>
            </div>

            {/* Notification Toast */}
            {toastMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    {toastMessage}
                </div>
            )}

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
                <div className="relative flex-1 min-w-[220px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search assignments by title, subject or teacher..."
                        className="w-full h-8 pl-9 pr-3 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#257cbe]"
                    />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <select
                        value={subjectFilter}
                        onChange={(e) => setSubjectFilter(e.target.value)}
                        className="h-8 px-2.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700"
                    >
                        <option value="All">All Subjects</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Science">Science</option>
                        <option value="Social Studies">Social Studies</option>
                        <option value="English Literature">English Literature</option>
                        <option value="Computer Science">Computer Science</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-8 px-2.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active / Open</option>
                        <option value="Completed">Completed</option>
                        <option value="Evaluated">Evaluated</option>
                    </select>
                </div>
            </div>

            {/* Assignments Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((item) => (
                    <div
                        key={item.id}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition"
                    >
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-700 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                                    {item.subject} • {item.className}-{item.section}
                                </span>
                                <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                        item.status === 'Active'
                                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    }`}
                                >
                                    {item.status}
                                </span>
                            </div>

                            <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.title}</h3>

                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                {item.description}
                            </p>

                            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-slate-400" /> Due: {item.dueDate}
                                    </span>
                                    <span className="font-medium text-slate-700">By: {item.assignedBy}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3 h-3 text-slate-400" /> Submissions: {item.totalSubmissions}/{item.totalStudents}
                                    </span>
                                    <span className="text-emerald-600 font-semibold">
                                        {Math.round((item.totalSubmissions / item.totalStudents) * 100)}% turned in
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex items-center gap-2 mt-2">
                            <button
                                type="button"
                                onClick={() => setSelectedAssignment(item)}
                                className="flex-1 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                            >
                                <Eye className="w-3.5 h-3.5" /> Submissions &amp; Grading
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Submissions & Gradebook Modal */}
            {selectedAssignment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">
                                    {selectedAssignment.title}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {selectedAssignment.subject} • {selectedAssignment.className}-{selectedAssignment.section} • Due: {selectedAssignment.dueDate}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedAssignment(null)}
                                className="text-slate-400 hover:text-slate-600 transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-5 overflow-y-auto space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                    Class Student Submissions ({submissions.length})
                                </h4>
                                <span className="text-xs text-slate-500 font-medium">Click "Evaluate" to award marks &amp; notes</span>
                            </div>

                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                                    <tr>
                                        <th className="p-2.5">Roll / Adm</th>
                                        <th className="p-2.5">Student Name</th>
                                        <th className="p-2.5">Turned In</th>
                                        <th className="p-2.5">Status</th>
                                        <th className="p-2.5">Score</th>
                                        <th className="p-2.5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {submissions.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-slate-50 transition">
                                            <td className="p-2.5 font-bold text-slate-800">
                                                #{sub.rollNo} <span className="font-normal text-slate-500">({sub.admNo})</span>
                                            </td>
                                            <td className="p-2.5 font-semibold text-slate-900">{sub.studentName}</td>
                                            <td className="p-2.5 text-slate-600">{sub.submittedAt || '—'}</td>
                                            <td className="p-2.5">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                        sub.status === 'Graded'
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : sub.status === 'Pending Review'
                                                            ? 'bg-amber-50 text-amber-700'
                                                            : 'bg-rose-50 text-rose-700'
                                                    }`}
                                                >
                                                    {sub.status}
                                                </span>
                                            </td>
                                            <td className="p-2.5 font-bold text-slate-800">{sub.score}</td>
                                            <td className="p-2.5 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEvaluatingStudent(sub);
                                                        setGradeForm({
                                                            score: sub.score !== '-' ? sub.score : '18/20',
                                                            feedback: sub.feedback || 'Good effort.',
                                                        });
                                                    }}
                                                    className="px-2.5 py-1 rounded-md bg-[#257cbe] hover:bg-[#1b6299] text-white text-[11px] font-semibold transition"
                                                >
                                                    Evaluate
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedAssignment(null)}
                                className="px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-white"
                            >
                                Close Window
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Evaluate Single Student Drawer */}
            {evaluatingStudent && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200 overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-sm font-bold text-slate-900">
                                Grade Submission: {evaluatingStudent.studentName}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setEvaluatingStudent(null)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveGrade} className="p-5 space-y-4 text-xs">
                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">Score / Marks</label>
                                <input
                                    type="text"
                                    value={gradeForm.score}
                                    onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })}
                                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200"
                                    placeholder="e.g. 19/20 or 95%"
                                    required
                                />
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">Teacher Feedback &amp; Remarks</label>
                                <textarea
                                    value={gradeForm.feedback}
                                    onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                                    rows={3}
                                    className="w-full p-2.5 rounded-lg border border-slate-200"
                                    placeholder="Write encouragement and constructive notes..."
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setEvaluatingStudent(null)}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                                >
                                    Save Grade
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Assignment Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Plus className="w-4 h-4 text-[#257cbe]" /> Create New Coursework Assignment
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowCreateModal(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateAssignment} className="p-5 space-y-3.5 text-xs">
                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">Assignment Title</label>
                                <input
                                    type="text"
                                    value={newForm.title}
                                    onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                                    placeholder="e.g. Chapter 4 Trigonometry Problem Set"
                                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-semibold text-slate-700 block mb-1">Subject</label>
                                    <select
                                        value={newForm.subject}
                                        onChange={(e) => setNewForm({ ...newForm, subject: e.target.value })}
                                        className="w-full h-8 px-2.5 rounded-lg border border-slate-200"
                                    >
                                        <option value="Mathematics">Mathematics</option>
                                        <option value="Science">Science</option>
                                        <option value="Social Studies">Social Studies</option>
                                        <option value="English Literature">English Literature</option>
                                        <option value="Computer Science">Computer Science</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="font-semibold text-slate-700 block mb-1">Submission Deadline</label>
                                    <input
                                        type="date"
                                        value={newForm.dueDate}
                                        onChange={(e) => setNewForm({ ...newForm, dueDate: e.target.value })}
                                        className="w-full h-8 px-2.5 rounded-lg border border-slate-200"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">Instructions &amp; Requirements</label>
                                <textarea
                                    value={newForm.description}
                                    onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                                    rows={3}
                                    placeholder="Detail the questions, formatting instructions and grading rubrics..."
                                    className="w-full p-2.5 rounded-lg border border-slate-200"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 rounded-lg bg-[#257cbe] hover:bg-[#1b6299] text-white font-semibold"
                                >
                                    Publish to Class
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
