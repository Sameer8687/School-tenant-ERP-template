import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    X,
    LayoutDashboard,
    Users,
    UserRoundPlus,
    BookOpen,
    CalendarCheck,
    Wallet,
    ClipboardList,
    GraduationCap,
    ArrowRight,
} from 'lucide-react';

import { initialStudents } from '../../data/students.mock';

const navigationItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', category: 'Pages' },
    { label: 'Students', icon: Users, path: '/students', category: 'Pages' },
    { label: 'Admissions', icon: UserRoundPlus, path: '/admissions', category: 'Pages' },
    { label: 'Academics', icon: BookOpen, path: '/academics', category: 'Pages' },
    { label: 'Attendance', icon: CalendarCheck, path: '/attendance', category: 'Pages' },
    { label: 'Fees & Payments', icon: Wallet, path: '/fees', category: 'Pages' },
    { label: 'Examinations', icon: ClipboardList, path: '/examinations', category: 'Pages' },
    { label: 'Staff & HR', icon: GraduationCap, path: '/staff', category: 'Pages' },
];

export default function CommandPalette({ open, onClose }) {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef(null);

    useEffect(() => {
        if (open) {
            setQuery('');
            setActiveIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    const studentMatches = useMemo(() => {
        if (!query.trim()) return [];
        const q = query.toLowerCase();
        return initialStudents
            .filter((s) =>
                `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
                s.admissionNo.toLowerCase().includes(q)
            )
            .slice(0, 4)
            .map((s) => ({
                id: s.id,
                label: `${s.firstName} ${s.lastName} (${s.admissionNo})`,
                hint: `Class ${s.className}-${s.section}`,
                path: '/students',
                category: 'Students',
                icon: Users,
            }));
    }, [query]);

    const navMatches = useMemo(() => {
        const q = query.toLowerCase().trim();
        if (!q) return navigationItems;
        return navigationItems.filter((item) =>
            item.label.toLowerCase().includes(q)
        );
    }, [query]);

    const allResults = useMemo(() => {
        if (!query.trim()) return navMatches;
        return [...studentMatches, ...navMatches];
    }, [query, studentMatches, navMatches]);

    useEffect(() => {
        function handleKeyDown(e) {
            if (!open) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex((prev) => (prev + 1) % (allResults.length || 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex((prev) => (prev - 1 + allResults.length) % (allResults.length || 1));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (allResults[activeIndex]) {
                    navigate(allResults[activeIndex].path);
                    onClose();
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, activeIndex, allResults, navigate, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]">
            <div
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
                {/* Search Bar */}
                <div className="flex items-center gap-2.5 border-b border-slate-100 px-3.5 py-2.5">
                    <Search size={15} className="shrink-0 text-slate-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type to search pages or students..."
                        className="flex-1 bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery('')}
                            className="rounded p-0.5 text-slate-400 hover:text-slate-600"
                        >
                            <X size={13} />
                        </button>
                    )}
                    <kbd className="text-[10px] text-slate-400">ESC</kbd>
                </div>

                {/* Results List */}
                <div className="max-h-[300px] overflow-y-auto p-1.5 divide-y divide-slate-50">
                    {allResults.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-400">
                            No matching results
                        </div>
                    ) : (
                        allResults.map((item, index) => {
                            const Icon = item.icon || ArrowRight;
                            const isSelected = index === activeIndex;

                            return (
                                <button
                                    key={`${item.category}-${item.label}-${index}`}
                                    type="button"
                                    onClick={() => {
                                        navigate(item.path);
                                        onClose();
                                    }}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    className={`flex w-full items-center justify-between gap-2.5 rounded-md px-2.5 py-2 text-left text-xs ${
                                        isSelected
                                            ? 'bg-slate-100 text-slate-900 font-medium'
                                            : 'text-slate-700 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <Icon size={14} className="text-slate-400 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="truncate">{item.label}</p>
                                            {item.hint && (
                                                <p className="truncate text-[10px] text-slate-400 font-normal">
                                                    {item.hint}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-slate-400">{item.category}</span>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
