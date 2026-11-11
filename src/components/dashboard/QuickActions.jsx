
import { useNavigate } from 'react-router-dom';
import {
    ArrowUpRight,
    CalendarCheck,
    ClipboardList,
    Receipt,
    UserPlus,
    Zap,
} from 'lucide-react';

const actions = [
    {
        label: 'Student Management',
        description: 'Admissions & records',
        icon: UserPlus,
        path: '/students',
    },
    {
        label: 'Mark Attendance',
        description: 'Daily attendance',
        icon: CalendarCheck,
        path: '/attendance',
    },
    {
        label: 'Collect Fees',
        description: 'Payments & collections',
        icon: Receipt,
        path: '/fees',
    },
    {
        label: 'Examinations',
        description: 'Schedules & results',
        icon: ClipboardList,
        path: '/examinations',
    },
];

export default function QuickActions() {
    const navigate = useNavigate();

    return (
        <section className="flex h-full flex-col rounded-lg border border-[#e7ecf2] bg-white p-3.5 shadow-[0_1px_3px_rgba(15,23,42,0.025)]">

            {/* Section Header */}
            <div className="mb-3 flex items-center gap-2.5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#edf5fb] text-[#257cbe]">
                    <Zap size={16} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                    <h2 className="text-[13px] font-bold text-slate-800">
                        Quick Actions
                    </h2>

                    <p className="text-[11px] text-slate-400">
                        Frequently used school tools
                    </p>
                </div>
            </div>

            {/* Compact Action Grid */}
            <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
                {actions.map(({ label, description, icon: Icon, path }) => (
                    <button
                        key={path}
                        type="button"
                        onClick={() => navigate(path)}
                        className="group flex min-h-[68px] items-center gap-2.5 rounded-lg border border-[#e8edf3] bg-[#fcfdff] px-3 py-2.5 text-left transition-all duration-150 hover:border-[#b9d7eb] hover:bg-[#f3f9fd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#257cbe]"
                    >
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#dcecf7] bg-white text-[#257cbe] transition-colors group-hover:bg-[#eaf4fb]">
                            <Icon size={16} strokeWidth={1.8} />
                        </span>

                        <span className="min-w-0 flex-1">
                            <span className="block text-[12px] font-semibold leading-4 text-slate-800">
                                {label}
                            </span>

                            <span className="mt-1 block text-[10px] leading-4 text-slate-400">
                                {description}
                            </span>
                        </span>

                        <ArrowUpRight
                            size={14}
                            className="shrink-0 text-slate-300 transition-colors group-hover:text-[#257cbe]"
                        />
                    </button>
                ))}
            </div>
        </section>
    );
}
