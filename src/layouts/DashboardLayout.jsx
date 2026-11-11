import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import SystemDiagnosticsModal from '../components/layout/SystemDiagnosticsModal';

export default function DashboardLayout() {
    // sbMode can be 'compact', 'grid', 'search', 'folder', or 'help'
    const [sbMode, setSbMode] = useState('compact');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
    const location = useLocation();

    // Auto close drawers on route change if on mobile
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    return (
        <div id="shell" data-sb={sbMode} className="min-h-screen bg-[var(--bg)] flex flex-col">
            {/* Mobile Backdrop Blur Overlay */}
            {mobileOpen && (
                <div
                    id="overlay"
                    aria-label="Close sidebar overlay"
                    onClick={() => {
                        setMobileOpen(false);
                        setSbMode('compact');
                    }}
                    className="fixed inset-0 bg-black/40 z-[95] lg:hidden backdrop-blur-xs transition-opacity"
                />
            )}

            {/* DUAL-SIDEBAR COMPONENT (Rail 56px + Flyout Panel 236px) */}
            <Sidebar
                sbMode={sbMode}
                setSbMode={setSbMode}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
                onOpenDiagnostics={() => setDiagnosticsOpen(true)}
            />

            {/* MAIN CONTENT WRAPPER */}
            <div id="mainWrap" className="flex-1 flex flex-col min-w-0 transition-all duration-200">
                <Header
                    onOpenMobile={() => {
                        setMobileOpen(true);
                        if (sbMode === 'compact') setSbMode('grid');
                    }}
                    onOpenDiagnostics={() => setDiagnosticsOpen(true)}
                />

                <main className="p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto flex-1">
                    <Outlet />
                </main>
            </div>

            {/* SYSTEM DIAGNOSTICS MODAL */}
            <SystemDiagnosticsModal
                open={diagnosticsOpen}
                onClose={() => setDiagnosticsOpen(false)}
            />
        </div>
    );
}
