import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CheckCheck,
    CreditCard,
    UserRoundPlus,
    Bus,
    ClipboardList,
    X,
} from 'lucide-react';

const initialNotifications = [
    {
        id: 'NOTIF-1',
        title: 'New Admission Application',
        message: 'Ayaan Khan submitted an admission form for Class 5.',
        time: '12m ago',
        unread: true,
        path: '/admissions',
        icon: UserRoundPlus,
    },
    {
        id: 'NOTIF-2',
        title: 'Fee Collection Update',
        message: '₹1,85,000 recorded in term fee dues collected today.',
        time: '45m ago',
        unread: true,
        path: '/fees',
        icon: CreditCard,
    },
    {
        id: 'NOTIF-3',
        title: 'Bus Route #3 Dispatched',
        message: 'Vehicle departed campus on North Ring Road route.',
        time: '2h ago',
        unread: true,
        path: '/transport',
        icon: Bus,
    },
    {
        id: 'NOTIF-4',
        title: 'Exam Results Finalized',
        message: 'Report cards generated for Class 8 & 9.',
        time: 'Yesterday',
        unread: false,
        path: '/examinations',
        icon: ClipboardList,
    },
];

export default function NotificationsPopover({ open, onClose }) {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState(initialNotifications);

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    };

    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
        );
    };

    if (!open) return null;

    return (
        <div className="absolute right-0 top-[36px] z-50 w-[320px] max-w-[calc(100vw-24px)] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg text-xs">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2 bg-slate-50/60">
                <span className="font-semibold text-slate-800">
                    Notifications
                </span>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={markAllRead}
                        className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800"
                        title="Mark all as read"
                    >
                        <CheckCheck size={13} />
                        Mark read
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded p-0.5 text-slate-400 hover:text-slate-600"
                    >
                        <X size={13} />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="max-h-[280px] overflow-y-auto divide-y divide-slate-100">
                {notifications.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.id}
                            onClick={() => {
                                markAsRead(item.id);
                                navigate(item.path);
                                onClose();
                            }}
                            className={`flex cursor-pointer items-start gap-2.5 p-2.5 hover:bg-slate-50 transition ${
                                item.unread ? 'bg-slate-50/40' : ''
                            }`}
                        >
                            <div className="flex size-6.5 shrink-0 items-center justify-center rounded bg-slate-100 text-slate-500">
                                <Icon size={13} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                    <p className="truncate font-medium text-slate-800">
                                        {item.title}
                                    </p>
                                    <span className="shrink-0 text-[10px] text-slate-400">
                                        {item.time}
                                    </span>
                                </div>
                                <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-2">
                                    {item.message}
                                </p>
                            </div>

                            {item.unread && (
                                <span className="size-1.5 shrink-0 rounded-full bg-[#257cbe] mt-1.5" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
