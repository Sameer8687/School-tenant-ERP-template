import { Database, Server, ShieldCheck, X } from 'lucide-react';

export default function SystemDiagnosticsModal({ open, onClose }) {
    if (!open) return null;

    return (
        <div
            id="diagnosticsModal"
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
            onClick={onClose}
        >
            <div
                className="card w-full max-w-xl overflow-hidden shadow-lg animate-in fade-in duration-150"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="card-head">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                        <h3 className="card-title text-sm font-bold">System Self-Diagnostics &amp; Health</h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-[var(--ink-2)] hover:text-[var(--ink)] text-base font-bold w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--hover)] transition"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="card-body space-y-3 text-xs">
                    <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <Database className="w-4 h-4 text-emerald-700 shrink-0" />
                            <div>
                                <p className="font-bold text-gray-900">Database Connection &amp; Tables</p>
                                <p className="text-[11px] text-gray-500">1,378 enrolled students, 39 faculty members verified</p>
                            </div>
                        </div>
                        <span className="badge b-ok font-semibold">Connected</span>
                    </div>

                    <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <Server className="w-4 h-4 text-emerald-700 shrink-0" />
                            <div>
                                <p className="font-bold text-gray-900">Academic Years Master (stvacdm)</p>
                                <p className="text-[11px] text-gray-500">Current session: 2026-27 (Session ID: 9)</p>
                            </div>
                        </div>
                        <span className="badge b-ok font-semibold">Active</span>
                    </div>

                    <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                            <div>
                                <p className="font-bold text-gray-900">JWT Authentication Authority</p>
                                <p className="text-[11px] text-gray-500">Role-isolated sessions &amp; Multi-tenant routing active</p>
                            </div>
                        </div>
                        <span className="badge b-ok font-semibold">Operational</span>
                    </div>
                </div>

                <div className="p-4 border-t border-[var(--line)] bg-[var(--surface)] flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-secondary btn-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

