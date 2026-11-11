
import { useMemo, useState } from 'react';
import {
    Activity, ArrowRight, BusFront, CalendarClock,
    Check, ChevronRight, CircleAlert, Clock3,
    Download, Gauge, MapPin, Navigation2, Pencil,
    Plus, Route, Search, ShieldCheck, Sparkles,
    Truck, UserRound, UsersRound, Wrench, X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

import {
    initialVehicles, initialRoutes, initialDrivers,
    initialAllocations, transportStudents, transportMoney,
} from '../data/transport.mock';
import '../styles/erp-compact.css';

const KEY = 'olive-transport-v1';

function loadData() {
    try {
        const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
        if (
            Array.isArray(saved?.vehicles) &&
            Array.isArray(saved?.routes) &&
            Array.isArray(saved?.drivers) &&
            Array.isArray(saved?.allocations)
        ) return saved;
    } catch {
        // Use initial demo data.
    }
    return {
        vehicles: initialVehicles,
        routes: initialRoutes,
        drivers: initialDrivers,
        allocations: initialAllocations,
    };
}

const inputClass =
    'h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none transition focus:border-[#257cbe] focus:ring-2 focus:ring-blue-100';

const tabs = [
    ['overview', 'Overview', Activity],
    ['vehicles', 'Vehicles', BusFront],
    ['routes', 'Routes', Route],
    ['drivers', 'Drivers', UserRound],
    ['allocations', 'Student Allocation', UsersRound],
];

const statusClass = {
    Active: 'bg-emerald-50 text-emerald-700',
    Available: 'bg-emerald-50 text-emerald-700',
    Maintenance: 'bg-amber-50 text-amber-700',
    'On Leave': 'bg-amber-50 text-amber-700',
    Inactive: 'bg-slate-100 text-slate-500',
};

function Status({ value }) {
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${statusClass[value] || statusClass.Inactive}`}>
            <span className="size-1.5 rounded-full bg-current" />
            {value}
        </span>
    );
}

function Surface({ children, className = '' }) {
    return (
        <Card className={`gap-0 overflow-hidden rounded-[24px] border-slate-200/70 bg-white py-0 shadow-[0_10px_35px_-23px_rgba(15,23,42,.24)] ${className}`}>
            <CardContent className="p-0">{children}</CardContent>
        </Card>
    );
}

function Metric({ label, value, detail, Icon, color, bg }) {
    return (
        <div className="group rounded-[22px] border border-slate-200/70 bg-white p-5 shadow-[0_8px_30px_-20px_rgba(15,23,42,.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-medium text-slate-500">{label}</span>
                <div className="grid size-11 place-items-center rounded-2xl" style={{ color, background: bg }}>
                    <Icon size={21} />
                </div>
            </div>
            <div className="mt-3 text-[30px] font-bold tracking-tight text-slate-900">
                {value}
            </div>
            <p className="mt-2 text-xs text-slate-500">{detail}</p>
        </div>
    );
}

function VehicleCard({ vehicle, route, driver, allocated, onEdit }) {
    const usage = vehicle.capacity
        ? Math.round(allocated / vehicle.capacity * 100) : 0;

    return (
        <div className="group overflow-hidden rounded-[22px] border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/40">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#edf6fc] via-[#f7faff] to-white px-5 pb-4 pt-5">
                <div className="absolute -right-10 -top-12 size-36 rounded-full border border-blue-100" />
                <div className="absolute -right-3 -top-5 size-24 rounded-full border border-blue-100" />
                <div className="relative flex items-start justify-between">
                    <div className="grid size-14 place-items-center rounded-2xl bg-white text-[#257cbe] shadow-sm">
                        <BusFront size={30} strokeWidth={1.7} />
                    </div>
                    <Status value={vehicle.status} />
                </div>
                <h3 className="relative mt-5 text-base font-bold text-slate-900">
                    {vehicle.name}
                </h3>
                <p className="mt-1 text-xs font-medium text-slate-500">
                    {vehicle.number} · {vehicle.type}
                </p>
            </div>
            <div className="space-y-4 p-5">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-[11px] text-slate-400">Assigned Route</p>
                        <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                            {route?.code || 'Unassigned'}
                        </p>
                    </div>
                    <div>
                        <p className="text-[11px] text-slate-400">Driver</p>
                        <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                            {driver?.name || 'Unassigned'}
                        </p>
                    </div>
                </div>

                <div>
                    <div className="mb-2 flex justify-between text-xs">
                        <span className="text-slate-500">Seat Occupancy</span>
                        <span className="font-bold text-slate-800">
                            {allocated} / {vehicle.capacity}
                        </span>
                    </div>
                    <Progress value={Math.min(usage, 100)} className="h-2" />
                </div>

                <button
                    onClick={onEdit}
                    className="flex w-full items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-[#257cbe] hover:text-[#175f95]"
                >
                    Manage Vehicle <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}

function Editor({ kind, initial, store, onSave, onClose }) {
    const defaults = {
        vehicle: {
            name: '', number: '', type: 'Bus', capacity: 40,
            routeId: '', driverId: '', status: 'Active',
        },
        route: {
            name: '', code: '', start: '', end: '',
            stops: '', departure: '07:30', fee: 1200,
            status: 'Active',
        },
        driver: {
            name: '', phone: '', license: '',
            experience: 1, status: 'Available',
        },
        allocation: {
            studentId: '', routeId: '', pickup: '',
        },
    };

    const prepare = (record) => {
        if (!record) return defaults[kind];
        if (kind === 'route') {
            return { ...record, stops: record.stops.join(', ') };
        }
        return { ...record };
    };

    const [form, setForm] = useState(() => prepare(initial));
    const [error, setError] = useState('');

    const fields = {
        vehicle: [
            { key: 'name', label: 'Vehicle Name' },
            { key: 'number', label: 'Registration Number' },
            { key: 'type', label: 'Vehicle Type', options: ['Bus', 'Van', 'Mini Bus'] },
            { key: 'capacity', label: 'Seating Capacity', type: 'number' },
            {
                key: 'routeId', label: 'Assigned Route', optional: true,
                options: [{ value: '', label: 'Unassigned' }, ...store.routes.map((x) => ({
                    value: x.id, label: `${x.code} · ${x.name}`,
                }))],
            },
            {
                key: 'driverId', label: 'Assigned Driver', optional: true,
                options: [{ value: '', label: 'Unassigned' }, ...store.drivers.map((x) => ({
                    value: x.id, label: x.name,
                }))],
            },
            { key: 'status', label: 'Vehicle Status', options: ['Active', 'Maintenance', 'Inactive'] },
        ],
        route: [
            { key: 'name', label: 'Route Name' },
            { key: 'code', label: 'Route Code' },
            { key: 'start', label: 'Starting Point' },
            { key: 'end', label: 'Destination' },
            { key: 'stops', label: 'Stops (comma separated)', type: 'textarea' },
            { key: 'departure', label: 'Departure Time', type: 'time' },
            { key: 'fee', label: 'Monthly Transport Fee (₹)', type: 'number' },
            { key: 'status', label: 'Route Status', options: ['Active', 'Inactive'] },
        ],
        driver: [
            { key: 'name', label: 'Full Name' },
            { key: 'phone', label: 'Mobile Number', type: 'tel' },
            { key: 'license', label: 'Driving License Number' },
            { key: 'experience', label: 'Experience (Years)', type: 'number' },
            { key: 'status', label: 'Availability', options: ['Available', 'On Leave', 'Inactive'] },
        ],
        allocation: [
            {
                key: 'studentId', label: 'Student',
                options: [
                    { value: '', label: 'Select student' },
                    ...transportStudents.map((s) => ({
                        value: s.id, label: `${s.name} · Class ${s.className}`,
                    })),
                ],
            },
            {
                key: 'routeId', label: 'Transport Route',
                options: [
                    { value: '', label: 'Select route' },
                    ...store.routes.filter((r) => r.status === 'Active').map((r) => ({
                        value: r.id, label: `${r.code} · ${r.name}`,
                    })),
                ],
            },
            {
                key: 'pickup', label: 'Pickup Stop',
                options: [
                    { value: '', label: 'Select stop' },
                    ...(store.routes.find((r) => r.id === form.routeId)?.stops || [])
                        .map((stop) => ({ value: stop, label: stop })),
                ],
            },
        ],
    };

    function change(key, value) {
        setError('');
        setForm((prev) => ({
            ...prev, [key]: value,
            ...(kind === 'allocation' && key === 'routeId' ? { pickup: '' } : {}),
        }));
    }

    function submit(e) {
        e.preventDefault();
        const data = { ...form };

        for (const field of fields[kind]) {
            const value = String(data[field.key] ?? '').trim();

            if (!field.optional && !value) {
                setError(`${field.label} is required.`);
                return;
            }

            if (field.type === 'number') data[field.key] = Number(value);
            else data[field.key] = value;
        }

        if (kind === 'route') {
            data.stops = data.stops.split(',').map((x) => x.trim()).filter(Boolean);
            if (data.stops.length < 2) {
                setError('Enter at least two route stops.');
                return;
            }
            data.start = data.stops[0];
            data.end = data.stops.at(-1);
        }

        const result = onSave(kind, data, initial);
        if (result) setError(result);
    }

    const title = {
        vehicle: 'Vehicle',
        route: 'Route',
        driver: 'Driver',
        allocation: 'Student Allocation',
    }[kind];

    return (
        <div
            className="fixed inset-0 z-[110] flex justify-end bg-slate-950/45 backdrop-blur-[2px]"
            onMouseDown={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={`${initial ? 'Edit' : 'Add'} ${title}`}
                className="flex h-full w-full max-w-[490px] flex-col bg-white shadow-2xl"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-slate-100 p-6">
                    <div>
                        <h2 className="text-lg font-bold">
                            {initial ? 'Edit' : 'Add'} {title}
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Transport management · Demo workspace
                        </p>
                    </div>
                    <button onClick={onClose} aria-label="Close" className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
                    <div className="flex-1 space-y-5 overflow-y-auto p-6">
                        {fields[kind].map((field) => (
                            <label key={field.key} className="block">
                                <span className="mb-2 block text-xs font-semibold text-slate-600">
                                    {field.label}
                                </span>

                                {field.options ? (
                                    <select
                                        required={!field.optional}
                                        className={inputClass}
                                        value={form[field.key] ?? ''}
                                        onChange={(e) => change(field.key, e.target.value)}
                                    >
                                        {field.options.map((option) => {
                                            const item = typeof option === 'string'
                                                ? { value: option, label: option } : option;
                                            return (
                                                <option key={item.value} value={item.value}>
                                                    {item.label}
                                                </option>
                                            );
                                        })}
                                    </select>
                                ) : field.type === 'textarea' ? (
                                    <textarea
                                        rows={4}
                                        required
                                        value={form[field.key] ?? ''}
                                        onChange={(e) => change(field.key, e.target.value)}
                                        className={`${inputClass} h-auto resize-none py-3`}
                                        placeholder="Stop 1, Stop 2, School"
                                    />
                                ) : (
                                    <input
                                        required={!field.optional}
                                        type={field.type || 'text'}
                                        min={field.type === 'number' ? 0 : undefined}
                                        className={inputClass}
                                        value={form[field.key] ?? ''}
                                        onChange={(e) => change(field.key, e.target.value)}
                                    />
                                )}
                            </label>
                        ))}

                        {error && (
                            <p role="alert" className="rounded-xl bg-rose-50 p-3 text-xs text-rose-700">
                                {error}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 border-t border-slate-100 p-5">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-[#257cbe] hover:bg-[#176aa6]">
                            <Check size={16} className="mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function RouteTrack({ stops }) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {stops.map((stop, index) => (
                <div key={`${stop}-${index}`} className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                        <span className={`size-2.5 rounded-full border-2 ${index === 0 || index === stops.length - 1
                                ? 'border-[#257cbe] bg-[#257cbe]'
                                : 'border-blue-300 bg-white'
                            }`} />
                        <span className="text-[11px] text-slate-600">{stop}</span>
                    </div>
                    {index !== stops.length - 1 && (
                        <span className="h-px w-4 bg-blue-200" />
                    )}
                </div>
            ))}
        </div>
    );
}

export default function TransportPage() {
    const [store, setStore] = useState(loadData);
    const [tab, setTab] = useState('overview');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [editor, setEditor] = useState(null);
    const [notice, setNotice] = useState('');

    const { vehicles, routes, drivers, allocations } = store;

    const routeById = useMemo(
        () => Object.fromEntries(routes.map((r) => [r.id, r])),
        [routes]
    );
    const driverById = useMemo(
        () => Object.fromEntries(drivers.map((d) => [d.id, d])),
        [drivers]
    );
    const studentById = useMemo(
        () => Object.fromEntries(transportStudents.map((s) => [s.id, s])),
        []
    );

    const activeVehicles = vehicles.filter((v) => v.status === 'Active');
    const operationalVehicles = activeVehicles.filter((v) =>
        v.routeId && v.driverId &&
        routeById[v.routeId]?.status === 'Active' &&
        driverById[v.driverId]?.status === 'Available'
    );
    const totalSeats = operationalVehicles.reduce(
        (sum, v) => sum + Number(v.capacity), 0
    );
    const allocatedSeats = allocations.filter((a) =>
        operationalVehicles.some((v) => v.routeId === a.routeId)
    ).length;
    const utilization = totalSeats
        ? Math.round(allocatedSeats / totalSeats * 100) : 0;

    const getRouteCapacity = (routeId, list = vehicles) =>
        list.filter((v) =>
            v.routeId === routeId &&
            v.status === 'Active' &&
            driverById[v.driverId]?.status === 'Available'
        ).reduce((sum, v) => sum + Number(v.capacity), 0);

    const getRouteCount = (routeId, list = allocations) =>
        list.filter((a) => a.routeId === routeId).length;

    const filtered = (items, keys) =>
        items.filter((item) =>
            keys.some((key) =>
                String(item[key] ?? '').toLowerCase()
                    .includes(search.trim().toLowerCase())
            ) &&
            (statusFilter === 'All' || item.status === statusFilter)
        );

    function persist(updated, message) {
        try {
            localStorage.setItem(KEY, JSON.stringify(updated));
            setStore(updated);
            setNotice(message);
            return true;
        } catch {
            setNotice('Unable to save demo changes in browser storage.');
            return false;
        }
    }

    function saveRecord(kind, data, original) {
        const collection = {
            vehicle: 'vehicles',
            route: 'routes',
            driver: 'drivers',
            allocation: 'allocations',
        }[kind];

        const items = store[collection];

        if (kind === 'vehicle') {
            if (!Number.isInteger(data.capacity) || data.capacity < 1) {
                return 'Capacity must be a positive whole number.';
            }
            if (items.some((v) =>
                v.id !== original?.id &&
                v.number.toLowerCase() === data.number.toLowerCase()
            )) return 'Registration number already exists.';

            if (data.driverId && items.some((v) =>
                v.id !== original?.id && v.driverId === data.driverId
            )) return 'This driver is already assigned to another vehicle.';

            if (data.status === 'Active' && data.driverId &&
                driverById[data.driverId]?.status !== 'Available') {
                return 'An active vehicle requires an available driver.';
            }

            if (original?.routeId && original.routeId !== data.routeId &&
                getRouteCount(original.routeId) > 0 &&
                vehicles.filter((v) =>
                    v.id !== original.id &&
                    v.routeId === original.routeId &&
                    v.status === 'Active'
                ).length === 0) {
                return 'Reassign students before removing the last active vehicle from this route.';
            }

            if (data.routeId && data.status === 'Active') {
                const others = vehicles.filter((v) =>
                    v.id !== original?.id &&
                    v.routeId === data.routeId &&
                    v.status === 'Active' &&
                    driverById[v.driverId]?.status === 'Available'
                ).reduce((sum, v) => sum + Number(v.capacity), 0);

                const operational = data.driverId &&
                    driverById[data.driverId]?.status === 'Available';

                const capacity = others + (operational ? data.capacity : 0);
                if (capacity < getRouteCount(data.routeId)) {
                    return 'Vehicle changes would leave this route over capacity.';
                }
            }

            if (original?.routeId &&
                (data.status !== 'Active' || data.driverId === '') &&
                getRouteCount(original.routeId) >
                vehicles.filter((v) =>
                    v.id !== original.id &&
                    v.routeId === original.routeId &&
                    v.status === 'Active' &&
                    driverById[v.driverId]?.status === 'Available'
                ).reduce((sum, v) => sum + Number(v.capacity), 0)) {
                return 'Cannot disable this vehicle while its route has assigned students.';
            }
        }

        if (kind === 'route') {
            if (data.fee < 0 || !Number.isFinite(data.fee)) {
                return 'Enter a valid transport fee.';
            }
            if (items.some((r) =>
                r.id !== original?.id &&
                r.code.toLowerCase() === data.code.toLowerCase()
            )) return 'Route code already exists.';

            if (original && getRouteCount(original.id) > 0) {
                if (data.status !== 'Active') {
                    return 'Reassign students before deactivating this route.';
                }
                if (allocations.some((a) =>
                    a.routeId === original.id &&
                    !data.stops.includes(a.pickup)
                )) return 'Existing assigned pickup stops must be retained.';
            }
        }

        if (kind === 'driver') {
            if (!Number.isFinite(data.experience) || data.experience < 0) {
                return 'Experience must be zero or greater.';
            }
            if (items.some((d) =>
                d.id !== original?.id &&
                d.license.toLowerCase() === data.license.toLowerCase()
            )) return 'License number already exists.';

            if (original && data.status !== 'Available' &&
                vehicles.some((v) =>
                    v.driverId === original.id &&
                    v.status === 'Active' &&
                    getRouteCount(v.routeId) > 0
                )) return 'Reassign the driver before changing their availability.';
        }

        if (kind === 'allocation') {
            const route = routeById[data.routeId];
            if (!route || route.status !== 'Active' ||
                !route.stops.includes(data.pickup)) {
                return 'Choose an active route and a valid pickup stop.';
            }

            if (items.some((a) =>
                a.studentId === data.studentId &&
                a.id !== original?.id
            )) return 'This student already has a transport allocation.';

            if (getRouteCount(data.routeId, items.filter((a) =>
                a.id !== original?.id
            )) >= getRouteCapacity(data.routeId)) {
                return 'No operational seats are available on the selected route.';
            }
        }

        const id = original?.id || crypto.randomUUID();
        const updatedItems = original
            ? items.map((item) => item.id === id ? { ...item, ...data } : item)
            : [...items, { ...data, id }];

        if (persist(
            { ...store, [collection]: updatedItems },
            'Transport demo record saved successfully.'
        )) setEditor(null);

        return null;
    }

    function exportAllocations() {
        const rows = [
            ['Student', 'Admission No', 'Class', 'Route', 'Pickup'],
            ...allocations.map((a) => {
                const student = studentById[a.studentId];
                return [
                    student?.name, student?.admissionNo,
                    student?.className, routeById[a.routeId]?.name,
                    a.pickup,
                ];
            }),
        ];

        const csv = rows.map((row) =>
            row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')
        ).join('\r\n');

        const url = URL.createObjectURL(new Blob(['\uFEFF', csv], {
            type: 'text/csv;charset=utf-8',
        }));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'olive-transport-allocations-demo.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    const open = (kind, item = null) =>
        setEditor({ kind, item });

    return (
        <div className="erp-compact erp-compact--transport mx-auto max-w-[1550px] space-y-4 pb-4 text-slate-900">

            {/* EDITORIAL PAGE HEADER */}
            <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#257cbe]">
                        <span className="size-2 rounded-full bg-[#257cbe]" />
                        Operations / Transport
                    </div>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-[30px]">
                        Transport Command Center
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Every route connected. Every journey organized.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className="rounded-xl border-amber-200 bg-amber-50 px-3 text-amber-700">
                        Demo Data
                    </Badge>
                    <Button
                        onClick={() => open('vehicle')}
                        className="rounded-xl bg-[#257cbe] shadow-md shadow-blue-100 hover:bg-[#176ca8]"
                    >
                        <Plus size={16} className="mr-2" /> Add Vehicle
                    </Button>
                </div>
            </header>

            {/* FEATURED COMMAND PANEL */}
            <section className="grid overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_15px_50px_-32px_rgba(15,23,42,.4)] lg:grid-cols-[1.1fr_0.9fr]">
                <div className="relative overflow-hidden bg-[#102f54] p-7 text-white sm:p-9">
                    <div className="absolute -right-20 -top-32 size-[350px] rounded-full border border-white/10" />
                    <div className="absolute -right-3 -top-20 size-[220px] rounded-full border border-white/10" />
                    <div className="relative">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-blue-100">
                            <Sparkles size={13} /> FLEET INTELLIGENCE
                        </span>
                        <h2 className="mt-6 max-w-md text-2xl font-bold tracking-tight sm:text-3xl">
                            Moving education forward.
                        </h2>
                        <p className="mt-3 max-w-md text-sm leading-6 text-blue-100/75">
                            A unified home for school vehicles, drivers, routes,
                            and student transportation.
                        </p>
                        <div className="mt-7 flex flex-wrap gap-7">
                            <div>
                                <p className="text-3xl font-bold">{activeVehicles.length}</p>
                                <p className="mt-1 text-xs text-blue-200">Active vehicles</p>
                            </div>
                            <div className="border-l border-white/15 pl-7">
                                <p className="text-3xl font-bold">{routes.length}</p>
                                <p className="mt-1 text-xs text-blue-200">Managed routes</p>
                            </div>
                            <div className="border-l border-white/15 pl-7">
                                <p className="text-3xl font-bold">{allocations.length}</p>
                                <p className="mt-1 text-xs text-blue-200">Students allocated</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#edf6fc] via-white to-[#f7f9ff] p-7 sm:p-9">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#257cbe]">
                            Fleet Readiness
                        </span>
                        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#257cbe] shadow-sm">
                            Demo snapshot
                        </span>
                    </div>

                    <div className="relative mx-auto my-4 flex size-44 items-center justify-center">
                        <div
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: `conic-gradient(#257cbe ${vehicles.length ? operationalVehicles.length / vehicles.length * 100 : 0}%, #e2ecf4 0)`,
                            }}
                        />
                        <div className="relative flex size-[145px] flex-col items-center justify-center rounded-full bg-white shadow-inner">
                            <BusFront size={28} className="text-[#257cbe]" />
                            <strong className="mt-2 text-3xl font-bold">
                                {operationalVehicles.length}/{vehicles.length}
                            </strong>
                            <span className="text-[11px] text-slate-500">Ready for service</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-white/80 p-4">
                        <div>
                            <p className="text-xs font-bold text-slate-800">Fleet utilization</p>
                            <p className="mt-1 text-xs text-slate-500">{allocatedSeats} of {totalSeats} operational seats</p>
                        </div>
                        <span className="text-xl font-bold text-[#257cbe]">{utilization}%</span>
                    </div>
                </div>
            </section>

            {/* METRICS */}
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                <Metric label="Total Vehicles" value={vehicles.length} detail="Registered fleet" Icon={BusFront} color="#257cbe" bg="#eaf4fc" />
                <Metric label="Operational Vehicles" value={operationalVehicles.length} detail="Ready with available drivers" Icon={ShieldCheck} color="#10b981" bg="#ecfdf5" />
                <Metric label="Registered Drivers" value={drivers.length} detail={`${drivers.filter((d) => d.status === 'Available').length} available`} Icon={UserRound} color="#8b5cf6" bg="#f5f3ff" />
                <Metric label="Student Allocations" value={allocations.length} detail="Assigned to transport routes" Icon={UsersRound} color="#f59e0b" bg="#fffbeb" />
            </div>

            {/* TABS */}
            <div className="flex gap-2 overflow-x-auto rounded-[20px] border border-slate-200 bg-white p-2 shadow-sm">
                {tabs.map(([id, label, Icon]) => (
                    <button
                        key={id}
                        onClick={() => {
                            setTab(id);
                            setSearch('');
                            setStatusFilter('All');
                        }}
                        className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold transition sm:text-sm ${tab === id
                                ? 'bg-[#257cbe] text-white shadow-md shadow-blue-200/50'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                            }`}
                    >
                        <Icon size={16} /> {label}
                    </button>
                ))}
            </div>

            {notice && (
                <div role="status" className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-800">
                    {notice}
                    <button onClick={() => setNotice('')} aria-label="Dismiss"><X size={16} /></button>
                </div>
            )}

            {/* OVERVIEW */}
            {tab === 'overview' && (
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
                    <Surface>
                        <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5">
                            <div>
                                <h2 className="text-base font-bold">Fleet Overview</h2>
                                <p className="mt-1 text-xs text-slate-500">Vehicle assignments and seat usage</p>
                            </div>
                            <button onClick={() => setTab('vehicles')} className="text-xs font-semibold text-[#257cbe]">
                                View all <ArrowRight size={14} className="ml-1 inline" />
                            </button>
                        </div>
                        <div className="grid gap-4 p-5 md:grid-cols-2">
                            {vehicles.slice(0, 4).map((v) => (
                                <VehicleCard
                                    key={v.id}
                                    vehicle={v}
                                    route={routeById[v.routeId]}
                                    driver={driverById[v.driverId]}
                                    allocated={getRouteCount(v.routeId)}
                                    onEdit={() => open('vehicle', v)}
                                />
                            ))}
                        </div>
                    </Surface>

                    <div className="space-y-5">
                        <Surface>
                            <div className="p-5">
                                <h3 className="text-sm font-bold">Route Network</h3>
                                <p className="mt-1 text-xs text-slate-400">Configured school routes</p>
                                <div className="mt-5 space-y-5">
                                    {routes.map((r) => (
                                        <button
                                            key={r.id}
                                            onClick={() => open('route', r)}
                                            className="flex w-full items-center gap-3 text-left"
                                        >
                                            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#257cbe]">
                                                <Route size={18} />
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-xs font-semibold text-slate-800">{r.name}</span>
                                                <span className="mt-1 block text-[11px] text-slate-400">{r.code} · {r.departure}</span>
                                            </span>
                                            <ChevronRight size={16} className="text-slate-300" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Surface>

                        <div className="rounded-[22px] bg-[#eaf4fc] p-5">
                            <div className="grid size-11 place-items-center rounded-xl bg-white text-[#257cbe]">
                                <Navigation2 size={23} />
                            </div>
                            <h3 className="mt-4 text-sm font-bold text-[#174e7a]">Smarter School Transport</h3>
                            <p className="mt-2 text-xs leading-5 text-[#4e789a]">
                                Manage vehicles, pickup points, drivers and student allocations
                                in one connected workspace.
                            </p>
                            <p className="mt-4 text-[11px] font-semibold text-[#257cbe]">
                                Simulation only · No live GPS tracking
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* VEHICLES */}
            {tab === 'vehicles' && (
                <Surface>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-6">
                        <div>
                            <h2 className="text-lg font-bold">Fleet Directory</h2>
                            <p className="mt-1 text-xs text-slate-500">Manage vehicles and their assigned resources.</p>
                        </div>
                        <Button className="bg-[#257cbe] hover:bg-[#176aa6]" onClick={() => open('vehicle')}>
                            <Plus size={16} className="mr-2" /> Add Vehicle
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-3 p-5">
                        <div className="relative min-w-[200px] flex-1">
                            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input
                                className="h-11 rounded-xl pl-10"
                                placeholder="Search vehicle or registration..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <select className={inputClass + ' max-w-44'} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="All">All Statuses</option>
                            <option>Active</option>
                            <option>Maintenance</option>
                            <option>Inactive</option>
                        </select>
                    </div>

                    <div className="grid gap-4 p-5 pt-0 md:grid-cols-2 xl:grid-cols-3">
                        {filtered(vehicles, ['name', 'number', 'type']).map((v) => (
                            <VehicleCard
                                key={v.id}
                                vehicle={v}
                                route={routeById[v.routeId]}
                                driver={driverById[v.driverId]}
                                allocated={getRouteCount(v.routeId)}
                                onEdit={() => open('vehicle', v)}
                            />
                        ))}
                    </div>
                </Surface>
            )}

            {/* ROUTES */}
            {tab === 'routes' && (
                <Surface>
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-6">
                        <div>
                            <h2 className="text-lg font-bold">Route Management</h2>
                            <p className="mt-1 text-xs text-slate-500">Organize pickup points and destination schedules.</p>
                        </div>
                        <Button className="bg-[#257cbe] hover:bg-[#176aa6]" onClick={() => open('route')}>
                            <Plus size={16} className="mr-2" /> Create Route
                        </Button>
                    </div>

                    <div className="grid gap-4 p-6 lg:grid-cols-2">
                        {routes.map((route) => {
                            const capacity = getRouteCapacity(route.id);
                            const count = getRouteCount(route.id);

                            return (
                                <div key={route.id} className="rounded-[22px] border border-slate-200 p-5 transition-all hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/30">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <span className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-[#257cbe]">
                                            <Route size={23} />
                                        </span>
                                        <Status value={route.status} />
                                    </div>

                                    <h3 className="mt-5 font-bold">{route.name}</h3>
                                    <p className="mt-1 text-xs text-slate-400">
                                        {route.code} · Departure {route.departure}
                                    </p>

                                    <div className="mt-5 rounded-xl bg-slate-50 p-4">
                                        <RouteTrack stops={route.stops} />
                                    </div>

                                    <div className="mt-5 grid grid-cols-3 gap-3">
                                        <div>
                                            <p className="text-[11px] text-slate-400">Students</p>
                                            <p className="mt-1 text-sm font-bold">{count}</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-slate-400">Seats</p>
                                            <p className="mt-1 text-sm font-bold">{capacity}</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-slate-400">Monthly Fee</p>
                                            <p className="mt-1 text-sm font-bold">{transportMoney(route.fee)}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => open('route', route)}
                                        className="mt-5 flex w-full items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-[#257cbe]"
                                    >
                                        Edit Route <Pencil size={15} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </Surface>
            )}

            {/* DRIVERS */}
            {tab === 'drivers' && (
                <Surface>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-6">
                        <div>
                            <h2 className="text-lg font-bold">Driver Directory</h2>
                            <p className="mt-1 text-xs text-slate-500">Manage transport staff and vehicle assignments.</p>
                        </div>
                        <Button className="bg-[#257cbe] hover:bg-[#176aa6]" onClick={() => open('driver')}>
                            <Plus size={16} className="mr-2" /> Add Driver
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px] text-left text-sm">
                            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                <tr>
                                    <th className="px-6 py-4">Driver</th>
                                    <th className="px-4 py-4">License</th>
                                    <th className="px-4 py-4">Experience</th>
                                    <th className="px-4 py-4">Vehicle</th>
                                    <th className="px-4 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {drivers.map((driver) => {
                                    const vehicle = vehicles.find((v) => v.driverId === driver.id);
                                    return (
                                        <tr key={driver.id} className="hover:bg-blue-50/30">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="grid size-11 place-items-center rounded-2xl bg-blue-50 font-bold text-[#257cbe]">
                                                        {driver.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">{driver.name}</p>
                                                        <p className="mt-1 text-[11px] text-slate-400">{driver.phone}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-xs text-slate-600">{driver.license}</td>
                                            <td className="px-4 py-4 text-xs text-slate-600">{driver.experience} years</td>
                                            <td className="px-4 py-4 text-xs text-slate-600">{vehicle?.name || 'Unassigned'}</td>
                                            <td className="px-4 py-4"><Status value={driver.status} /></td>
                                            <td className="px-6 py-4 text-right">
                                                <Button size="sm" variant="outline" onClick={() => open('driver', driver)}>
                                                    <Pencil size={14} className="mr-1.5" /> Edit
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Surface>
            )}

            {/* STUDENT ALLOCATION */}
            {tab === 'allocations' && (
                <Surface>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-6">
                        <div>
                            <h2 className="text-lg font-bold">Student Transport Allocation</h2>
                            <p className="mt-1 text-xs text-slate-500">Assign students to routes and pickup stops.</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" onClick={exportAllocations}>
                                <Download size={16} className="mr-2" /> Export
                            </Button>
                            <Button className="bg-[#257cbe] hover:bg-[#176aa6]" onClick={() => open('allocation')}>
                                <Plus size={16} className="mr-2" /> Allocate Student
                            </Button>
                        </div>
                    </div>

                    <div className="relative m-5 max-w-md">
                        <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            className="h-11 rounded-xl pl-10"
                            placeholder="Search student, route, pickup..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                <tr>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-4 py-4">Class</th>
                                    <th className="px-4 py-4">Assigned Route</th>
                                    <th className="px-4 py-4">Pickup Stop</th>
                                    <th className="px-4 py-4">Monthly Fee</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {allocations.filter((a) => {
                                    const s = studentById[a.studentId];
                                    const r = routeById[a.routeId];
                                    return `${s?.name} ${s?.admissionNo} ${r?.name} ${a.pickup}`
                                        .toLowerCase().includes(search.trim().toLowerCase());
                                }).map((a) => {
                                    const student = studentById[a.studentId];
                                    const route = routeById[a.routeId];
                                    return (
                                        <tr key={a.id} className="hover:bg-blue-50/30">
                                            <td className="px-6 py-4">
                                                <p className="font-semibold">{student?.name || 'Unknown'}</p>
                                                <p className="mt-1 text-[11px] text-slate-400">{student?.admissionNo}</p>
                                            </td>
                                            <td className="px-4 py-4 text-xs text-slate-600">
                                                {student?.className}-{student?.section}
                                            </td>
                                            <td className="px-4 py-4 text-xs font-semibold text-slate-700">
                                                {route?.name || '—'}
                                            </td>
                                            <td className="px-4 py-4 text-xs text-slate-600">{a.pickup}</td>
                                            <td className="px-4 py-4 text-xs font-semibold">
                                                {transportMoney(route?.fee)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button size="sm" variant="outline" onClick={() => open('allocation', a)}>
                                                    <Pencil size={14} className="mr-1.5" /> Edit
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {!allocations.length && (
                            <p className="p-12 text-center text-sm text-slate-400">No transport allocations yet.</p>
                        )}
                    </div>
                </Surface>
            )}

            {editor && (
                <Editor
                    key={`${editor.kind}-${editor.item?.id || 'new'}`}
                    kind={editor.kind}
                    initial={editor.item}
                    store={store}
                    onSave={saveRecord}
                    onClose={() => setEditor(null)}
                />
            )}
        </div>
    );
}
