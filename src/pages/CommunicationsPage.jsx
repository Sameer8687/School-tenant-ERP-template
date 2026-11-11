import { useState, useMemo } from 'react';
import {
    Bell,
    Send,
    Plus,
    MessageSquare,
    Mail,
    Smartphone,
    Search,
    Pin,
    Calendar,
    Users,
    CheckCircle2,
    Clock,
    X,
    Filter,
} from 'lucide-react';
import { initialAnnouncements, initialBroadcastLogs } from '../data/communications.mock';

export default function CommunicationsPage() {
    const [activeTab, setActiveTab] = useState('notices'); // 'notices' | 'broadcast' | 'logs'
    const [notices, setNotices] = useState(initialAnnouncements);
    const [logs, setLogs] = useState(initialBroadcastLogs);
    const [search, setSearch] = useState('');
    const [showNoticeModal, setShowNoticeModal] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Broadcast composer state
    const [broadcastForm, setBroadcastForm] = useState({
        channel: 'SMS',
        targetAudience: 'All Parents',
        title: '',
        message: '',
    });

    const [newNoticeForm, setNewNoticeForm] = useState({
        title: '',
        category: 'Academic',
        targetAudience: 'All Students & Parents',
        content: '',
        pinned: false,
    });

    const filteredNotices = useMemo(() => {
        return notices.filter(
            (n) =>
                n.title.toLowerCase().includes(search.toLowerCase()) ||
                n.content.toLowerCase().includes(search.toLowerCase()) ||
                n.category.toLowerCase().includes(search.toLowerCase())
        );
    }, [notices, search]);

    const handleCreateNotice = (e) => {
        e.preventDefault();
        const notice = {
            id: `ANN-${Math.floor(105 + Math.random() * 50)}`,
            ...newNoticeForm,
            publishDate: new Intl.DateTimeFormat('en-CA').format(new Date()),
            expireDate: '2026-12-31',
            author: 'Administration Desk',
            status: 'Published',
            attachments: [],
        };

        setNotices([notice, ...notices]);
        setShowNoticeModal(false);
        setToastMessage(`Notice "${notice.title}" posted to notice board!`);
        setTimeout(() => setToastMessage(''), 3000);

        setNewNoticeForm({
            title: '',
            category: 'Academic',
            targetAudience: 'All Students & Parents',
            content: '',
            pinned: false,
        });
    };

    const handleSendBroadcast = (e) => {
        e.preventDefault();
        const newLog = {
            id: `MSG-${Math.floor(904 + Math.random() * 50)}`,
            title: broadcastForm.title,
            channel: broadcastForm.channel,
            recipientsGroup: broadcastForm.targetAudience,
            recipientCount: broadcastForm.targetAudience.includes('All') ? 1420 : 320,
            sentAt: 'Just now',
            status: 'Delivered (100%)',
            sentBy: 'Admin Office',
        };

        setLogs([newLog, ...logs]);
        setToastMessage(`Broadcast successfully queued and dispatched via ${broadcastForm.channel}!`);
        setTimeout(() => setToastMessage(''), 3000);

        setBroadcastForm({
            channel: 'SMS',
            targetAudience: 'All Parents',
            title: '',
            message: '',
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-[#257cbe]" />
                        Communication Center
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        School-wide circulars, official notice board, and mass SMS / WhatsApp broadcasts
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setShowNoticeModal(true)}
                        className="h-8 px-3 rounded-lg bg-[#257cbe] hover:bg-[#1b6299] text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                    >
                        <Plus className="w-3.5 h-3.5" /> Post Announcement
                    </button>
                </div>
            </div>

            {/* Tab navigation */}
            <div className="flex items-center gap-2 border-b border-slate-200">
                <button
                    type="button"
                    onClick={() => setActiveTab('notices')}
                    className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition ${
                        activeTab === 'notices'
                            ? 'border-[#257cbe] text-[#257cbe]'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                    Official Notice Board ({notices.length})
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('broadcast')}
                    className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition ${
                        activeTab === 'broadcast'
                            ? 'border-[#257cbe] text-[#257cbe]'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                    Send Broadcast / SMS
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('logs')}
                    className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition ${
                        activeTab === 'logs'
                            ? 'border-[#257cbe] text-[#257cbe]'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                    Delivery Logs ({logs.length})
                </button>
            </div>

            {/* Toast message */}
            {toastMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    {toastMessage}
                </div>
            )}

            {/* Tab 1: Notice Board */}
            {activeTab === 'notices' && (
                <div className="space-y-4">
                    <div className="relative max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search notices and circulars..."
                            className="w-full h-8 pl-9 pr-3 text-xs rounded-lg border border-slate-200 bg-white"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {filteredNotices.map((n) => (
                            <div
                                key={n.id}
                                className={`rounded-2xl border bg-white p-5 shadow-xs relative space-y-3 transition ${
                                    n.pinned ? 'border-[#257cbe]/40 bg-blue-50/20' : 'border-slate-200'
                                }`}
                            >
                                {n.pinned && (
                                    <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold text-[#257cbe] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                        <Pin className="w-3 h-3" /> Pinned Notice
                                    </div>
                                )}

                                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                                    <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                                        {n.category}
                                    </span>
                                    <span>• Target: {n.targetAudience}</span>
                                </div>

                                <h3 className="font-bold text-slate-900 text-sm">{n.title}</h3>

                                <p className="text-xs text-slate-600 leading-relaxed">{n.content}</p>

                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                                    <span>Published: {n.publishDate}</span>
                                    <span>By: {n.author}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tab 2: Broadcast Composer */}
            {activeTab === 'broadcast' && (
                <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                    <div>
                        <h3 className="font-bold text-slate-900 text-sm">Compose Instant Mass Broadcast</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Dispatches messages via SMS gateway or WhatsApp API with automated parent/student variable replacement
                        </p>
                    </div>

                    <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">Dispatch Gateway</label>
                                <select
                                    value={broadcastForm.channel}
                                    onChange={(e) => setBroadcastForm({ ...broadcastForm, channel: e.target.value })}
                                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200"
                                >
                                    <option value="SMS">SMS Gateway (Fast2SMS / Twilio)</option>
                                    <option value="WhatsApp">WhatsApp Business API</option>
                                    <option value="Email">Email Bulk Newsletter</option>
                                </select>
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">Target Group</label>
                                <select
                                    value={broadcastForm.targetAudience}
                                    onChange={(e) => setBroadcastForm({ ...broadcastForm, targetAudience: e.target.value })}
                                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200"
                                >
                                    <option value="All Parents">All Enrolled Parents (1,420 recipients)</option>
                                    <option value="Parents with Outstanding Dues">Parents with Outstanding Dues (148 recipients)</option>
                                    <option value="All Teaching Staff">All Teaching Faculty (48 staff)</option>
                                    <option value="Grade 8 & 9 Parents">Grade 8 &amp; 9 Cohorts (240 parents)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="font-semibold text-slate-700 block mb-1">Campaign Title / Identifier</label>
                            <input
                                type="text"
                                value={broadcastForm.title}
                                onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                                placeholder="e.g. Weather Alert - Early Dismissal Today"
                                className="w-full h-8 px-2.5 rounded-lg border border-slate-200"
                                required
                            />
                        </div>

                        <div>
                            <label className="font-semibold text-slate-700 block mb-1">
                                Message Body ({broadcastForm.message.length}/160 chars per SMS credit)
                            </label>
                            <textarea
                                value={broadcastForm.message}
                                onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                                rows={4}
                                placeholder="Type your announcement here. E.g. Dear Parent, please note school buses will depart 1 hour early today due to rain."
                                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <span className="text-[11px] text-slate-500">
                                Estimated delivery speed: ~3,000 messages / minute
                            </span>
                            <button
                                type="submit"
                                className="px-5 py-2 rounded-lg bg-[#257cbe] hover:bg-[#1b6299] text-white font-semibold flex items-center gap-1.5 shadow-xs"
                            >
                                <Send className="w-3.5 h-3.5" /> Dispatch Broadcast Now
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Tab 3: Delivery Logs */}
            {activeTab === 'logs' && (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                            <tr>
                                <th className="p-3">Campaign / Subject</th>
                                <th className="p-3">Channel</th>
                                <th className="p-3">Recipients Group</th>
                                <th className="p-3">Count</th>
                                <th className="p-3">Sent Time</th>
                                <th className="p-3">Delivery Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50 transition">
                                    <td className="p-3 font-semibold text-slate-900">{log.title}</td>
                                    <td className="p-3">
                                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">
                                            {log.channel}
                                        </span>
                                    </td>
                                    <td className="p-3 text-slate-600">{log.recipientsGroup}</td>
                                    <td className="p-3 font-bold text-slate-800">{log.recipientCount.toLocaleString()}</td>
                                    <td className="p-3 text-slate-500">{log.sentAt}</td>
                                    <td className="p-3">
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200 flex items-center gap-1 w-max">
                                            <CheckCircle2 className="w-3 h-3" /> {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Post Notice Modal */}
            {showNoticeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Plus className="w-4 h-4 text-[#257cbe]" /> Post Circular / Notice
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowNoticeModal(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateNotice} className="p-5 space-y-3.5 text-xs">
                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">Notice Headline</label>
                                <input
                                    type="text"
                                    value={newNoticeForm.title}
                                    onChange={(e) => setNewNoticeForm({ ...newNoticeForm, title: e.target.value })}
                                    placeholder="e.g. Annual School Picnic Instructions"
                                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="font-semibold text-slate-700 block mb-1">Category</label>
                                    <select
                                        value={newNoticeForm.category}
                                        onChange={(e) => setNewNoticeForm({ ...newNoticeForm, category: e.target.value })}
                                        className="w-full h-8 px-2.5 rounded-lg border border-slate-200"
                                    >
                                        <option value="Academic">Academic</option>
                                        <option value="Administration">Administration</option>
                                        <option value="Sports & Extra-curricular">Sports &amp; Extra-curricular</option>
                                        <option value="Examinations">Examinations</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="font-semibold text-slate-700 block mb-1">Audience</label>
                                    <input
                                        type="text"
                                        value={newNoticeForm.targetAudience}
                                        onChange={(e) => setNewNoticeForm({ ...newNoticeForm, targetAudience: e.target.value })}
                                        placeholder="e.g. All Students or Grades 6-10"
                                        className="w-full h-8 px-2.5 rounded-lg border border-slate-200"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="font-semibold text-slate-700 block mb-1">Notice Details</label>
                                <textarea
                                    value={newNoticeForm.content}
                                    onChange={(e) => setNewNoticeForm({ ...newNoticeForm, content: e.target.value })}
                                    rows={4}
                                    placeholder="Write full circular announcement details here..."
                                    className="w-full p-2.5 rounded-lg border border-slate-200"
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="pinCheckbox"
                                    checked={newNoticeForm.pinned}
                                    onChange={(e) => setNewNoticeForm({ ...newNoticeForm, pinned: e.target.checked })}
                                    className="rounded border-slate-300 text-[#257cbe]"
                                />
                                <label htmlFor="pinCheckbox" className="font-medium text-slate-700">
                                    Pin this announcement to top of notice board
                                </label>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowNoticeModal(false)}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 rounded-lg bg-[#257cbe] hover:bg-[#1b6299] text-white font-semibold"
                                >
                                    Publish Notice
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
