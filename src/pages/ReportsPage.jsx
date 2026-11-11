
import { useMemo, useState } from 'react';
import {
    Activity, ArrowDownRight, ArrowDownToLine,
    ArrowRight, ArrowUpRight, BookOpen, BusFront,
    CalendarDays, CheckCircle2, ChevronDown,
    CircleDollarSign, Clock3, GraduationCap,
    Layers3, LibraryBig, RefreshCw, Sparkles,
    TrendingUp, UsersRound, Wallet,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import {
    reportMonths, reportClasses, reportGradeDistribution,
    reportCategories, reportCurrency, reportCompactCurrency,
} from '../data/reports.mock';

import {
    initialFeeInvoices,
    initialFeePayments,
} from '../data/fees.mock';

import {
    initialStaff,
    initialDepartments,
    initialLeaveRequests,
} from '../data/staff.mock';

import {
    initialVehicles,
    initialRoutes,
    initialDrivers,
    initialAllocations,
} from '../data/transport.mock';

import {
    initialBooks,
    initialLoans,
} from '../data/library.mock';

import {
    initialExams,
    initialMarks,
} from '../data/examinations.mock';

import '../styles/erp-compact.css';

const storageKeys = {
    fees: 'olive-fees-demo-v1',
    staff: 'olive-hr-demo-v1',
    transport: 'olive-transport-v1',
    library: 'olive-library-demo-v1',
    exams: 'olive-examinations-demo-v1',
};

function readLocal(key, fallback) {
    try {
        const stored = JSON.parse(localStorage.getItem(key) || 'null');
        if (!stored || typeof stored !== 'object') return fallback;

        const valid = Object.keys(fallback).every(
            (name) => Array.isArray(stored[name])
        );

        return valid ? stored : fallback;
    } catch {
        return fallback;
    }
}

function getSnapshot() {
    return {
        fees: readLocal(storageKeys.fees, {
            invoices: initialFeeInvoices,
            payments: initialFeePayments,
            plans: [],
        }),
        staff: readLocal(storageKeys.staff, {
            staff: initialStaff,
            departments: initialDepartments,
            leaves: initialLeaveRequests,
        }),
        transport: readLocal(storageKeys.transport, {
            vehicles: initialVehicles,
            routes: initialRoutes,
            drivers: initialDrivers,
            allocations: initialAllocations,
        }),
        library: readLocal(storageKeys.library, {
            books: initialBooks,
            loans: initialLoans,
        }),
        exams: readLocal(storageKeys.exams, {
            exams: initialExams,
            marks: initialMarks,
        }),
    };
}

function downloadCsv(name, rows) {
    const content = rows.map((row) =>
        row.map((item) =>
            `"${String(item ?? '').replaceAll('"', '""')}"`
        ).join(',')
    ).join('\r\n');

    const url = URL.createObjectURL(
        new Blob(['\uFEFF', content], {
            type: 'text/csv;charset=utf-8',
        })
    );

    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Panel({ title, subtitle, action, children, className = '' }) {
    return (
        <Card className={`gap-0 overflow-hidden rounded-[24px] border-slate-200/70 bg-white py-0 shadow-[0_12px_36px_-26px_rgba(15,23,42,.32)] ${className}`}>
            <CardContent className="p-0">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
                    <div>
                        <h2 className="text-[15px] font-bold tracking-tight text-slate-900">
                            {title}
                        </h2>
                        <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
                    </div>
                    {action}
                </div>
                {children}
            </CardContent>
        </Card>
    );
}

function Metric({ label, value, detail, Icon, accent, soft, trend }) {
    return (
        <div className="group relative overflow-hidden rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_-22px_rgba(15,23,42,.32)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/40">
            <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-semibold text-slate-500">{label}</span>
                <span
                    className="grid size-11 shrink-0 place-items-center rounded-2xl"
                    style={{ color: accent, background: soft }}
                >
                    <Icon size={21} />
                </span>
            </div>

            <p className="mt-4 text-[28px] font-bold tracking-tight text-slate-900 sm:text-[30px]">
                {value}
            </p>

            <div className="mt-3 flex items-center gap-2">
                {trend && (
                    <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-[#257cbe]">
                        <TrendingUp size={12} /> {trend}
                    </span>
                )}
                <span className="text-[11px] text-slate-400">{detail}</span>
            </div>

            <div
                className="absolute bottom-0 left-5 right-5 h-[2px] rounded-full opacity-60"
                style={{ backgroundColor: accent }}
            />
        </div>
    );
}

function RevenueChart({ data, selected, onSelect }) {
    const max = Math.max(
        1,
        ...data.flatMap((d) => [d.revenue, d.target])
    );

    return (
        <div className="px-4 pb-5 pt-7 sm:px-6">
            <div className="mb-7 flex flex-wrap items-center gap-5">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="size-2.5 rounded-full bg-[#257cbe]" />
                    Collected
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="size-2.5 rounded-full bg-[#bfd9ed]" />
                    Target
                </div>
                <span className="ml-auto text-[11px] text-slate-400">
                    Historical demo figures
                </span>
            </div>

            <div className="grid grid-cols-[42px_minmax(0,1fr)] gap-2">
                <div className="flex h-52 flex-col justify-between pb-1 text-right text-[10px] text-slate-400">
                    {[1, 0.75, 0.5, 0.25, 0].map((ratio) => (
                        <span key={ratio}>
                            {reportCompactCurrency(max * ratio)}
                        </span>
                    ))}
                </div>

                <div>
                    <div className="relative h-52">
                        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                            {[0, 1, 2, 3, 4].map((n) => (
                                <div key={n} className="border-t border-dashed border-slate-100" />
                            ))}
                        </div>

                        <div className="relative flex h-full items-end gap-2 sm:gap-4">
                            {data.map((item) => {
                                const active = selected === item.id;
                                return (
                                    <button
                                        type="button"
                                        key={item.id}
                                        onClick={() => onSelect(item.id)}
                                        title={`${item.label}: ${reportCurrency(item.revenue)} collected, ${reportCurrency(item.target)} target`}
                                        aria-pressed={active}
                                        className={`group/bar flex h-full min-w-0 flex-1 items-end justify-center gap-1 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#257cbe] ${active ? 'bg-blue-50/60' : 'hover:bg-slate-50'
                                            }`}
                                    >
                                        <span
                                            className={`w-[38%] max-w-8 rounded-t-md transition-all duration-500 ${active ? 'bg-[#176ba8]' : 'bg-[#257cbe] group-hover/bar:bg-[#176ba8]'
                                                }`}
                                            style={{ height: `${item.revenue / max * 100}%` }}
                                        />
                                        <span
                                            className="w-[38%] max-w-8 rounded-t-md bg-[#c7dfef] transition-all duration-500"
                                            style={{ height: `${item.target / max * 100}%` }}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-3 flex gap-2 sm:gap-4">
                        {data.map((item) => (
                            <span
                                key={item.id}
                                className={`min-w-0 flex-1 text-center text-[11px] font-semibold ${selected === item.id ? 'text-[#257cbe]' : 'text-slate-400'
                                    }`}
                            >
                                {item.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function AttendanceChart({ data }) {
    const values = data.map((d) => d.attendance);
    const step = 560 / Math.max(1, data.length - 1);
    const points = values.map((value, i) => ({
        x: i * step + 20,
        y: 190 - value * 1.65,
        value,
        label: data[i].label,
    }));

    const line = points.map((p) => `${p.x},${p.y}`).join(' ');
    const area = `20,190 ${line} ${points.at(-1)?.x || 20},190`;

    return (
        <div className="p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                    <p className="text-3xl font-bold tracking-tight">
                        {data.at(-1)?.attendance ?? 0}%
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        Latest attendance rate in selected period
                    </p>
                </div>
                <span className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                    Demo Trend
                </span>
            </div>

            <svg
                viewBox="0 0 600 205"
                role="img"
                aria-label="Monthly attendance trend"
                className="h-auto w-full overflow-visible"
            >
                <defs>
                    <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#257cbe" stopOpacity=".22" />
                        <stop offset="100%" stopColor="#257cbe" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {[50, 100, 150, 190].map((y) => (
                    <line
                        key={y}
                        x1="10" x2="590" y1={y} y2={y}
                        stroke="#e8eef4"
                        strokeDasharray="5 5"
                    />
                ))}

                <polygon points={area} fill="url(#attendanceFill)" />
                <polyline
                    points={line}
                    fill="none"
                    stroke="#257cbe"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {points.map((point) => (
                    <g key={point.label}>
                        <circle
                            cx={point.x}
                            cy={point.y}
                            r="5"
                            fill="white"
                            stroke="#257cbe"
                            strokeWidth="3"
                        />
                        <text
                            x={point.x}
                            y={point.y - 15}
                            textAnchor="middle"
                            fill="#257cbe"
                            fontSize="13"
                            fontWeight="700"
                        >
                            {point.value}%
                        </text>
                    </g>
                ))}
            </svg>

            <div className="flex justify-between">
                {data.map((item) => (
                    <span
                        key={item.id}
                        className="flex-1 text-center text-[11px] font-semibold text-slate-400"
                    >
                        {item.label}
                    </span>
                ))}
            </div>
        </div>
    );
}

function Distribution({ data }) {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    let angle = 0;

    const stops = data.map((item) => {
        const start = angle;
        angle += total ? item.count / total * 100 : 0;
        return `${item.color} ${start}% ${angle}%`;
    });

    return (
        <div className="grid gap-7 p-6 sm:grid-cols-[190px_minmax(0,1fr)] sm:items-center">
            <div className="relative mx-auto flex size-44 items-center justify-center">
                <div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: `conic-gradient(${stops.join(', ')})`,
                    }}
                />
                <div className="relative flex size-[135px] flex-col items-center justify-center rounded-full bg-white">
                    <span className="text-3xl font-bold">{total}</span>
                    <span className="text-xs text-slate-400">Assessments</span>
                </div>
            </div>

            <div className="space-y-3">
                {data.map((item) => (
                    <div key={item.grade} className="flex items-center gap-3">
                        <span
                            className="size-2.5 rounded-full"
                            style={{ background: item.color }}
                        />
                        <span className="flex-1 text-xs text-slate-600">
                            Grade {item.grade}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                            {item.count}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DepartmentPanel({ staff, departments }) {
    const total = Math.max(1, staff.length);

    return (
        <div className="space-y-5 p-6">
            {departments.map((department) => {
                const count = staff.filter(
                    (s) => s.departmentId === department.id
                ).length;

                return (
                    <div key={department.id}>
                        <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                            <span className="font-medium text-slate-600">
                                {department.name}
                            </span>
                            <strong className="text-slate-800">{count}</strong>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${count / total * 100}%`,
                                    background: department.color || '#257cbe',
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function OperationalItem({ Icon, name, detail, value, accent }) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3.5 transition hover:border-blue-100 hover:bg-blue-50/30">
            <div
                className="grid size-11 shrink-0 place-items-center rounded-xl"
                style={{ color: accent, background: `${accent}14` }}
            >
                <Icon size={20} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-800">{name}</p>
                <p className="mt-1 text-[11px] text-slate-400">{detail}</p>
            </div>
            <span className="text-lg font-bold text-slate-900">{value}</span>
        </div>
    );
}

export default function ReportsPage() {
    const [snapshot, setSnapshot] = useState(getSnapshot);
    const [category, setCategory] = useState('overview');
    const [period, setPeriod] = useState('6');
    const [selectedMonth, setSelectedMonth] = useState('2026-10');

    const months = reportMonths.slice(-Number(period));
    const activeMonth = months.find((m) => m.id === selectedMonth)
        || months.at(-1);

    const { fees, staff, transport, library, exams } = snapshot;

    const stats = useMemo(() => {
        const billed = fees.invoices.reduce(
            (sum, i) => sum + Number(i.amount || 0), 0
        );
        const collected = fees.invoices.reduce(
            (sum, i) => sum + Number(i.paid || 0), 0
        );
        const copies = library.books.reduce(
            (sum, b) => sum + Number(b.total || 0), 0
        );
        const activeLoans = library.loans.filter(
            (loan) => !loan.returnDate
        );

        const today = new Date();
        const todayString = [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, '0'),
            String(today.getDate()).padStart(2, '0'),
        ].join('-');

        const overdue = activeLoans.filter(
            (loan) => loan.dueDate < todayString
        ).length;

        return {
            billed,
            collected,
            pending: billed - collected,
            collectionRate: billed
                ? Math.round(collected / billed * 100) : 0,
            staffCount: staff.staff.length,
            activeStaff: staff.staff.filter(
                (s) => s.status === 'Active'
            ).length,
            pendingLeaves: staff.leaves.filter(
                (l) => l.status === 'Pending'
            ).length,
            vehicleCount: transport.vehicles.length,
            activeVehicles: transport.vehicles.filter(
                (v) => v.status === 'Active'
            ).length,
            allocations: transport.allocations.length,
            bookTitles: library.books.length,
            copies,
            activeLoans: activeLoans.length,
            overdue,
            exams: exams.exams.length,
            completedExams: exams.exams.filter(
                (e) => e.status === 'Completed'
            ).length,
            marksEntered: exams.marks.length,
        };
    }, [snapshot]);

    const trendRevenue = months.reduce(
        (sum, m) => sum + m.revenue, 0
    );
    const trendTarget = months.reduce(
        (sum, m) => sum + m.target, 0
    );
    const trendAttendance = Math.round(
        months.reduce((sum, m) => sum + m.attendance, 0)
        / months.length
    );

    const cardSets = {
        overview: [
            {
                label: 'Collected Fees',
                value: reportCompactCurrency(stats.collected),
                detail: 'Current fee demo ledger',
                Icon: Wallet, accent: '#257cbe', soft: '#eaf4fc',
            },
            {
                label: 'Collection Rate',
                value: `${stats.collectionRate}%`,
                detail: 'Of total fee demand',
                Icon: TrendingUp, accent: '#10b981', soft: '#ecfdf5',
            },
            {
                label: 'Active Employees',
                value: stats.activeStaff,
                detail: 'Current HR demo records',
                Icon: UsersRound, accent: '#8b5cf6', soft: '#f5f3ff',
            },
            {
                label: 'Books Issued',
                value: stats.activeLoans,
                detail: 'Active library loans',
                Icon: BookOpen, accent: '#f59e0b', soft: '#fffbeb',
            },
        ],
        finance: [
            {
                label: 'Total Demand',
                value: reportCompactCurrency(stats.billed),
                detail: 'Generated demo invoices',
                Icon: CircleDollarSign, accent: '#257cbe', soft: '#eaf4fc',
            },
            {
                label: 'Collected',
                value: reportCompactCurrency(stats.collected),
                detail: 'Received in demo ledger',
                Icon: Wallet, accent: '#10b981', soft: '#ecfdf5',
            },
            {
                label: 'Outstanding',
                value: reportCompactCurrency(stats.pending),
                detail: 'Uncollected demo balance',
                Icon: Clock3, accent: '#f59e0b', soft: '#fffbeb',
            },
            {
                label: 'Collection Rate',
                value: `${stats.collectionRate}%`,
                detail: 'Total collection efficiency',
                Icon: TrendingUp, accent: '#8b5cf6', soft: '#f5f3ff',
            },
        ],
        academics: [
            {
                label: 'Examinations',
                value: stats.exams,
                detail: 'Configured examinations',
                Icon: GraduationCap, accent: '#257cbe', soft: '#eaf4fc',
            },
            {
                label: 'Completed Exams',
                value: stats.completedExams,
                detail: 'Exam records completed',
                Icon: CheckCircle2, accent: '#10b981', soft: '#ecfdf5',
            },
            {
                label: 'Marks Recorded',
                value: stats.marksEntered,
                detail: 'Individual result entries',
                Icon: BookOpen, accent: '#8b5cf6', soft: '#f5f3ff',
            },
            {
                label: 'Demo Attendance',
                value: `${trendAttendance}%`,
                detail: 'Historical sample average',
                Icon: Activity, accent: '#f59e0b', soft: '#fffbeb',
            },
        ],
        operations: [
            {
                label: 'Total Staff',
                value: stats.staffCount,
                detail: 'HR demo directory',
                Icon: UsersRound, accent: '#257cbe', soft: '#eaf4fc',
            },
            {
                label: 'Active Vehicles',
                value: stats.activeVehicles,
                detail: 'Of registered fleet',
                Icon: BusFront, accent: '#10b981', soft: '#ecfdf5',
            },
            {
                label: 'Student Allocations',
                value: stats.allocations,
                detail: 'Transport assignments',
                Icon: GraduationCap, accent: '#8b5cf6', soft: '#f5f3ff',
            },
            {
                label: 'Overdue Books',
                value: stats.overdue,
                detail: 'Active loans past due',
                Icon: Clock3, accent: '#f43f5e', soft: '#fff1f2',
            },
        ],
    };

    function exportReport() {
        const rows = [
            ['Olive English School — Reports & Analytics Demo'],
            ['Category', category],
            ['Historical Demo Period', `${period} months ending October 2026`],
            ['Current Ledger — Total Demand', stats.billed],
            ['Current Ledger — Collected', stats.collected],
            ['Current Ledger — Outstanding', stats.pending],
            ['Current HR Staff', stats.staffCount],
            ['Active Vehicles', stats.activeVehicles],
            ['Active Library Loans', stats.activeLoans],
            [],
            ['Month', 'Demo Collection', 'Demo Target', 'Demo Attendance %', 'Demo Pass Rate %'],
            ...months.map((m) => [
                m.label, m.revenue, m.target, m.attendance, m.passRate,
            ]),
            [],
            ['Notice', 'Demo figures. Historical charts are fictional and are not reconstructed from operational records.'],
        ];

        downloadCsv(`olive-analytics-${category}-demo.csv`, rows);
    }

    return (
        <div className="erp-compact erp-compact--reports mx-auto max-w-[1550px] space-y-4 pb-4 text-slate-900">
            {/* HEADER */}
            <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.17em] text-[#257cbe]">
                        <span className="size-2 rounded-full bg-[#257cbe]" />
                        Intelligence / Reporting
                    </div>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-[30px]">
                        Reports & Analytics
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        One clear view of your school's performance.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="outline"
                        className="h-10 rounded-xl"
                        onClick={() => setSnapshot(getSnapshot())}
                    >
                        <RefreshCw size={15} className="mr-2" />
                        Refresh
                    </Button>

                    <Button
                        onClick={exportReport}
                        className="h-10 rounded-xl bg-[#257cbe] shadow-md shadow-blue-100 hover:bg-[#176ba6]"
                    >
                        <ArrowDownToLine size={16} className="mr-2" />
                        Export Report
                    </Button>
                </div>
            </header>

            {/* EXECUTIVE FEATURE */}
            <section className="relative overflow-hidden rounded-[26px] bg-[#102f54] p-6 text-white shadow-[0_20px_55px_-30px_rgba(16,47,84,.65)] sm:p-8">
                <div className="pointer-events-none absolute -right-24 -top-40 size-[440px] rounded-full border border-white/10" />
                <div className="pointer-events-none absolute -right-5 -top-20 size-[270px] rounded-full border border-white/10" />
                <div className="pointer-events-none absolute -bottom-32 right-1/3 size-80 rounded-full bg-blue-400/20 blur-3xl" />

                <div className="relative flex flex-wrap items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold tracking-wider text-blue-100">
                            <Sparkles size={13} /> EXECUTIVE INTELLIGENCE
                        </div>
                        <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
                            Understand more. Decide better.
                        </h2>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100/80">
                            Bringing academic, financial and operational insights
                            together in one thoughtfully designed workspace.
                        </p>
                        <div className="mt-5 flex flex-wrap gap-2">
                            <Badge className="border border-white/15 bg-white/10 px-3 py-1.5 text-white">
                                <GraduationCap size={13} className="mr-1.5" />
                                Olive English School
                            </Badge>
                            <Badge className="border border-amber-300/30 bg-amber-400/15 px-3 py-1.5 text-amber-100">
                                Demo Analytics
                            </Badge>
                        </div>
                    </div>

                    <div className="min-w-[205px] rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                        <p className="text-xs text-blue-200">Sample period collections</p>
                        <p className="mt-2 text-3xl font-bold tracking-tight">
                            {reportCompactCurrency(trendRevenue)}
                        </p>
                        <p className="mt-2 text-xs text-blue-200">
                            {period}-month historical illustration
                        </p>
                        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/15">
                            <div
                                className="h-full rounded-full bg-[#89caff]"
                                style={{
                                    width: `${Math.min(100, trendTarget ? trendRevenue / trendTarget * 100 : 0)}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* FILTER BAR */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-slate-200 bg-white p-2 shadow-sm">
                <div className="flex max-w-full gap-1 overflow-x-auto">
                    {reportCategories.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setCategory(item.id)}
                            className={`shrink-0 rounded-xl px-4 py-3 text-xs font-semibold transition sm:text-sm ${category === item.id
                                    ? 'bg-[#257cbe] text-white shadow-md shadow-blue-200/50'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <label className="mx-1 flex items-center gap-2 rounded-xl border border-slate-200 px-3">
                    <CalendarDays size={15} className="text-slate-400" />
                    <select
                        value={period}
                        onChange={(e) => {
                            setPeriod(e.target.value);
                            setSelectedMonth('2026-10');
                        }}
                        className="h-10 bg-transparent text-xs font-semibold text-slate-700 outline-none"
                    >
                        <option value="3">Last 3 Demo Months</option>
                        <option value="6">Last 6 Demo Months</option>
                    </select>
                </label>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="size-1.5 rounded-full bg-amber-400" />
                KPI cards reflect current local demo records; historical charts use fictional sample data.
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                {cardSets[category].map((item) => (
                    <Metric key={item.label} {...item} />
                ))}
            </div>

            {(category === 'overview' || category === 'finance') && (
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]">
                    <Panel
                        title="Collection Performance"
                        subtitle="Monthly sample collection versus target"
                        action={
                            <Badge variant="outline" className="rounded-lg text-[11px]">
                                {period}-Month View
                            </Badge>
                        }
                    >
                        <RevenueChart
                            data={months}
                            selected={activeMonth?.id}
                            onSelect={setSelectedMonth}
                        />

                        {activeMonth && (
                            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 bg-slate-50/50 p-5">
                                <div>
                                    <p className="text-xs text-slate-400">
                                        {activeMonth.label} collection
                                    </p>
                                    <p className="mt-1 text-lg font-bold">
                                        {reportCompactCurrency(activeMonth.revenue)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">
                                        Achievement
                                    </p>
                                    <p className="mt-1 text-lg font-bold text-[#257cbe]">
                                        {Math.round(activeMonth.revenue / activeMonth.target * 100)}%
                                    </p>
                                </div>
                            </div>
                        )}
                    </Panel>

                    <Panel
                        title="Financial Health"
                        subtitle="Current fee module demo ledger"
                        action={<Wallet size={18} className="text-[#257cbe]" />}
                    >
                        <div className="p-6">
                            <div className="flex flex-wrap items-center justify-between gap-5">
                                <div>
                                    <p className="text-xs font-medium text-slate-400">
                                        Collection efficiency
                                    </p>
                                    <p className="mt-2 text-[43px] font-bold tracking-tight">
                                        {stats.collectionRate}%
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Collected against total demand
                                    </p>
                                </div>
                                <div className="grid size-16 place-items-center rounded-[22px] bg-blue-50 text-[#257cbe]">
                                    <CircleDollarSign size={31} />
                                </div>
                            </div>

                            <Progress value={stats.collectionRate} className="mt-6 h-2.5" />

                            <div className="mt-7 space-y-5">
                                {[
                                    ['Total Demand', stats.billed, '#257cbe'],
                                    ['Amount Collected', stats.collected, '#10b981'],
                                    ['Outstanding', stats.pending, '#f59e0b'],
                                ].map(([label, value, color]) => (
                                    <div key={label} className="flex items-center gap-3">
                                        <span
                                            className="size-2.5 rounded-full"
                                            style={{ background: color }}
                                        />
                                        <span className="flex-1 text-xs text-slate-500">
                                            {label}
                                        </span>
                                        <strong className="text-sm">
                                            {reportCurrency(value)}
                                        </strong>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-7 rounded-2xl bg-blue-50 p-4">
                                <p className="text-xs font-semibold text-[#257cbe]">
                                    Financial snapshot
                                </p>
                                <p className="mt-2 text-xs leading-5 text-slate-600">
                                    These totals are calculated from the current Fees & Payments
                                    demo ledger, not from the historical illustration.
                                </p>
                            </div>
                        </div>
                    </Panel>
                </div>
            )}

            {(category === 'overview' || category === 'academics') && (
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,1fr)]">
                    <Panel
                        title="Attendance Trend"
                        subtitle="Monthly attendance rates — fictional historical data"
                        action={<Activity size={18} className="text-[#257cbe]" />}
                    >
                        <AttendanceChart data={months} />
                    </Panel>

                    <Panel
                        title="Grade Distribution"
                        subtitle="Illustrative student grade mix"
                        action={<GraduationCap size={19} className="text-[#257cbe]" />}
                    >
                        <Distribution data={reportGradeDistribution} />
                    </Panel>
                </div>
            )}

            {(category === 'overview' || category === 'academics') && (
                <Panel
                    title="Class Performance"
                    subtitle="Comparative sample attendance and examination outcomes"
                    action={
                        <Badge variant="outline" className="rounded-lg">
                            4 Sample Classes
                        </Badge>
                    }
                >
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[590px] text-left text-sm">
                            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                <tr>
                                    <th className="px-6 py-4">Class</th>
                                    <th className="px-5 py-4">Sample Students</th>
                                    <th className="px-5 py-4">Attendance</th>
                                    <th className="px-5 py-4">Pass Rate</th>
                                    <th className="px-6 py-4">Performance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {reportClasses.map((item) => (
                                    <tr key={item.name} className="hover:bg-blue-50/30">
                                        <td className="px-6 py-4 font-semibold text-slate-800">
                                            {item.name}
                                        </td>
                                        <td className="px-5 py-4 text-slate-600">
                                            {item.students}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                                                    <div
                                                        className="h-full rounded-full bg-[#257cbe]"
                                                        style={{ width: `${item.attendance}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-semibold">
                                                    {item.attendance}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 font-semibold">
                                            {item.passRate}%
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className={`rounded-lg ${item.passRate >= 90
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'bg-blue-50 text-[#257cbe]'
                                                }`}>
                                                {item.passRate >= 90 ? 'Excellent' : 'Good'}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Panel>
            )}

            {(category === 'overview' || category === 'operations') && (
                <div className="grid gap-6 xl:grid-cols-2">
                    <Panel
                        title="Workforce Distribution"
                        subtitle="Current HR demo employee records"
                        action={<UsersRound size={18} className="text-[#257cbe]" />}
                    >
                        <DepartmentPanel
                            staff={staff.staff}
                            departments={staff.departments}
                        />
                    </Panel>

                    <Panel
                        title="Operational Health"
                        subtitle="Live snapshot of local demo modules"
                        action={<Layers3 size={18} className="text-[#257cbe]" />}
                    >
                        <div className="space-y-3 p-5">
                            <OperationalItem
                                Icon={BusFront}
                                name="Transport Fleet"
                                detail={`${stats.vehicleCount} registered vehicles`}
                                value={stats.activeVehicles}
                                accent="#257cbe"
                            />
                            <OperationalItem
                                Icon={UsersRound}
                                name="Student Transport"
                                detail="Assigned transport users"
                                value={stats.allocations}
                                accent="#8b5cf6"
                            />
                            <OperationalItem
                                Icon={LibraryBig}
                                name="Library Collection"
                                detail={`${stats.copies} physical book copies`}
                                value={stats.bookTitles}
                                accent="#10b981"
                            />
                            <OperationalItem
                                Icon={Clock3}
                                name="Pending Staff Leaves"
                                detail="Awaiting HR review"
                                value={stats.pendingLeaves}
                                accent="#f59e0b"
                            />
                        </div>
                    </Panel>
                </div>
            )}

            {/* FOOTER */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-blue-100 bg-[#edf6fc] p-5">
                <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-white text-[#257cbe]">
                        <Sparkles size={19} />
                    </span>
                    <div>
                        <p className="text-xs font-bold text-[#174b75]">
                            Olive Intelligence Workspace
                        </p>
                        <p className="mt-1 text-[11px] text-[#5782a2]">
                            Demo analytics combining fictional trends and browser-saved module records.
                        </p>
                    </div>
                </div>
                <span className="text-[11px] font-semibold text-[#257cbe]">
                    Frontend Preview · No Backend Connection
                </span>
            </div>
        </div>
    );
}
