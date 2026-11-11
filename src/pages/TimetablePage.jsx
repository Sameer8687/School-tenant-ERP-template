import { useState, useMemo } from 'react';
import {
    CalendarDays,
    Clock,
    Plus,
    Printer,
    Download,
    Search,
    BookOpen,
    User,
    MapPin,
    Filter,
    CheckCircle2,
    X,
} from 'lucide-react';
import {
    initialTimetableSlots,
    timetableDays,
    timetablePeriods,
} from '../data/timetable.mock';

export default function TimetablePage() {
    const [slots, setSlots] = useState(initialTimetableSlots);
    const [selectedClass, setSelectedClass] = useState('Grade 8-A');
    const [selectedDay, setSelectedDay] = useState('All');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [showAddModal, setShowAddModal] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const [form, setForm] = useState({
        day: 'Monday',
        period: '08:00 - 08:45',
        class: 'Grade 8-A',
        subject: 'Mathematics',
        teacher: 'Rahul Patil',
        room: 'Room 204',
    });

    const filteredSlots = useMemo(() => {
        return slots.filter((slot) => {
            const matchesClass = slot.class === selectedClass;
            const matchesDay = selectedDay === 'All' || slot.day === selectedDay;
            return matchesClass && matchesDay;
        });
    }, [slots, selectedClass, selectedDay]);

    const handleAddSlot = (e) => {
        e.preventDefault();
        const colors = [
            'bg-blue-50 border-blue-200 text-blue-800',
            'bg-emerald-50 border-emerald-200 text-emerald-800',
            'bg-purple-50 border-purple-200 text-purple-800',
            'bg-amber-50 border-amber-200 text-amber-800',
            'bg-cyan-50 border-cyan-200 text-cyan-800',
        ];
        const newSlot = {
            id: `TS-${Date.now()}`,
            ...form,
            color: colors[Math.floor(Math.random() * colors.length)],
        };

        setSlots((prev) => [...prev, newSlot]);
        setShowAddModal(false);
        setToastMessage(`Assigned ${form.subject} on ${form.day} (${form.period})`);
        setTimeout(() => setToastMessage(''), 3000);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <CalendarDays className="w-5 h-5 text-[#257cbe]" />
                        Master Class Timetable
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Academic schedule, classroom allocation &amp; teacher periods for Academic Year 2026-2027
                    </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="h-8 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 flex items-center gap-1.5 hover:bg-slate-50 transition shadow-xs"
                    >
                        <Printer className="w-3.5 h-3.5 text-slate-600" /> Print Schedule
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowAddModal(true)}
                        className="h-8 px-3 rounded-lg bg-[#257cbe] hover:bg-[#1b6299] text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                    >
                        <Plus className="w-3.5 h-3.5" /> Assign Period
                    </button>
                </div>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5">
                        <label className="text-xs font-semibold text-slate-600">Standard &amp; Section:</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="h-8 px-2.5 text-xs rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:border-[#257cbe]"
                        >
                            <option value="Grade 8-A">Grade 8th - Section A</option>
                            <option value="Grade 8-B">Grade 8th - Section B</option>
                            <option value="Grade 7-A">Grade 7th - Section A</option>
                            <option value="Grade 6-A">Grade 6th - Section A</option>
                            <option value="Grade 9-A">Grade 9th - Section A</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <label className="text-xs font-semibold text-slate-600">Day:</label>
                        <select
                            value={selectedDay}
                            onChange={(e) => setSelectedDay(e.target.value)}
                            className="h-8 px-2.5 text-xs rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:border-[#257cbe]"
                        >
                            <option value="All">All Days (Mon - Sat)</option>
                            {timetableDays.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">View:</span>
                    <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
                        <button
                            type="button"
                            onClick={() => setViewMode('grid')}
                            className={`px-2.5 py-1 rounded-md font-semibold transition ${
                                viewMode === 'grid' ? 'bg-white shadow-xs text-[#257cbe]' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Weekly Grid
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('list')}
                            className={`px-2.5 py-1 rounded-md font-semibold transition ${
                                viewMode === 'list' ? 'bg-white shadow-xs text-[#257cbe]' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Day Agenda
                        </button>
                    </div>
                </div>
            </div>

            {/* Notification Toast */}
            {toastMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    {toastMessage}
                </div>
            )}

            {/* Timetable Grid View */}
            {viewMode === 'grid' ? (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <table className="w-full text-left border-collapse min-w-[760px]">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                <th className="p-3.5 w-32 border-r border-slate-200">Day</th>
                                {timetablePeriods.map((p, idx) => (
                                    <th key={p} className="p-3.5 text-center border-r border-slate-200 last:border-r-0">
                                        <div className="font-bold text-slate-800">Period {idx + 1}</div>
                                        <div className="text-[10px] text-slate-500 font-medium lowercase tracking-normal flex items-center justify-center gap-1 mt-0.5">
                                            <Clock className="w-3 h-3 text-slate-400" /> {p}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {timetableDays
                                .filter((d) => selectedDay === 'All' || d === selectedDay)
                                .map((day) => (
                                    <tr key={day} className="hover:bg-slate-50/50 transition">
                                        <td className="p-3.5 font-bold text-slate-900 bg-slate-50/40 border-r border-slate-200 align-top">
                                            {day}
                                        </td>
                                        {timetablePeriods.map((period) => {
                                            const slot = slots.find(
                                                (s) => s.class === selectedClass && s.day === day && s.period === period
                                            );
                                            return (
                                                <td key={period} className="p-2 border-r border-slate-100 last:border-r-0 align-top">
                                                    {slot ? (
                                                        <div className={`p-2.5 rounded-xl border ${slot.color} transition hover:shadow-xs space-y-1`}>
                                                            <div className="font-bold text-xs leading-tight">
                                                                {slot.subject}
                                                            </div>
                                                            <div className="text-[11px] font-medium opacity-90 flex items-center gap-1">
                                                                <User className="w-3 h-3" /> {slot.teacher}
                                                            </div>
                                                            <div className="text-[10px] opacity-75 flex items-center gap-1">
                                                                <MapPin className="w-2.5 h-2.5" /> {slot.room}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="h-16 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-[11px] text-slate-400 hover:border-slate-300 hover:text-slate-600 transition cursor-pointer"
                                                            onClick={() => {
                                                                setForm((prev) => ({ ...prev, day, period, class: selectedClass }));
                                                                setShowAddModal(true);
                                                            }}
                                                        >
                                                            + Slot
                                                        </div>
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
                /* List / Agenda View */
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSlots.map((slot) => (
                        <div key={slot.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                                    {slot.day}
                                </span>
                                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {slot.period}
                                </span>
                            </div>
                            <div className="pt-1">
                                <h3 className="font-bold text-slate-900 text-sm">{slot.subject}</h3>
                                <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                                    <User className="w-3.5 h-3.5 text-slate-400" /> {slot.teacher}
                                </p>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {slot.room}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Assign Period Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200 overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#257cbe]" /> Assign Class Period
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="text-slate-400 hover:text-slate-600 transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <form onSubmit={handleAddSlot} className="p-5 space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-semibold text-slate-700 block mb-1">Standard / Class</label>
                                    <input
                                        type="text"
                                        value={form.class}
                                        onChange={(e) => setForm({ ...form, class: e.target.value })}
                                        className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="font-semibold text-slate-700 block mb-1">Day of Week</label>
                                    <select
                                        value={form.day}
                                        onChange={(e) => setForm({ ...form, day: e.target.value })}
                                        className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-800"
                                    >
                                        {timetableDays.map((d) => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">Time Slot / Period</label>
                                <select
                                    value={form.period}
                                    onChange={(e) => setForm({ ...form, period: e.target.value })}
                                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-800"
                                >
                                    {timetablePeriods.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-semibold text-slate-700 block mb-1">Subject</label>
                                    <input
                                        type="text"
                                        value={form.subject}
                                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                        className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-800"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="font-semibold text-slate-700 block mb-1">Faculty / Teacher</label>
                                    <input
                                        type="text"
                                        value={form.teacher}
                                        onChange={(e) => setForm({ ...form, teacher: e.target.value })}
                                        className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-800"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">Classroom / Lab Location</label>
                                <input
                                    type="text"
                                    value={form.room}
                                    onChange={(e) => setForm({ ...form, room: e.target.value })}
                                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-800"
                                    placeholder="e.g. Room 204 or Science Lab 1"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 rounded-lg bg-[#257cbe] hover:bg-[#1b6299] text-white font-semibold shadow-xs"
                                >
                                    Save Period Slot
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
