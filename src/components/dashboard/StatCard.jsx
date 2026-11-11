import { ArrowUpRight } from 'lucide-react';

export default function StatCard({
    title,
    value,
    description,
    icon: Icon,
    iconBg = 'bg-blue-50',
    iconColor = 'text-[#257cbe]',
}) {
    return (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
                    {Icon && <Icon size={23} />}
                </div>

                <ArrowUpRight size={17} className="text-slate-300" />
            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
                {title}
            </p>

            <h3 className="mt-2 break-words text-2xl font-bold text-slate-900">
                {value ?? '—'}
            </h3>

            <p className="mt-2 text-xs text-slate-400">
                {description || 'No data available'}
            </p>
        </div>
    );
}