import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    School, Palette, GraduationCap, SlidersHorizontal, Settings2,
    Save, RotateCcw, Download, Upload, X, Check,
    CheckCircle2, AlertCircle, ChevronRight, Clock3,
    MapPin, Globe, Mail, Phone, Calendar,
    UserCheck, Hash, Trash2, ShieldCheck,
    Layers, Sparkles, Monitor, Smartphone, RefreshCw
} from 'lucide-react';

import {
    defaultSchoolSettings,
    schoolColorPresets,
    schoolMonths,
} from '../data/schoolSettings.mock';

const KEY = 'olive-school-settings-demo-v1';

const sections = [
    { id: 'profile', name: 'School Profile', description: 'Identity, contact & address', icon: School },
    { id: 'branding', name: 'Branding Studio', description: 'Visual identity & theme preview', icon: Palette },
    { id: 'academics', name: 'Academic Setup', description: 'Year cycle, timings & rules', icon: GraduationCap },
    { id: 'preferences', name: 'Preferences', description: 'Regional, currency & layout', icon: SlidersHorizontal },
    { id: 'backup', name: 'Backup & Reset', description: 'Configuration snapshots & tools', icon: Settings2 },
];

const clone = (value) => JSON.parse(JSON.stringify(value));

function validateSettings(value) {
    if (!value || typeof value !== 'object') return false;

    return ['profile', 'branding', 'academics', 'preferences'].every(
        (key) =>
            value[key] &&
            typeof value[key] === 'object' &&
            !Array.isArray(value[key])
    );
}

function readSettings() {
    try {
        const stored = JSON.parse(localStorage.getItem(KEY) || 'null');
        if (validateSettings(stored)) {
            return Object.fromEntries(
                Object.entries(defaultSchoolSettings).map(([key, defaults]) => [
                    key,
                    { ...defaults, ...stored[key] },
                ])
            );
        }
    } catch {
        // Use demo defaults.
    }
    return clone(defaultSchoolSettings);
}

// Reusable Field styled with exact EduCore input classes
function FormField({ label, value, onChange, type = 'text', required = false, placeholder = '', helper = '', icon: Icon = null }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-[var(--ink)] flex items-center justify-between">
                <span>
                    {label}
                    {required && <span className="text-red-500 ml-1 font-bold">*</span>}
                </span>
                {required && (
                    <span className="text-[10px] font-medium uppercase tracking-[.06em] text-[var(--ink-3)]">
                        Required
                    </span>
                )}
            </label>
            <div className="relative">
                {Icon && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--ink-3)]">
                        <Icon size={14} />
                    </div>
                )}
                <input
                    type={type}
                    value={value ?? ''}
                    required={required}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e.target.value)}
                    className={`input ${Icon ? 'pl-9' : ''}`}
                />
            </div>
            {helper && <p className="text-[11px] text-[var(--ink-3)] leading-snug">{helper}</p>}
        </div>
    );
}

// Reusable Select styled with exact EduCore select.input classes
function FormSelect({ label, value, onChange, options, helper = '', icon: Icon = null }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-[var(--ink)] block">
                {label}
            </label>
            <div className="relative">
                {Icon && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--ink-3)]">
                        <Icon size={14} />
                    </div>
                )}
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`input appearance-none ${Icon ? 'pl-9' : ''}`}
                >
                    {options.map((option) => {
                        const item = typeof option === 'string'
                            ? { value: option, label: option }
                            : option;

                        return (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        );
                    })}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[var(--ink-3)]">
                    <ChevronRight size={13} className="rotate-90" />
                </div>
            </div>
            {helper && <p className="text-[11px] text-[var(--ink-3)] leading-snug">{helper}</p>}
        </div>
    );
}

// Reusable Toggle matching EduCore interactive switch
function FormToggle({ title, description, checked, onChange, icon: Icon = null }) {
    return (
        <div className="flex items-start justify-between gap-4 py-3 border-b border-[var(--line-2)] last:border-b-0">
            <div className="flex items-start gap-2.5">
                {Icon && (
                    <div className="mt-0.5 w-7 h-7 rounded-lg bg-[var(--surface)] text-[var(--coral)] flex items-center justify-center shrink-0">
                        <Icon size={14} />
                    </div>
                )}
                <div>
                    <h4 className="text-[13px] font-semibold text-[var(--ink)]">{title}</h4>
                    <p className="mt-0.5 text-[11.5px] text-[var(--ink-2)] leading-relaxed">{description}</p>
                </div>
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-label={title}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--coral)]/30 ${
                    checked ? 'bg-[var(--coral)]' : 'bg-[#DCDCD8]'
                }`}
            >
                <span
                    className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm transition duration-150 ease-in-out ${
                        checked ? 'translate-x-5' : 'translate-x-0.5'
                    } mt-0.5`}
                />
            </button>
        </div>
    );
}

// Live Interactive Preview mimicking the exact EduCore Dual-Sidebar layout
function EduCoreLivePreview({ settings }) {
    const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'mobile'
    const color = settings.branding.primaryColor || '#257CBE';
    const { branding, profile, academics } = settings;

    return (
        <div className="card overflow-hidden">
            <div className="card-head">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                        <h4 className="card-title">Live Workspace Simulator</h4>
                        <p className="card-sub">Dynamic real-time reflection of school branding and navigation</p>
                    </div>
                </div>

                <div className="flex items-center rounded-lg border border-[var(--line)] bg-[var(--surface)] p-0.5">
                    <button
                        type="button"
                        onClick={() => setPreviewDevice('desktop')}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11.5px] font-medium transition ${
                            previewDevice === 'desktop'
                                ? 'bg-white text-[var(--ink)] shadow-xs font-semibold'
                                : 'text-[var(--ink-2)] hover:text-[var(--ink)]'
                        }`}
                    >
                        <Monitor size={12} />
                        <span>Desktop</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setPreviewDevice('mobile')}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11.5px] font-medium transition ${
                            previewDevice === 'mobile'
                                ? 'bg-white text-[var(--ink)] shadow-xs font-semibold'
                                : 'text-[var(--ink-2)] hover:text-[var(--ink)]'
                        }`}
                    >
                        <Smartphone size={12} />
                        <span>Mobile</span>
                    </button>
                </div>
            </div>

            <div className="card-body bg-[var(--surface)] p-4 sm:p-6">
                <motion.div
                    layout
                    className={`mx-auto overflow-hidden rounded-xl border border-[var(--line)] bg-white shadow-sm transition-all duration-200 ${
                        previewDevice === 'desktop' ? 'w-full' : 'max-w-[340px]'
                    }`}
                >
                    {/* Simulated Topbar */}
                    <div className="h-10 border-b border-[var(--line)] bg-white px-3 flex items-center justify-between text-xs select-none">
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="font-semibold text-[var(--ink)] truncate">
                                {profile.name || 'Olive English School'}
                            </span>
                            <span className="text-[var(--ink-3)]">/</span>
                            <span className="text-[var(--ink-2)] text-[11px] truncate">
                                {branding.shortName || 'OES'} Portal
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span
                                className="px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-xs"
                                style={{ background: color }}
                            >
                                {academics.academicYear}
                            </span>
                            <div
                                className="w-6 h-6 rounded-md flex items-center justify-center font-bold text-white text-[10px]"
                                style={{ background: color }}
                            >
                                {profile.principal ? profile.principal.charAt(0) : 'A'}
                            </div>
                        </div>
                    </div>

                    {/* Simulated Body with Rail */}
                    <div className="flex min-h-[220px]">
                        {/* Mini Rail (56px) for Desktop */}
                        {previewDevice === 'desktop' && (
                            <div className="w-12 bg-white border-r border-[var(--line-2)] flex flex-col items-center py-2.5 gap-2 shrink-0">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-xs"
                                    style={{ background: color }}
                                >
                                    {branding.logo ? (
                                        <img src={branding.logo} alt="Logo" className="w-5 h-5 object-contain" />
                                    ) : (
                                        <GraduationCap size={16} />
                                    )}
                                </div>
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ background: `${color}18`, color }}
                                >
                                    <School size={15} />
                                </div>
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--ink-3)]">
                                    <Clock3 size={15} />
                                </div>
                            </div>
                        )}

                        {/* Content Area */}
                        <div className="flex-1 bg-[var(--bg)] p-3.5 space-y-3 min-w-0">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[.08em] text-[var(--ink-3)]">
                                    OVERVIEW
                                </p>
                                <h5 className="text-[14px] font-bold text-[var(--ink)] mt-0.5 truncate">
                                    {branding.tagline || 'Inspiring minds. Shaping futures.'}
                                </h5>
                            </div>

                            {/* Mini KPIs */}
                            <div className="grid grid-cols-3 gap-2">
                                <div className="card p-2.5">
                                    <p className="text-[9px] font-bold text-[var(--ink-3)] uppercase">STUDENTS</p>
                                    <p className="text-[14px] font-bold text-[var(--ink)] mt-1">1,378</p>
                                </div>
                                <div className="card p-2.5">
                                    <p className="text-[9px] font-bold text-[var(--ink-3)] uppercase">ATTENDANCE</p>
                                    <p className="text-[14px] font-bold text-emerald-700 mt-1">94.8%</p>
                                </div>
                                <div className="card p-2.5">
                                    <p className="text-[9px] font-bold text-[var(--ink-3)] uppercase">PASSING %</p>
                                    <p className="text-[14px] font-bold mt-1" style={{ color }}>
                                        {academics.passingPercentage}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
                <p className="text-[11px] text-[var(--ink-3)] text-center mt-3">
                    Preview rendered in standard EduCore theme token structure.
                </p>
            </div>
        </div>
    );
}

export default function SchoolSettingsPage() {
    const [settings, setSettings] = useState(readSettings);
    const [tab, setTab] = useState('profile');
    const [saved, setSaved] = useState(() => JSON.stringify(readSettings()));
    const [notice, setNotice] = useState(null); // { type: 'ok' | 'warn' | 'bad', text: string }
    const [resetConfirm, setResetConfirm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const logoInput = useRef(null);
    const importInput = useRef(null);

    const dirty = JSON.stringify(settings) !== saved;
    const color = settings.branding.primaryColor;

    function update(group, field, value) {
        setSettings((prev) => ({
            ...prev,
            [group]: { ...prev[group], [field]: value },
        }));
    }

    // Auto-dismiss notification
    useEffect(() => {
        if (!notice) return;
        const timer = setTimeout(() => setNotice(null), 4000);
        return () => clearTimeout(timer);
    }, [notice]);

    // Validation & Save Handler
    const saveSettings = useCallback(() => {
        const { profile, branding, academics } = settings;

        if (!profile.name.trim() || !profile.code.trim()) {
            setNotice({ type: 'bad', text: 'School name and institutional code are required.' });
            setTab('profile');
            return;
        }
        if (!/^#[0-9a-f]{6}$/i.test(branding.primaryColor)) {
            setNotice({ type: 'bad', text: 'Please choose a valid 6-character hex color.' });
            setTab('branding');
            return;
        }
        if (
            Number(academics.passingPercentage) < 0 ||
            Number(academics.passingPercentage) > 100 ||
            academics.schoolEnd <= academics.schoolStart
        ) {
            setNotice({ type: 'bad', text: 'Please verify the passing percentage and school timings.' });
            setTab('academics');
            return;
        }

        setIsSaving(true);
        try {
            localStorage.setItem(KEY, JSON.stringify(settings));
            setSaved(JSON.stringify(settings));
            setNotice({ type: 'ok', text: 'School settings successfully saved & applied!' });
        } catch {
            setNotice({ type: 'bad', text: 'Unable to save. Browser local storage may be full.' });
        } finally {
            setIsSaving(false);
        }
    }, [settings]);

    // Keyboard shortcut Ctrl+S / Cmd+S
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (dirty) {
                    saveSettings();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [dirty, saveSettings]);

    function uploadLogo(file) {
        if (!file) return;

        if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
            setNotice({ type: 'bad', text: 'Select a PNG, JPG or WebP image.' });
            return;
        }
        if (file.size > 300 * 1024) {
            setNotice({ type: 'warn', text: 'Please use an image smaller than 300 KB for this browser demo.' });
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            update('branding', 'logo', String(reader.result));
            setNotice({ type: 'ok', text: 'School crest uploaded successfully.' });
        };
        reader.readAsDataURL(file);
    }

    function exportSettings() {
        const content = JSON.stringify({
            version: 1,
            application: 'EduCore School ERP Demo',
            settings,
        }, null, 2);

        const url = URL.createObjectURL(
            new Blob([content], { type: 'application/json' })
        );
        const link = document.createElement('a');
        link.href = url;
        link.download = `educore-settings-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        setNotice({ type: 'ok', text: 'Settings backup downloaded as JSON.' });
    }

    async function importSettings(file) {
        if (!file) return;

        if (file.size > 500 * 1024) {
            setNotice({ type: 'bad', text: 'Configuration file is too large (max 500 KB).' });
            return;
        }

        try {
            const parsed = JSON.parse(await file.text());

            if (parsed.version !== 1 || !validateSettings(parsed.settings)) {
                throw new Error('Unsupported configuration format.');
            }

            const incoming = parsed.settings;

            const next = Object.fromEntries(
                Object.entries(defaultSchoolSettings).map(([key, defaults]) => [
                    key,
                    Object.fromEntries(
                        Object.entries(defaults).map(([field, defaultValue]) => {
                            const value = incoming[key][field];

                            return [
                                field,
                                typeof value === typeof defaultValue
                                    ? value : defaultValue,
                            ];
                        })
                    ),
                ])
            );

            if (!/^#[0-9a-f]{6}$/i.test(next.branding.primaryColor) ||
                !next.profile.name.trim()) {
                throw new Error('Invalid school configuration.');
            }

            setSettings(next);
            setTab('profile');
            setNotice({ type: 'ok', text: 'Configuration imported! Click Save Changes to apply.' });
        } catch {
            setNotice({ type: 'bad', text: 'Unable to import this configuration file.' });
        }
    }

    function resetSettings() {
        const next = clone(defaultSchoolSettings);

        try {
            localStorage.setItem(KEY, JSON.stringify(next));
            setSettings(next);
            setSaved(JSON.stringify(next));
            setResetConfirm(false);
            setTab('profile');
            setNotice({ type: 'ok', text: 'School configuration restored to demo defaults.' });
        } catch {
            setNotice({ type: 'bad', text: 'Unable to reset browser settings.' });
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="space-y-6 max-w-[1440px] mx-auto pb-16"
        >
            {/* FLOATING TOAST NOTIFICATION */}
            <AnimatePresence>
                {notice && (
                    <motion.div
                        initial={{ opacity: 0, y: -16, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -16, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border shadow-md text-xs font-medium backdrop-blur-md ${
                            notice.type === 'ok'
                                ? 'bg-[#E9F1E9]/95 text-[#386A46] border-[#386A46]/20'
                                : notice.type === 'warn'
                                ? 'bg-[#F7EEDB]/95 text-[#8A6415] border-[#8A6415]/20'
                                : 'bg-[#FDE8E8]/95 text-red-700 border-red-300'
                        }`}
                    >
                        {notice.type === 'ok' && <CheckCircle2 size={15} />}
                        {notice.type === 'warn' && <AlertCircle size={15} />}
                        {notice.type === 'bad' && <AlertCircle size={15} />}
                        <span>{notice.text}</span>
                        <button
                            type="button"
                            onClick={() => setNotice(null)}
                            className="ml-2 hover:opacity-75 transition p-0.5"
                        >
                            <X size={13} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* EXACT SUB HEADER COMPONENT FROM HTML TEMPLATE */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <p id="viewModuleCategory" className="text-[11px] font-bold uppercase tracking-[.08em] text-[var(--ink-3)]">
                        ADMINISTRATION &amp; CONFIGURATION
                    </p>
                    <h1 id="viewMainHeading" className="text-[24px] sm:text-[28px] font-bold text-[var(--ink)] tracking-[-.02em] mt-1">
                        School Settings
                    </h1>
                    <p id="viewSubHeading" className="text-[13px] text-[var(--ink-2)] mt-1">
                        Configure your school's identity, branding studio and academic preferences.
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge b-warn hidden sm:inline-flex">
                        <span className="dot"></span> Local Demo
                    </span>

                    <button
                        type="button"
                        onClick={exportSettings}
                        className="btn btn-secondary btn-sm"
                        title="Download configuration JSON"
                    >
                        <Download size={13} className="text-[var(--ink-2)]" />
                        <span>Export</span>
                    </button>

                    <button
                        type="button"
                        onClick={saveSettings}
                        disabled={!dirty || isSaving}
                        className={`btn btn-sm ${
                            dirty
                                ? 'btn-primary'
                                : 'btn-secondary opacity-60 cursor-not-allowed'
                        }`}
                    >
                        {isSaving ? (
                            <RefreshCw size={13} className="animate-spin" />
                        ) : (
                            <Save size={13} />
                        )}
                        <span>Save Changes</span>
                        {dirty && (
                            <span className="ml-1 text-[10px] opacity-80 font-mono hidden md:inline">
                                (⌘S)
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* 4 KPI SUMMARY CARDS (Matching DashboardPage & Template) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.12 }}
                    onClick={() => setTab('profile')}
                    className="card p-5 cursor-pointer hover:border-[var(--coral)] transition"
                    title="Click to manage School Profile"
                >
                    <p className="text-[10.5px] font-bold uppercase tracking-[.08em] text-[var(--ink-3)]">
                        INSTITUTION
                    </p>
                    <p className="text-[20px] font-bold text-[var(--ink)] tracking-[-.02em] mt-2 leading-tight truncate">
                        {settings.profile.name || 'School Name'}
                    </p>
                    <p className="text-[12px] text-[var(--ink-2)] mt-2">
                        Code: {settings.profile.code || 'OLIVE-001'}
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.12 }}
                    onClick={() => setTab('branding')}
                    className="card p-5 cursor-pointer hover:border-[var(--coral)] transition"
                    title="Click to customize Branding"
                >
                    <p className="text-[10.5px] font-bold uppercase tracking-[.08em] text-[var(--ink-3)]">
                        PRIMARY COLOR
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <span
                            className="size-4 rounded-md shadow-xs border border-white"
                            style={{ background: color }}
                        />
                        <p className="text-[20px] font-bold text-[var(--ink)] tracking-[-.02em] font-mono leading-none">
                            {color}
                        </p>
                    </div>
                    <p className="text-[12px] text-[var(--ink-2)] mt-2">
                        Short: {settings.branding.shortName || 'OES'}
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.12 }}
                    onClick={() => setTab('academics')}
                    className="card p-5 cursor-pointer hover:border-[var(--coral)] transition"
                    title="Click to configure Academic Setup"
                >
                    <p className="text-[10.5px] font-bold uppercase tracking-[.08em] text-[var(--ink-3)]">
                        ACADEMIC SESSION
                    </p>
                    <p className="text-[20px] font-bold text-[var(--ink)] tracking-[-.02em] mt-2 leading-none">
                        {settings.academics.academicYear}
                    </p>
                    <p className="text-[12px] text-[var(--ink-2)] mt-2">
                        Cycle starts in {settings.academics.startMonth}
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.12 }}
                    onClick={() => setTab('preferences')}
                    className="card p-5 cursor-pointer hover:border-[var(--coral)] transition"
                    title="Click to view Preferences"
                >
                    <p className="text-[10.5px] font-bold uppercase tracking-[.08em] text-[var(--ink-3)]">
                        REGION &amp; CURRENCY
                    </p>
                    <p className="text-[20px] font-bold text-[var(--ink)] tracking-[-.02em] mt-2 leading-none">
                        {settings.preferences.currency} ({settings.preferences.language})
                    </p>
                    <p className="text-[12px] text-[var(--ink-2)] mt-2 truncate">
                        {settings.preferences.timezone}
                    </p>
                </motion.div>
            </div>

            {/* TWO-COLUMN WORKSPACE: SIDEBAR + ACTIVE VIEW */}
            <div className="grid grid-cols-1 lg:grid-cols-[236px_minmax(0,1fr)] gap-6 items-start">
                
                {/* SETTINGS CATEGORY SIDEBAR (Matching EduCore Flyout Panel) */}
                <div className="card p-3 space-y-1 lg:sticky lg:top-20">
                    <p className="text-[11.5px] font-bold uppercase tracking-[.06em] text-[#8A92A6] px-2 pt-1 pb-1.5">
                        CONFIGURATION
                    </p>

                    {sections.map(({ id, name, description, icon: Icon }) => {
                        const active = tab === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setTab(id)}
                                className={`w-full flex items-center justify-between px-2.5 py-2.5 rounded-lg text-left transition ${
                                    active
                                        ? 'bg-[var(--coral-soft)] text-[var(--coral-ink)] font-semibold'
                                        : 'text-[var(--ink)] hover:bg-[var(--hover)] font-medium text-[13px]'
                                }`}
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <Icon
                                        size={16}
                                        className={active ? 'text-[var(--coral-ink)]' : 'text-[#475569]'}
                                    />
                                    <div className="min-w-0">
                                        <p className="truncate text-[13px] leading-tight">{name}</p>
                                        <p className="truncate text-[10.5px] font-normal text-[var(--ink-3)] mt-0.5">
                                            {description}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight
                                    size={14}
                                    className={`shrink-0 transition-transform ${
                                        active ? 'text-[var(--coral)] translate-x-0.5' : 'text-[var(--ink-3)] opacity-60'
                                    }`}
                                />
                            </button>
                        );
                    })}

                    <div className="p-3 rounded-xl bg-[var(--surface)] text-xs text-[var(--ink-2)] mt-4">
                        <div className="flex items-center gap-1.5 font-semibold text-[var(--ink)] mb-1">
                            <ShieldCheck size={14} className="text-[var(--coral)]" />
                            <span>Demo Workspace</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-[var(--ink-2)]">
                            Settings are saved directly in your browser without altering live tenant database records.
                        </p>
                    </div>
                </div>

                {/* ACTIVE TAB CONTENT */}
                <div className="min-w-0 space-y-6">
                    <AnimatePresence mode="wait">
                        {/* TAB 1: PROFILE */}
                        {tab === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.15 }}
                                className="space-y-6"
                            >
                                <div className="card">
                                    <div className="card-head">
                                        <div>
                                            <h3 className="card-title">School Identity</h3>
                                            <p className="card-sub">Core identification details for transcripts and official paperwork</p>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormField
                                                label="Institution Legal Name"
                                                value={settings.profile.name}
                                                onChange={(v) => update('profile', 'name', v)}
                                                required
                                                placeholder="e.g. Olive English School"
                                                icon={School}
                                            />
                                            <FormField
                                                label="School / Branch Code"
                                                value={settings.profile.code}
                                                onChange={(v) => update('profile', 'code', v)}
                                                required
                                                placeholder="e.g. OLIVE-001"
                                                icon={Hash}
                                                helper="Used as reference prefix in student roll numbers"
                                            />
                                            <FormField
                                                label="Principal / Head of Institution"
                                                value={settings.profile.principal}
                                                onChange={(v) => update('profile', 'principal', v)}
                                                placeholder="e.g. Dr. Evelyn Vance"
                                                icon={UserCheck}
                                            />
                                            <FormField
                                                label="Established Year"
                                                value={settings.profile.established}
                                                onChange={(v) => update('profile', 'established', v)}
                                                placeholder="e.g. 2005"
                                                icon={Calendar}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-head">
                                        <div>
                                            <h3 className="card-title">Campus &amp; Contact Information</h3>
                                            <p className="card-sub">Official communication channels and campus dispatch address</p>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormField
                                                label="Official Contact Email"
                                                type="email"
                                                value={settings.profile.email}
                                                onChange={(v) => update('profile', 'email', v)}
                                                placeholder="office@oliveschool.edu"
                                                icon={Mail}
                                            />
                                            <FormField
                                                label="Primary Telephone"
                                                type="tel"
                                                value={settings.profile.phone}
                                                onChange={(v) => update('profile', 'phone', v)}
                                                placeholder="+91 90000 00000"
                                                icon={Phone}
                                            />
                                            <div className="sm:col-span-2">
                                                <FormField
                                                    label="Website URL"
                                                    type="url"
                                                    value={settings.profile.website}
                                                    onChange={(v) => update('profile', 'website', v)}
                                                    placeholder="https://oliveschool.edu"
                                                    icon={Globe}
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <FormField
                                                    label="Campus Street Address"
                                                    value={settings.profile.address}
                                                    onChange={(v) => update('profile', 'address', v)}
                                                    placeholder="Survey No. 42, Campus Green Avenue"
                                                    icon={MapPin}
                                                />
                                            </div>
                                            <FormField
                                                label="City / District"
                                                value={settings.profile.city}
                                                onChange={(v) => update('profile', 'city', v)}
                                                placeholder="Dhule"
                                            />
                                            <FormField
                                                label="State / Province"
                                                value={settings.profile.state}
                                                onChange={(v) => update('profile', 'state', v)}
                                                placeholder="Maharashtra"
                                            />
                                            <FormField
                                                label="Postal / PIN Code"
                                                value={settings.profile.pincode}
                                                onChange={(v) => update('profile', 'pincode', v)}
                                                placeholder="424001"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* TAB 2: BRANDING */}
                        {tab === 'branding' && (
                            <motion.div
                                key="branding"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.15 }}
                                className="space-y-6"
                            >
                                <div className="card">
                                    <div className="card-head">
                                        <div>
                                            <h3 className="card-title">Brand Identity</h3>
                                            <p className="card-sub">Customize the visual identity and theme accents across the portal</p>
                                        </div>
                                    </div>
                                    <div className="card-body space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormField
                                                label="Short Display Name / Abbreviation"
                                                value={settings.branding.shortName}
                                                onChange={(v) => update('branding', 'shortName', v)}
                                                placeholder="e.g. OES"
                                                helper="Used in compact navigation rail & badges"
                                            />
                                            <FormField
                                                label="School Motto / Tagline"
                                                value={settings.branding.tagline}
                                                onChange={(v) => update('branding', 'tagline', v)}
                                                placeholder="Inspiring minds. Shaping futures."
                                                helper="Appears on dashboard headers and welcome cards"
                                            />
                                        </div>

                                        <div className="pt-3 border-t border-[var(--line-2)]">
                                            <label className="text-[12px] font-semibold text-[var(--ink)] block mb-2">
                                                Primary Brand Color
                                            </label>

                                            <div className="flex flex-wrap gap-2.5 items-center">
                                                {schoolColorPresets.map((preset) => {
                                                    const isSelected = color.toLowerCase() === preset.value.toLowerCase();
                                                    return (
                                                        <button
                                                            key={preset.value}
                                                            type="button"
                                                            title={preset.name}
                                                            aria-label={preset.name}
                                                            onClick={() => update('branding', 'primaryColor', preset.value)}
                                                            className={`size-10 rounded-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 ${
                                                                isSelected ? 'ring-2 ring-offset-2 ring-[var(--ink)] shadow-sm' : ''
                                                            }`}
                                                            style={{ background: preset.value }}
                                                        >
                                                            {isSelected && <Check size={16} className="text-white" />}
                                                        </button>
                                                    );
                                                })}

                                                {/* Custom Hex Color Picker */}
                                                <label className="size-10 rounded-xl border border-[var(--line)] bg-white flex items-center justify-center cursor-pointer shadow-xs hover:bg-[var(--hover)] transition">
                                                    <input
                                                        type="color"
                                                        value={color}
                                                        onChange={(e) => update('branding', 'primaryColor', e.target.value)}
                                                        className="size-6 cursor-pointer border-0 bg-transparent p-0"
                                                        title="Custom color picker"
                                                    />
                                                </label>

                                                <span className="text-xs font-mono text-[var(--ink-2)] ml-2">
                                                    Selected: <strong>{color}</strong>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-head">
                                        <div>
                                            <h3 className="card-title">School Crest / Logo</h3>
                                            <p className="card-sub">Upload your institution emblem for reports, receipts, and portal header</p>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="flex flex-wrap items-center gap-5">
                                            <div className="size-20 rounded-xl border border-[var(--line)] bg-[var(--surface)] flex items-center justify-center overflow-hidden">
                                                {settings.branding.logo ? (
                                                    <img
                                                        src={settings.branding.logo}
                                                        alt="School logo"
                                                        className="size-full object-contain p-1"
                                                    />
                                                ) : (
                                                    <School size={28} className="text-[var(--ink-3)]" />
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-xs text-[var(--ink-2)]">
                                                    Recommended: PNG, JPG, or WebP. Maximum 300 KB.
                                                </p>

                                                <input
                                                    ref={logoInput}
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/webp"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        uploadLogo(e.target.files?.[0]);
                                                        e.target.value = '';
                                                    }}
                                                />

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => logoInput.current?.click()}
                                                        className="btn btn-secondary btn-sm"
                                                    >
                                                        <Upload size={13} />
                                                        <span>Upload Crest</span>
                                                    </button>

                                                    {settings.branding.logo && (
                                                        <button
                                                            type="button"
                                                            onClick={() => update('branding', 'logo', '')}
                                                            className="btn btn-ghost btn-sm text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 size={13} />
                                                            <span>Remove</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Live Workspace Simulator */}
                                <EduCoreLivePreview settings={settings} />
                            </motion.div>
                        )}

                        {/* TAB 3: ACADEMICS */}
                        {tab === 'academics' && (
                            <motion.div
                                key="academics"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.15 }}
                                className="space-y-6"
                            >
                                <div className="card">
                                    <div className="card-head">
                                        <div>
                                            <h3 className="card-title">Academic Session &amp; Schedule</h3>
                                            <p className="card-sub">Define the default academic cycle, session start, and attendance format</p>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormField
                                                label="Academic Year"
                                                value={settings.academics.academicYear}
                                                onChange={(v) => update('academics', 'academicYear', v)}
                                                placeholder="2026-2027"
                                                helper="Format: YYYY-YYYY"
                                            />
                                            <FormSelect
                                                label="Cycle Starts In"
                                                value={settings.academics.startMonth}
                                                onChange={(v) => update('academics', 'startMonth', v)}
                                                options={schoolMonths}
                                            />
                                            <FormSelect
                                                label="Week Starts On"
                                                value={settings.academics.weekStart}
                                                onChange={(v) => update('academics', 'weekStart', v)}
                                                options={['Monday', 'Sunday', 'Saturday']}
                                            />
                                            <FormSelect
                                                label="Attendance Mode"
                                                value={settings.academics.attendanceMode}
                                                onChange={(v) => update('academics', 'attendanceMode', v)}
                                                options={['Daily', 'Period Wise']}
                                            />
                                            <div className="sm:col-span-2">
                                                <FormField
                                                    label="Minimum Passing Percentage"
                                                    type="number"
                                                    value={settings.academics.passingPercentage}
                                                    onChange={(v) => update('academics', 'passingPercentage', Number(v))}
                                                    placeholder="35"
                                                    helper="Default threshold for examinations and report cards"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-head">
                                        <div>
                                            <h3 className="card-title">Daily Instructional Timings</h3>
                                            <p className="card-sub">Configure default assembly bell and dismissal timings</p>
                                        </div>
                                    </div>
                                    <div className="card-body space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormField
                                                label="School Start Time"
                                                type="time"
                                                value={settings.academics.schoolStart}
                                                onChange={(v) => update('academics', 'schoolStart', v)}
                                                icon={Clock3}
                                            />
                                            <FormField
                                                label="School End Time"
                                                type="time"
                                                value={settings.academics.schoolEnd}
                                                onChange={(v) => update('academics', 'schoolEnd', v)}
                                                icon={Clock3}
                                            />
                                        </div>

                                        <div className="p-3 rounded-xl bg-[var(--surface)] text-xs text-[var(--ink-2)]">
                                            Standard instructional duration: {settings.academics.schoolStart} to {settings.academics.schoolEnd}. Values are preferences for timetable scheduling.
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* TAB 4: PREFERENCES */}
                        {tab === 'preferences' && (
                            <motion.div
                                key="preferences"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.15 }}
                                className="space-y-6"
                            >
                                <div className="card">
                                    <div className="card-head">
                                        <div>
                                            <h3 className="card-title">Regional &amp; Localization</h3>
                                            <p className="card-sub">Timezone, currency and date formatting across accounting &amp; receipts</p>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormSelect
                                                label="System Timezone"
                                                value={settings.preferences.timezone}
                                                onChange={(v) => update('preferences', 'timezone', v)}
                                                options={['Asia/Kolkata', 'UTC', 'Asia/Dubai', 'Europe/London']}
                                            />
                                            <FormSelect
                                                label="Default Currency"
                                                value={settings.preferences.currency}
                                                onChange={(v) => update('preferences', 'currency', v)}
                                                options={['INR', 'USD', 'AED', 'EUR', 'GBP']}
                                            />
                                            <FormSelect
                                                label="Date Format"
                                                value={settings.preferences.dateFormat}
                                                onChange={(v) => update('preferences', 'dateFormat', v)}
                                                options={['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']}
                                            />
                                            <FormSelect
                                                label="Default Language"
                                                value={settings.preferences.language}
                                                onChange={(v) => update('preferences', 'language', v)}
                                                options={['English', 'Hindi', 'Marathi', 'Arabic']}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-head">
                                        <div>
                                            <h3 className="card-title">Display &amp; Interface Options</h3>
                                            <p className="card-sub">Control interactive animations and data table density</p>
                                        </div>
                                    </div>
                                    <div className="card-body divide-y divide-[var(--line-2)]">
                                        <FormToggle
                                            title="Interface Motion &amp; Transitions"
                                            description="Enable smooth micro-animations on route transitions and modal dialogs."
                                            checked={settings.preferences.enableAnimations}
                                            onChange={(v) => update('preferences', 'enableAnimations', v)}
                                            icon={Sparkles}
                                        />
                                        <FormToggle
                                            title="Compact Table Density"
                                            description="Display tighter row spacing in students and fees directories."
                                            checked={settings.preferences.compactTables}
                                            onChange={(v) => update('preferences', 'compactTables', v)}
                                            icon={Layers}
                                        />
                                        <FormToggle
                                            title="Show Academic Year in Header"
                                            description="Keep the current session indicator visible on the workspace top bar."
                                            checked={settings.preferences.showAcademicYear}
                                            onChange={(v) => update('preferences', 'showAcademicYear', v)}
                                            icon={GraduationCap}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* TAB 5: BACKUP & RESET */}
                        {tab === 'backup' && (
                            <motion.div
                                key="backup"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.15 }}
                                className="space-y-6"
                            >
                                <div className="card">
                                    <div className="card-head">
                                        <div>
                                            <h3 className="card-title">Export Settings</h3>
                                            <p className="card-sub">Generate a portable JSON backup file of current school configurations</p>
                                        </div>
                                    </div>
                                    <div className="card-body space-y-3">
                                        <p className="text-xs text-[var(--ink-2)]">
                                            Export school identity, colors, academic calendar, and regional preferences for archiving or importing into other browser sessions.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={exportSettings}
                                            className="btn btn-primary btn-sm"
                                        >
                                            <Download size={13} />
                                            <span>Export Settings JSON</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-head">
                                        <div>
                                            <h3 className="card-title">Import Configuration</h3>
                                            <p className="card-sub">Restore school parameters from an existing JSON configuration file</p>
                                        </div>
                                    </div>
                                    <div className="card-body space-y-3">
                                        <p className="text-xs text-[var(--ink-2)]">
                                            Importing applies settings to the form. Review the values and click Save Changes to persist.
                                        </p>
                                        <input
                                            ref={importInput}
                                            type="file"
                                            accept=".json,application/json"
                                            className="hidden"
                                            onChange={(e) => {
                                                importSettings(e.target.files?.[0]);
                                                e.target.value = '';
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => importInput.current?.click()}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            <Upload size={13} />
                                            <span>Upload JSON File</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-head">
                                        <div>
                                            <h3 className="card-title">Reset to Defaults</h3>
                                            <p className="card-sub">Restore original fictional demonstration settings</p>
                                        </div>
                                    </div>
                                    <div className="card-body space-y-3">
                                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
                                            This resets only the School Settings configuration. Student records, fee invoices, and attendance logs remain untouched.
                                        </div>

                                        {!resetConfirm ? (
                                            <button
                                                type="button"
                                                onClick={() => setResetConfirm(true)}
                                                className="btn btn-secondary btn-sm text-red-600 hover:text-red-700"
                                            >
                                                <RotateCcw size={13} />
                                                <span>Reset to Defaults</span>
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-2 pt-1">
                                                <button
                                                    type="button"
                                                    onClick={resetSettings}
                                                    className="btn btn-sm btn-danger"
                                                >
                                                    Yes, Confirm Reset
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setResetConfirm(false)}
                                                    className="btn btn-secondary btn-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* FLOATING SAVE BAR WITH ANIMATE-PRESENCE */}
            <AnimatePresence>
                {dirty && tab !== 'backup' && (
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 24 }}
                        transition={{ duration: 0.16 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-xl card p-3.5 shadow-lg flex items-center justify-between gap-4 backdrop-blur-md bg-white/95"
                    >
                        <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            <div>
                                <p className="text-xs font-bold text-[var(--ink)]">
                                    Unsaved Changes
                                </p>
                                <p className="text-[11px] text-[var(--ink-2)]">
                                    Press <kbd className="px-1 py-0.5 bg-[var(--surface)] border border-[var(--line)] rounded text-[9.5px]">⌘S</kbd> to save
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setSettings(JSON.parse(saved));
                                    setNotice({ type: 'ok', text: 'Unsaved modifications discarded.' });
                                }}
                                className="btn btn-ghost btn-sm"
                            >
                                Discard
                            </button>
                            <button
                                type="button"
                                onClick={saveSettings}
                                disabled={isSaving}
                                className="btn btn-primary btn-sm"
                            >
                                {isSaving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
