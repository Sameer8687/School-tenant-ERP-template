
import { useMemo, useState } from 'react';
import {
    ArrowDownToLine, ArrowRight, Award, BookOpen,
    CalendarDays, Check, CheckCircle2, ChevronDown,
    ClipboardCheck, Clock3, FileText, GraduationCap,
    Medal, Pencil, Plus, Printer, Search, Sparkles,
    TrendingUp, UsersRound, X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

import {
    examStudents, examSubjects, initialExams,
    initialMarks, examClasses, getGrade, formatExamDate,
} from '../data/examinations.mock';
import '../styles/erp-compact.css';

const STORAGE_KEY = 'olive-examinations-demo-v1';
const BLUE = '#257cbe';

const subjectName = (id) =>
    examSubjects.find((s) => s.id === id)?.name || id;

function readStore() {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
        if (Array.isArray(data?.exams) && Array.isArray(data?.marks)) {
            return data;
        }
    } catch {
        // Use demo records if stored JSON is invalid.
    }
    return { exams: initialExams, marks: initialMarks };
}

function downloadCsv(filename, rows) {
    const csv = rows.map((row) =>
        row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')
    ).join('\r\n');

    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], {
        type: 'text/csv;charset=utf-8',
    }));

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const selectClass =
    'h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#257cbe] focus:ring-2 focus:ring-blue-100';

function Surface({ children, className = '' }) {
    return (
        <Card className={`gap-0 overflow-hidden rounded-[24px] border-slate-200/70 bg-white py-0 shadow-[0_10px_35px_-24px_rgba(15,23,42,.28)] ${className}`}>
            <CardContent className="p-0">{children}</CardContent>
        </Card>
    );
}

function Stat({ title, value, detail, icon: Icon, accent, soft }) {
    return (
        <div className="group rounded-[22px] border border-slate-200/70 bg-white p-5 shadow-[0_8px_30px_-20px_rgba(15,23,42,.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-start justify-between">
                <p className="text-xs font-semibold text-slate-500">{title}</p>
                <span
                    className="grid size-11 place-items-center rounded-2xl"
                    style={{ color: accent, background: soft }}
                >
                    <Icon size={21} />
                </span>
            </div>
            <p className="mt-2 text-[30px] font-bold tracking-tight text-slate-900">
                {value}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <span className="size-2 rounded-full" style={{ background: accent }} />
                {detail}
            </div>
        </div>
    );
}

function ExamStatus({ status }) {
    const completed = status === 'Completed';
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${completed
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-blue-50 text-[#257cbe]'
            }`}>
            <span className="size-1.5 rounded-full bg-current" />
            {status}
        </span>
    );
}

function Modal({ title, subtitle, onClose, children }) {
    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
            onMouseDown={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className="max-h-[94vh] w-full max-w-xl overflow-y-auto rounded-[26px] bg-white shadow-2xl"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-6">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
                    </div>
                    <button onClick={onClose} aria-label="Close" className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
                        <X size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

function ExamForm({ initial, onSave, onClose }) {
    const [form, setForm] = useState(initial || {
        name: '',
        className: '8',
        subjectId: 'ENG',
        date: '',
        startTime: '09:00',
        duration: 120,
        maxMarks: 100,
        passMarks: 35,
        status: 'Scheduled',
    });

    const [error, setError] = useState('');

    function submit(e) {
        e.preventDefault();

        const values = {
            ...form,
            name: form.name.trim(),
            duration: Number(form.duration),
            maxMarks: Number(form.maxMarks),
            passMarks: Number(form.passMarks),
        };

        if (!values.name || !values.date || !values.startTime) {
            setError('Please complete all required fields.');
            return;
        }
        if (values.duration <= 0 || values.maxMarks <= 0 ||
            values.passMarks < 0 || values.passMarks > values.maxMarks) {
            setError('Check duration, maximum marks and passing marks.');
            return;
        }

        const result = onSave(values);
        if (result) setError(result);
    }

    const labelClass = 'mb-1.5 block text-xs font-semibold text-slate-600';

    return (
        <Modal
            title={initial ? 'Edit Examination' : 'Create Examination'}
            subtitle="Configure a subject examination and its schedule."
            onClose={onClose}
        >
            <form onSubmit={submit} className="space-y-4 p-6">
                <label className="block">
                    <span className={labelClass}>Examination Name</span>
                    <Input
                        required
                        className="h-11 rounded-xl"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Annual Examination"
                    />
                </label>

                <div className="grid grid-cols-2 gap-4">
                    <label>
                        <span className={labelClass}>Class</span>
                        <select
                            className={`${selectClass} w-full`}
                            value={form.className}
                            onChange={(e) => setForm({ ...form, className: e.target.value })}
                        >
                            {examClasses.map((c) => <option key={c} value={c}>Class {c}</option>)}
                        </select>
                    </label>

                    <label>
                        <span className={labelClass}>Subject</span>
                        <select
                            className={`${selectClass} w-full`}
                            value={form.subjectId}
                            onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                        >
                            {examSubjects.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        <span className={labelClass}>Exam Date</span>
                        <Input
                            required type="date"
                            className="h-11 rounded-xl"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                        />
                    </label>

                    <label>
                        <span className={labelClass}>Start Time</span>
                        <Input
                            required type="time"
                            className="h-11 rounded-xl"
                            value={form.startTime}
                            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                        />
                    </label>

                    <label>
                        <span className={labelClass}>Duration (Minutes)</span>
                        <Input
                            required type="number" min="1"
                            className="h-11 rounded-xl"
                            value={form.duration}
                            onChange={(e) => setForm({ ...form, duration: e.target.value })}
                        />
                    </label>

                    <label>
                        <span className={labelClass}>Status</span>
                        <select
                            className={`${selectClass} w-full`}
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                        >
                            <option>Scheduled</option>
                            <option>Completed</option>
                        </select>
                    </label>

                    <label>
                        <span className={labelClass}>Maximum Marks</span>
                        <Input
                            required type="number" min="1"
                            className="h-11 rounded-xl"
                            value={form.maxMarks}
                            onChange={(e) => setForm({ ...form, maxMarks: e.target.value })}
                        />
                    </label>

                    <label>
                        <span className={labelClass}>Passing Marks</span>
                        <Input
                            required type="number" min="0"
                            className="h-11 rounded-xl"
                            value={form.passMarks}
                            onChange={(e) => setForm({ ...form, passMarks: e.target.value })}
                        />
                    </label>

                    {error && (
                        <div role="alert" className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 border-t border-slate-100 pt-5">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="bg-[#257cbe] hover:bg-[#176ba5]">
                            <Check size={16} className="mr-2" /> Save Examination
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}

function ReportCard({ student, exams, marks, onClose }) {
    const rows = exams
        .filter((exam) =>
            exam.className === student.className &&
            exam.status === 'Completed'
        )
        .map((exam) => {
            const entry = marks.find((m) =>
                m.examId === exam.id && m.studentId === student.id
            );
            return { exam, entry };
        });

    const graded = rows.filter(({ entry }) =>
        entry && typeof entry.marks === 'number'
    );

    const obtained = graded.reduce((sum, x) => sum + x.entry.marks, 0);
    const maximum = graded.reduce((sum, x) => sum + x.exam.maxMarks, 0);
    const percent = maximum ? obtained / maximum * 100 : 0;
    const complete = rows.length > 0 && graded.length === rows.length;
    const passed = graded.every((x) => x.entry.marks >= x.exam.passMarks);

    return (
        <Modal title="Student Report Card" subtitle="Academic performance summary" onClose={onClose}>
            <div className="p-6">
                <div id="exam-report-print" className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="bg-[#103c68] p-6 text-center text-white">
                        <div className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-white/15">
                            <GraduationCap size={26} />
                        </div>
                        <h2 className="text-xl font-bold">Olive English School</h2>
                        <p className="mt-1 text-xs text-blue-100">Academic Performance Report</p>
                        <p className="mt-2 text-[11px] text-blue-200">2026–2027 · DEMO</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-b border-slate-100 p-5 text-xs">
                        <div>
                            <p className="text-slate-400">Student</p>
                            <p className="mt-1 font-bold text-slate-800">{student.name}</p>
                        </div>
                        <div>
                            <p className="text-slate-400">Admission Number</p>
                            <p className="mt-1 font-bold text-slate-800">{student.admissionNo}</p>
                        </div>
                        <div>
                            <p className="text-slate-400">Class / Section</p>
                            <p className="mt-1 font-bold text-slate-800">
                                {student.className} / {student.section}
                            </p>
                        </div>
                        <div>
                            <p className="text-slate-400">Roll Number</p>
                            <p className="mt-1 font-bold text-slate-800">{student.rollNo}</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto p-5">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500">
                                <tr>
                                    <th className="p-3">Examination / Subject</th>
                                    <th className="p-3 text-right">Max</th>
                                    <th className="p-3 text-right">Scored</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {rows.map(({ exam, entry }) => (
                                    <tr key={exam.id}>
                                        <td className="p-3">
                                            <p className="font-semibold">{subjectName(exam.subjectId)}</p>
                                            <p className="mt-1 text-[10px] text-slate-400">{exam.name}</p>
                                        </td>
                                        <td className="p-3 text-right">{exam.maxMarks}</td>
                                        <td className="p-3 text-right font-bold">
                                            {entry?.marks ?? 'Pending'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {!rows.length && (
                            <p className="py-6 text-center text-xs text-slate-400">
                                No completed examinations available.
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-3 bg-slate-50 p-5 text-center">
                        <div>
                            <p className="text-[10px] text-slate-500">Marks</p>
                            <p className="mt-1 text-base font-bold">
                                {maximum ? `${obtained}/${maximum}` : '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500">Percentage</p>
                            <p className="mt-1 text-base font-bold">
                                {maximum ? `${percent.toFixed(1)}%` : '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500">Grade</p>
                            <p className="mt-1 text-base font-bold text-[#257cbe]">
                                {maximum ? getGrade(percent) : '—'}
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 p-4 text-center">
                        <p className="text-xs font-semibold text-slate-700">
                            {complete ? (passed ? 'Passed' : 'Needs Improvement') : 'Incomplete Assessment'}
                        </p>
                        <p className="mt-2 text-[10px] text-rose-500">
                            SAMPLE DOCUMENT · NOT AN OFFICIAL SCHOOL RESULT
                        </p>
                    </div>
                </div>

                <Button
                    onClick={() => window.print()}
                    className="mt-5 w-full bg-[#257cbe] hover:bg-[#176ba5]"
                >
                    <Printer size={16} className="mr-2" />
                    Print Report
                </Button>
            </div>
        </Modal>
    );
}

export default function ExaminationsPage() {
    const [store, setStore] = useState(readStore);
    const [tab, setTab] = useState('schedule');
    const [search, setSearch] = useState('');
    const [classFilter, setClassFilter] = useState('All');
    const [examFilter, setExamFilter] = useState('');
    const [studentFilter, setStudentFilter] = useState('');
    const [editor, setEditor] = useState(null);
    const [reportStudent, setReportStudent] = useState(null);
    const [draftMarks, setDraftMarks] = useState({});
    const [notice, setNotice] = useState('');

    const { exams, marks } = store;

    const selectedExam = exams.find((x) => x.id === examFilter);

    const classStudents = examStudents.filter((s) =>
        selectedExam && s.className === selectedExam.className
    );

    const chosenStudent = examStudents.find((s) => s.id === studentFilter);

    const resultRows = useMemo(() => {
        return examStudents.map((student) => {
            const relevantExams = exams.filter((exam) =>
                exam.className === student.className &&
                exam.status === 'Completed'
            );

            const marked = relevantExams.map((exam) => {
                const entry = marks.find((mark) =>
                    mark.examId === exam.id && mark.studentId === student.id
                );
                return { exam, entry };
            }).filter(({ entry }) => typeof entry?.marks === 'number');

            const obtained = marked.reduce((sum, x) => sum + x.entry.marks, 0);
            const maximum = marked.reduce((sum, x) => sum + x.exam.maxMarks, 0);
            const percentage = maximum ? obtained / maximum * 100 : null;

            const complete = relevantExams.length > 0 &&
                marked.length === relevantExams.length;

            const passed = marked.every((x) =>
                x.entry.marks >= x.exam.passMarks
            );

            return {
                ...student, obtained, maximum, percentage,
                grade: percentage === null ? '—' : getGrade(percentage),
                complete,
                result: !maximum || !complete
                    ? 'Pending'
                    : passed ? 'Pass' : 'Fail',
            };
        });
    }, [exams, marks]);

    const assessed = resultRows.filter((r) => r.complete);
    const passCount = assessed.filter((r) => r.result === 'Pass').length;
    const average = assessed.length
        ? Math.round(assessed.reduce((sum, r) => sum + r.percentage, 0) / assessed.length)
        : 0;

    const filteredExams = exams.filter((exam) =>
        (classFilter === 'All' || exam.className === classFilter) &&
        `${exam.name} ${subjectName(exam.subjectId)} ${exam.className}`
            .toLowerCase().includes(search.trim().toLowerCase())
    ).sort((a, b) => a.date.localeCompare(b.date));

    function persist(updated) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            setStore(updated);
            return true;
        } catch {
            setNotice('Unable to save. Browser storage may be full or unavailable.');
            return false;
        }
    }

    function saveExam(data) {
        if (editor?.id) {
            const hasMarks = marks.some((m) => m.examId === editor.id);
            if (hasMarks && (
                data.className !== editor.className ||
                data.subjectId !== editor.subjectId ||
                data.maxMarks !== editor.maxMarks
            )) {
                return 'Cannot change class, subject or max marks after marks have been entered.';
            }
        }

        const duplicate = exams.some((exam) =>
            exam.id !== editor?.id &&
            exam.name.toLowerCase() === data.name.toLowerCase() &&
            exam.className === data.className &&
            exam.subjectId === data.subjectId
        );

        if (duplicate) return 'This examination already exists for that class and subject.';

        const updated = editor?.id
            ? exams.map((exam) => exam.id === editor.id ? { ...exam, ...data } : exam)
            : [...exams, { ...data, id: crypto.randomUUID() }];

        if (persist({ ...store, exams: updated })) {
            setEditor(null);
            setNotice('Examination saved to demo storage.');
        }
        return null;
    }

    function chooseExam(id) {
        const exam = exams.find((x) => x.id === id);
        setExamFilter(id);

        setDraftMarks(Object.fromEntries(
            examStudents
                .filter((s) => s.className === exam?.className)
                .map((student) => {
                    const entry = marks.find((mark) =>
                        mark.examId === id && mark.studentId === student.id
                    );
                    return [student.id, entry ? String(entry.marks) : ''];
                })
        ));
    }

    function saveMarks() {
        if (!selectedExam) return;

        const entries = classStudents.map((student) => {
            const raw = String(draftMarks[student.id] ?? '').trim();
            if (raw === '') return null;

            const value = Number(raw);
            if (!Number.isFinite(value) || value < 0 || value > selectedExam.maxMarks) {
                return { invalid: true, student };
            }
            return {
                examId: selectedExam.id,
                studentId: student.id,
                marks: value,
            };
        });

        const invalid = entries.find((e) => e?.invalid);
        if (invalid) {
            setNotice(`Invalid marks for ${invalid.student.name}. Enter 0 to ${selectedExam.maxMarks}.`);
            return;
        }

        const updatedMarks = [
            ...marks.filter((m) => m.examId !== selectedExam.id),
            ...entries.filter(Boolean),
        ];

        if (persist({ ...store, marks: updatedMarks })) {
            setNotice('Marks saved in browser demo storage.');
        }
    }

    function exportResults() {
        downloadCsv('olive-examination-results-demo.csv', [
            ['Student', 'Admission Number', 'Class', 'Section', 'Obtained', 'Maximum', 'Percentage', 'Grade', 'Result'],
            ...resultRows.map((r) => [
                r.name, r.admissionNo, r.className, r.section,
                r.obtained, r.maximum,
                r.percentage === null ? '' : r.percentage.toFixed(2),
                r.grade, r.result,
            ]),
        ]);
    }

    return (
        <div className="erp-compact erp-compact--examinations mx-auto max-w-[1550px] space-y-4 pb-4 text-slate-900">
            {/* HERO */}
            <section className="relative overflow-hidden rounded-[28px] bg-[#103b68] p-6 text-white shadow-[0_20px_55px_-28px_rgba(16,59,104,.65)] sm:p-8">
                <div className="pointer-events-none absolute -right-16 -top-36 size-[400px] rounded-full border border-white/10" />
                <div className="pointer-events-none absolute -right-2 -top-24 size-[280px] rounded-full border border-white/10" />
                <div className="pointer-events-none absolute bottom-[-130px] right-1/4 size-80 rounded-full bg-blue-400/20 blur-3xl" />

                <div className="relative flex flex-wrap items-center justify-between gap-6">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-blue-100">
                            <Sparkles size={14} />
                            ACADEMIC PERFORMANCE WORKSPACE
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Excellence, measured beautifully.
                        </h1>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100/85">
                            Organize examinations, capture student performance,
                            discover results and present academic achievements with clarity.
                        </p>
                        <div className="mt-5 flex flex-wrap gap-2">
                            <Badge className="border border-white/15 bg-white/10 px-3 py-1.5 text-white">
                                <GraduationCap size={13} className="mr-1.5" />
                                Olive English School
                            </Badge>
                            <Badge className="border border-amber-300/30 bg-amber-400/15 px-3 py-1.5 text-amber-100">
                                Demo Records
                            </Badge>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                        <div className="grid size-14 place-items-center rounded-2xl bg-white/15">
                            <Award size={28} />
                        </div>
                        <div>
                            <p className="text-xs text-blue-100">Classroom performance</p>
                            <p className="mt-1 text-3xl font-bold">{average}%</p>
                            <p className="text-xs text-blue-200">Average assessed score</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SUMMARY */}
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                <Stat
                    title="Total Examinations"
                    value={exams.length}
                    detail="Scheduled and completed"
                    icon={ClipboardCheck}
                    accent="#257cbe"
                    soft="#eaf4fc"
                />
                <Stat
                    title="Completed Exams"
                    value={exams.filter((e) => e.status === 'Completed').length}
                    detail="Ready for marking"
                    icon={CheckCircle2}
                    accent="#10b981"
                    soft="#ecfdf5"
                />
                <Stat
                    title="Average Score"
                    value={`${average}%`}
                    detail="Fully assessed students"
                    icon={TrendingUp}
                    accent="#8b5cf6"
                    soft="#f5f3ff"
                />
                <Stat
                    title="Students Passed"
                    value={passCount}
                    detail={`${assessed.length} fully assessed`}
                    icon={Medal}
                    accent="#f59e0b"
                    soft="#fffbeb"
                />
            </div>

            {/* TABS */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-[20px] border border-slate-200 bg-white p-2 shadow-sm">
                <div className="flex gap-1 overflow-x-auto">
                    {[
                        ['schedule', 'Exam Schedule', CalendarDays],
                        ['marks', 'Marks Entry', ClipboardCheck],
                        ['results', 'Results & Analytics', TrendingUp],
                        ['reports', 'Report Cards', FileText],
                    ].map(([id, label, Icon]) => (
                        <button
                            key={id}
                            onClick={() => setTab(id)}
                            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold transition-all sm:text-sm ${tab === id
                                    ? 'bg-[#257cbe] text-white shadow-md shadow-blue-200/60'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                }`}
                        >
                            <Icon size={16} /> {label}
                        </button>
                    ))}
                </div>
                <Badge variant="outline" className="mx-2 hidden rounded-full lg:inline-flex">
                    Academic Year 2026–27
                </Badge>
            </div>

            {notice && (
                <div role="status" className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-800">
                    {notice}
                    <button aria-label="Dismiss" onClick={() => setNotice('')}>
                        <X size={15} />
                    </button>
                </div>
            )}

            {/* EXAM SCHEDULE */}
            {tab === 'schedule' && (
                <Surface>
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
                        <div>
                            <h2 className="text-lg font-bold">Examination Schedule</h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Plan subject-wise examinations for every class.
                            </p>
                        </div>
                        <Button
                            onClick={() => setEditor({})}
                            className="rounded-xl bg-[#257cbe] shadow-md shadow-blue-100 hover:bg-[#176ba5]"
                        >
                            <Plus size={17} className="mr-2" /> Create Exam
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-3 p-5">
                        <div className="relative min-w-[210px] flex-1">
                            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Search examinations..."
                                className="h-10 rounded-xl pl-10"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <select
                            className={selectClass}
                            value={classFilter}
                            onChange={(e) => setClassFilter(e.target.value)}
                        >
                            <option value="All">All Classes</option>
                            {examClasses.map((c) => <option key={c} value={c}>Class {c}</option>)}
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[750px] text-left text-sm">
                            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                <tr>
                                    <th className="px-5 py-4">Examination</th>
                                    <th className="px-4 py-4">Class / Subject</th>
                                    <th className="px-4 py-4">Date & Time</th>
                                    <th className="px-4 py-4">Marks</th>
                                    <th className="px-4 py-4">Status</th>
                                    <th className="px-5 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredExams.map((exam) => (
                                    <tr key={exam.id} className="transition-colors hover:bg-blue-50/30">
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-slate-800">{exam.name}</p>
                                            <p className="mt-1 text-[11px] text-slate-400">{exam.id.slice(0, 13)}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="font-semibold">Class {exam.className}</p>
                                            <p className="mt-1 text-xs text-slate-400">{subjectName(exam.subjectId)}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="font-medium">{formatExamDate(exam.date)}</p>
                                            <p className="mt-1 text-xs text-slate-400">
                                                {exam.startTime} · {exam.duration} min
                                            </p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="font-semibold">{exam.maxMarks}</p>
                                            <p className="mt-1 text-xs text-slate-400">Pass: {exam.passMarks}</p>
                                        </td>
                                        <td className="px-4 py-4"><ExamStatus status={exam.status} /></td>
                                        <td className="px-5 py-4 text-right">
                                            <Button variant="outline" size="sm" onClick={() => setEditor(exam)}>
                                                <Pencil size={14} className="mr-1.5" />
                                                Edit
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {!filteredExams.length && (
                            <p className="p-12 text-center text-sm text-slate-400">
                                No examinations found.
                            </p>
                        )}
                    </div>
                </Surface>
            )}

            {/* MARKS ENTRY */}
            {tab === 'marks' && (
                <Surface>
                    <div className="border-b border-slate-100 p-5 sm:p-6">
                        <h2 className="text-lg font-bold">Marks Entry Workspace</h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Select a completed examination and enter student marks.
                        </p>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <label className="block">
                                <span className="mb-2 block text-xs font-semibold text-slate-500">
                                    Select Examination
                                </span>
                                <select
                                    className={`${selectClass} w-full`}
                                    value={examFilter}
                                    onChange={(e) => chooseExam(e.target.value)}
                                >
                                    <option value="">Choose examination...</option>
                                    {exams.filter((e) => e.status === 'Completed').map((e) => (
                                        <option key={e.id} value={e.id}>
                                            {e.name} · Class {e.className} · {subjectName(e.subjectId)}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <div className="flex items-end">
                                <div className="flex h-10 w-full items-center gap-2 rounded-xl bg-blue-50 px-4 text-xs text-[#257cbe]">
                                    <BookOpen size={16} />
                                    {selectedExam
                                        ? `Maximum ${selectedExam.maxMarks} · Passing ${selectedExam.passMarks}`
                                        : 'Choose an exam to begin marking'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {selectedExam ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[550px] text-left text-sm">
                                    <thead className="bg-slate-50 text-xs text-slate-500">
                                        <tr>
                                            <th className="px-6 py-4">Student</th>
                                            <th className="px-4 py-4">Class / Roll</th>
                                            <th className="px-4 py-4">Marks Obtained</th>
                                            <th className="px-6 py-4">Assessment</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {classStudents.map((student) => {
                                            const raw = draftMarks[student.id] ?? '';
                                            const value = raw === '' ? null : Number(raw);
                                            const valid = value !== null && Number.isFinite(value) &&
                                                value >= 0 && value <= selectedExam.maxMarks;

                                            return (
                                                <tr key={student.id}>
                                                    <td className="px-6 py-4">
                                                        <p className="font-semibold">{student.name}</p>
                                                        <p className="mt-1 text-xs text-slate-400">{student.admissionNo}</p>
                                                    </td>
                                                    <td className="px-4 py-4 text-xs text-slate-500">
                                                        {student.className}-{student.section} · {student.rollNo}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            max={selectedExam.maxMarks}
                                                            step="0.5"
                                                            placeholder={`0 - ${selectedExam.maxMarks}`}
                                                            value={raw}
                                                            onChange={(e) => setDraftMarks((prev) => ({
                                                                ...prev, [student.id]: e.target.value,
                                                            }))}
                                                            className="h-10 w-36 rounded-xl"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {valid ? (
                                                            <span className={`text-xs font-semibold ${value >= selectedExam.passMarks
                                                                    ? 'text-emerald-600' : 'text-rose-600'
                                                                }`}>
                                                                {value >= selectedExam.passMarks ? 'Pass' : 'Below Passing'}
                                                            </span>
                                                        ) : <span className="text-xs text-slate-400">Not marked</span>}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                {!classStudents.length && (
                                    <p className="p-10 text-center text-sm text-slate-400">
                                        No students in the selected class.
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/50 p-5">
                                <p className="text-xs text-slate-500">
                                    Changes are saved only in this browser.
                                </p>
                                <Button
                                    onClick={saveMarks}
                                    className="bg-[#257cbe] hover:bg-[#176ba5]"
                                >
                                    <Check size={16} className="mr-2" />
                                    Save Marks
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center py-20 text-center">
                            <div className="mb-4 grid size-16 place-items-center rounded-3xl bg-blue-50 text-[#257cbe]">
                                <ClipboardCheck size={28} />
                            </div>
                            <h3 className="font-semibold">Ready to enter marks?</h3>
                            <p className="mt-2 text-sm text-slate-400">
                                Select a completed examination above.
                            </p>
                        </div>
                    )}
                </Surface>
            )}

            {/* RESULTS */}
            {tab === 'results' && (
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
                    <Surface>
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
                            <div>
                                <h2 className="text-lg font-bold">Student Results</h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    Consolidated performance across completed exams.
                                </p>
                            </div>
                            <Button variant="outline" onClick={exportResults}>
                                <ArrowDownToLine size={16} className="mr-2" />
                                Export CSV
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px] text-left text-sm">
                                <thead className="bg-slate-50 text-xs text-slate-500">
                                    <tr>
                                        <th className="px-5 py-4">Student</th>
                                        <th className="px-4 py-4">Class</th>
                                        <th className="px-4 py-4">Marks</th>
                                        <th className="px-4 py-4">Percentage</th>
                                        <th className="px-4 py-4">Grade</th>
                                        <th className="px-4 py-4">Result</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {resultRows.map((student) => (
                                        <tr key={student.id} className="hover:bg-blue-50/30">
                                            <td className="px-5 py-4">
                                                <p className="font-semibold">{student.name}</p>
                                                <p className="mt-1 text-[11px] text-slate-400">{student.admissionNo}</p>
                                            </td>
                                            <td className="px-4 py-4 text-slate-600">
                                                {student.className}-{student.section}
                                            </td>
                                            <td className="px-4 py-4 font-medium">
                                                {student.maximum ? `${student.obtained}/${student.maximum}` : '—'}
                                            </td>
                                            <td className="px-4 py-4 font-semibold">
                                                {student.percentage === null
                                                    ? '—' : `${student.percentage.toFixed(1)}%`}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-[#257cbe]">
                                                    {student.grade}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`text-xs font-semibold ${student.result === 'Pass' ? 'text-emerald-600'
                                                        : student.result === 'Fail' ? 'text-rose-600'
                                                            : 'text-amber-600'
                                                    }`}>
                                                    {student.result}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Surface>

                    <div className="space-y-5">
                        <Surface>
                            <div className="p-5">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold">Performance Snapshot</h3>
                                    <TrendingUp size={18} className="text-[#257cbe]" />
                                </div>
                                <div className="my-6 text-center">
                                    <p className="text-[42px] font-bold tracking-tight">{average}%</p>
                                    <p className="mt-1 text-xs text-slate-400">Overall Average</p>
                                </div>
                                <Progress value={average} className="h-2" />
                                <div className="mt-5 flex justify-between text-xs">
                                    <span className="text-slate-500">Pass Rate</span>
                                    <strong>
                                        {assessed.length
                                            ? Math.round(passCount / assessed.length * 100)
                                            : 0}%
                                    </strong>
                                </div>
                            </div>
                        </Surface>

                        <Surface>
                            <div className="p-5">
                                <h3 className="text-sm font-bold">Grade Distribution</h3>
                                <p className="mt-1 text-xs text-slate-400">Fully assessed students</p>
                                <div className="mt-5 space-y-4">
                                    {['A+', 'A', 'B+', 'B', 'C', 'D', 'F'].map((grade) => {
                                        const count = assessed.filter((r) => r.grade === grade).length;
                                        return (
                                            <div key={grade} className="flex items-center gap-3 text-xs">
                                                <span className="w-7 font-bold text-slate-700">{grade}</span>
                                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                                                    <div
                                                        className="h-full rounded-full bg-[#257cbe]"
                                                        style={{
                                                            width: `${assessed.length ? count / assessed.length * 100 : 0}%`,
                                                        }}
                                                    />
                                                </div>
                                                <span className="w-5 text-right text-slate-500">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </Surface>
                    </div>
                </div>
            )}

            {/* REPORT CARDS */}
            {tab === 'reports' && (
                <Surface>
                    <div className="border-b border-slate-100 p-6">
                        <h2 className="text-lg font-bold">Student Report Cards</h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Preview academic performance and print sample report cards.
                        </p>
                    </div>

                    <div className="grid gap-5 p-6 lg:grid-cols-[minmax(0,1fr)_270px]">
                        <div>
                            <label className="mb-2 block text-xs font-semibold text-slate-500">
                                Select Student
                            </label>
                            <select
                                className={`${selectClass} w-full`}
                                value={studentFilter}
                                onChange={(e) => setStudentFilter(e.target.value)}
                            >
                                <option value="">Choose student...</option>
                                {examStudents.map((student) => (
                                    <option key={student.id} value={student.id}>
                                        {student.name} · Class {student.className}
                                    </option>
                                ))}
                            </select>

                            {chosenStudent ? (
                                <div className="mt-5 rounded-[22px] border border-slate-200 p-5">
                                    <div className="flex items-center gap-4">
                                        <div className="grid size-14 place-items-center rounded-2xl bg-blue-50 text-xl font-bold text-[#257cbe]">
                                            {chosenStudent.name[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-bold">{chosenStudent.name}</h3>
                                            <p className="mt-1 text-xs text-slate-400">
                                                {chosenStudent.admissionNo}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                Class {chosenStudent.className} · Section {chosenStudent.section}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        className="mt-6 w-full bg-[#257cbe] hover:bg-[#176ba5]"
                                        onClick={() => setReportStudent(chosenStudent)}
                                    >
                                        <FileText size={16} className="mr-2" />
                                        View Report Card
                                        <ArrowRight size={15} className="ml-2" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="mt-5 rounded-2xl border border-dashed border-slate-200 p-12 text-center text-sm text-slate-400">
                                    Choose a student to preview their report.
                                </div>
                            )}
                        </div>

                        <div className="rounded-[22px] bg-[#edf5fb] p-6">
                            <div className="grid size-12 place-items-center rounded-2xl bg-white text-[#257cbe]">
                                <Award size={25} />
                            </div>
                            <h3 className="mt-5 font-bold text-[#15466f]">
                                Beautiful Report Cards
                            </h3>
                            <p className="mt-2 text-xs leading-6 text-[#497493]">
                                Professional student assessment summaries featuring marks,
                                grades and academic achievements.
                            </p>
                            <div className="mt-5 text-xs font-semibold text-[#257cbe]">
                                Preview · Print · Share later
                            </div>
                        </div>
                    </div>
                </Surface>
            )}

            {editor && (
                <ExamForm
                    key={editor.id || 'new'}
                    initial={editor.id ? editor : null}
                    onClose={() => setEditor(null)}
                    onSave={saveExam}
                />
            )}

            {reportStudent && (
                <ReportCard
                    student={reportStudent}
                    exams={exams}
                    marks={marks}
                    onClose={() => setReportStudent(null)}
                />
            )}
        </div>
    );
}
