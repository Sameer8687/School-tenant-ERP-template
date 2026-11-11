
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Activity, ArrowDownToLine, ArrowLeft, ArrowRight,
    ArrowUpRight, BadgeCheck, BarChart3, Bell,
    Building2, CalendarDays, Check, CheckCircle2,
    ChevronDown, CircleDollarSign, Clock3, CreditCard,
    Filter, GraduationCap, LayoutDashboard, MoreHorizontal,
    Plus, Search, Settings2, ShieldCheck, Sparkles,
    TrendingUp, UsersRound, Wallet, X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

import {
    initialTenants, initialPlans, platformTrend, platformMoney,
} from '../data/platform.mock';

import '../styles/platform-compact.css';

const KEY = 'olive-platform-preview-v1';

function loadData() {
    try {
        const data = JSON.parse(localStorage.getItem(KEY) || 'null');
        if (Array.isArray(data?.tenants) && Array.isArray(data?.plans)) return data;
    } catch { }
    return { tenants: initialTenants, plans: initialPlans };
}

function exportCsv(filename, rows) {
    const csv = rows.map((row) =>
        row.map((v) => `"${String(v ?? '').replaceAll('"', '""')}"`).join(',')
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

const field =
    'h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-[12px] outline-none transition focus:border-[#257cbe] focus:ring-2 focus:ring-blue-100';

const statusColors = {
    Active: 'bg-emerald-50 text-emerald-700',
    Trial: 'bg-blue-50 text-blue-700',
    Suspended: 'bg-rose-50 text-rose-700',
};

function Status({ value }) {
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${statusColors[value] || statusColors.Trial}`}>
            <span className="size-1.5 rounded-full bg-current" />
            {value}
        </span>
    );
}

function Logo({ tenant, large = false }) {
    return (
        <div
            className={`grid shrink-0 place-items-center rounded-2xl font-bold text-white ${large ? 'size-14 text-lg' : 'size-11 text-sm'
                }`}
            style={{ background: tenant.color || '#257cbe' }}
        >
            {tenant.name.split(' ').slice(0, 2).map((x) => x[0]).join('')}
        </div>
    );
}

function Metric({ title, value, note, Icon, tone }) {
    const colors = {
        blue: ['#257cbe', '#eaf4fc'],
        violet: ['#7c3aed', '#f5f3ff'],
        emerald: ['#059669', '#ecfdf5'],
        amber: ['#d97706', '#fffbeb'],
    };
    const [color, soft] = colors[tone];

    return (
        <div className="group rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_35px_-24px_rgba(15,23,42,.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-start justify-between">
                <span className="text-xs font-semibold text-slate-500">{title}</span>
                <div className="grid size-11 place-items-center rounded-2xl" style={{ color, background: soft }}>
                    <Icon size={21} />
                </div>
            </div>
            <div className="mt-3 text-[30px] font-bold tracking-tight text-slate-900">{value}</div>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                <span className="size-1.5 rounded-full" style={{ background: color }} />
                {note}
            </div>
        </div>
    );
}

function Panel({ title, subtitle, action, children, className = '' }) {
    return (
        <Card className={`gap-0 overflow-hidden rounded-[24px] border-slate-200/80 bg-white py-0 shadow-[0_10px_32px_-24px_rgba(15,23,42,.25)] ${className}`}>
            <CardContent className="p-0">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
                    <div>
                        <h2 className="font-bold text-slate-900">{title}</h2>
                        <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
                    </div>
                    {action}
                </div>
                {children}
            </CardContent>
        </Card>
    );
}

function Modal({ title, subtitle, onClose, children }) {
    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" onMouseDown={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onMouseDown={(e) => e.stopPropagation()}
                className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[26px] bg-white shadow-2xl"
            >
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-6">
                    <div>
                        <h2 className="text-lg font-bold">{title}</h2>
                        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
                    </div>
                    <button aria-label="Close" onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100">
                        <X size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

function SchoolForm({ initial, plans, onSave, onClose }) {
    const [form, setForm] = useState(initial || {
        name: '', slug: '', city: '', contact: '',
        plan: 'Starter', status: 'Trial',
        students: 0, staff: 0,
        joined: new Date().toLocaleDateString('en-CA'),
        renewal: '',
        color: '#257cbe',
    });
    const [error, setError] = useState('');

    function update(key, value) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function submit(e) {
        e.preventDefault();
        const data = {
            ...form,
            name: form.name.trim(),
            slug: form.slug.trim().toLowerCase(),
            city: form.city.trim(),
            contact: form.contact.trim(),
            students: Number(form.students),
            staff: Number(form.staff),
        };

        if (!data.name || !data.slug || !data.city || !data.contact || !data.renewal) {
            setError('Complete all required fields.');
            return;
        }
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
            setError('Slug must use lowercase letters, numbers and hyphens.');
            return;
        }
        if (!Number.isInteger(data.students) || data.students < 0 ||
            !Number.isInteger(data.staff) || data.staff < 0) {
            setError('Student and staff counts must be non-negative whole numbers.');
            return;
        }
        if (data.renewal < data.joined) {
            setError('Renewal date cannot be before onboarding date.');
            return;
        }

        const result = onSave(data, initial);
        if (result) setError(result);
    }

    return (
        <Modal title={initial ? 'Edit School' : 'Onboard School'} subtitle="Configure a fictional SaaS tenant." onClose={onClose}>
            <form onSubmit={submit} className="space-y-4 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                    {[
                        ['name', 'School Name', 'text'],
                        ['slug', 'Tenant Slug', 'text'],
                        ['city', 'City', 'text'],
                        ['contact', 'Contact Email', 'email'],
                        ['students', 'Students (Demo)', 'number'],
                        ['staff', 'Staff (Demo)', 'number'],
                        ['joined', 'Onboarding Date', 'date'],
                        ['renewal', 'Renewal Date', 'date'],
                    ].map(([key, label, type]) => (
                        <label key={key} className="block min-w-0">
                            <span className="mb-2 block text-xs font-semibold text-slate-600">{label}</span>
                            <input
                                required
                                className={field}
                                type={type}
                                min={type === 'number' ? 0 : undefined}
                                value={form[key] ?? ''}
                                onChange={(e) => update(key, e.target.value)}
                            />
                        </label>
                    ))}

                    <label>
                        <span className="mb-2 block text-xs font-semibold text-slate-600">Subscription Plan</span>
                        <select className={field} value={form.plan} onChange={(e) => update('plan', e.target.value)}>
                            {plans.map((p) => <option key={p.id}>{p.name}</option>)}
                        </select>
                    </label>

                    <label>
                        <span className="mb-2 block text-xs font-semibold text-slate-600">Tenant Status</span>
                        <select className={field} value={form.status} onChange={(e) => update('status', e.target.value)}>
                            <option>Trial</option>
                            <option>Active</option>
                            <option>Suspended</option>
                        </select>
                    </label>
                </div>

                <div className="rounded-xl bg-amber-50 p-4 text-xs leading-5 text-amber-800">
                    This form simulates tenant onboarding. It does not create a database tenant, assign credentials, enable access or activate real billing.
                </div>

                {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700">{error}</p>}

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-5">
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" className="bg-[#257cbe] hover:bg-[#176ba5]">
                        <Check size={16} className="mr-2" /> Save Tenant
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

function PlanEditor({ plan, onSave, onClose }) {
    const [form, setForm] = useState({ ...plan });
    const [error, setError] = useState('');

    function submit(e) {
        e.preventDefault();
        const price = Number(form.price);
        const studentsLimit = Number(form.studentsLimit);
        if (!Number.isFinite(price) || price < 0 ||
            !Number.isInteger(studentsLimit) || studentsLimit < 1) {
            setError('Enter a valid price and student limit.');
            return;
        }
        onSave({ ...form, price, studentsLimit });
    }

    return (
        <Modal title={`Edit ${plan.name} Plan`} subtitle="Modify fictional subscription pricing." onClose={onClose}>
            <form onSubmit={submit} className="space-y-5 p-6">
                <label className="block">
                    <span className="mb-2 block text-xs font-semibold">Monthly Price (₹)</span>
                    <input type="number" min="0" step="1" required className={field} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </label>
                <label className="block">
                    <span className="mb-2 block text-xs font-semibold">Student Limit</span>
                    <input type="number" min="1" step="1" required className={field} value={form.studentsLimit} onChange={(e) => setForm({ ...form, studentsLimit: e.target.value })} />
                </label>
                {error && <p role="alert" className="text-xs text-rose-600">{error}</p>}
                <div className="flex justify-end gap-2">
                    <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
                    <Button className="bg-[#257cbe] hover:bg-[#176ba5]">Save Plan</Button>
                </div>
            </form>
        </Modal>
    );
}

function RevenueChart() {
    const maximum = 80000;

    return (
        <div className="p-5">
            <div className="mb-6 flex items-center gap-5 text-xs text-slate-500">
                <span className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-[#257cbe]" /> Sample revenue</span>
                <span className="ml-auto text-[11px]">May–Oct 2026</span>
            </div>
            <div className="relative flex h-56 items-end gap-3 border-b border-slate-100">
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                    {[0, 1, 2, 3, 4].map((n) => (
                        <div key={n} className="border-t border-dashed border-slate-100" />
                    ))}
                </div>
                {platformTrend.map((d) => (
                    <div key={d.month} className="group relative flex h-full min-w-0 flex-1 items-end justify-center">
                        <div
                            title={`${d.month}: ${platformMoney(d.revenue)}`}
                            className="relative z-10 w-[65%] max-w-14 rounded-t-xl bg-gradient-to-t from-[#257cbe] to-[#8bc8f0] transition-all duration-300 group-hover:brightness-110"
                            style={{ height: `${d.revenue / maximum * 100}%` }}
                        />
                    </div>
                ))}
            </div>
            <div className="mt-3 flex gap-3">
                {platformTrend.map((d) => (
                    <span key={d.month} className="min-w-0 flex-1 text-center text-[11px] font-semibold text-slate-400">
                        {d.month}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function PlatformAdminPage() {
    const [data, setData] = useState(loadData);
    const [tab, setTab] = useState('overview');
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [modal, setModal] = useState(null);
    const [notice, setNotice] = useState('');

    const { tenants, plans } = data;

    const stats = useMemo(() => {
        const active = tenants.filter((t) => t.status === 'Active');
        const trial = tenants.filter((t) => t.status === 'Trial');
        const suspended = tenants.filter((t) => t.status === 'Suspended');
        const planPrice = Object.fromEntries(plans.map((p) => [p.name, p.price]));
        const estimatedMRR = active.reduce((sum, t) => sum + Number(planPrice[t.plan] || 0), 0);

        return {
            active: active.length,
            trial: trial.length,
            suspended: suspended.length,
            students: tenants.reduce((sum, t) => sum + Number(t.students || 0), 0),
            staff: tenants.reduce((sum, t) => sum + Number(t.staff || 0), 0),
            estimatedMRR,
        };
    }, [tenants, plans]);

    const visibleTenants = tenants.filter((t) => {
        const matches = `${t.name} ${t.slug} ${t.city} ${t.id}`
            .toLowerCase().includes(search.toLowerCase().trim());
        return matches && (filter === 'All' || t.status === filter);
    });

    function persist(next, message) {
        try {
            localStorage.setItem(KEY, JSON.stringify(next));
            setData(next);
            setNotice(message);
            return true;
        } catch {
            setNotice('Browser storage could not be updated.');
            return false;
        }
    }

    function saveTenant(tenant, original) {
        if (tenants.some((t) => t.slug === tenant.slug && t.id !== original?.id)) {
            return 'Tenant slug already exists.';
        }
        const updated = original
            ? tenants.map((t) => t.id === original.id ? { ...t, ...tenant } : t)
            : [...tenants, { ...tenant, id: `DEMO-${crypto.randomUUID().slice(0, 8)}` }];

        if (persist({ ...data, tenants: updated }, 'Demo tenant saved successfully.')) {
            setModal(null);
        }
        return null;
    }

    function updatePlan(plan) {
        const updated = plans.map((p) => p.id === plan.id ? plan : p);
        if (persist({ ...data, plans: updated }, 'Demo pricing updated.')) {
            setModal(null);
        }
    }

    function exportTenants() {
        exportCsv('platform-tenants-demo.csv', [
            ['ID', 'School', 'Slug', 'City', 'Contact', 'Plan', 'Status', 'Students', 'Staff', 'Renewal'],
            ...visibleTenants.map((t) => [
                t.id, t.name, t.slug, t.city, t.contact, t.plan,
                t.status, t.students, t.staff, t.renewal,
            ]),
        ]);
    }

    const tabs = [
        ['overview', 'Overview', LayoutDashboard],
        ['schools', 'Schools & Tenants', Building2],
        ['subscriptions', 'Subscriptions', CreditCard],
        ['analytics', 'Platform Analytics', BarChart3],
    ];

    return (
        <div className="platform-compact space-y-4 text-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                <div>
                    <h1 className="text-base font-semibold text-slate-900">Platform Admin</h1>
                    <p className="text-xs text-slate-500">Manage tenant schools, subscription plans and platform metrics</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => setModal({ type: 'school' })}
                        className="h-8 rounded-md bg-[#257cbe] px-3 text-xs hover:bg-[#176ba5]"
                    >
                        <Plus size={14} className="mr-1.5" /> Onboard School
                    </Button>
                </div>
            </div>

{/* FEATURE STRIP */}

                {/* COMPACT PLATFORM OVERVIEW */}
                <section className="rounded-xl border border-[#e7ecf2] bg-white px-4 py-3.5 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#edf5fb] text-[#257cbe]">
                                <Building2 size={18} />
                            </div>

                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-[13px] font-semibold text-slate-800">
                                        Platform Overview
                                    </h3>

                                    <Badge
                                        variant="outline"
                                        className="border-[#dceaf6] bg-[#f2f8fc] text-[10px] text-[#257cbe]"
                                    >
                                        Demo Environment
                                    </Badge>
                                </div>

                                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                                    Manage schools, subscriptions and platform operations
                                    from one centralized workspace.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-lg border border-[#e7ecf2] bg-[#fafbfd] px-3 py-2">
                            <div>
                                <p className="text-[10px] font-medium text-slate-500">
                                    Estimated Monthly Plan Value
                                </p>

                                <p className="mt-0.5 text-[18px] font-bold tracking-tight text-[#257cbe]">
                                    {platformMoney(stats.estimatedMRR)}
                                </p>

                                <p className="text-[10px] text-slate-400">
                                    Demo plan assignments
                                </p>
                            </div>

                            <div className="flex size-8 items-center justify-center rounded-lg bg-[#edf5fb] text-[#257cbe]">
                                <TrendingUp size={16} />
                            </div>
                        </div>
                    </div>
                </section>


                {/* METRICS */}
                <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                    <Metric title="Total Schools" value={tenants.length} note="All tenant demo records" Icon={Building2} tone="blue" />
                    <Metric title="Active Schools" value={stats.active} note={`${stats.trial} currently on trial`} Icon={CheckCircle2} tone="emerald" />
                    <Metric title="Total Students" value={stats.students.toLocaleString('en-IN')} note="Across fictional schools" Icon={GraduationCap} tone="violet" />
                    <Metric title="Estimated MRR" value={platformMoney(stats.estimatedMRR)} note="Not actual billing revenue" Icon={Wallet} tone="amber" />
                </div>

                {/* NAVIGATION */}
                <div className="flex gap-1 overflow-x-auto rounded-[20px] border border-slate-200 bg-white p-2 shadow-sm">
                    {tabs.map(([id, label, Icon]) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setTab(id)}
                            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold transition-all sm:text-sm ${tab === id
                                ? 'bg-[#257cbe] text-white shadow-md shadow-blue-200/50'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                }`}
                        >
                            <Icon size={17} /> {label}
                        </button>
                    ))}
                </div>

                {notice && (
                    <div role="status" className="flex items-center justify-between gap-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs text-blue-800">
                        {notice}
                        <button onClick={() => setNotice('')} aria-label="Dismiss"><X size={16} /></button>
                    </div>
                )}

                {/* OVERVIEW */}
                {tab === 'overview' && (
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,1fr)]">
                        <Panel
                            title="Platform Growth"
                            subtitle="Historical sample revenue illustration"
                            action={<Badge variant="outline">6-Month View</Badge>}
                        >
                            <RevenueChart />
                        </Panel>

                        <Panel title="Tenant Health" subtitle="Current demo subscription distribution">
                            <div className="p-6">
                                <div className="relative mx-auto flex size-44 items-center justify-center">
                                    <div
                                        className="absolute inset-0 rounded-full"
                                        style={{
                                            background: `conic-gradient(
                        #257cbe 0 ${tenants.length ? stats.active / tenants.length * 100 : 0}%,
                        #93c5fd ${tenants.length ? stats.active / tenants.length * 100 : 0}% ${tenants.length ? (stats.active + stats.trial) / tenants.length * 100 : 0}%,
                        #fda4af 0 100%)`,
                                        }}
                                    />
                                    <div className="relative flex size-[140px] flex-col items-center justify-center rounded-full bg-white">
                                        <span className="text-4xl font-bold">{tenants.length}</span>
                                        <span className="text-xs text-slate-400">Schools</span>
                                    </div>
                                </div>

                                <div className="mt-7 space-y-4">
                                    {[
                                        ['Active', stats.active, '#257cbe'],
                                        ['Trial', stats.trial, '#93c5fd'],
                                        ['Suspended', stats.suspended, '#fda4af'],
                                    ].map(([name, count, color]) => (
                                        <div key={name} className="flex items-center gap-3 text-xs">
                                            <span className="size-2.5 rounded-full" style={{ background: color }} />
                                            <span className="flex-1 text-slate-500">{name}</span>
                                            <strong>{count}</strong>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Panel>

                        <Panel
                            title="Your School Network"
                            subtitle="Recent tenant records"
                            className="xl:col-span-2"
                            action={
                                <button onClick={() => setTab('schools')} className="text-xs font-bold text-[#257cbe]">
                                    Manage Schools <ArrowRight size={14} className="ml-1 inline" />
                                </button>
                            }
                        >
                            <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-3">
                                {tenants.slice(0, 6).map((tenant) => (
                                    <button
                                        key={tenant.id}
                                        onClick={() => setModal({ type: 'school', tenant })}
                                        className="flex items-center gap-3 rounded-2xl border border-slate-100 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                                    >
                                        <Logo tenant={tenant} />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-xs font-bold text-slate-800">{tenant.name}</p>
                                            <p className="mt-1 text-[11px] text-slate-400">{tenant.city} · {tenant.plan}</p>
                                        </div>
                                        <Status value={tenant.status} />
                                    </button>
                                ))}
                            </div>
                        </Panel>
                    </div>
                )}

                {/* TENANT MANAGEMENT */}
                {tab === 'schools' && (
                    <Panel
                        title="School & Tenant Management"
                        subtitle="Browse and edit the fictional school network"
                        action={<Button onClick={exportTenants} variant="outline"><ArrowDownToLine size={16} className="mr-2" /> Export</Button>}
                    >
                        <div className="flex flex-wrap gap-3 p-5">
                            <div className="relative min-w-[200px] flex-1">
                                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search school, slug, city..."
                                    className="h-11 rounded-xl pl-10"
                                />
                            </div>
                            <select value={filter} onChange={(e) => setFilter(e.target.value)} className={`${field} max-w-40`}>
                                <option value="All">All Statuses</option>
                                <option>Active</option>
                                <option>Trial</option>
                                <option>Suspended</option>
                            </select>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[920px] text-left text-sm">
                                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    <tr>
                                        <th className="px-5 py-4">School</th>
                                        <th className="px-4 py-4">Subscription</th>
                                        <th className="px-4 py-4">Students</th>
                                        <th className="px-4 py-4">Renewal</th>
                                        <th className="px-4 py-4">Status</th>
                                        <th className="px-5 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {visibleTenants.map((t) => (
                                        <tr key={t.id} className="transition hover:bg-blue-50/30">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Logo tenant={t} />
                                                    <div>
                                                        <p className="font-semibold">{t.name}</p>
                                                        <p className="mt-1 text-[11px] text-slate-400">{t.slug} · {t.city}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4"><Badge variant="secondary">{t.plan}</Badge></td>
                                            <td className="px-4 py-4 font-semibold">{Number(t.students).toLocaleString('en-IN')}</td>
                                            <td className="px-4 py-4 text-xs text-slate-500">{t.renewal}</td>
                                            <td className="px-4 py-4"><Status value={t.status} /></td>
                                            <td className="px-5 py-4 text-right">
                                                <Button size="sm" variant="outline" onClick={() => setModal({ type: 'school', tenant: t })}>
                                                    Edit <ArrowRight size={14} className="ml-1.5" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {!visibleTenants.length && (
                                <p className="p-12 text-center text-sm text-slate-400">No matching schools found.</p>
                            )}
                        </div>
                    </Panel>
                )}

                {/* SUBSCRIPTIONS */}
                {tab === 'subscriptions' && (
                    <Panel title="Subscription Plans" subtitle="Illustrative SaaS pricing and resource limits">
                        <div className="grid gap-5 p-5 lg:grid-cols-3">
                            {plans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className={`rounded-[24px] border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${plan.name === 'Growth'
                                        ? 'border-blue-200 bg-gradient-to-b from-[#eef6fc] to-white'
                                        : 'border-slate-200 bg-white'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-[#257cbe]">
                                            <CreditCard size={22} />
                                        </div>
                                        {plan.name === 'Growth' && <Badge className="bg-[#257cbe]">Popular Demo</Badge>}
                                    </div>
                                    <h3 className="mt-6 text-lg font-bold">{plan.name}</h3>
                                    <div className="mt-3">
                                        <strong className="text-3xl font-bold">{platformMoney(plan.price)}</strong>
                                        <span className="ml-1 text-xs text-slate-400">/ month</span>
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500">
                                        Up to {plan.studentsLimit.toLocaleString('en-IN')} students
                                    </p>
                                    <div className="my-6 h-px bg-slate-100" />
                                    <div className="space-y-4">
                                        {plan.features.map((feature) => (
                                            <div key={feature} className="flex items-start gap-2 text-xs text-slate-600">
                                                <CheckCircle2 size={16} className="shrink-0 text-[#257cbe]" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="mt-8 w-full rounded-xl"
                                        onClick={() => setModal({ type: 'plan', plan })}
                                    >
                                        Edit Demo Plan
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <p className="px-6 pb-6 text-xs text-slate-500">
                            Changing these plans updates only this browser preview. Actual entitlements, invoices and subscription billing are not implemented.
                        </p>
                    </Panel>
                )}

                {/* PLATFORM ANALYTICS */}
                {tab === 'analytics' && (
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Panel title="Revenue Illustration" subtitle="Fictional monthly SaaS revenue trend">
                            <RevenueChart />
                        </Panel>
                        <Panel title="Platform Snapshot" subtitle="Current fictional tenant records">
                            <div className="space-y-4 p-6">
                                {[
                                    ['Schools', tenants.length, Building2],
                                    ['Students', stats.students, GraduationCap],
                                    ['Staff', stats.staff, UsersRound],
                                    ['Trial Accounts', stats.trial, Clock3],
                                ].map(([name, value, Icon]) => (
                                    <div key={name} className="flex items-center gap-3 rounded-xl border border-slate-100 p-4">
                                        <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-[#257cbe]"><Icon size={18} /></span>
                                        <span className="flex-1 text-sm text-slate-500">{name}</span>
                                        <strong>{Number(value).toLocaleString('en-IN')}</strong>
                                    </div>
                                ))}
                            </div>
                        </Panel>
                        <Panel title="Subscription Mix" subtitle="Fictional plan assignments" className="lg:col-span-2">
                            <div className="grid gap-4 p-6 md:grid-cols-3">
                                {plans.map((plan) => {
                                    const count = tenants.filter((t) => t.plan === plan.name).length;
                                    return (
                                        <div key={plan.id} className="rounded-2xl bg-slate-50 p-5">
                                            <p className="text-xs font-semibold text-slate-500">{plan.name}</p>
                                            <p className="mt-3 text-3xl font-bold">{count}</p>
                                            <p className="mt-2 text-xs text-slate-400">School accounts</p>
                                            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">
                                                <div
                                                    className="h-full rounded-full bg-[#257cbe]"
                                                    style={{ width: `${tenants.length ? count / tenants.length * 100 : 0}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Panel>
                    </div>
                )}

                <footer className="rounded-2xl border border-blue-100 bg-[#edf6fc] p-5 text-xs leading-5 text-[#426d8e]">
                    <ShieldCheck size={17} className="mb-2 text-[#257cbe]" />
                    **Frontend prototype only.** This page is not a secured production super-admin panel. It does not provide tenant isolation, platform RBAC, real subscription management, or payment processing.
                </footer>

            {modal?.type === 'school' && (
                <SchoolForm
                    key={modal.tenant?.id || 'new'}
                    initial={modal.tenant}
                    plans={plans}
                    onSave={saveTenant}
                    onClose={() => setModal(null)}
                />
            )}

            {modal?.type === 'plan' && (
                <PlanEditor
                    key={modal.plan.id}
                    plan={modal.plan}
                    onSave={updatePlan}
                    onClose={() => setModal(null)}
                />
            )}
        </div>
    );
}

function LayersIcon() {
    return <Building2 size={22} />;
}
