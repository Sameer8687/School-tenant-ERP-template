
import { useMemo, useState } from 'react';
import {
    ArrowDownToLine, ArrowRight, BookCopy, BookMarked,
    BookOpen, CalendarClock, Check, CheckCircle2,
    ChevronRight, Clock3, LibraryBig, Plus,
    RotateCcw, Search, Sparkles, TrendingUp,
    UsersRound, X, AlertCircle, Pencil, MapPin,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

import {
    initialBooks, initialLoans, libraryStudents,
    libraryCategories, dateISO, addDays, prettyDate,
} from '../data/library.mock';
import '../styles/erp-compact.css';

const STORE_KEY = 'olive-library-demo-v1';

const inputClass =
    'h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#257cbe] focus:ring-2 focus:ring-blue-100';

function readData() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
        if (Array.isArray(saved?.books) && Array.isArray(saved?.loans)) {
            return saved;
        }
    } catch {
        // Use sample data if local storage is invalid.
    }
    return { books: initialBooks, loans: initialLoans };
}

function downloadCsv(filename, rows) {
    const csv = rows.map((r) =>
        r.map((v) => `"${String(v ?? '').replaceAll('"', '""')}"`).join(',')
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

function Surface({ children, className = '' }) {
    return (
        <Card className={`gap-0 overflow-hidden rounded-[24px] border-slate-200/70 bg-white py-0 shadow-[0_10px_32px_-22px_rgba(15,23,42,.25)] ${className}`}>
            <CardContent className="p-0">{children}</CardContent>
        </Card>
    );
}

function BookCover({ book, large = false }) {
    return (
        <div
            className={`relative flex shrink-0 flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br ${book.cover} p-3 text-white shadow-[5px_6px_13px_-7px_rgba(0,0,0,.45)] ${large ? 'h-48 w-32' : 'h-28 w-20'
                }`}
        >
            <div className="absolute bottom-0 left-2 top-0 w-px bg-white/25" />
            <div className="absolute -right-7 -top-7 size-20 rounded-full border border-white/20" />
            <BookOpen size={large ? 25 : 17} className="relative opacity-80" />
            <div className="relative">
                <p className={`font-bold tracking-tight ${large ? 'text-lg' : 'text-base'}`}>
                    {book.initials}
                </p>
                <div className="mt-1 h-0.5 w-7 bg-white/50" />
                <p className="mt-2 text-[8px] uppercase tracking-wider opacity-70">
                    Library Collection
                </p>
            </div>
        </div>
    );
}

function Metric({ label, value, detail, Icon, color, bg }) {
    return (
        <div className="group rounded-[22px] border border-slate-200/70 bg-white p-5 shadow-[0_8px_30px_-20px_rgba(15,23,42,.24)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-semibold text-slate-500">{label}</span>
                <span
                    className="grid size-11 place-items-center rounded-2xl"
                    style={{ background: bg, color }}
                >
                    <Icon size={21} />
                </span>
            </div>
            <p className="mt-3 text-[30px] font-bold tracking-tight text-slate-900">
                {value}
            </p>
            <p className="mt-2 text-xs text-slate-500">{detail}</p>
        </div>
    );
}

function Modal({ title, description, onClose, children }) {
    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm"
            onMouseDown={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[26px] bg-white shadow-2xl"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-5">
                    <div>
                        <h2 className="text-lg font-bold">{title}</h2>
                        <p className="mt-1 text-xs text-slate-500">{description}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

function BookForm({ book, onClose, onSave }) {
    const [form, setForm] = useState(book || {
        title: '', author: '', isbn: '', category: 'Literature',
        shelf: '', total: 1,
    });
    const [error, setError] = useState('');

    function submit(e) {
        e.preventDefault();

        const data = {
            ...form,
            title: form.title.trim(),
            author: form.author.trim(),
            isbn: form.isbn.trim(),
            shelf: form.shelf.trim(),
            total: Number(form.total),
        };

        if (!data.title || !data.author || !data.isbn || !data.shelf) {
            setError('Please complete all required fields.');
            return;
        }
        if (!Number.isInteger(data.total) || data.total < 1) {
            setError('Total copies must be a positive whole number.');
            return;
        }

        const result = onSave(data, book);
        if (result) setError(result);
    }

    return (
        <Modal
            title={book ? 'Edit Book' : 'Add New Book'}
            description="Manage the school library collection."
            onClose={onClose}
        >
            <form onSubmit={submit} className="space-y-4 p-6">
                {[
                    ['title', 'Book Title'],
                    ['author', 'Author'],
                    ['isbn', 'ISBN / Catalogue Identifier'],
                    ['shelf', 'Shelf Location'],
                ].map(([key, label]) => (
                    <label key={key} className="block">
                        <span className="mb-2 block text-xs font-semibold text-slate-600">
                            {label}
                        </span>
                        <Input
                            required
                            value={form[key] ?? ''}
                            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                            className="h-11 rounded-xl"
                        />
                    </label>
                ))}

                <div className="grid grid-cols-2 gap-4">
                    <label>
                        <span className="mb-2 block text-xs font-semibold text-slate-600">Category</span>
                        <select
                            className={inputClass}
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                        >
                            {libraryCategories.map((c) => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        <span className="mb-2 block text-xs font-semibold text-slate-600">Total Copies</span>
                        <Input
                            required type="number" min="1" step="1"
                            value={form.total}
                            onChange={(e) => setForm({ ...form, total: e.target.value })}
                            className="h-11 rounded-xl"
                        />
                    </label>
                </div>

                {error && (
                    <p role="alert" className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700">
                        {error}
                    </p>
                )}

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-5">
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" className="bg-[#257cbe] hover:bg-[#176aa5]">
                        <Check size={16} className="mr-2" /> Save Book
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

function IssueForm({ books, loans, onSave, onClose }) {
    const today = dateISO();
    const [form, setForm] = useState({
        studentId: '', bookId: '', issueDate: today,
        dueDate: addDays(today, 14),
    });
    const [error, setError] = useState('');

    const available = (id) => {
        const book = books.find((b) => b.id === id);
        if (!book) return 0;
        return book.total - loans.filter(
            (l) => l.bookId === id && !l.returnDate
        ).length;
    };

    function submit(e) {
        e.preventDefault();
        if (!form.studentId || !form.bookId) {
            setError('Select a student and book.');
            return;
        }
        if (form.dueDate < form.issueDate) {
            setError('Due date cannot be before issue date.');
            return;
        }
        const result = onSave(form);
        if (result) setError(result);
    }

    return (
        <Modal
            title="Issue a Book"
            description="Register a new student borrowing transaction."
            onClose={onClose}
        >
            <form onSubmit={submit} className="space-y-5 p-6">
                <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-slate-600">
                        Select Student
                    </span>
                    <select
                        required className={inputClass}
                        value={form.studentId}
                        onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                    >
                        <option value="">Choose student...</option>
                        {libraryStudents.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.name} · Class {student.className}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-slate-600">
                        Select Book
                    </span>
                    <select
                        required className={inputClass}
                        value={form.bookId}
                        onChange={(e) => setForm({ ...form, bookId: e.target.value })}
                    >
                        <option value="">Choose available book...</option>
                        {books.filter((b) => available(b.id) > 0).map((book) => (
                            <option key={book.id} value={book.id}>
                                {book.title} · {available(book.id)} available
                            </option>
                        ))}
                    </select>
                </label>

                <div className="grid grid-cols-2 gap-4">
                    {[
                        ['issueDate', 'Issue Date'],
                        ['dueDate', 'Due Date'],
                    ].map(([key, label]) => (
                        <label key={key}>
                            <span className="mb-2 block text-xs font-semibold text-slate-600">
                                {label}
                            </span>
                            <Input
                                key={key}
                                required type="date"
                                value={form[key]}
                                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                className="h-11 rounded-xl"
                            />
                        </label>
                    ))}
                </div>

                <div className="rounded-xl bg-blue-50 p-4 text-xs leading-5 text-blue-800">
                    <BookMarked size={17} className="mb-2" />
                    This is a demo circulation record. It will not update a real school library database.
                </div>

                {error && (
                    <p role="alert" className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700">
                        {error}
                    </p>
                )}

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" className="bg-[#257cbe] hover:bg-[#176aa5]">
                        <Check size={16} className="mr-2" /> Issue Book
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

function LoanStatus({ loan, today }) {
    if (loan.returnDate) {
        return (
            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700">
                Returned
            </span>
        );
    }
    if (loan.dueDate < today) {
        return (
            <span className="rounded-full bg-rose-50 px-3 py-1.5 text-[11px] font-bold text-rose-700">
                Overdue
            </span>
        );
    }
    return (
        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-[#257cbe]">
            Issued
        </span>
    );
}

export default function LibraryPage() {
    const [store, setStore] = useState(readData);
    const [tab, setTab] = useState('overview');
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [modal, setModal] = useState(null);
    const [notice, setNotice] = useState('');
    const today = dateISO();

    const { books, loans } = store;

    const bookById = useMemo(
        () => Object.fromEntries(books.map((b) => [b.id, b])),
        [books]
    );
    const studentById = useMemo(
        () => Object.fromEntries(libraryStudents.map((s) => [s.id, s])),
        []
    );

    const activeLoans = loans.filter((l) => !l.returnDate);
    const overdue = activeLoans.filter((l) => l.dueDate < today);
    const totalCopies = books.reduce((n, b) => n + b.total, 0);
    const availableCopies = totalCopies - activeLoans.length;
    const availabilityRate = totalCopies
        ? Math.round(availableCopies / totalCopies * 100)
        : 0;

    function availableFor(bookId) {
        return (bookById[bookId]?.total || 0) -
            activeLoans.filter((l) => l.bookId === bookId).length;
    }

    function persist(updated, message) {
        try {
            localStorage.setItem(STORE_KEY, JSON.stringify(updated));
            setStore(updated);
            setNotice(message);
            return true;
        } catch {
            setNotice('Could not save changes to browser storage.');
            return false;
        }
    }

    function saveBook(data, original) {
        if (books.some((b) => b.id !== original?.id &&
            b.isbn.toLowerCase() === data.isbn.toLowerCase())) {
            return 'This catalogue identifier already exists.';
        }

        const issued = original
            ? activeLoans.filter((l) => l.bookId === original.id).length
            : 0;

        if (data.total < issued) {
            return `At least ${issued} copies are currently issued.`;
        }

        const palette = [
            'from-indigo-700 to-blue-400',
            'from-teal-800 to-cyan-400',
            'from-rose-700 to-orange-400',
            'from-violet-800 to-purple-400',
        ];

        const next = original
            ? books.map((b) => b.id === original.id ? { ...b, ...data } : b)
            : [...books, {
                ...data,
                id: crypto.randomUUID(),
                cover: palette[books.length % palette.length],
                initials: data.title.split(/\s+/).slice(0, 2)
                    .map((x) => x[0]).join('').toUpperCase(),
            }];

        if (persist({ ...store, books: next }, 'Book saved to demo catalogue.')) {
            setModal(null);
        }
        return null;
    }

    function issueBook(data) {
        if (!libraryStudents.some((s) => s.id === data.studentId)) {
            return 'Please choose a valid student.';
        }
        if (!bookById[data.bookId] || availableFor(data.bookId) < 1) {
            return 'No copies are available.';
        }
        if (data.dueDate < data.issueDate) {
            return 'Invalid borrowing dates.';
        }
        if (activeLoans.some((l) =>
            l.studentId === data.studentId && l.bookId === data.bookId)) {
            return 'This student already has a copy of this book.';
        }

        const next = [...loans, {
            ...data, id: crypto.randomUUID(), returnDate: null,
        }];

        if (persist({ ...store, loans: next }, 'Book issued successfully in demo.')) {
            setModal(null);
            setTab('circulation');
        }
        return null;
    }

    function returnBook(loanId) {
        const loan = loans.find((l) => l.id === loanId);
        if (!loan || loan.returnDate) return;

        const updated = loans.map((l) =>
            l.id === loanId ? { ...l, returnDate: today } : l
        );

        if (persist({ ...store, loans: updated }, 'Book returned successfully in demo.')) {
            setModal(null);
        }
    }

    function exportHistory() {
        const rows = [
            ['Loan ID', 'Book', 'Student', 'Issue Date', 'Due Date', 'Return Date', 'Status'],
            ...loans.map((loan) => [
                loan.id,
                bookById[loan.bookId]?.title,
                studentById[loan.studentId]?.name,
                loan.issueDate, loan.dueDate, loan.returnDate || '',
                loan.returnDate ? 'Returned'
                    : loan.dueDate < today ? 'Overdue' : 'Issued',
            ]),
        ];

        const csv = rows.map((row) =>
            row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')
        ).join('\r\n');

        const url = URL.createObjectURL(new Blob(['\uFEFF', csv], {
            type: 'text/csv;charset=utf-8',
        }));
        const link = document.createElement('a');
        link.href = url;
        link.download = 'olive-library-history-demo.csv';
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    const filteredBooks = books.filter((book) =>
        (category === 'All' || book.category === category) &&
        `${book.title} ${book.author} ${book.isbn} ${book.shelf}`
            .toLowerCase().includes(search.toLowerCase().trim())
    );

    const filteredLoans = loans.filter((loan) =>
        `${bookById[loan.bookId]?.title} ${studentById[loan.studentId]?.name} ${loan.id}`
            .toLowerCase().includes(search.toLowerCase().trim())
    ).sort((a, b) => b.issueDate.localeCompare(a.issueDate));

    const tabs = [
        ['overview', 'Overview', LibraryBig],
        ['catalogue', 'Book Catalogue', BookOpen],
        ['circulation', 'Issue & Return', BookMarked],
        ['history', 'Borrowing History', CalendarClock],
    ];

    function switchTab(id) {
        setTab(id);
        setSearch('');
        setCategory('All');
    }

    return (
        <div className="erp-compact erp-compact--library mx-auto max-w-[1550px] space-y-4 pb-4 text-slate-900">
            {/* LIBRARY HERO */}
            <section className="relative overflow-hidden rounded-[28px] bg-[#133858] p-7 text-white shadow-[0_20px_55px_-28px_rgba(19,56,88,.7)] sm:p-9">
                <div className="pointer-events-none absolute -right-16 -top-36 size-[400px] rounded-full border border-white/10" />
                <div className="pointer-events-none absolute -right-3 -top-24 size-[280px] rounded-full border border-white/10" />
                <div className="pointer-events-none absolute bottom-[-130px] right-1/3 size-72 rounded-full bg-sky-400/20 blur-3xl" />

                <div className="relative flex flex-wrap items-center justify-between gap-7">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold tracking-widest text-blue-100">
                            <Sparkles size={13} /> THE DIGITAL LIBRARY
                        </span>
                        <h1 className="mt-5 text-2xl font-bold tracking-tight sm:text-4xl">
                            A world of knowledge.
                        </h1>
                        <p className="mt-3 max-w-lg text-sm leading-6 text-blue-100/80">
                            Discover, organize and manage your school's reading collection
                            in one beautiful workspace.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <Badge className="border border-white/15 bg-white/10 px-3 py-1.5 text-white">
                                <BookOpen size={13} className="mr-1.5" /> Olive English School
                            </Badge>
                            <Badge className="border border-amber-300/30 bg-amber-400/15 px-3 py-1.5 text-amber-100">
                                Frontend Demo
                            </Badge>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-[22px] border border-white/15 bg-white/10 p-5 backdrop-blur">
                        <div className="grid size-14 place-items-center rounded-2xl bg-white/15">
                            <BookCopy size={28} />
                        </div>
                        <div>
                            <p className="text-xs text-blue-200">Collection Size</p>
                            <p className="mt-1 text-4xl font-bold">{totalCopies}</p>
                            <p className="text-xs text-blue-200">Physical book copies</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* METRICS */}
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                <Metric label="Book Titles" value={books.length} detail="Unique catalogue records" Icon={BookOpen} color="#257cbe" bg="#eaf4fc" />
                <Metric label="Available Copies" value={availableCopies} detail="Ready to borrow" Icon={CheckCircle2} color="#10b981" bg="#ecfdf5" />
                <Metric label="Currently Issued" value={activeLoans.length} detail="Active borrowing records" Icon={UsersRound} color="#8b5cf6" bg="#f5f3ff" />
                <Metric label="Overdue Books" value={overdue.length} detail="Past their return date" Icon={Clock3} color="#f43f5e" bg="#fff1f2" />
            </div>

            {/* NAVIGATION */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-[20px] border border-slate-200 bg-white p-2 shadow-sm">
                <div className="flex gap-1 overflow-x-auto">
                    {tabs.map(([id, label, Icon]) => (
                        <button
                            key={id}
                            onClick={() => switchTab(id)}
                            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold transition sm:text-sm ${tab === id
                                    ? 'bg-[#257cbe] text-white shadow-md shadow-blue-200/50'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                }`}
                        >
                            <Icon size={16} /> {label}
                        </button>
                    ))}
                </div>
                <Badge variant="outline" className="mx-2 hidden rounded-full lg:inline-flex">
                    Library Workspace
                </Badge>
            </div>

            {notice && (
                <div role="status" className="flex items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-800">
                    {notice}
                    <button onClick={() => setNotice('')} aria-label="Dismiss">
                        <X size={15} />
                    </button>
                </div>
            )}

            {/* OVERVIEW */}
            {tab === 'overview' && (
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_310px]">
                    <Surface>
                        <div className="flex items-center justify-between border-b border-slate-100 p-5">
                            <div>
                                <h2 className="text-lg font-bold">Explore the Collection</h2>
                                <p className="mt-1 text-xs text-slate-500">Featured books from your library</p>
                            </div>
                            <button onClick={() => switchTab('catalogue')} className="text-xs font-bold text-[#257cbe]">
                                View All <ArrowRight size={14} className="ml-1 inline" />
                            </button>
                        </div>
                        <div className="grid gap-4 p-5 sm:grid-cols-2">
                            {books.slice(0, 6).map((book) => (
                                <button
                                    key={book.id}
                                    onClick={() => {
                                        setModal({ type: 'book', book });
                                    }}
                                    className="flex gap-4 rounded-2xl border border-slate-100 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                                >
                                    <BookCover book={book} />
                                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#257cbe]">
                                            {book.category}
                                        </p>
                                        <h3 className="mt-2 line-clamp-2 text-sm font-bold">{book.title}</h3>
                                        <p className="mt-1 text-xs text-slate-400">{book.author}</p>
                                        <p className="mt-4 text-[11px] font-semibold text-emerald-600">
                                            {availableFor(book.id)} available
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </Surface>

                    <div className="space-y-5">
                        <Surface>
                            <div className="p-5">
                                <h3 className="text-sm font-bold">Collection Health</h3>
                                <div className="relative mx-auto my-6 flex size-40 items-center justify-center">
                                    <div
                                        className="absolute inset-0 rounded-full"
                                        style={{
                                            background: `conic-gradient(#257cbe ${availabilityRate}%, #eef2f7 ${availabilityRate}% 100%)`,
                                        }}
                                    />
                                    <div className="relative flex size-[132px] flex-col items-center justify-center rounded-full bg-white">
                                        <span className="text-3xl font-bold">{availabilityRate}%</span>
                                        <span className="text-[11px] text-slate-400">Availability</span>
                                    </div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Available copies</span>
                                    <strong className="text-slate-800">{availableCopies}</strong>
                                </div>
                                <Progress value={availabilityRate} className="mt-3 h-2" />
                            </div>
                        </Surface>

                        <div className="rounded-[22px] bg-[#eaf4fc] p-5">
                            <div className="grid size-11 place-items-center rounded-xl bg-white text-[#257cbe]">
                                <BookMarked size={23} />
                            </div>
                            <h3 className="mt-4 font-bold text-[#174e7a]">Simpler Circulation</h3>
                            <p className="mt-2 text-xs leading-5 text-[#4e789a]">
                                Issue books, track due dates and record returns from one organized workspace.
                            </p>
                            <Button
                                onClick={() => setModal({ type: 'issue' })}
                                className="mt-5 bg-[#257cbe] hover:bg-[#176aa5]"
                            >
                                Issue a Book <ArrowRight size={15} className="ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* CATALOGUE */}
            {tab === 'catalogue' && (
                <Surface>
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-6">
                        <div>
                            <h2 className="text-lg font-bold">Book Catalogue</h2>
                            <p className="mt-1 text-xs text-slate-500">Manage book titles, copies and shelf locations.</p>
                        </div>
                        <Button onClick={() => setModal({ type: 'book', book: null })} className="bg-[#257cbe] hover:bg-[#176aa5]">
                            <Plus size={17} className="mr-2" /> Add Book
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-3 p-5">
                        <div className="relative min-w-[200px] flex-1">
                            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input
                                className="h-11 rounded-xl pl-10"
                                placeholder="Search title, author, ISBN..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <select
                            className={`${inputClass} max-w-48`}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            {libraryCategories.map((item) => (
                                <option key={item}>{item}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid gap-4 p-5 pt-0 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredBooks.map((book) => (
                            <div
                                key={book.id}
                                className="group rounded-[20px] border border-slate-200 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/40"
                            >
                                <div className="flex gap-4">
                                    <BookCover book={book} />
                                    <div className="min-w-0 flex-1">
                                        <Badge variant="secondary" className="rounded-lg text-[10px]">
                                            {book.category}
                                        </Badge>
                                        <h3 className="mt-3 line-clamp-2 text-sm font-bold">{book.title}</h3>
                                        <p className="mt-1 truncate text-xs text-slate-400">{book.author}</p>
                                        <p className="mt-3 text-[11px] text-slate-500">
                                            Shelf {book.shelf}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                                    <span className={`text-xs font-semibold ${availableFor(book.id) ? 'text-emerald-600' : 'text-rose-600'
                                        }`}>
                                        {availableFor(book.id)} / {book.total} available
                                    </span>
                                    <button
                                        onClick={() => setModal({ type: 'book', book })}
                                        className="flex items-center gap-1.5 text-xs font-semibold text-[#257cbe]"
                                    >
                                        <Pencil size={14} /> Edit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {!filteredBooks.length && (
                        <p className="p-12 text-center text-sm text-slate-400">
                            No books match your filters.
                        </p>
                    )}
                </Surface>
            )}

            {/* CIRCULATION */}
            {tab === 'circulation' && (
                <Surface>
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-6">
                        <div>
                            <h2 className="text-lg font-bold">Issue & Return Register</h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Track active loans, due dates and overdue books.
                            </p>
                        </div>
                        <Button onClick={() => setModal({ type: 'issue' })} className="bg-[#257cbe] hover:bg-[#176aa5]">
                            <Plus size={17} className="mr-2" /> Issue Book
                        </Button>
                    </div>

                    <div className="relative m-5 max-w-sm">
                        <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            className="h-11 rounded-xl pl-10"
                            placeholder="Search active loans..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[770px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
                                <tr>
                                    <th className="px-5 py-4">Book</th>
                                    <th className="px-4 py-4">Borrower</th>
                                    <th className="px-4 py-4">Issue Date</th>
                                    <th className="px-4 py-4">Due Date</th>
                                    <th className="px-4 py-4">Status</th>
                                    <th className="px-5 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredLoans.filter((l) => !l.returnDate).map((loan) => (
                                    <tr key={loan.id} className="hover:bg-blue-50/30">
                                        <td className="px-5 py-4">
                                            <p className="font-semibold">{bookById[loan.bookId]?.title}</p>
                                            <p className="mt-1 text-[11px] text-slate-400">{loan.id.slice(0, 12)}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="text-xs font-semibold">{studentById[loan.studentId]?.name}</p>
                                            <p className="mt-1 text-[11px] text-slate-400">
                                                Class {studentById[loan.studentId]?.className}
                                            </p>
                                        </td>
                                        <td className="px-4 py-4 text-xs text-slate-600">{prettyDate(loan.issueDate)}</td>
                                        <td className="px-4 py-4 text-xs text-slate-600">{prettyDate(loan.dueDate)}</td>
                                        <td className="px-4 py-4"><LoanStatus loan={loan} today={today} /></td>
                                        <td className="px-5 py-4 text-right">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setModal({ type: 'return', loan })}
                                                className="rounded-xl"
                                            >
                                                <RotateCcw size={14} className="mr-1.5" /> Return
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {!filteredLoans.some((l) => !l.returnDate) && (
                            <p className="p-12 text-center text-sm text-slate-400">
                                No active loans found.
                            </p>
                        )}
                    </div>
                </Surface>
            )}

            {/* HISTORY */}
            {tab === 'history' && (
                <Surface>
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-6">
                        <div>
                            <h2 className="text-lg font-bold">Borrowing History</h2>
                            <p className="mt-1 text-xs text-slate-500">All fictional borrowing transactions.</p>
                        </div>
                        <Button variant="outline" onClick={exportHistory}>
                            <ArrowDownToLine size={16} className="mr-2" /> Export CSV
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[680px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">Book</th>
                                    <th className="px-4 py-4">Student</th>
                                    <th className="px-4 py-4">Issued</th>
                                    <th className="px-4 py-4">Returned</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredLoans.map((loan) => (
                                    <tr key={loan.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-semibold">
                                            {bookById[loan.bookId]?.title}
                                        </td>
                                        <td className="px-4 py-4 text-xs">
                                            {studentById[loan.studentId]?.name}
                                        </td>
                                        <td className="px-4 py-4 text-xs">{prettyDate(loan.issueDate)}</td>
                                        <td className="px-4 py-4 text-xs">{prettyDate(loan.returnDate)}</td>
                                        <td className="px-6 py-4"><LoanStatus loan={loan} today={today} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {!filteredLoans.length && (
                            <p className="p-12 text-center text-sm text-slate-400">No borrowing history yet.</p>
                        )}
                    </div>
                </Surface>
            )}

            {modal?.type === 'book' && (
                <BookForm
                    key={modal.book?.id || 'new'}
                    book={modal.book}
                    onClose={() => setModal(null)}
                    onSave={saveBook}
                />
            )}

            {modal?.type === 'issue' && (
                <IssueForm
                    books={books}
                    loans={loans}
                    onClose={() => setModal(null)}
                    onSave={issueBook}
                />
            )}

            {modal?.type === 'return' && (
                <Modal
                    title="Confirm Book Return"
                    description="Complete the borrowing transaction."
                    onClose={() => setModal(null)}
                >
                    <div className="space-y-5 p-6">
                        <div className="rounded-2xl bg-blue-50 p-5">
                            <BookMarked size={24} className="text-[#257cbe]" />
                            <h3 className="mt-3 font-bold">{bookById[modal.loan.bookId]?.title}</h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Borrowed by {studentById[modal.loan.studentId]?.name}
                            </p>
                            <p className="mt-3 text-xs text-slate-600">
                                Due {prettyDate(modal.loan.dueDate)}
                            </p>
                        </div>
                        <p className="text-sm text-slate-600">
                            Mark this book as returned on {prettyDate(today)}?
                        </p>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setModal(null)}>Cancel</Button>
                            <Button
                                onClick={() => returnBook(modal.loan.id)}
                                className="bg-[#257cbe] hover:bg-[#176aa5]"
                            >
                                <Check size={16} className="mr-2" /> Confirm Return
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
