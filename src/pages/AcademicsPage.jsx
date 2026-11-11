
import { useMemo, useState } from 'react';
import {
    BookOpen, CalendarDays, GraduationCap, Layers3,
    LibraryBig, Users, Plus, Pencil, X, Save,
    Search, CheckCircle2, Clock3,
} from 'lucide-react';

import { initialStudents } from '../data/students.mock';
import {
    academicYears, academicClasses, academicSections,
    academicSubjects, academicDays, academicPeriods,
    academicTimetable,
} from '../data/academics.mock';
import '../styles/erp-compact.css';

const BLUE = '#257cbe';

const tabs = [
    { id: 'years', label: 'Academic Years', icon: CalendarDays },
    { id: 'classes', label: 'Classes', icon: GraduationCap },
    { id: 'sections', label: 'Sections', icon: Layers3 },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'enrollment', label: 'Enrollment', icon: Users },
    { id: 'timetable', label: 'Timetable', icon: Clock3 },
];

const inputStyle =
    'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#257cbe] focus:ring-2 focus:ring-blue-50';

const buttonStyle =
    'inline-flex items-center justify-center gap-2 rounded-xl bg-[#257cbe] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#176ba6]';

const newId = () => crypto.randomUUID();

function Panel({ title, description, action, children }) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
                <div>
                    <h2 className="font-bold text-slate-900">{title}</h2>
                    <p className="mt-1 text-xs text-slate-500">{description}</p>
                </div>
                {action}
            </div>
            {children}
        </section>
    );
}

function Editor({ title, fields, initial, onSave, onClose }) {
    const [form, setForm] = useState(initial);
    const [error, setError] = useState('');

    function submit(e) {
        e.preventDefault();
        const data = { ...form };

        for (const field of fields) {
            const value = String(data[field.key] ?? '').trim();
            if (field.required !== false && !value) {
                setError(`${field.label} is required.`);
                return;
            }
            if (field.type === 'number') data[field.key] = Number(value);
            else data[field.key] = value;
        }

        const result = onSave(data);
        if (result) setError(result);
    }

    return (
        <div className="fixed inset-0 z-[100] flex justify-end bg-slate-900/40" onMouseDown={onClose}>
            <div
                className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-slate-100 p-5">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                        <p className="text-xs text-slate-500">Complete the details below</p>
                    </div>
                    <button onClick={onClose} aria-label="Close form" className="rounded-lg p-2 hover:bg-slate-100">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
                    <div className="flex-1 space-y-5 overflow-y-auto p-5">
                        {fields.map((field) => (
                            <label key={field.key} className="block">
                                <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                                    {field.label}
                                </span>

                                {field.options ? (
                                    <select
                                        required={field.required !== false}
                                        className={inputStyle}
                                        value={form[field.key] ?? ''}
                                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                                    >
                                        <option value="">Select {field.label}</option>
                                        {field.options.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        required={field.required !== false}
                                        type={field.type || 'text'}
                                        min={field.type === 'number' ? 1 : undefined}
                                        className={inputStyle}
                                        value={form[field.key] ?? ''}
                                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                                        placeholder={`Enter ${field.label.toLowerCase()}`}
                                    />
                                )}
                            </label>
                        ))}
                        {error && (
                            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 border-t border-slate-100 p-5">
                        <button type="button" onClick={onClose} className="rounded-xl border px-4 py-2.5 text-sm">
                            Cancel
                        </button>
                        <button type="submit" className={buttonStyle}>
                            <Save size={16} /> Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Directory({ title, description, items, columns, onAdd, onEdit, searchKeys = [] }) {
    const [search, setSearch] = useState('');

    const filtered = items.filter((item) =>
        searchKeys.some((key) =>
            String(item[key] ?? '').toLowerCase().includes(search.toLowerCase().trim())
        ) || !search.trim()
    );

    return (
        <Panel
            title={title}
            description={description}
            action={
                <button onClick={onAdd} className={buttonStyle}>
                    <Plus size={17} /> Add New
                </button>
            }
        >
            <div className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div className="relative w-full max-w-sm">
                    <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        className={`${inputStyle} pl-10`}
                        placeholder={`Search ${title.toLowerCase()}...`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <span className="text-xs text-slate-500">{filtered.length} records</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[580px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs text-slate-500">
                        <tr>
                            {columns.map((column) => (
                                <th key={column.key} className="px-5 py-3 font-semibold">{column.label}</th>
                            ))}
                            <th className="px-5 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/70">
                                {columns.map((column) => (
                                    <td key={column.key} className="px-5 py-4 text-slate-700">
                                        {column.render ? column.render(item) : item[column.key]}
                                    </td>
                                ))}
                                <td className="px-5 py-4 text-right">
                                    <button
                                        onClick={() => onEdit(item)}
                                        aria-label={`Edit ${title}`}
                                        className="rounded-lg p-2 text-[#257cbe] hover:bg-blue-50"
                                    >
                                        <Pencil size={17} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {!filtered.length && (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-5 py-12 text-center text-slate-400">
                                    No records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Panel>
    );
}

function SummaryCard({ label, value, Icon }) {
    return (
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#257cbe]">
                <Icon size={22} />
            </div>
            <div>
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
            </div>
        </div>
    );
}

export default function AcademicsPage() {
    const [tab, setTab] = useState('years');
    const [years, setYears] = useState(() => academicYears.map((x) => ({ ...x })));
    const [classes, setClasses] = useState(() => academicClasses.map((x) => ({ ...x })));
    const [sections, setSections] = useState(() => academicSections.map((x) => ({ ...x })));
    const [subjects, setSubjects] = useState(() => academicSubjects.map((x) => ({ ...x })));
    const [enrollments, setEnrollments] = useState(() =>
        initialStudents.map((s) => ({
            studentId: s.id,
            classId: academicClasses.find((c) => c.name === s.className)?.id || '',
            section: s.section || '',
        }))
    );
    const [timetable, setTimetable] = useState(() => academicTimetable.map((x) => ({ ...x })));

    const [editor, setEditor] = useState(null);
    const [classFilter, setClassFilter] = useState('C3');
    const [sectionFilter, setSectionFilter] = useState('A');
    const [studentSearch, setStudentSearch] = useState('');

    const activeYear = years.find((y) => y.active);
    const getClass = (id) => classes.find((c) => c.id === id)?.name || '—';

    const classOptions = classes.map((c) => ({
        value: c.id, label: `Class ${c.name}`,
    }));

    const fields = {
        years: [
            { key: 'name', label: 'Academic Year (e.g. 2027-2028)' },
            { key: 'startDate', label: 'Start Date', type: 'date' },
            { key: 'endDate', label: 'End Date', type: 'date' },
        ],
        classes: [
            { key: 'name', label: 'Class Name' },
            { key: 'code', label: 'Class Code' },
            { key: 'teacher', label: 'Class Teacher' },
        ],
        sections: [
            { key: 'classId', label: 'Class', options: classOptions },
            { key: 'name', label: 'Section Name' },
            { key: 'capacity', label: 'Maximum Capacity', type: 'number' },
        ],
        subjects: [
            { key: 'name', label: 'Subject Name' },
            { key: 'code', label: 'Subject Code' },
            { key: 'classId', label: 'Class', options: classOptions },
            { key: 'teacher', label: 'Subject Teacher' },
        ],
    };

    const stores = {
        years: [years, setYears],
        classes: [classes, setClasses],
        sections: [sections, setSections],
        subjects: [subjects, setSubjects],
    };

    function saveRecord(data) {
        const [items, setItems] = stores[editor.type];
        const value = { ...data };

        if (editor.type === 'years') {
            if (value.endDate <= value.startDate) return 'End date must be later than start date.';
            if (items.some((x) => x.id !== editor.item?.id && x.name.toLowerCase() === value.name.toLowerCase())) {
                return 'This academic year already exists.';
            }
        }

        if (editor.type === 'classes') {
            if (items.some((x) => x.id !== editor.item?.id &&
                (x.name.toLowerCase() === value.name.toLowerCase() || x.code.toLowerCase() === value.code.toLowerCase()))) {
                return 'Class name or code already exists.';
            }
        }

        if (editor.type === 'sections') {
            if (items.some((x) => x.id !== editor.item?.id && x.classId === value.classId &&
                x.name.toLowerCase() === value.name.toLowerCase())) {
                return 'This section already exists in the selected class.';
            }
        }

        if (editor.type === 'subjects') {
            if (items.some((x) => x.id !== editor.item?.id && x.classId === value.classId &&
                x.code.toLowerCase() === value.code.toLowerCase())) {
                return 'This subject code already exists in the selected class.';
            }
        }

        if (editor.item) {
            setItems((prev) => prev.map((x) => x.id === editor.item.id ? { ...x, ...value } : x));
        } else {
            setItems((prev) => [...prev, {
                ...value, id: newId(), ...(editor.type === 'years' ? { active: false } : {}),
            }]);
        }
        setEditor(null);
        return null;
    }

    function activateYear(id) {
        setYears((prev) => prev.map((year) => ({ ...year, active: year.id === id })));
    }

    const directoryConfigs = {
        years: {
            title: 'Academic Years',
            description: 'Manage academic sessions and the currently active school year.',
            searchKeys: ['name'],
            columns: [
                { key: 'name', label: 'Academic Year' },
                { key: 'startDate', label: 'Start Date' },
                { key: 'endDate', label: 'End Date' },
                {
                    key: 'active', label: 'Status',
                    render: (x) => x.active
                        ? <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#257cbe]">Active</span>
                        : <button onClick={() => activateYear(x.id)} className="rounded-full bg-slate-100 px-3 py-1 text-xs hover:bg-blue-50 hover:text-[#257cbe]">Set Active</button>,
                },
            ],
        },
        classes: {
            title: 'Classes',
            description: 'Manage class levels, codes and assigned class teachers.',
            searchKeys: ['name', 'code', 'teacher'],
            columns: [
                { key: 'name', label: 'Class', render: (x) => <b>Class {x.name}</b> },
                { key: 'code', label: 'Class Code' },
                { key: 'teacher', label: 'Class Teacher' },
                { key: 'sections', label: 'Sections', render: (x) => sections.filter((s) => s.classId === x.id).length },
            ],
        },
        sections: {
            title: 'Sections',
            description: 'Organize divisions and student capacity within each class.',
            searchKeys: ['name', 'capacity'],
            columns: [
                { key: 'classId', label: 'Class', render: (x) => `Class ${getClass(x.classId)}` },
                { key: 'name', label: 'Section', render: (x) => <b>Section {x.name}</b> },
                { key: 'capacity', label: 'Capacity' },
                { key: 'students', label: 'Enrolled', render: (x) => enrollments.filter((e) => e.classId === x.classId && e.section === x.name).length },
            ],
        },
        subjects: {
            title: 'Subjects',
            description: 'Configure subjects and teachers for each class.',
            searchKeys: ['name', 'code', 'teacher'],
            columns: [
                { key: 'name', label: 'Subject', render: (x) => <b>{x.name}</b> },
                { key: 'code', label: 'Code' },
                { key: 'classId', label: 'Class', render: (x) => `Class ${getClass(x.classId)}` },
                { key: 'teacher', label: 'Teacher' },
            ],
        },
    };

    const availableSections = useMemo(() =>
        sections.filter((s) => s.classId === classFilter),
        [sections, classFilter]
    );

    const currentSection = availableSections.some((s) => s.name === sectionFilter)
        ? sectionFilter : availableSections[0]?.name || '';

    function updateEnrollment(studentId, field, value) {
        setEnrollments((prev) => prev.map((e) => {
            if (e.studentId !== studentId) return e;
            if (field === 'classId') return { ...e, classId: value, section: '' };
            return { ...e, [field]: value };
        }));
    }

    const filteredStudents = initialStudents.filter((s) =>
        `${s.firstName} ${s.lastName} ${s.admissionNo}`
            .toLowerCase().includes(studentSearch.toLowerCase().trim())
    );

    const classSubjects = subjects.filter((s) => s.classId === classFilter);

    function setPeriod(day, period, subjectId) {
        setTimetable((prev) => {
            const withoutCell = prev.filter((x) =>
                !(x.classId === classFilter && x.section === currentSection &&
                    x.day === day && x.period === period)
            );
            if (!subjectId) return withoutCell;
            return [...withoutCell, {
                id: newId(), classId: classFilter, section: currentSection,
                day, period, subjectId,
            }];
        });
    }

    return (
        <div className="erp-compact erp-compact--academics mx-auto max-w-[1500px] space-y-4">
            <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#257cbe]">
                        School Administration
                    </p>
                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                        Academics Management
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage academic sessions, classes, subjects, enrollment and timetables.
                    </p>
                </div>
                <span className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                    Demo Data · Frontend Only
                </span>
            </header>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard label="Active Academic Year" value={activeYear?.name || '—'} Icon={CalendarDays} />
                <SummaryCard label="Total Classes" value={classes.length} Icon={GraduationCap} />
                <SummaryCard label="Total Sections" value={sections.length} Icon={Layers3} />
                <SummaryCard label="Total Subjects" value={subjects.length} Icon={LibraryBig} />
            </div>

            <div className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setTab(id)}
                        className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${tab === id
                            ? 'bg-[#257cbe] text-white shadow-sm'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                            }`}
                    >
                        <Icon size={17} /> {label}
                    </button>
                ))}
            </div>

            {directoryConfigs[tab] && (
                <Directory
                    key={tab}
                    {...directoryConfigs[tab]}
                    items={stores[tab][0]}
                    onAdd={() => setEditor({ type: tab, item: null })}
                    onEdit={(item) => setEditor({ type: tab, item })}
                />
            )}

            {tab === 'enrollment' && (
                <Panel
                    title="Student Enrollment"
                    description="Assign existing student records to classes and sections. Changes are temporary."
                    action={<span className="text-xs font-medium text-slate-500">{enrollments.length} Students</span>}
                >
                    <div className="p-5">
                        <div className="relative max-w-sm">
                            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                value={studentSearch}
                                onChange={(e) => setStudentSearch(e.target.value)}
                                className={`${inputStyle} pl-10`}
                                placeholder="Search student or admission no..."
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[690px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs text-slate-500">
                                <tr>
                                    <th className="px-5 py-3">Student</th>
                                    <th className="px-5 py-3">Admission No.</th>
                                    <th className="px-5 py-3">Class</th>
                                    <th className="px-5 py-3">Section</th>
                                    <th className="px-5 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStudents.map((student) => {
                                    const enrollment = enrollments.find((e) => e.studentId === student.id);
                                    const choices = sections.filter((s) => s.classId === enrollment?.classId);
                                    return (
                                        <tr key={student.id}>
                                            <td className="px-5 py-4 font-semibold text-slate-800">
                                                {student.firstName} {student.lastName}
                                            </td>
                                            <td className="px-5 py-4 text-slate-500">{student.admissionNo}</td>
                                            <td className="px-5 py-3">
                                                <select
                                                    className={inputStyle}
                                                    value={enrollment?.classId || ''}
                                                    onChange={(e) => updateEnrollment(student.id, 'classId', e.target.value)}
                                                >
                                                    <option value="">Unassigned</option>
                                                    {classOptions.map((c) => (
                                                        <option key={c.value} value={c.value}>{c.label}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-5 py-3">
                                                <select
                                                    className={inputStyle}
                                                    value={choices.some((s) => s.name === enrollment?.section) ? enrollment.section : ''}
                                                    disabled={!enrollment?.classId}
                                                    onChange={(e) => updateEnrollment(student.id, 'section', e.target.value)}
                                                >
                                                    <option value="">Select Section</option>
                                                    {choices.map((s) => (
                                                        <option key={s.id} value={s.name}>Section {s.name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-5 py-4">
                                                {enrollment?.classId && choices.some((s) => s.name === enrollment?.section)
                                                    ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#257cbe]"><CheckCircle2 size={15} /> Assigned</span>
                                                    : <span className="text-xs text-amber-600">Incomplete</span>}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {!filteredStudents.length && (
                                    <tr><td colSpan={5} className="p-10 text-center text-slate-400">No students found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <p className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
                        Enrollment changes are maintained in this screen only. They do not update the Student Management module or database.
                    </p>
                </Panel>
            )}

            {tab === 'timetable' && (
                <Panel
                    title="Weekly Class Timetable"
                    description="Select a class and section, then assign subjects to each period."
                    action={<span className="text-xs font-semibold text-[#257cbe]">Editable Schedule</span>}
                >
                    <div className="grid gap-3 border-b border-slate-100 p-5 sm:grid-cols-2">
                        <label>
                            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Class</span>
                            <select
                                value={classFilter}
                                onChange={(e) => {
                                    setClassFilter(e.target.value);
                                    setSectionFilter('');
                                }}
                                className={inputStyle}
                            >
                                {classOptions.map((c) => (
                                    <option key={c.value} value={c.value}>{c.label}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            <span className="mb-1.5 block text-xs font-semibold text-slate-500">Section</span>
                            <select
                                className={inputStyle}
                                value={currentSection}
                                onChange={(e) => setSectionFilter(e.target.value)}
                            >
                                {!availableSections.length && <option value="">No sections</option>}
                                {availableSections.map((s) => (
                                    <option key={s.id} value={s.name}>Section {s.name}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {currentSection ? (
                        <div className="overflow-x-auto p-5">
                            <table className="w-full min-w-[850px] border-separate border-spacing-2 text-center text-xs">
                                <thead>
                                    <tr>
                                        <th className="min-w-32 rounded-xl bg-slate-50 p-3 text-left">Period</th>
                                        {academicDays.map((day) => (
                                            <th key={day} className="min-w-36 rounded-xl bg-slate-50 p-3 text-slate-700">
                                                {day}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {academicPeriods.map((period) => (
                                        <tr key={period.id}>
                                            <th className="rounded-xl bg-slate-50 p-3 text-left">
                                                <p className="font-semibold text-slate-800">{period.label}</p>
                                                <p className="mt-1 text-[10px] font-normal text-slate-400">{period.time}</p>
                                            </th>
                                            {academicDays.map((day) => {
                                                const entry = timetable.find((x) =>
                                                    x.classId === classFilter && x.section === currentSection &&
                                                    x.day === day && x.period === period.id
                                                );
                                                return (
                                                    <td key={day} className="rounded-xl border border-slate-100 bg-blue-50/40 p-2">
                                                        <select
                                                            aria-label={`${day} ${period.label}`}
                                                            className="w-full rounded-lg bg-transparent p-2 text-xs font-medium text-slate-700 outline-none focus:bg-white"
                                                            value={entry?.subjectId || ''}
                                                            onChange={(e) => setPeriod(day, period.id, e.target.value)}
                                                        >
                                                            <option value="">+ Add Subject</option>
                                                            {classSubjects.map((subject) => (
                                                                <option key={subject.id} value={subject.id}>
                                                                    {subject.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {entry && (
                                                            <p className="mt-1 truncate px-2 text-[10px] text-slate-400">
                                                                {subjects.find((s) => s.id === entry.subjectId)?.teacher || ''}
                                                            </p>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="p-10 text-center text-slate-400">Create a section for this class first.</p>
                    )}

                    <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
                        Timetable changes are kept in React state until the page is refreshed.
                    </div>
                </Panel>
            )}

            {editor && (
                <Editor
                    key={`${editor.type}-${editor.item?.id || 'new'}`}
                    title={`${editor.item ? 'Edit' : 'Add'} ${tabs.find((t) => t.id === editor.type)?.label}`}
                    fields={fields[editor.type]}
                    initial={editor.item || {}}
                    onSave={saveRecord}
                    onClose={() => setEditor(null)}
                />
            )}
        </div>
    );
}
