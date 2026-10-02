import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import QRCode from 'qrcode';
import EntryTab from './tabs/EntryTab';
import InventoryTab from './tabs/InventoryTab';
import PalletCardTab from './tabs/PalletCardTab';
import ContractEntryTab from './tabs/ContractEntryTab';
import ContractListTab from './tabs/ContractListTab';
import WaybillEntryTab from './tabs/WaybillEntryTab';
import WaybillListTab from './tabs/WaybillListTab';
import CoupDashboardTab from './tabs/CoupDashboardTab';
import CuttingEntryTab from './tabs/CuttingEntryTab';
import CuttingListTab from './tabs/CuttingListTab';
import StoneTypesTab from './tabs/StoneTypesTab';
import SettingsTab from './tabs/SettingsTab';
import { AppContext } from './app/AppContext';
import { todayJalaliString, isoToJalaliString, jalaliStringToIso, normalizeJalaliInput } from './shared/jalali';
import {
  DEFAULT_STONE_TYPES, COUP_FORMATS, coupFormatLabel, num, formatRial,
  normalizePalletInput, formatPallet, createEntryRow, rowIsEmpty, ROW_FIELDS, rowArea,
  normalizedRowDims, createSlabRow, slabRowIsEmpty, slabArea,
  normalizedSlabDims, storedSlabArea, flattenCoups, findCoupByNumber, WEIGHT_EPSILON,
} from './shared/domain';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const STORAGE_KEY = 'stone-inventory-data';

/* ================================================================== */
/* UI kit                                                              */
/* ================================================================== */

const Button = ({ children, variant = 'secondary', size = 'md', className = '', ...props }) => {
  const base = 'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors disabled:opacity-45 disabled:cursor-not-allowed whitespace-nowrap';
  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3.5 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  };
  const variants = {
    primary: 'text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)]',
    secondary: 'bg-white text-[var(--text)] border border-[var(--border-strong)] hover:bg-[var(--surface-sunken)]',
    ghost: 'text-[var(--text-muted)] hover:bg-[var(--surface-sunken)] hover:text-[var(--text)]',
    danger: 'text-[var(--danger)] bg-[var(--danger-soft)] border border-[#f0cfcc] hover:bg-[#f8dedc]',
    dangerSolid: 'text-white bg-[var(--danger)] hover:bg-[#8d1d16]',
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const fieldClass = 'w-full rounded-md border border-[var(--border-strong)] bg-white px-2.5 py-1.5 text-sm text-[var(--text)] placeholder:text-[var(--text-subtle)] transition-colors hover:border-[#adb5bd] focus:border-[var(--focus)]';

const Input = ({ className = '', numeric = false, ...props }) => (
  <input className={`${fieldClass} ${numeric ? 'num text-center' : ''} ${className}`} {...props} />
);

const Select = ({ className = '', children, ...props }) => (
  <select className={`${fieldClass} ${className}`} {...props}>{children}</select>
);

const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="mb-1 block text-xs font-medium text-[var(--text-muted)]">{label}</span>
    {children}
    {hint && <span className="mt-1 block text-[11px] text-[var(--text-subtle)]">{hint}</span>}
  </label>
);

const Card = ({ title, description, actions, children, className = '' }) => (
  <section className={`rounded-lg border border-[var(--border)] bg-[var(--surface)] ${className}`}>
    {(title || actions) && (
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border)] px-5 py-3.5">
        <div>
          {title && <h2 className="text-[15px] font-semibold text-[var(--text)]">{title}</h2>}
          {description && <p className="mt-0.5 max-w-2xl text-xs leading-relaxed text-[var(--text-muted)]">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </header>
    )}
    <div className="p-5">{children}</div>
  </section>
);

const Badge = ({ tone = 'neutral', children }) => {
  const tones = {
    neutral: 'bg-[var(--surface-sunken)] text-[var(--text-muted)] border-[var(--border)]',
    success: 'bg-[var(--success-soft)] text-[var(--success)] border-[#c5e2d2]',
    danger: 'bg-[var(--danger-soft)] text-[var(--danger)] border-[#f0cfcc]',
    accent: 'bg-[var(--accent-soft)] text-[var(--accent)] border-[#ecd9b4]',
  };
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}>{children}</span>;
};

const Stat = ({ label, value, unit, detail }) => (
  <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-sunken)] px-4 py-3">
    <div className="text-xs text-[var(--text-muted)]">{label}</div>
    <div className="num mt-0.5 text-xl font-semibold text-[var(--text)]">
      {value}
      {unit && <span className="mr-1 text-xs font-normal text-[var(--text-muted)]">{unit}</span>}
    </div>
    {detail && <div className="num mt-0.5 text-xs text-[var(--text-muted)]">{detail}</div>}
  </div>
);

const EmptyState = ({ title, description }) => (
  <div className="rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--surface-sunken)] px-6 py-10 text-center">
    <p className="text-sm font-medium text-[var(--text)]">{title}</p>
    {description && <p className="mt-1 text-xs text-[var(--text-muted)]">{description}</p>}
  </div>
);

const Toasts = ({ items, onDismiss }) => (
  <div className="pointer-events-none fixed bottom-5 left-5 z-50 flex w-80 flex-col gap-2">
    {items.map((toast) => {
      const tones = {
        success: 'border-[#c5e2d2] bg-[var(--success-soft)] text-[var(--success)]',
        error: 'border-[#f0cfcc] bg-[var(--danger-soft)] text-[var(--danger)]',
        info: 'border-[var(--border-strong)] bg-white text-[var(--text)]',
      };
      return (
        <div
          key={toast.id}
          role="status"
          className={`pointer-events-auto flex items-start justify-between gap-3 rounded-lg border px-4 py-2.5 text-sm shadow-sm ${tones[toast.tone]}`}
        >
          <span>{toast.message}</span>
          <button onClick={() => onDismiss(toast.id)} className="text-lg leading-none opacity-50 hover:opacity-100" aria-label="بستن">×</button>
        </div>
      );
    })}
  </div>
);

const ConfirmDialog = ({ request, onResolve }) => {
  if (!request) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-lg border border-[var(--border)] bg-white shadow-xl">
        <div className="px-5 py-4">
          <h3 className="text-[15px] font-semibold">{request.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">{request.body}</p>
        </div>
        <div className="flex justify-end gap-2 border-t border-[var(--border)] bg-[var(--surface-sunken)] px-5 py-3">
          <Button variant="secondary" onClick={() => onResolve(false)}>انصراف</Button>
          <Button variant={request.destructive ? 'dangerSolid' : 'primary'} onClick={() => onResolve(true)}>
            {request.confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

// A text field for a Jalali (Persian) date. The user types digits only; the
// separators appear as they type, and on blur the value is validated as a
// real calendar date. Nothing here ever stores or displays a Gregorian date.
const JalaliDateField = ({ label, value, onChange, hint }) => {
  const [invalid, setInvalid] = useState(false);
  const handleBlur = () => setInvalid(value.trim() !== '' && !jalaliStringToIso(value));
  return (
    <Field label={label} hint={invalid ? undefined : hint}>
      <Input
        value={value}
        onChange={(e) => { setInvalid(false); onChange(normalizeJalaliInput(e.target.value)); }}
        onBlur={handleBlur}
        placeholder="1403/07/25"
        className={`num text-center ${invalid ? 'border-[var(--danger)]' : ''}`}
      />
      {invalid && <span className="mt-1 block text-[11px] text-[var(--danger)]">تاریخ نامعتبر است.</span>}
    </Field>
  );
};

// Shows the address mobile devices on the same network use to reach the
// "ثبت پالت" / "ثبت برش" pages, plus a QR code so a phone can scan instead of
// typing an IP. The background service keeps running (and this address stays
// reachable) even after the desktop window is closed — only the tray's
// "خروج" fully stops it.
const MobileConnectionCard = () => {
  const [info, setInfo] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    if (!window.electronAPI?.getNetworkInfo) { setError('این نسخه از برنامه اطلاعات شبکه را پشتیبانی نمی‌کند.'); return undefined; }
    window.electronAPI.getNetworkInfo()
      .then((result) => {
        if (cancelled) return;
        if (!result?.url) { setError('آدرس شبکه در دسترس نیست. اتصال به شبکه محلی را بررسی کنید.'); return; }
        setInfo(result);
        return QRCode.toDataURL(result.url, { width: 176, margin: 1 });
      })
      .then((dataUrl) => { if (!cancelled && dataUrl) setQrDataUrl(dataUrl); })
      .catch(() => { if (!cancelled) setError('دریافت اطلاعات شبکه ناموفق بود.'); });
    return () => { cancelled = true; };
  }, []);

  return (
    <Card title="اتصال موبایل" description="با این آدرس، از هر مرورگر روی شبکه‌ی داخلی کارخانه می‌توان به فرم‌های «ثبت پالت» و «ثبت برش» وصل شد.">
      {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
      {info && (
        <div className="flex flex-wrap items-center gap-4">
          {qrDataUrl && <img src={qrDataUrl} alt="QR اتصال موبایل" className="h-32 w-32 rounded-lg border border-[var(--border)] bg-white p-2" />}
          <div>
            <p className="num text-lg font-semibold text-[var(--primary)]">{info.url}</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">این آدرس را در مرورگر موبایل باز کنید یا کد QR را اسکن کنید. هر دو دستگاه باید به یک شبکه‌ی Wi-Fi/LAN وصل باشند.</p>
            <p className="mt-2 text-xs text-[var(--text-subtle)]">سرویس در پس‌زمینه فعال می‌ماند؛ برای قطع کامل آن از آیکن برنامه در Tray گزینه‌ی «خروج» را بزنید.</p>
          </div>
        </div>
      )}
    </Card>
  );
};

/* ================================================================== */
/* Domain helpers (desktop-only; shared ones come from ./shared/domain) */
/* ================================================================== */

// Coup mark code stamped on the block: three letters, three digits (ABC-123).
const normalizeMarkCodeInput = (rawValue) => {
  const cleaned = String(rawValue || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const letters = (cleaned.match(/^[A-Z]{0,3}/) || [''])[0];
  const digits = cleaned.slice(letters.length).replace(/[^0-9]/g, '').slice(0, 3);
  return `${letters}${digits}`;
};

const formatMarkCode = (rawValue) => {
  const match = normalizeMarkCodeInput(rawValue).match(/^([A-Z]{3})(\d{3})$/);
  return match ? `${match[1]}-${match[2]}` : '';
};

const normalizePlateInput = (rawValue) => String(rawValue || '').replace(/[^0-9]/g, '').slice(0, 5);

// Generic Enter-to-next-field navigation, used by every new form below (the
// pallet-entry table has its own, older version of the same idea). A "flat"
// form is a single sequence of fields; a "grid" form is a repeating row like
// the coup or slab tables, where Enter on the last field starts a new row.
const focusByAttr = (attr, value) => document.querySelector(`[${attr}="${value}"] input, [${attr}="${value}"] select`)?.focus();

const handleFlatEnter = (event, attr, index, lastIndex, onOverflow) => {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  if (index >= lastIndex) { onOverflow?.(); return; }
  focusByAttr(attr, index + 1);
};

const handleGridEnter = (event, rowAttr, fieldAttr, rowIndex, fieldIndex, fieldCount, onNewRow) => {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  if (fieldIndex < fieldCount - 1) {
    document.querySelector(`[${rowAttr}="${rowIndex}"][${fieldAttr}="${fieldIndex + 1}"] input, [${rowAttr}="${rowIndex}"][${fieldAttr}="${fieldIndex + 1}"] select`)?.focus();
    return;
  }
  onNewRow(rowIndex);
};

const groupByPallet = (stones) => {
  const groups = new Map();
  stones.forEach((stone) => {
    if (!groups.has(stone.palletNumber)) {
      groups.set(stone.palletNumber, { palletNumber: stone.palletNumber, stones: [], totalArea: 0, totalCount: 0 });
    }
    const group = groups.get(stone.palletNumber);
    group.stones.push(stone);
    group.totalArea += Number(stone.area) || 0;
    group.totalCount += Number(stone.quantity) || 0;
  });
  return [...groups.values()];
};

/* -------- waybill coup rows (desktop-only: waybills aren't on mobile) -------- */

let coupRowCounter = 0;
const createCoupRow = (defaults = {}) => ({
  key: `coup-${Date.now()}-${(coupRowCounter += 1)}`,
  coupNumber: '',
  markCode: '',
  type: defaults.type || '',
  coupFormat: defaults.coupFormat || '',
  coupGrade: '',
  approxWeight: '',
});

const coupRowIsEmpty = (row) => !row.coupNumber.trim() && !row.markCode.trim() && !row.type && !String(row.approxWeight).trim();

/* ================================================================== */
/* App                                                                 */
/* ================================================================== */

export default function StoneInventoryApp() {
  const [activeTab, setActiveTab] = useState('entry');

  const [stones, setStones] = useState([]);
  const [stoneTypes, setStoneTypes] = useState(DEFAULT_STONE_TYPES);
  const [waybills, setWaybills] = useState([]);
  const [cuttingForms, setCuttingForms] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [machines, setMachines] = useState([]);
  const [blades, setBlades] = useState([]);
  const [operators, setOperators] = useState([]);
  const [settings, setSettings] = useState({
    showLogoInPdf: true,
    showQrInPdf: true,
    enableFormDefaults: true,
    printGradeInReport: true,
    pdfFontScale: 1.15,
    pdfHeaderText: '',
    customLogoDataUrl: '',
  });

  // 'loading' | 'ready' | 'blocked' — 'blocked' means the data file exists but
  // could not be read, so auto-saving would overwrite good records with nothing.
  const [dataState, setDataState] = useState('loading');
  const [saveState, setSaveState] = useState('idle');
  const [lastSavedAt, setLastSavedAt] = useState(null);

  const [toasts, setToasts] = useState([]);
  const [confirmRequest, setConfirmRequest] = useState(null);
  const confirmResolver = useRef(null);

  const notify = useCallback((message, tone = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4200);
  }, []);

  const dismissToast = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  const confirm = useCallback((request) => new Promise((resolve) => {
    confirmResolver.current = resolve;
    setConfirmRequest({ confirmLabel: 'تأیید', ...request });
  }), []);

  const resolveConfirm = (result) => {
    setConfirmRequest(null);
    confirmResolver.current?.(result);
    confirmResolver.current = null;
  };

  /* ---------------- persistence ---------------- */

  useEffect(() => {
    let cancelled = false;

    const applyLoaded = (data) => {
      if (cancelled) return;
      setStones(Array.isArray(data?.stones) ? data.stones : []);
      setStoneTypes(Array.isArray(data?.stoneTypes) && data.stoneTypes.length > 0 ? data.stoneTypes : DEFAULT_STONE_TYPES);
      setWaybills(Array.isArray(data?.waybills) ? data.waybills : []);
      setCuttingForms(Array.isArray(data?.cuttingForms) ? data.cuttingForms : []);
      setContracts(Array.isArray(data?.contracts) ? data.contracts : []);
      setMachines(Array.isArray(data?.machines) ? data.machines : []);
      setBlades(Array.isArray(data?.blades) ? data.blades : []);
      setOperators(Array.isArray(data?.operators) ? data.operators : []);
      if (data?.settings && typeof data.settings === 'object') {
        setSettings((prev) => ({ ...prev, ...data.settings }));
      }
    };

    const load = async () => {
      try {
        if (window.electronAPI) {
          const result = await window.electronAPI.loadData();
          applyLoaded(result?.data ?? result);
          if (cancelled) return;

          if (result?.status === 'error') {
            setDataState('blocked');
            notify('فایل اطلاعات خوانده نشد. برای جلوگیری از پاک شدن داده‌ها، ذخیره‌سازی خودکار متوقف شد.', 'error');
            return;
          }
          if (result?.status === 'recovered') {
            notify('فایل اصلی آسیب دیده بود و اطلاعات از نسخه پشتیبان بازیابی شد.', 'info');
          }
          setDataState('ready');
          return;
        }

        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) applyLoaded(JSON.parse(raw));
        if (!cancelled) setDataState('ready');
      } catch (error) {
        console.error('Load failed:', error);
        if (cancelled) return;
        setDataState('blocked');
        notify('خواندن اطلاعات ناموفق بود. ذخیره‌سازی خودکار متوقف شد.', 'error');
      }
    };

    load();
    return () => { cancelled = true; };
  }, [notify]);

  // stones/cuttingForms are never set locally any more (see savePallet,
  // deletePallet, saveCuttingForm, etc. below) — they only ever change in
  // response to this push, which fires for every mutation regardless of
  // whether it came from this window or a mobile browser on the network.
  useEffect(() => {
    if (!window.electronAPI?.onLiveUpdate) return undefined;
    return window.electronAPI.onLiveUpdate(({ stones: nextStones, cuttingForms: nextCuttingForms }) => {
      if (Array.isArray(nextStones)) setStones(nextStones);
      if (Array.isArray(nextCuttingForms)) setCuttingForms(nextCuttingForms);
    });
  }, []);

  useEffect(() => {
    if (dataState !== 'ready') return undefined;

    const payload = { stoneTypes, settings, waybills, contracts, machines, blades, operators };
    const timeout = setTimeout(async () => {
      setSaveState('saving');
      try {
        if (window.electronAPI) {
          const result = await window.electronAPI.saveData(payload);
          if (result?.success === false) throw new Error(result.message || 'save rejected');
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...payload, stones, cuttingForms }));
        }
        setLastSavedAt(new Date());
        setSaveState('saved');
      } catch (error) {
        console.error('Save failed:', error);
        setSaveState('failed');
        notify('ذخیره‌سازی ناموفق بود. تغییرات هنوز روی دیسک نوشته نشده‌اند.', 'error');
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [stones, stoneTypes, settings, waybills, cuttingForms, contracts, machines, blades, operators, dataState, notify]);

  useEffect(() => {
    if (dataState !== 'ready') return undefined;
    const flush = () => {
      const payload = { stoneTypes, settings, waybills, contracts, machines, blades, operators };
      if (window.electronAPI) window.electronAPI.saveData(payload);
      else localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...payload, stones, cuttingForms }));
    };
    window.addEventListener('beforeunload', flush);
    return () => window.removeEventListener('beforeunload', flush);
  }, [stones, stoneTypes, settings, waybills, cuttingForms, contracts, machines, blades, operators, dataState]);

  /* ---------------- derived data ---------------- */

  // One pass over the records instead of a scan per row: with a few thousand
  // stones the old per-stone lookup made filtering visibly sluggish.
  const invoiceByPallet = useMemo(() => {
    const map = new Map();
    stones.forEach((stone) => {
      const invoice = String(stone.invoiceNumber || '').trim();
      if (invoice && !map.has(stone.palletNumber)) map.set(stone.palletNumber, invoice);
    });
    return map;
  }, [stones]);

  const getInvoice = useCallback((palletNumber) => invoiceByPallet.get(palletNumber) || '', [invoiceByPallet]);

  // Every coup logged through a waybill, flattened for lookup. Selecting a
  // coup number elsewhere in the app (pallet entry, cutting form) auto-fills
  // its stone type from here — this is what makes "کد کوپ" a real link
  // instead of a free-text label.
  const allCoups = useMemo(() => flattenCoups(waybills), [waybills]);

  const findCoup = useCallback((coupNumber) => findCoupByNumber(allCoups, coupNumber), [allCoups]);

  const markCodeIndex = useMemo(() => {
    const map = new Map();
    allCoups.forEach((coup) => {
      const key = formatMarkCode(coup.markCode || '');
      if (key && !map.has(key)) map.set(key, coup);
    });
    return map;
  }, [allCoups]);
  const findMarkCode = useCallback((markCode) => markCodeIndex.get(formatMarkCode(markCode)) || null, [markCodeIndex]);

  // A coup is "consumed" once a cutting form references it — shown as a
  // status hint, never enforced, since a coup can legitimately be re-cut.
  const cutCoupNumbers = useMemo(() => new Set(cuttingForms.map((f) => f.coupNumber.trim().toUpperCase())), [cuttingForms]);

  /* ---------------- quick entry ---------------- */

  const [headerPallet, setHeaderPallet] = useState('');
  const [headerSpec, setHeaderSpec] = useState({ type: '', cutCode: '', grade: '' });
  const [entryRows, setEntryRows] = useState(() => [createEntryRow()]);
  const [editingPallet, setEditingPallet] = useState(null);
  const [lastSavedBatch, setLastSavedBatch] = useState(null);

  const specIsUsable = (spec) => Boolean(spec?.type) && String(spec?.cutCode ?? '').trim() !== '';

  // A row shows its own stamped spec once that spec is complete. Until then —
  // blank rows, and rows typed into before the header was filled — it tracks
  // the header live, so filling the header in afterwards still reaches them.
  const specOf = useCallback((row) => {
    const own = { type: row.type, cutCode: row.cutCode, grade: row.grade };
    return row.specLocked && specIsUsable(own) ? own : headerSpec;
  }, [headerSpec]);

  // Every edit to a row re-stamps it with the spec currently in the header, so a
  // row always carries the spec that was on screen while it was being filled.
  // Changing the header afterwards cannot reach back and alter it.
  const updateRow = (key, field, value) => {
    setEntryRows((rows) => rows.map((row) => {
      if (row.key !== key) return row;
      const next = { ...row, [field]: value, specLocked: true, ...headerSpec };
      if (field === 'length') next.lengthInMeters = false;
      if (field === 'width') next.widthInMeters = false;
      return next;
    }));
  };

  // Length and width are typed in centimetres and rewritten in metres as soon
  // as the field loses focus. The per-field flag makes the conversion
  // idempotent, so tabbing back through a row never divides by 100 twice.
  const convertOnBlur = (key, field) => {
    setEntryRows((rows) => rows.map((row) => {
      if (row.key !== key) return row;
      const flag = field === 'length' ? 'lengthInMeters' : 'widthInMeters';
      if (row[flag]) return row;
      const value = Number(row[field]);
      if (!Number.isFinite(value) || value <= 0) return row;
      return { ...row, [field]: (value / 100).toFixed(2), [flag]: true };
    }));
  };

  const addRow = () => setEntryRows((rows) => [...rows, createEntryRow()]);

  const removeRow = (key) => setEntryRows((rows) => (rows.length === 1 ? [createEntryRow()] : rows.filter((r) => r.key !== key)));

  // Escape hatch for "I changed the spec too late": the row is released back to
  // the header and tracks it live again.
  const relinkRowToHeader = (key) => setEntryRows((rows) => rows.map((row) => (
    row.key === key ? { ...row, specLocked: false, type: '', cutCode: '', grade: '' } : row
  )));

  const focusCell = (rowIndex, fieldIndex) => {
    document.querySelector(`[data-cell="${rowIndex}-${fieldIndex}"] input`)?.focus();
  };

  const handleRowKeyDown = (event, rowIndex, fieldIndex) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    if (fieldIndex < ROW_FIELDS.length - 1) {
      focusCell(rowIndex, fieldIndex + 1);
      return;
    }
    if (rowIndex === entryRows.length - 1) addRow();
    requestAnimationFrame(() => focusCell(rowIndex + 1, 0));
  };

  // Every pallet/cutting-form mutation goes through here rather than a local
  // setStones/setCuttingForms. When Electron's IPC is available, the main
  // process is authoritative — it resolves the operation against its own
  // canonical copy (safe under concurrent mobile writers) and pushes the
  // result back via onLiveUpdate, which is what actually updates this
  // component's state. Without electronAPI (e.g. `vite dev` in a plain
  // browser tab), there is no server to defer to, so we fall back to
  // mutating local state directly — single-user only, but keeps development
  // working without Electron running.
  const dataOps = {
    async savePallet(payload) {
      if (window.electronAPI?.savePallet) {
        const result = await window.electronAPI.savePallet(payload);
        if (result?.error) throw new Error(result.error);
        return;
      }
      setStones((current) => {
        const rest = payload.editingPalletNumber ? current.filter((s) => s.palletNumber !== payload.editingPalletNumber) : current;
        return [...payload.stones, ...rest];
      });
    },
    async setInvoice(payload) {
      if (window.electronAPI?.setPalletInvoice) {
        const result = await window.electronAPI.setPalletInvoice(payload);
        if (result?.error) throw new Error(result.error);
        return;
      }
      setStones((prev) => prev.map((s) => (payload.palletNumbers.includes(s.palletNumber) ? { ...s, invoiceNumber: payload.invoice } : s)));
    },
    async clearInvoice(payload) {
      if (window.electronAPI?.clearPalletInvoice) {
        const result = await window.electronAPI.clearPalletInvoice(payload);
        if (result?.error) throw new Error(result.error);
        return;
      }
      setStones((prev) => prev.map((s) => (payload.palletNumbers.includes(s.palletNumber) ? { ...s, invoiceNumber: '' } : s)));
    },
    async deletePallet(payload) {
      if (window.electronAPI?.deletePallet) {
        const result = await window.electronAPI.deletePallet(payload);
        if (result?.error) throw new Error(result.error);
        return;
      }
      setStones((prev) => prev.filter((s) => s.palletNumber !== payload.palletNumber));
    },
    async saveCuttingForm(record) {
      if (window.electronAPI?.saveCuttingForm) {
        const result = await window.electronAPI.saveCuttingForm(record);
        if (result?.error) throw new Error(result.error);
        return result.record;
      }
      const saved = { ...record, id: record.id || `cf-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` };
      setCuttingForms((prev) => (record.id && prev.some((f) => f.id === record.id) ? prev.map((f) => (f.id === record.id ? saved : f)) : [saved, ...prev]));
      return saved;
    },
    async deleteCuttingForm(payload) {
      if (window.electronAPI?.deleteCuttingForm) {
        const result = await window.electronAPI.deleteCuttingForm(payload);
        if (result?.error) throw new Error(result.error);
        return;
      }
      setCuttingForms((prev) => prev.filter((f) => f.id !== payload.id));
    },
  };

  const resetEntryForm = (keepSpec = true) => {
    setHeaderPallet('');
    setEntryRows([createEntryRow()]);
    setEditingPallet(null);
    if (!keepSpec || !settings.enableFormDefaults) setHeaderSpec({ type: '', cutCode: '', grade: '' });
  };

  const savePallet = async () => {
    const pallet = formatPallet(headerPallet);
    if (!pallet) {
      notify('شماره پالت را مانند A-123 وارد کنید.', 'error');
      return;
    }

    const filled = entryRows.filter((row) => !rowIsEmpty(row));
    if (filled.length === 0) {
      notify('حداقل یک ردیف را کامل کنید.', 'error');
      return;
    }

    const invalid = filled.filter((row) => {
      const spec = specOf(row);
      return !spec.type || String(spec.cutCode).trim() === ''
        || !(Number(row.length) > 0) || !(Number(row.width) > 0) || !(Number(row.quantity) > 0);
    });
    if (invalid.length > 0) {
      notify(`${invalid.length} ردیف کامل نیست. نوع سنگ، برش، طول، عرض و تعداد الزامی است.`, 'error');
      return;
    }

    if (!editingPallet && invoiceByPallet.has(pallet)) {
      notify(`پالت ${pallet} قبلاً فروخته شده است. ابتدا فاکتور آن را حذف کنید.`, 'error');
      return;
    }

    const stamp = new Date().toISOString();
    const invoice = getInvoice(pallet);

    const newStones = filled.map((row, index) => {
      const spec = specOf(row);
      const { length, width } = normalizedRowDims(row);
      const quantity = Number(row.quantity);
      return {
        id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
        palletNumber: pallet,
        type: spec.type,
        cutCode: spec.cutCode,
        grade: spec.grade,
        notes: row.notes,
        invoiceNumber: invoice,
        thickness: String(row.thickness).trim() === '' ? 0 : Number(row.thickness) / 100,
        length,
        width,
        quantity,
        area: Number((length * width * quantity).toFixed(2)),
        createdAt: stamp,
      };
    });

    try {
      // Editing replaces the pallet's records instead of appending a second copy.
      await dataOps.savePallet({ palletNumber: pallet, editingPalletNumber: editingPallet, stones: newStones });
    } catch (error) {
      notify(`ذخیره ناموفق بود: ${error.message}`, 'error');
      return;
    }

    setLastSavedBatch({
      palletNumber: pallet,
      stones: newStones,
      totalArea: newStones.reduce((sum, s) => sum + s.area, 0),
      totalCount: newStones.reduce((sum, s) => sum + s.quantity, 0),
      edited: Boolean(editingPallet),
    });

    notify(
      editingPallet ? `پالت ${pallet} با ${newStones.length} ردیف به‌روزرسانی شد.` : `پالت ${pallet} با ${newStones.length} ردیف ثبت شد.`,
      'success'
    );
    resetEntryForm(true);
    document.querySelector('[data-header-field="pallet"]')?.focus();
  };

  const entryTotals = useMemo(() => {
    const filled = entryRows.filter((row) => !rowIsEmpty(row));
    return {
      rows: filled.length,
      pieces: filled.reduce((sum, row) => sum + (Number(row.quantity) || 0), 0),
      area: filled.reduce((sum, row) => sum + rowArea(row), 0),
    };
  }, [entryRows]);

  /* ---------------- search ---------------- */

  const [filters, setFilters] = useState({
    showSold: false,
    type: '',
    palletNumber: '',
    grade: '',
    cutCode: '',
    invoiceNumber: '',
    minLength: '',
    maxLength: '',
    minWidth: '',
    maxWidth: '',
    minThickness: '',
    maxThickness: '',
  });
  const [selectedPallets, setSelectedPallets] = useState([]);
  const [bulkInvoice, setBulkInvoice] = useState('');

  const updateFilter = (name, value) => setFilters((prev) => ({ ...prev, [name]: value }));

  const resetFilters = () => setFilters({
    showSold: false, type: '', palletNumber: '', grade: '', cutCode: '', invoiceNumber: '',
    minLength: '', maxLength: '', minWidth: '', maxWidth: '', minThickness: '', maxThickness: '',
  });

  const activeFilterCount = useMemo(
    () => Object.entries(filters).filter(([key, value]) => key !== 'showSold' && String(value).trim() !== '').length,
    [filters]
  );

  const filteredStones = useMemo(() => {
    const between = (value, min, max) => {
      const v = parseFloat(value);
      if (min !== '' && !(v >= parseFloat(min))) return false;
      if (max !== '' && !(v <= parseFloat(max))) return false;
      return true;
    };
    // Pallet and grade are matched case-insensitively so "a12" finds "A-123".
    const palletQuery = filters.palletNumber.toUpperCase().replace(/[^A-Z0-9]/g, '');

    return stones
      .filter((stone) => {
        const invoice = getInvoice(stone.palletNumber);
        if (!filters.showSold && invoice) return false;
        if (filters.type && stone.type !== filters.type) return false;
        if (palletQuery && !String(stone.palletNumber).replace(/[^A-Z0-9]/g, '').includes(palletQuery)) return false;
        if (filters.grade && String(stone.grade || '').toUpperCase() !== filters.grade.toUpperCase()) return false;
        if (filters.cutCode && String(stone.cutCode) !== String(filters.cutCode)) return false;
        if (filters.invoiceNumber && !invoice.includes(filters.invoiceNumber)) return false;
        if (!between(stone.thickness, filters.minThickness, filters.maxThickness)) return false;
        if (!between(stone.length, filters.minLength, filters.maxLength)) return false;
        if (!between(stone.width, filters.minWidth, filters.maxWidth)) return false;
        return true;
      })
      .sort((a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0));
  }, [stones, filters, getInvoice]);

  // A filter identifies relevant rows, but the inventory view must show the
  // entire pallet around every match. This keeps the context of a matching slab
  // visible while `matchingStoneIds` lets the UI mark the exact matching rows.
  const matchingStoneIds = useMemo(() => new Set(filteredStones.map((stone) => stone.id)), [filteredStones]);
  const visiblePalletStones = useMemo(() => {
    if (activeFilterCount === 0) return filteredStones;

    const matchingPallets = new Set(filteredStones.map((stone) => stone.palletNumber));
    return stones.filter((stone) => {
      if (!matchingPallets.has(stone.palletNumber)) return false;
      return filters.showSold || !getInvoice(stone.palletNumber);
    });
  }, [activeFilterCount, filteredStones, stones, filters.showSold, getInvoice]);

  const palletGroups = useMemo(() => groupByPallet(visiblePalletStones), [visiblePalletStones]);

  const searchTotals = useMemo(() => ({
    area: filteredStones.reduce((sum, s) => sum + (Number(s.area) || 0), 0),
    pieces: filteredStones.reduce((sum, s) => sum + (Number(s.quantity) || 0), 0),
    pallets: palletGroups.length,
  }), [filteredStones, palletGroups]);

  const inventorySummary = useMemo(() => {
    const totals = new Map();
    stones.forEach((stone) => {
      const entry = totals.get(stone.type) || { total: 0, sold: 0 };
      entry.total += Number(stone.area) || 0;
      if (getInvoice(stone.palletNumber)) entry.sold += Number(stone.area) || 0;
      totals.set(stone.type, entry);
    });
    const labels = [...totals.keys()];
    return {
      labels,
      inStock: labels.map((l) => Number((totals.get(l).total - totals.get(l).sold).toFixed(2))),
      sold: labels.map((l) => Number(totals.get(l).sold.toFixed(2))),
    };
  }, [stones, getInvoice]);

  const togglePallet = (palletNumber, checked) => setSelectedPallets((prev) => (
    checked ? [...new Set([...prev, palletNumber])] : prev.filter((p) => p !== palletNumber)
  ));

  const allVisibleSelected = palletGroups.length > 0 && palletGroups.every((g) => selectedPallets.includes(g.palletNumber));

  const toggleAllVisible = () => setSelectedPallets(
    allVisibleSelected ? [] : [...new Set(palletGroups.map((g) => g.palletNumber))]
  );

  const markSold = async () => {
    const invoice = bulkInvoice.trim();
    if (!invoice) { notify('شماره فاکتور را وارد کنید.', 'error'); return; }
    if (selectedPallets.length === 0) { notify('حداقل یک پالت انتخاب کنید.', 'error'); return; }

    const ok = await confirm({
      title: 'ثبت فروش',
      body: `${selectedPallets.length} پالت با فاکتور ${invoice} به‌عنوان فروخته‌شده ثبت شود؟`,
      confirmLabel: 'ثبت فروش',
    });
    if (!ok) return;

    try {
      await dataOps.setInvoice({ palletNumbers: selectedPallets, invoice });
    } catch (error) {
      notify(`عملیات ناموفق بود: ${error.message}`, 'error');
      return;
    }
    notify(`${selectedPallets.length} پالت با فاکتور ${invoice} ثبت شد.`, 'success');
    setBulkInvoice('');
    setSelectedPallets([]);
  };

  const clearInvoice = async () => {
    if (selectedPallets.length === 0) { notify('حداقل یک پالت انتخاب کنید.', 'error'); return; }
    const ok = await confirm({
      title: 'برگشت از فروش',
      body: `فاکتور ${selectedPallets.length} پالت حذف شود و به موجودی برگردند؟`,
      confirmLabel: 'حذف فاکتور',
    });
    if (!ok) return;
    try {
      await dataOps.clearInvoice({ palletNumbers: selectedPallets });
    } catch (error) {
      notify(`عملیات ناموفق بود: ${error.message}`, 'error');
      return;
    }
    notify('فاکتور پالت‌های انتخاب‌شده حذف شد.', 'success');
    setSelectedPallets([]);
  };

  const editPallet = (palletNumber) => {
    const items = stones.filter((s) => s.palletNumber === palletNumber);
    if (items.length === 0) return;

    const first = items[0];
    setHeaderSpec({ type: first.type || '', cutCode: String(first.cutCode ?? ''), grade: first.grade || '' });
    setHeaderPallet(palletNumber);
    setEditingPallet(palletNumber);
    // Stored values are metres, so the rows are flagged as already converted
    // and the blur handler leaves them alone. Thickness stays in centimetres.
    setEntryRows(items.map((stone) => ({
      ...createEntryRow(),
      specLocked: true,
      type: stone.type || '',
      cutCode: String(stone.cutCode ?? ''),
      grade: stone.grade || '',
      thickness: stone.thickness ? String(Number((Number(stone.thickness) * 100).toFixed(2))) : '',
      length: num(stone.length),
      width: num(stone.width),
      quantity: String(stone.quantity ?? 1),
      notes: stone.notes || '',
      lengthInMeters: true,
      widthInMeters: true,
    })));
    setActiveTab('entry');
    notify(`پالت ${palletNumber} برای ویرایش باز شد.`, 'info');
  };

  const deletePallet = async (palletNumber) => {
    const count = stones.filter((s) => s.palletNumber === palletNumber).length;
    const ok = await confirm({
      title: `حذف پالت ${palletNumber}`,
      body: `${count} ردیف از این پالت برای همیشه حذف می‌شود. این کار قابل بازگشت نیست.`,
      confirmLabel: 'حذف پالت',
      destructive: true,
    });
    if (!ok) return;
    try {
      await dataOps.deletePallet({ palletNumber });
    } catch (error) {
      notify(`حذف ناموفق بود: ${error.message}`, 'error');
      return;
    }
    setSelectedPallets((prev) => prev.filter((p) => p !== palletNumber));
    if (editingPallet === palletNumber) resetEntryForm(true);
    notify(`پالت ${palletNumber} حذف شد.`, 'success');
  };

  /* ---------------- pallet card ---------------- */

  const [cardQuery, setCardQuery] = useState('');
  const [cardPallet, setCardPallet] = useState(null);

  const findPalletCard = () => {
    const pallet = formatPallet(cardQuery) || cardQuery.toUpperCase().trim();
    const items = stones.filter((s) => s.palletNumber === pallet);
    if (items.length === 0) {
      setCardPallet(null);
      notify(`پالتی با شماره ${pallet || cardQuery} پیدا نشد.`, 'error');
      return;
    }
    setCardPallet({
      palletNumber: pallet,
      stones: items,
      totalArea: items.reduce((sum, s) => sum + (Number(s.area) || 0), 0),
      totalCount: items.reduce((sum, s) => sum + (Number(s.quantity) || 0), 0),
    });
  };

  /* ---------------- printing ---------------- */

  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

  const loadLogoDataUrl = async () => {
    if (settings.customLogoDataUrl) return settings.customLogoDataUrl;
    for (const candidate of ['./logo.png', '/logo.png']) {
      try {
        const response = await fetch(candidate);
        if (!response.ok) continue;
        const blob = await response.blob();
        return await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : null);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(blob);
        });
      } catch {
        // try the next path
      }
    }
    return null;
  };

  const loadQrDataUrl = async () => {
    try {
      return await QRCode.toDataURL('https://agse.ir/', { width: 160, margin: 1 });
    } catch {
      return null;
    }
  };

  const buildPrintHtml = ({ title, subtitle, headers, rows, logoDataUrl, qrDataUrl, fontScale = 1, emphasis = false, headerText = '', logoScale = 1 }) => {
    const base = Math.round(12 * fontScale);
    const border = emphasis ? '#000' : '#9aa0a6';
    const headCell = `border:1px solid ${border};padding:${Math.max(3, Math.round(4 * fontScale))}px;background:${emphasis ? '#000' : '#eee'};color:${emphasis ? '#fff' : '#000'};font-weight:700;white-space:nowrap`;

    const headHtml = headers.map((h) => `<th style="${headCell}">${escapeHtml(h)}</th>`).join('');
    const bodyHtml = rows.map((row, index) => (
      `<tr style="background:${index % 2 ? '#f6f6f6' : '#fff'}">${row.map((cell) => {
        const text = escapeHtml(cell);
        const numeric = /^[-+]?\d+(?:[.,]\d+)?$/.test(String(text).trim());
        return `<td style="border:1px solid ${border};padding:${Math.max(3, Math.round(4 * fontScale))}px;font-weight:${numeric ? 700 : 500};font-size:${numeric ? Math.round(base * 1.15) : base}px">${text}</td>`;
      }).join('')}</tr>`
    )).join('');

    const logoSize = Math.round(70 * logoScale);
    const logoHtml = logoDataUrl ? `<img src="${logoDataUrl}" alt="" style="height:${logoSize}px;max-width:${Math.round(logoSize * 2.7)}px;object-fit:contain">` : '<span></span>';
    const qrHtml = qrDataUrl ? `<img src="${qrDataUrl}" alt="" style="height:${logoSize}px;width:${logoSize}px">` : '<span></span>';

    return `
      <div dir="ltr" style="font-family:'Vazirmatn',Tahoma,Arial,sans-serif;color:#111">
        <header style="display:flex;align-items:center;justify-content:space-between;gap:16px;border-bottom:2px solid #111;padding-bottom:10px">
          ${logoHtml}
          <div style="flex:1;text-align:center">
            <div style="font-size:${Math.round(20 * fontScale)}px;font-weight:800">${escapeHtml(title)}</div>
            ${headerText ? `<div style="font-size:${Math.round(13 * fontScale)}px;margin-top:2px">${escapeHtml(headerText)}</div>` : ''}
          </div>
          ${qrHtml}
        </header>
        <p style="text-align:center;font-size:${Math.round(14 * fontScale)}px;font-weight:600;margin:10px 0 14px">${escapeHtml(subtitle)}</p>
        <table style="width:100%;border-collapse:collapse;text-align:center;font-size:${base}px">
          <thead><tr>${headHtml}</tr></thead>
          <tbody>${bodyHtml}</tbody>
        </table>
        <footer style="margin-top:14px;font-size:10px;color:#666;display:flex;justify-content:space-between">
          <span>${escapeHtml(new Date().toLocaleString('en-GB'))}</span>
          <span>${rows.length} rows</span>
        </footer>
      </div>
    `;
  };

  // The document is rendered in a detached iframe and handed to the system
  // print dialog. The browser paginates it and repeats the table header on
  // every page, and the user can still pick "Save as PDF" from that dialog.
  const printDocument = (html, documentTitle) => {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.cssText = 'position:fixed;width:0;height:0;border:0;visibility:hidden';
    document.body.appendChild(iframe);

    const remove = () => { if (iframe.parentNode) iframe.parentNode.removeChild(iframe); };

    iframe.onload = () => {
      try {
        const frameWindow = iframe.contentWindow;
        frameWindow.focus();
        frameWindow.onafterprint = remove;
        frameWindow.print();
        setTimeout(remove, 60000);
      } catch (error) {
        console.error('Print failed:', error);
        notify('باز کردن پنجره چاپ ناموفق بود.', 'error');
        remove();
      }
    };

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(documentTitle)}</title><style>
      @page { size: A4; margin: 12mm; }
      body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      table { page-break-inside: auto; }
      tr { page-break-inside: avoid; }
      thead { display: table-header-group; }
    </style></head><body>${html}</body></html>`);
    doc.close();
  };

  const printPalletCard = async (palletNumber, items, totalArea) => {
    if (!items || items.length === 0) { notify('این پالت ردیفی برای چاپ ندارد.', 'error'); return; }
    const html = buildPrintHtml({
      title: `Pallet ${palletNumber}`,
      subtitle: `Total area ${num(totalArea)} m² — ${items.reduce((s, i) => s + (Number(i.quantity) || 0), 0)} pcs`,
      headers: ['#', 'Type', 'Thk (m)', 'Len (m)', 'Wid (m)', 'Qty', 'Area (m²)'],
      rows: items.map((stone, index) => [
        index + 1, stone.type,
        num(stone.thickness), num(stone.length), num(stone.width), stone.quantity, num(stone.area),
      ]),
      logoDataUrl: settings.showLogoInPdf ? await loadLogoDataUrl() : null,
      qrDataUrl: settings.showQrInPdf ? await loadQrDataUrl() : null,
      fontScale: settings.pdfFontScale,
      logoScale: 2,
      emphasis: true,
      headerText: settings.pdfHeaderText,
    });
    printDocument(html, `Pallet ${palletNumber}`);
  };

  // Each pallet renders as its own bordered box with "avoid break inside", so
  // a pallet's rows are never split across two printed pages. Long reports
  // simply flow more boxes onto the next page; only a single pallet with more
  // rows than fit on one page would still have to break (a hard physical
  // limit, not something a page-break rule can prevent).
  const printSearchReport = async () => {
    if (filteredStones.length === 0) { notify('نتیجه‌ای برای چاپ وجود ندارد.', 'error'); return; }

    const fontScale = settings.pdfFontScale;
    const base = Math.round(11 * fontScale);
    const groups = groupByPallet(filteredStones);

    const columns = ['Type', 'Coup No.', ...(settings.printGradeInReport ? ['Grade'] : []), 'Thk (m)', 'Len (m)', 'Wid (m)', 'Qty', 'Area (m²)', 'Notes'];
    const headCell = `border:1px solid #000;padding:3px 5px;background:#000;color:#fff;font-weight:700;font-size:${base}px;white-space:nowrap`;
    const bodyCell = `border:1px solid #999;padding:3px 5px;font-size:${base}px`;

    const boxesHtml = groups.map((group) => {
      const invoice = getInvoice(group.palletNumber);
      const rowsHtml = group.stones.map((stone) => `
        <tr>
          <td style="${bodyCell}">${escapeHtml(stone.type)}</td>
          <td style="${bodyCell};text-align:center;font-weight:700">${escapeHtml(stone.cutCode)}</td>
          ${settings.printGradeInReport ? `<td style="${bodyCell};text-align:center">${escapeHtml(stone.grade || '-')}</td>` : ''}
          <td style="${bodyCell};text-align:center;font-weight:700">${num(stone.thickness)}</td>
          <td style="${bodyCell};text-align:center;font-weight:700">${num(stone.length)}</td>
          <td style="${bodyCell};text-align:center;font-weight:700">${num(stone.width)}</td>
          <td style="${bodyCell};text-align:center;font-weight:700">${stone.quantity}</td>
          <td style="${bodyCell};text-align:center;font-weight:700">${num(stone.area)}</td>
          <td style="${bodyCell};font-size:${Math.round(base * 0.9)}px">${escapeHtml(stone.notes || '-')}</td>
        </tr>`).join('');

      return `
        <div style="border:2px solid #000;border-radius:4px;padding:8px;margin-bottom:10px;page-break-inside:avoid;break-inside:avoid">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #000;padding-bottom:5px;margin-bottom:6px">
            <span style="font-weight:800;font-size:${Math.round(base * 1.3)}px">Pallet ${escapeHtml(group.palletNumber)}</span>
            <span style="font-size:${base}px;font-weight:700">${invoice ? `Sold — ${escapeHtml(invoice)}` : 'In stock'}</span>
            <span style="font-size:${base}px">${group.stones.length} rows · ${group.totalCount} pcs · ${num(group.totalArea)} m²</span>
          </div>
          <table style="width:100%;border-collapse:collapse;text-align:center">
            <thead><tr>${columns.map((c) => `<th style="${headCell}">${escapeHtml(c)}</th>`).join('')}</tr></thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>`;
    }).join('');

    const logoDataUrl = settings.showLogoInPdf ? await loadLogoDataUrl() : null;
    const qrDataUrl = settings.showQrInPdf ? await loadQrDataUrl() : null;
    const logoHtml = logoDataUrl ? `<img src="${logoDataUrl}" alt="" style="height:60px;max-width:170px;object-fit:contain">` : '<span></span>';
    const qrHtml = qrDataUrl ? `<img src="${qrDataUrl}" alt="" style="height:60px;width:60px">` : '<span></span>';

    const html = `
      <div dir="ltr" style="font-family:'Vazirmatn',Tahoma,Arial,sans-serif;color:#111">
        <header style="display:flex;align-items:center;justify-content:space-between;gap:16px;border-bottom:2px solid #111;padding-bottom:10px;margin-bottom:12px">
          ${logoHtml}
          <div style="flex:1;text-align:center">
            <div style="font-size:${Math.round(19 * fontScale)}px;font-weight:800">Inventory Report</div>
            ${settings.pdfHeaderText ? `<div style="font-size:${Math.round(12 * fontScale)}px;margin-top:2px">${escapeHtml(settings.pdfHeaderText)}</div>` : ''}
            <div style="font-size:${Math.round(12 * fontScale)}px;margin-top:2px">${groups.length} pallets — ${filteredStones.length} rows — ${searchTotals.pieces} pcs — ${num(searchTotals.area)} m²</div>
          </div>
          ${qrHtml}
        </header>
        ${boxesHtml}
      </div>
    `;
    printDocument(html, `Inventory_${new Date().toISOString().slice(0, 10)}`);
  };

  const metaGridHtml = (pairs, fontScale = 1) => `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:12px">
      ${pairs.map(([label, value]) => `
        <div style="border:1px solid #999;border-radius:3px;padding:5px 8px">
          <div style="font-size:${Math.round(10 * fontScale)}px;color:#555">${escapeHtml(label)}</div>
          <div style="font-weight:700;font-size:${Math.round(12 * fontScale)}px">${value ? escapeHtml(value) : '&nbsp;'}</div>
        </div>`).join('')}
    </div>
  `;

  const printDocumentHeader = (title, subtitle, logoDataUrl, qrDataUrl, fontScale = 1) => {
    const logoHtml = logoDataUrl ? `<img src="${logoDataUrl}" alt="" style="height:60px;max-width:170px;object-fit:contain">` : '<span></span>';
    const qrHtml = qrDataUrl ? `<img src="${qrDataUrl}" alt="" style="height:60px;width:60px">` : '<span></span>';
    return `
      <header style="display:flex;align-items:center;justify-content:space-between;gap:16px;border-bottom:2px solid #111;padding-bottom:10px;margin-bottom:14px">
        ${logoHtml}
        <div style="flex:1;text-align:center">
          <div style="font-size:${Math.round(19 * fontScale)}px;font-weight:800">${escapeHtml(title)}</div>
          ${settings.pdfHeaderText ? `<div style="font-size:${Math.round(11 * fontScale)}px;margin-top:2px">${escapeHtml(settings.pdfHeaderText)}</div>` : ''}
          ${subtitle ? `<div style="font-size:${Math.round(12 * fontScale)}px;margin-top:2px">${escapeHtml(subtitle)}</div>` : ''}
        </div>
        ${qrHtml}
      </header>
    `;
  };

  const printWaybill = async (waybill) => {
    const fontScale = settings.pdfFontScale;
    const base = Math.round(12 * fontScale);
    const headCell = `border:1px solid #000;padding:4px 6px;background:#000;color:#fff;font-weight:700;font-size:${base}px`;
    const bodyCell = `border:1px solid #999;padding:4px 6px;font-size:${base}px;text-align:center`;
    const rowsHtml = waybill.coups.map((coup, index) => `
      <tr>
        <td style="${bodyCell}">${index + 1}</td>
        <td style="${bodyCell};font-weight:700">${escapeHtml(coup.coupNumber)}</td>
        <td style="${bodyCell}">${escapeHtml(coup.type)}</td>
        <td style="${bodyCell};font-weight:700">${num(coup.approxWeight)}</td>
      </tr>`).join('');

    const html = `
      <div dir="ltr" style="font-family:'Vazirmatn',Tahoma,Arial,sans-serif;color:#111">
        ${printDocumentHeader(`Waybill ${waybill.waybillNumber}`, `Date: ${isoToJalaliString(waybill.date)}`, settings.showLogoInPdf ? await loadLogoDataUrl() : null, settings.showQrInPdf ? await loadQrDataUrl() : null, fontScale)}
        ${metaGridHtml([
          ['Waybill No.', waybill.waybillNumber],
          ['Date', isoToJalaliString(waybill.date)],
          ['Driver', waybill.driverName],
          ['Plate No.', waybill.plateNumber],
          ['Mine', waybill.mineName],
          ['Contract No.', waybill.contractNumber],
          ['Total Weight (ton)', num(waybill.totalWeight)],
        ], fontScale)}
        <table style="width:100%;border-collapse:collapse">
          <thead><tr>
            <th style="${headCell}">#</th><th style="${headCell}">Coup No.</th><th style="${headCell}">Type</th><th style="${headCell}">Approx. Weight (ton)</th>
          </tr></thead>
          <tbody>${rowsHtml}</tbody>
          <tfoot><tr>
            <td colspan="3" style="${bodyCell};font-weight:800;background:#eee">Total</td>
            <td style="${bodyCell};font-weight:800;background:#eee">${num(waybill.coups.reduce((s, c) => s + Number(c.approxWeight || 0), 0))}</td>
          </tr></tfoot>
        </table>
      </div>
    `;
    printDocument(html, `Waybill_${waybill.waybillNumber}`);
  };

  const printWaybillReport = async () => {
    if (filteredWaybills.length === 0) { notify('حواله‌ای برای چاپ وجود ندارد.', 'error'); return; }
    const rows = filteredWaybills.map((waybill) => [
      waybill.waybillNumber, isoToJalaliString(waybill.date), waybill.contractNumber || '—',
      num(waybill.totalWeight), formatRial(waybill.freightPerTon || 0), formatRial(waybill.freightAmount || 0),
    ]);
    const totalWeight = filteredWaybills.reduce((sum, waybill) => sum + Number(waybill.totalWeight || 0), 0);
    const totalFreight = filteredWaybills.reduce((sum, waybill) => sum + Number(waybill.freightAmount || 0), 0);
    const html = buildPrintHtml({
      title: 'Waybill Report',
      subtitle: `${filteredWaybills.length} waybills — ${num(totalWeight)} ton — freight ${formatRial(totalFreight)} Rial`,
      headers: ['Waybill', 'Date', 'Contract', 'Weight (ton)', 'Freight / ton', 'Total Freight'],
      rows,
      logoDataUrl: settings.showLogoInPdf ? await loadLogoDataUrl() : null,
      qrDataUrl: settings.showQrInPdf ? await loadQrDataUrl() : null,
      fontScale: settings.pdfFontScale,
      headerText: settings.pdfHeaderText,
    });
    printDocument(html, `Waybill_Report_${new Date().toISOString().slice(0, 10)}`);
  };

  const timingBoxHtml = (label, entry, fontScale = 1) => `
    <div style="flex:1;border:1px solid #000;border-radius:4px;padding:8px">
      <div style="font-weight:800;font-size:${Math.round(12 * fontScale)}px;border-bottom:1px solid #000;padding-bottom:4px;margin-bottom:8px">${escapeHtml(label)}</div>
      <div style="font-size:${Math.round(11 * fontScale)}px;margin-bottom:10px">تاریخ: ${entry?.date ? escapeHtml(isoToJalaliString(entry.date)) : '<span style="display:inline-block;width:110px;border-bottom:1px solid #000">&nbsp;</span>'}</div>
      <div style="font-size:${Math.round(11 * fontScale)}px">ساعت: ${entry?.time ? escapeHtml(entry.time) : '<span style="display:inline-block;width:110px;border-bottom:1px solid #000">&nbsp;</span>'}</div>
    </div>
  `;

  // Printable before the slab table is filled in: the office prints the sheet
  // with header/coup/machine info, an operator fills the table and the timing
  // boxes by hand at the machine, and the data is typed back in afterwards.
  // Unlike the other (English) print documents, this one is Persian/RTL since
  // it is read and filled by floor operators.
  const printCuttingForm = async (form) => {
    const fontScale = settings.pdfFontScale;
    const base = Math.round(12 * fontScale);
    const headCell = `border:1px solid #000;padding:4px 6px;background:#000;color:#fff;font-weight:700;font-size:${base}px`;
    const bodyCell = `border:1px solid #999;padding:6px;font-size:${base}px;text-align:center;height:22px`;

    const filledRows = form.slabs.map((slab) => `
      <tr>
        <td style="${bodyCell};font-weight:700">${num(slab.length)}</td>
        <td style="${bodyCell};font-weight:700">${num(slab.width)}</td>
        <td style="${bodyCell};font-weight:700">${num(slab.thickness)}</td>
        <td style="${bodyCell};font-weight:700">${slab.quantity}</td>
        <td style="${bodyCell};font-weight:700">${num(storedSlabArea(slab))}</td>
      </tr>`).join('');
    const blankRowsNeeded = Math.max(0, 8 - form.slabs.length);
    const blankRows = Array.from({ length: blankRowsNeeded }, () => `
      <tr>${'<td style="' + bodyCell + '">&nbsp;</td>'.repeat(5)}</tr>`).join('');

    const html = `
      <div dir="rtl" style="font-family:'Vazirmatn',Tahoma,Arial,sans-serif;color:#111">
        ${printDocumentHeader(`فرم برش — ردیف #${form.rowNumber}`, `تاریخ: ${isoToJalaliString(form.date)}`, settings.showLogoInPdf ? await loadLogoDataUrl() : null, settings.showQrInPdf ? await loadQrDataUrl() : null, fontScale)}
        ${metaGridHtml([
          ['شماره ردیف', form.rowNumber],
          ['تاریخ', isoToJalaliString(form.date)],
          ['شماره کوپ', form.coupNumber],
          ['شماره حواله', form.waybillNumber],
          ['نوع سنگ', form.type],
          ['فرمت کوپ', coupFormatLabel(form.coupFormat)],
          ['وزن تقریبی (تن)', form.approxWeight ? num(form.approxWeight) : ''],
          ['دستگاه برش', form.cuttingMachine],
          ['تیغه', form.bladeName || '—'],
        ], fontScale)}
        <table style="width:100%;border-collapse:collapse;margin-bottom:14px">
          <thead><tr>
            <th style="${headCell}">طول (متر)</th><th style="${headCell}">عرض (متر)</th><th style="${headCell}">ضخامت (متر)</th><th style="${headCell}">تعداد</th><th style="${headCell}">مساحت (متر مربع)</th>
          </tr></thead>
          <tbody>${filledRows}${blankRows}</tbody>
          <tfoot><tr>
            <td colspan="4" style="${bodyCell};font-weight:800;background:#eee">جمع مساحت</td>
            <td style="${bodyCell};font-weight:800;background:#eee">${num(form.totalArea)}</td>
          </tr></tfoot>
        </table>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          ${timingBoxHtml('شروع برش', form.startCut, fontScale)}
          ${timingBoxHtml('پایان برش', form.endCut, fontScale)}
          ${timingBoxHtml('ورود به خط فراوری', form.entryProcessing, fontScale)}
          ${timingBoxHtml('خروج از خط فراوری', form.exitProcessing, fontScale)}
        </div>
        <div style="margin-top:14px;border:1px solid #000;border-radius:4px;padding:8px">
          <div style="font-weight:800;font-size:${Math.round(12 * fontScale)}px;border-bottom:1px solid #000;padding-bottom:4px;margin-bottom:10px">ملاحظات</div>
          ${Array.from({ length: 3 }, () => '<div style="border-bottom:1px solid #999;height:22px"></div>').join('')}
        </div>
      </div>
    `;
    printDocument(html, `CuttingForm_${form.rowNumber}`);
  };



  const [newStoneType, setNewStoneType] = useState('');

  const addStoneType = () => {
    const value = newStoneType.trim();
    if (!value) return;
    if (stoneTypes.some((t) => t.toLowerCase() === value.toLowerCase())) {
      notify('این نوع سنگ از قبل وجود دارد.', 'error');
      return;
    }
    setStoneTypes((prev) => [...prev, value]);
    setNewStoneType('');
    notify(`«${value}» اضافه شد.`, 'success');
  };

  const removeStoneType = async (type) => {
    const used = stones.filter((s) => s.type === type).length;
    if (used > 0) {
      notify(`حذف ممکن نیست: ${used} ردیف از این نوع سنگ استفاده می‌کنند.`, 'error');
      return;
    }
    const ok = await confirm({ title: 'حذف نوع سنگ', body: `«${type}» از فهرست حذف شود؟`, confirmLabel: 'حذف', destructive: true });
    if (!ok) return;
    setStoneTypes((prev) => prev.filter((t) => t !== type));
  };

  const updateSetting = (name, value) => {
    setSettings((prev) => ({ ...prev, [name]: value }));
    if (name === 'enableFormDefaults' && !value) setHeaderSpec({ type: '', cutCode: '', grade: '' });
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      notify('حجم تصویر باید کمتر از ۱.۵ مگابایت باشد.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        updateSetting('customLogoDataUrl', reader.result);
        notify('لوگوی سفارشی ذخیره شد.', 'success');
      }
    };
    reader.onerror = () => notify('خواندن فایل تصویر ناموفق بود.', 'error');
    reader.readAsDataURL(file);
  };

  /* ---------------- contracts (قرارداد) ---------------- */

  const activeContracts = useMemo(() => contracts.filter((c) => c.status === 'active'), [contracts]);
  const contractByNumber = useMemo(() => new Map(contracts.map((c) => [c.contractNumber, c])), [contracts]);

  const [ctNumber, setCtNumber] = useState('');
  const [ctTonnage, setCtTonnage] = useState('');
  const [ctMine, setCtMine] = useState('');
  const [ctStoneType, setCtStoneType] = useState('');
  const [ctFormat, setCtFormat] = useState('');
  const [ctPrice, setCtPrice] = useState('');
  const [ctFreightPerTon, setCtFreightPerTon] = useState('');
  const [ctCoupCount, setCtCoupCount] = useState('');
  const [editingContractId, setEditingContractId] = useState(null);
  const [contractQuery, setContractQuery] = useState('');
  const [expandedContractId, setExpandedContractId] = useState(null);

  const resetContractForm = () => {
    setCtNumber(''); setCtTonnage(''); setCtMine(''); setCtStoneType('');
    setCtFormat(''); setCtPrice(''); setCtFreightPerTon(''); setCtCoupCount(''); setEditingContractId(null);
  };

  const saveContract = () => {
    const number = ctNumber.trim();
    if (!number) { notify('شماره قرارداد را وارد کنید.', 'error'); return; }
    if (contracts.some((c) => c.contractNumber === number && c.id !== editingContractId)) {
      notify('قراردادی با این شماره از قبل ثبت شده است.', 'error'); return;
    }
    if (!(Number(ctTonnage) > 0)) { notify('تناژ کل قرارداد را وارد کنید.', 'error'); return; }
    if (!ctMine.trim()) { notify('نام معدن را وارد کنید.', 'error'); return; }
    if (!ctStoneType) { notify('نوع سنگ را انتخاب کنید.', 'error'); return; }
    if (!ctFormat) { notify('فرمت کوپ قرارداد را انتخاب کنید.', 'error'); return; }
    if (!(Number(ctPrice) >= 0)) { notify('قیمت فی هر تن را وارد کنید.', 'error'); return; }
    if (ctFreightPerTon === '' || !(Number(ctFreightPerTon) >= 0)) { notify('فی کرایه هر تن را وارد کنید.', 'error'); return; }
    if (!(Number(ctCoupCount) > 0)) { notify('تعداد کوپ قرارداد را وارد کنید.', 'error'); return; }

    const record = {
      id: editingContractId || `ct-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      contractNumber: number,
      status: editingContractId ? contracts.find((c) => c.id === editingContractId)?.status || 'active' : 'active',
      totalTonnage: Number(ctTonnage),
      mineName: ctMine.trim(),
      stoneType: ctStoneType,
      coupFormat: ctFormat,
      pricePerTon: Number(ctPrice),
      freightPerTon: Number(ctFreightPerTon),
      coupCount: Number(ctCoupCount),
      createdAt: editingContractId ? contracts.find((c) => c.id === editingContractId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
    };

    setContracts((prev) => (editingContractId ? prev.map((c) => (c.id === editingContractId ? record : c)) : [record, ...prev]));
    notify(editingContractId ? `قرارداد ${number} به‌روزرسانی شد.` : `قرارداد ${number} ثبت شد.`, 'success');
    resetContractForm();
  };

  const editContract = (contract) => {
    setCtNumber(contract.contractNumber);
    setCtTonnage(String(contract.totalTonnage));
    setCtMine(contract.mineName);
    setCtStoneType(contract.stoneType);
    setCtFormat(contract.coupFormat);
    setCtPrice(String(contract.pricePerTon));
    setCtFreightPerTon(String(contract.freightPerTon ?? 0));
    setCtCoupCount(String(contract.coupCount));
    setEditingContractId(contract.id);
    setActiveTab('contractEntry');
  };

  const toggleContractStatus = (contract) => {
    const next = contract.status === 'active' ? 'inactive' : 'active';
    setContracts((prev) => prev.map((c) => (c.id === contract.id ? { ...c, status: next } : c)));
    notify(next === 'active' ? `قرارداد ${contract.contractNumber} فعال شد.` : `قرارداد ${contract.contractNumber} غیرفعال شد. ثبت حواله‌ی جدید با این قرارداد امکان‌پذیر نیست.`, 'info');
  };

  const deleteContract = async (contract) => {
    const usedBy = waybills.filter((w) => w.contractNumber === contract.contractNumber).length;
    if (usedBy > 0) { notify(`حذف ممکن نیست: ${usedBy} حواله به این قرارداد وصل است.`, 'error'); return; }
    const ok = await confirm({ title: `حذف قرارداد ${contract.contractNumber}`, body: 'این قرارداد برای همیشه حذف می‌شود.', confirmLabel: 'حذف قرارداد', destructive: true });
    if (!ok) return;
    setContracts((prev) => prev.filter((c) => c.id !== contract.id));
    notify(`قرارداد ${contract.contractNumber} حذف شد.`, 'success');
  };

  const contractStats = useMemo(() => {
    const map = new Map();
    contracts.forEach((c) => {
      const relatedWaybills = waybills.filter((w) => w.contractNumber === c.contractNumber);
      const tonnageUsed = relatedWaybills.reduce((sum, w) => sum + Number(w.totalWeight || 0), 0);
      const coupsArrived = relatedWaybills.reduce((sum, w) => sum + w.coups.length, 0);
      const tonnage = Number(c.totalTonnage || 0);
      const coupCount = Number(c.coupCount || 0);
      map.set(c.id, {
        relatedWaybills,
        tonnageUsed,
        tonnageRemaining: tonnage - tonnageUsed,
        coupsArrived,
        coupsRemaining: coupCount - coupsArrived,
        tonnagePct: tonnage > 0 ? Math.min(100, (tonnageUsed / tonnage) * 100) : 0,
        coupPct: coupCount > 0 ? Math.min(100, (coupsArrived / coupCount) * 100) : 0,
      });
    });
    return map;
  }, [contracts, waybills]);

  const filteredContracts = useMemo(() => {
    const query = contractQuery.trim().toLowerCase();
    if (!query) return contracts;
    return contracts.filter((c) => [c.contractNumber, c.mineName, c.stoneType].some((f) => String(f || '').toLowerCase().includes(query)));
  }, [contracts, contractQuery]);

  /* ---------------- machines & blades (تجهیزات برش) ---------------- */

  const [newMachineName, setNewMachineName] = useState('');
  const addMachine = () => {
    const name = newMachineName.trim();
    if (!name) return;
    if (machines.some((m) => m.name.toLowerCase() === name.toLowerCase())) { notify('دستگاهی با این نام از قبل وجود دارد.', 'error'); return; }
    setMachines((prev) => [...prev, { id: `mc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name }]);
    setNewMachineName('');
  };
  const removeMachine = async (machine) => {
    const used = cuttingForms.some((f) => f.machineId === machine.id);
    if (used) { notify('حذف ممکن نیست: این دستگاه در فرم‌های برش استفاده شده است.', 'error'); return; }
    const ok = await confirm({ title: 'حذف دستگاه', body: `دستگاه «${machine.name}» حذف شود؟`, confirmLabel: 'حذف', destructive: true });
    if (!ok) return;
    setMachines((prev) => prev.filter((m) => m.id !== machine.id));
    setBlades((prev) => prev.map((b) => (b.machineId === machine.id ? { ...b, machineId: null } : b)));
  };

  const [newBladeName, setNewBladeName] = useState('');
  const addBlade = () => {
    const name = newBladeName.trim();
    if (!name) return;
    if (blades.some((b) => b.name.toLowerCase() === name.toLowerCase())) { notify('تیغه‌ای با این نام از قبل وجود دارد.', 'error'); return; }
    setBlades((prev) => [...prev, { id: `bl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name, machineId: null }]);
    setNewBladeName('');
  };
  // Only one blade can be mounted on a machine at a time — equipping a new
  // one automatically dismounts whatever was there before.
  const equipBlade = (bladeId, machineId) => {
    setBlades((prev) => prev.map((b) => {
      if (b.id === bladeId) return { ...b, machineId: machineId || null };
      if (machineId && b.machineId === machineId) return { ...b, machineId: null };
      return b;
    }));
  };
  const removeBlade = async (blade) => {
    const ok = await confirm({ title: 'حذف تیغه', body: `تیغه «${blade.name}» حذف شود؟ سوابق فرم‌های برش قبلی دست‌نخورده می‌ماند.`, confirmLabel: 'حذف', destructive: true });
    if (!ok) return;
    setBlades((prev) => prev.filter((b) => b.id !== blade.id));
  };

  const [newOperatorName, setNewOperatorName] = useState('');
  const addOperator = () => {
    const name = newOperatorName.trim();
    if (!name) return;
    if (operators.some((o) => o.name.toLowerCase() === name.toLowerCase())) { notify('این نام از قبل در فهرست هست.', 'error'); return; }
    setOperators((prev) => [...prev, { id: `op-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name }]);
    setNewOperatorName('');
  };
  const removeOperator = (operator) => setOperators((prev) => prev.filter((o) => o.id !== operator.id));

  /* ---------------- waybills (حواله) ---------------- */

  const [wbNumber, setWbNumber] = useState('');
  const [wbTotalWeight, setWbTotalWeight] = useState('');
  const [wbDriver, setWbDriver] = useState('');
  const [wbPlate, setWbPlate] = useState('');
  const [wbMine, setWbMine] = useState('');
  const [wbContractNumber, setWbContractNumber] = useState('');
  const [wbDate, setWbDate] = useState(() => todayJalaliString());
  const [coupRows, setCoupRows] = useState(() => [createCoupRow()]);
  const [editingWaybillId, setEditingWaybillId] = useState(null);
  const [lastSavedWaybill, setLastSavedWaybill] = useState(null);
  const [waybillQuery, setWaybillQuery] = useState('');

  const selectedContract = contractByNumber.get(wbContractNumber) || null;
  const wbFreightPerTon = Number(selectedContract?.freightPerTon || 0);
  const wbFreightAmount = Number((Number(wbTotalWeight || 0) * wbFreightPerTon).toFixed(2));

  const handleContractSelect = (contractNumber) => {
    setWbContractNumber(contractNumber);
    const contract = contractByNumber.get(contractNumber);
    if (!contract) return;
    setWbMine(contract.mineName);
    // Only pre-fill rows the user hasn't touched yet, never overwrite work in progress.
    setCoupRows((rows) => (rows.every(coupRowIsEmpty)
      ? rows.map(() => createCoupRow({ type: contract.stoneType, coupFormat: contract.coupFormat }))
      : rows));
  };

  const updateCoupRow = (key, field, value) => setCoupRows((rows) => rows.map((row) => (row.key === key ? { ...row, [field]: value } : row)));
  const addCoupRow = () => setCoupRows((rows) => [...rows, createCoupRow(selectedContract ? { type: selectedContract.stoneType, coupFormat: selectedContract.coupFormat } : {})]);
  const removeCoupRow = (key) => setCoupRows((rows) => (rows.length === 1 ? [createCoupRow()] : rows.filter((r) => r.key !== key)));

  const coupWeightTotal = useMemo(
    () => coupRows.reduce((sum, row) => sum + (Number(row.approxWeight) || 0), 0),
    [coupRows]
  );
  const weightDifference = Number(wbTotalWeight || 0) - coupWeightTotal;
  const weightsMatch = Math.abs(weightDifference) <= WEIGHT_EPSILON && Number(wbTotalWeight) > 0;

  const resetWaybillForm = () => {
    setWbNumber(''); setWbTotalWeight(''); setWbDriver(''); setWbPlate(''); setWbMine(''); setWbContractNumber('');
    setWbDate(todayJalaliString());
    setCoupRows([createCoupRow()]);
    setEditingWaybillId(null);
  };

  const saveWaybill = () => {
    const number = wbNumber.trim();
    if (!number) { notify('شماره حواله را وارد کنید.', 'error'); return; }
    if (!editingWaybillId && waybills.some((w) => w.waybillNumber === number)) {
      notify('حواله‌ای با این شماره از قبل ثبت شده است.', 'error'); return;
    }
    const isoDate = jalaliStringToIso(wbDate);
    if (!isoDate) { notify('تاریخ حواله معتبر نیست.', 'error'); return; }
    if (!(Number(wbTotalWeight) > 0)) { notify('وزن کل حواله را وارد کنید.', 'error'); return; }
    if (wbPlate.length !== 5) { notify('شماره پلاک باید ۵ رقم باشد.', 'error'); return; }
    const contract = contractByNumber.get(wbContractNumber);
    if (!contract || contract.status !== 'active') {
      notify('این حواله باید به یک قرارداد فعال وصل باشد. ابتدا قرارداد را در تب «ثبت قرارداد» ثبت یا فعال کنید.', 'error');
      return;
    }

    const filledCoups = coupRows.filter((row) => !coupRowIsEmpty(row));
    if (filledCoups.length === 0) { notify('حداقل یک کوپ را ثبت کنید.', 'error'); return; }

    const invalidCoup = filledCoups.find((row) => (
      !row.coupNumber.trim() || !row.type || !row.coupFormat || !(Number(row.approxWeight) > 0)
      || !formatMarkCode(row.markCode) || !/^[A-Z]$/.test(row.coupGrade)
    ));
    if (invalidCoup) { notify('شماره کوپ، کد مارک (ABC-123)، نوع سنگ، فرمت، درجه کوپ (یک حرف) و وزن تقریبی هر ردیف الزامی است.', 'error'); return; }

    const seenCoup = new Set();
    const seenMark = new Set();
    for (const row of filledCoups) {
      const coupKey = row.coupNumber.trim().toUpperCase();
      if (seenCoup.has(coupKey)) { notify(`شماره کوپ ${row.coupNumber} در این حواله تکراری است.`, 'error'); return; }
      seenCoup.add(coupKey);
      const markKey = formatMarkCode(row.markCode);
      if (seenMark.has(markKey)) { notify(`کد مارک ${markKey} در این حواله تکراری است.`, 'error'); return; }
      seenMark.add(markKey);
    }
    const clashingCoup = filledCoups.find((row) => {
      const existing = findCoup(row.coupNumber);
      return existing && existing.waybillId !== editingWaybillId;
    });
    if (clashingCoup) { notify(`شماره کوپ ${clashingCoup.coupNumber} قبلاً در حواله دیگری ثبت شده است.`, 'error'); return; }
    const clashingMark = filledCoups.find((row) => {
      const existing = findMarkCode(row.markCode);
      return existing && existing.waybillId !== editingWaybillId;
    });
    if (clashingMark) { notify(`کد مارک ${formatMarkCode(clashingMark.markCode)} قبلاً در حواله دیگری ثبت شده است.`, 'error'); return; }

    if (!weightsMatch) {
      notify(`مجموع وزن کوپ‌ها (${num(coupWeightTotal)}) با وزن کل حواله (${num(wbTotalWeight)}) برابر نیست.`, 'error');
      return;
    }

    const record = {
      id: editingWaybillId || `wb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      waybillNumber: number,
      totalWeight: Number(wbTotalWeight),
      freightPerTon: wbFreightPerTon,
      freightAmount: wbFreightAmount,
      driverName: wbDriver.trim(),
      plateNumber: wbPlate,
      mineName: wbMine.trim(),
      contractNumber: wbContractNumber,
      date: isoDate,
      coups: filledCoups.map((row) => ({
        id: `coup-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        coupNumber: row.coupNumber.trim(),
        markCode: formatMarkCode(row.markCode),
        type: row.type,
        coupFormat: row.coupFormat,
        coupGrade: row.coupGrade,
        approxWeight: Number(row.approxWeight),
      })),
      createdAt: editingWaybillId ? waybills.find((w) => w.id === editingWaybillId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
    };

    setWaybills((prev) => (editingWaybillId ? prev.map((w) => (w.id === editingWaybillId ? record : w)) : [record, ...prev]));
    setLastSavedWaybill(record);
    notify(editingWaybillId ? `حواله ${number} به‌روزرسانی شد.` : `حواله ${number} با ${record.coups.length} کوپ ثبت شد.`, 'success');
    resetWaybillForm();
  };

  const editWaybill = (waybill) => {
    setWbNumber(waybill.waybillNumber);
    setWbTotalWeight(String(waybill.totalWeight));
    setWbDriver(waybill.driverName);
    setWbPlate(waybill.plateNumber || '');
    setWbMine(waybill.mineName);
    setWbContractNumber(waybill.contractNumber);
    setWbDate(isoToJalaliString(waybill.date));
    setCoupRows(waybill.coups.map((coup) => ({
      ...createCoupRow(),
      coupNumber: coup.coupNumber,
      markCode: coup.markCode || '',
      type: coup.type,
      coupFormat: coup.coupFormat || '',
      coupGrade: coup.coupGrade || '',
      approxWeight: String(coup.approxWeight),
    })));
    setEditingWaybillId(waybill.id);
    setActiveTab('waybillEntry');
  };

  const deleteWaybill = async (waybill) => {
    const coupsInUse = waybill.coups.filter((c) => cutCoupNumbers.has(c.coupNumber.trim().toUpperCase()));
    const ok = await confirm({
      title: `حذف حواله ${waybill.waybillNumber}`,
      body: coupsInUse.length > 0
        ? `${coupsInUse.length} کوپ این حواله در فرم‌های برش استفاده شده‌اند. حذف حواله، آن فرم‌ها را دست‌نخورده نگه می‌دارد اما ارتباطشان با این حواله از بین می‌رود.`
        : 'این حواله برای همیشه حذف می‌شود.',
      confirmLabel: 'حذف حواله',
      destructive: true,
    });
    if (!ok) return;
    setWaybills((prev) => prev.filter((w) => w.id !== waybill.id));
    if (editingWaybillId === waybill.id) resetWaybillForm();
    notify(`حواله ${waybill.waybillNumber} حذف شد.`, 'success');
  };

  const filteredWaybills = useMemo(() => {
    const query = waybillQuery.trim().toLowerCase();
    if (!query) return waybills;
    return waybills.filter((w) => [w.waybillNumber, w.driverName, w.mineName, w.contractNumber, w.plateNumber]
      .some((field) => String(field || '').toLowerCase().includes(query))
      || w.coups.some((c) => c.coupNumber.toLowerCase().includes(query) || (c.markCode || '').toLowerCase().includes(query)));
  }, [waybills, waybillQuery]);

  /* ---------------- cutting forms (فرم برش) ---------------- */

  const nextCuttingRowNumber = useMemo(
    () => (cuttingForms.length === 0 ? 1 : Math.max(...cuttingForms.map((f) => f.rowNumber)) + 1),
    [cuttingForms]
  );

  const [cfDate, setCfDate] = useState(() => todayJalaliString());
  const [cfCoupNumber, setCfCoupNumber] = useState('');
  const [cfMachineId, setCfMachineId] = useState('');
  const [cfManualType, setCfManualType] = useState('');
  const [cfManualWaybill, setCfManualWaybill] = useState('');
  const [cfManualWeight, setCfManualWeight] = useState('');
  const [cfManualFormat, setCfManualFormat] = useState('');
  const [cfSlabs, setCfSlabs] = useState(() => [createSlabRow()]);
  const [cfEnd, setCfEnd] = useState({ date: '', time: '' });
  const [cfExit, setCfExit] = useState({ date: '', time: '' });
  const [editingCuttingFormId, setEditingCuttingFormId] = useState(null);
  const [lastSavedCuttingForm, setLastSavedCuttingForm] = useState(null);
  const [cuttingQuery, setCuttingQuery] = useState('');

  // The form being edited, if any — start/entry timestamps (the automatic
  // ones) are read straight from here rather than kept as separately-typed
  // state, since they are never meant to be typed in by hand.
  const editingCuttingRecord = editingCuttingFormId ? cuttingForms.find((f) => f.id === editingCuttingFormId) : null;

  const matchedCutCoup = findCoup(cfCoupNumber);
  const selectedMachine = machines.find((m) => m.id === cfMachineId) || null;
  const equippedBlade = cfMachineId ? blades.find((b) => b.machineId === cfMachineId) || null : null;

  const nowClockTime = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };
  const nowStamp = () => ({ date: jalaliStringToIso(todayJalaliString()), time: nowClockTime() });
  const manualStamp = (value) => (value.date || value.time ? { date: jalaliStringToIso(value.date) || '', time: value.time } : null);

  const updateSlabRow = (key, field, value) => setCfSlabs((rows) => rows.map((row) => {
    if (row.key !== key) return row;
    const next = { ...row, [field]: value };
    if (field === 'length') next.lengthInMeters = false;
    if (field === 'width') next.widthInMeters = false;
    return next;
  }));
  const convertSlabOnBlur = (key, field) => setCfSlabs((rows) => rows.map((row) => {
    if (row.key !== key) return row;
    const flag = field === 'length' ? 'lengthInMeters' : 'widthInMeters';
    if (row[flag]) return row;
    const value = Number(row[field]);
    if (!Number.isFinite(value) || value <= 0) return row;
    return { ...row, [field]: (value / 100).toFixed(2), [flag]: true };
  }));
  const addSlabRow = () => setCfSlabs((rows) => [...rows, createSlabRow()]);
  const removeSlabRow = (key) => setCfSlabs((rows) => (rows.length === 1 ? [createSlabRow()] : rows.filter((r) => r.key !== key)));

  const cfTotalArea = useMemo(() => cfSlabs.filter((r) => !slabRowIsEmpty(r)).reduce((sum, r) => sum + slabArea(r), 0), [cfSlabs]);

  const resetCuttingForm = () => {
    setCfDate(todayJalaliString());
    setCfCoupNumber(''); setCfMachineId('');
    setCfManualType(''); setCfManualWaybill(''); setCfManualWeight(''); setCfManualFormat('');
    setCfSlabs([createSlabRow()]);
    setCfEnd({ date: '', time: '' }); setCfExit({ date: '', time: '' });
    setEditingCuttingFormId(null);
  };

  // Shared by the normal save button and the print button (which now also
  // saves): validates the form and returns the record to persist, or an
  // error message if something required is missing.
  const validateAndBuildCuttingRecord = () => {
    const isoDate = jalaliStringToIso(cfDate);
    if (!isoDate) return { error: 'تاریخ برش معتبر نیست.' };
    if (!cfCoupNumber.trim()) return { error: 'شماره کوپ را وارد کنید.' };
    if (!selectedMachine) return { error: 'دستگاه برش را انتخاب کنید. اگر دستگاهی در فهرست نیست، از تب «تنظیمات» اضافه کنید.' };

    const type = matchedCutCoup ? matchedCutCoup.type : cfManualType.trim();
    const waybillNumber = matchedCutCoup ? matchedCutCoup.waybillNumber : cfManualWaybill.trim();
    const approxWeight = matchedCutCoup ? matchedCutCoup.approxWeight : (cfManualWeight === '' ? null : Number(cfManualWeight));
    const coupFormat = matchedCutCoup ? matchedCutCoup.coupFormat : cfManualFormat;
    if (!type) return { error: 'نوع کوپ مشخص نیست. اگر کوپ در حواله‌ای ثبت نشده، نوع را دستی وارد کنید.' };

    const filledSlabs = cfSlabs.filter((row) => !slabRowIsEmpty(row));
    const invalidSlab = filledSlabs.find((row) => !(Number(row.length) > 0) || !(Number(row.width) > 0) || !(Number(row.quantity) > 0));
    if (invalidSlab) return { error: 'طول، عرض و تعداد هر ردیف پرشده باید بزرگ‌تر از صفر باشد.' };

    const record = {
      id: editingCuttingFormId || `cf-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      rowNumber: editingCuttingRecord?.rowNumber ?? nextCuttingRowNumber,
      date: isoDate,
      coupNumber: cfCoupNumber.trim(),
      waybillNumber,
      type,
      approxWeight,
      coupFormat,
      machineId: selectedMachine.id,
      cuttingMachine: selectedMachine.name,
      bladeId: equippedBlade?.id || null,
      bladeName: equippedBlade?.name || '',
      slabs: filledSlabs.map((row) => ({
        id: `slab-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        ...normalizedSlabDims(row),
        thickness: String(row.thickness).trim() === '' ? 0 : Number(row.thickness) / 100,
        quantity: Number(row.quantity),
      })),
      totalArea: Number(cfTotalArea.toFixed(2)),
      // "شروع برش" and "ورود به خط فراوری" are automatic and one-shot: once
      // set they are never overwritten by a later save. Start fires the
      // moment a machine is assigned and the form is first saved. Entry
      // fires the moment its slab table is first saved with real rows.
      // "پایان برش" and "خروج از خط فراوری" are entered by hand below and
      // simply follow whatever is currently in those two fields.
      startCut: editingCuttingRecord?.startCut || nowStamp(),
      entryProcessing: editingCuttingRecord?.entryProcessing || (filledSlabs.length > 0 ? nowStamp() : null),
      endCut: manualStamp(cfEnd),
      exitProcessing: manualStamp(cfExit),
      createdAt: editingCuttingRecord?.createdAt || new Date().toISOString(),
    };

    return { record };
  };

  const persistCuttingRecord = async (record) => {
    const saved = await dataOps.saveCuttingForm(record);
    setLastSavedCuttingForm(saved || record);
    return saved || record;
  };

  const saveCuttingForm = async () => {
    const { record, error } = validateAndBuildCuttingRecord();
    if (error) { notify(error, 'error'); return; }
    let saved;
    try {
      saved = await persistCuttingRecord(record);
    } catch (err) {
      notify(`ذخیره ناموفق بود: ${err.message}`, 'error');
      return;
    }
    notify(editingCuttingFormId ? `فرم برش #${saved.rowNumber} به‌روزرسانی شد.` : `فرم برش #${saved.rowNumber} ثبت شد.`, 'success');
    resetCuttingForm();
  };

  // The print button in the entry form saves first (so the printed sheet
  // always reflects a real, numbered record with correct timestamps) and
  // then opens the print dialog for that saved record.
  const saveAndPrintCuttingForm = async () => {
    const { record, error } = validateAndBuildCuttingRecord();
    if (error) { notify(error, 'error'); return; }
    let saved;
    try {
      saved = await persistCuttingRecord(record);
    } catch (err) {
      notify(`ذخیره ناموفق بود: ${err.message}`, 'error');
      return;
    }
    notify(editingCuttingFormId ? `فرم برش #${saved.rowNumber} ذخیره و برای چاپ آماده شد.` : `فرم برش #${saved.rowNumber} ثبت و برای چاپ آماده شد.`, 'success');
    resetCuttingForm();
    printCuttingForm(saved);
  };

  const editCuttingForm = (form) => {
    setCfDate(isoToJalaliString(form.date));
    setCfCoupNumber(form.coupNumber);
    setCfMachineId(form.machineId || '');
    const match = findCoup(form.coupNumber);
    setCfManualType(match ? '' : form.type);
    setCfManualWaybill(match ? '' : form.waybillNumber);
    setCfManualWeight(match || form.approxWeight === null ? '' : String(form.approxWeight));
    setCfManualFormat(match ? '' : (form.coupFormat || ''));
    setCfSlabs(form.slabs.length > 0
      ? form.slabs.map((slab) => ({
        ...createSlabRow(),
        length: num(slab.length), width: num(slab.width),
        thickness: slab.thickness ? String((Number(slab.thickness) * 100).toFixed(2)) : '',
        quantity: String(slab.quantity),
        lengthInMeters: true, widthInMeters: true,
      }))
      : [createSlabRow()]);
    setCfEnd(form.endCut ? { date: isoToJalaliString(form.endCut.date), time: form.endCut.time || '' } : { date: '', time: '' });
    setCfExit(form.exitProcessing ? { date: isoToJalaliString(form.exitProcessing.date), time: form.exitProcessing.time || '' } : { date: '', time: '' });
    setEditingCuttingFormId(form.id);
    setActiveTab('cuttingEntry');
  };

  const deleteCuttingForm = async (form) => {
    const ok = await confirm({
      title: `حذف فرم برش #${form.rowNumber}`,
      body: 'این فرم برای همیشه حذف می‌شود.',
      confirmLabel: 'حذف فرم',
      destructive: true,
    });
    if (!ok) return;
    try {
      await dataOps.deleteCuttingForm({ id: form.id });
    } catch (error) {
      notify(`حذف ناموفق بود: ${error.message}`, 'error');
      return;
    }
    if (editingCuttingFormId === form.id) resetCuttingForm();
    notify(`فرم برش #${form.rowNumber} حذف شد.`, 'success');
  };

  const filteredCuttingForms = useMemo(() => {
    const query = cuttingQuery.trim().toLowerCase();
    const sorted = [...cuttingForms].sort((a, b) => b.rowNumber - a.rowNumber);
    if (!query) return sorted;
    return sorted.filter((f) => [f.coupNumber, f.waybillNumber, f.cuttingMachine, f.type, String(f.rowNumber)]
      .some((field) => String(field || '').toLowerCase().includes(query)));
  }, [cuttingForms, cuttingQuery]);

  /* ---------------- coup dashboard (کوپ) ---------------- */

  const COUP_STAGES = {
    depot: { label: 'در انبار', tone: 'neutral' },
    underMachine: { label: 'زیر دستگاه برش', tone: 'accent' },
    cut: { label: 'بریده‌شده', tone: 'accent' },
    palletized: { label: 'به‌صورت اسلب در پالت', tone: 'success' },
    sold: { label: 'فروخته‌شده', tone: 'danger' },
  };

  const coupDashboard = useMemo(() => {
    const formsByCoup = new Map();
    cuttingForms.forEach((f) => {
      const key = f.coupNumber.trim().toUpperCase();
      if (!formsByCoup.has(key)) formsByCoup.set(key, []);
      formsByCoup.get(key).push(f);
    });

    const stonesByCoup = new Map();
    stones.forEach((s) => {
      const key = String(s.cutCode || '').trim().toUpperCase();
      if (!key) return;
      if (!stonesByCoup.has(key)) stonesByCoup.set(key, []);
      stonesByCoup.get(key).push(s);
    });

    return allCoups.map((coup) => {
      const key = coup.coupNumber.trim().toUpperCase();
      const forms = formsByCoup.get(key) || [];
      const cutSlabs = forms.flatMap((f) => f.slabs.map((sl) => ({ ...sl, machine: f.cuttingMachine, formDate: f.date })));
      const cutArea = cutSlabs.reduce((sum, sl) => sum + storedSlabArea(sl), 0);
      const cutQty = cutSlabs.reduce((sum, sl) => sum + (Number(sl.quantity) || 0), 0);
      const palletStones = stonesByCoup.get(key) || [];
      const palletArea = palletStones.reduce((sum, s) => sum + (Number(s.area) || 0), 0);
      const palletQty = palletStones.reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);
      const soldStones = palletStones.filter((s) => getInvoice(s.palletNumber));
      const soldArea = soldStones.reduce((sum, s) => sum + (Number(s.area) || 0), 0);
      const soldQty = soldStones.reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);
      const stoneGrades = [...new Set(palletStones.map((s) => s.grade).filter(Boolean))];

      let stage = 'depot';
      if (soldArea > 0) stage = 'sold';
      else if (palletArea > 0) stage = 'palletized';
      else if (cutSlabs.length > 0) stage = 'cut';
      else if (forms.length > 0) stage = 'underMachine';

      return {
        ...coup,
        forms, cutArea, cutQty, palletArea, palletQty, soldArea, soldQty, stoneGrades, stage,
        cuttingMachine: forms[0]?.cuttingMachine || '',
        bladeName: forms[0]?.bladeName || '',
        cutThickness: cutSlabs[0]?.thickness ?? null,
        palletizedPct: cutArea > 0 ? Math.min(100, (palletArea / cutArea) * 100) : 0,
        soldPct: cutArea > 0 ? Math.min(100, (soldArea / cutArea) * 100) : 0,
      };
    });
  }, [allCoups, cuttingForms, stones, getInvoice]);

  const coupStats = useMemo(() => {
    const inDepotCoups = coupDashboard.filter((c) => c.stage === 'depot' || c.stage === 'underMachine');
    const cutCoups = coupDashboard.filter((c) => ['cut', 'palletized', 'sold'].includes(c.stage));
    const soldCoups = coupDashboard.filter((c) => c.stage === 'sold');
    const sumWeight = (list) => list.reduce((sum, c) => sum + (Number(c.approxWeight) || 0), 0);
    return {
      inDepot: inDepotCoups.length,
      inDepotWeight: sumWeight(inDepotCoups),
      cut: cutCoups.length,
      cutWeight: sumWeight(cutCoups),
      cutArea: cutCoups.reduce((sum, c) => sum + c.cutArea, 0),
      cutAndSold: soldCoups.length,
      cutAndSoldWeight: sumWeight(soldCoups),
      soldArea: soldCoups.reduce((sum, c) => sum + c.soldArea, 0),
    };
  }, [coupDashboard]);

  const [coupQuery, setCoupQuery] = useState('');
  const filteredCoupDashboard = useMemo(() => {
    const query = coupQuery.trim().toLowerCase();
    if (!query) return coupDashboard;
    return coupDashboard.filter((c) => [c.coupNumber, c.markCode, c.waybillNumber, c.contractNumber, c.type, c.cuttingMachine]
      .some((field) => String(field || '').toLowerCase().includes(query)));
  }, [coupDashboard, coupQuery]);

  /* ---------------- render ---------------- */

  const tabs = [
    { id: 'contractEntry', label: 'ثبت قرارداد' },
    { id: 'contractList', label: 'قراردادها' },
    { id: 'waybillEntry', label: 'ثبت حواله' },
    { id: 'waybillList', label: 'حواله‌ها' },
    { id: 'coupDashboard', label: 'کوپ' },
    { id: 'cuttingEntry', label: 'ثبت برش' },
    { id: 'cuttingList', label: 'فرم‌های برش' },
    { id: 'entry', label: 'ثبت پالت' },
    { id: 'search', label: 'موجودی و فروش' },
    { id: 'card', label: 'کارت پالت' },
    { id: 'types', label: 'انواع سنگ' },
    { id: 'settings', label: 'تنظیمات' },
  ];

  const saveIndicator = {
    idle: { text: 'آماده', tone: 'neutral' },
    saving: { text: 'در حال ذخیره…', tone: 'neutral' },
    saved: { text: lastSavedAt ? `ذخیره شد ${lastSavedAt.toLocaleTimeString('fa-IR')}` : 'ذخیره شد', tone: 'success' },
    failed: { text: 'ذخیره ناموفق', tone: 'danger' },
  }[saveState];

  const totalStock = useMemo(() => {
    const inStock = stones.filter((s) => !getInvoice(s.palletNumber));
    return {
      area: inStock.reduce((sum, s) => sum + (Number(s.area) || 0), 0),
      pallets: new Set(inStock.map((s) => s.palletNumber)).size,
    };
  }, [stones, getInvoice]);

  const appContext = {
    activeTab,
    setActiveTab,
    stones,
    setStones,
    stoneTypes,
    setStoneTypes,
    waybills,
    setWaybills,
    cuttingForms,
    setCuttingForms,
    contracts,
    setContracts,
    machines,
    setMachines,
    blades,
    setBlades,
    operators,
    setOperators,
    settings,
    setSettings,
    dataState,
    setDataState,
    saveState,
    setSaveState,
    lastSavedAt,
    setLastSavedAt,
    toasts,
    setToasts,
    confirmRequest,
    setConfirmRequest,
    confirmResolver,
    notify,
    dismissToast,
    confirm,
    resolveConfirm,
    invoiceByPallet,
    getInvoice,
    allCoups,
    findCoup,
    markCodeIndex,
    findMarkCode,
    cutCoupNumbers,
    headerPallet,
    setHeaderPallet,
    headerSpec,
    setHeaderSpec,
    entryRows,
    setEntryRows,
    editingPallet,
    setEditingPallet,
    lastSavedBatch,
    setLastSavedBatch,
    specIsUsable,
    specOf,
    updateRow,
    convertOnBlur,
    addRow,
    removeRow,
    relinkRowToHeader,
    focusCell,
    handleRowKeyDown,
    dataOps,
    resetEntryForm,
    savePallet,
    entryTotals,
    filters,
    setFilters,
    selectedPallets,
    setSelectedPallets,
    bulkInvoice,
    setBulkInvoice,
    updateFilter,
    resetFilters,
    activeFilterCount,
    filteredStones,
    matchingStoneIds,
    palletGroups,
    searchTotals,
    inventorySummary,
    togglePallet,
    allVisibleSelected,
    toggleAllVisible,
    markSold,
    clearInvoice,
    editPallet,
    deletePallet,
    cardQuery,
    setCardQuery,
    cardPallet,
    setCardPallet,
    findPalletCard,
    escapeHtml,
    loadLogoDataUrl,
    loadQrDataUrl,
    buildPrintHtml,
    printDocument,
    printPalletCard,
    printSearchReport,
    metaGridHtml,
    printDocumentHeader,
    printWaybill,
    printWaybillReport,
    timingBoxHtml,
    printCuttingForm,
    newStoneType,
    setNewStoneType,
    addStoneType,
    removeStoneType,
    updateSetting,
    handleLogoUpload,
    activeContracts,
    contractByNumber,
    ctNumber,
    setCtNumber,
    ctTonnage,
    setCtTonnage,
    ctMine,
    setCtMine,
    ctStoneType,
    setCtStoneType,
    ctFormat,
    setCtFormat,
    ctPrice,
    setCtPrice,
    ctFreightPerTon,
    setCtFreightPerTon,
    ctCoupCount,
    setCtCoupCount,
    editingContractId,
    setEditingContractId,
    contractQuery,
    setContractQuery,
    expandedContractId,
    setExpandedContractId,
    resetContractForm,
    saveContract,
    editContract,
    toggleContractStatus,
    deleteContract,
    contractStats,
    filteredContracts,
    newMachineName,
    setNewMachineName,
    addMachine,
    removeMachine,
    newBladeName,
    setNewBladeName,
    addBlade,
    equipBlade,
    removeBlade,
    newOperatorName,
    setNewOperatorName,
    addOperator,
    removeOperator,
    wbNumber,
    setWbNumber,
    wbTotalWeight,
    setWbTotalWeight,
    wbDriver,
    setWbDriver,
    wbPlate,
    setWbPlate,
    wbMine,
    setWbMine,
    wbContractNumber,
    setWbContractNumber,
    wbDate,
    setWbDate,
    coupRows,
    setCoupRows,
    editingWaybillId,
    setEditingWaybillId,
    lastSavedWaybill,
    setLastSavedWaybill,
    waybillQuery,
    setWaybillQuery,
    selectedContract,
    wbFreightPerTon,
    wbFreightAmount,
    handleContractSelect,
    updateCoupRow,
    addCoupRow,
    removeCoupRow,
    coupWeightTotal,
    weightDifference,
    weightsMatch,
    resetWaybillForm,
    saveWaybill,
    editWaybill,
    deleteWaybill,
    filteredWaybills,
    nextCuttingRowNumber,
    cfDate,
    setCfDate,
    cfCoupNumber,
    setCfCoupNumber,
    cfMachineId,
    setCfMachineId,
    cfManualType,
    setCfManualType,
    cfManualWaybill,
    setCfManualWaybill,
    cfManualWeight,
    setCfManualWeight,
    cfManualFormat,
    setCfManualFormat,
    cfSlabs,
    setCfSlabs,
    cfEnd,
    setCfEnd,
    cfExit,
    setCfExit,
    editingCuttingFormId,
    setEditingCuttingFormId,
    lastSavedCuttingForm,
    setLastSavedCuttingForm,
    cuttingQuery,
    setCuttingQuery,
    editingCuttingRecord,
    matchedCutCoup,
    selectedMachine,
    equippedBlade,
    nowClockTime,
    nowStamp,
    manualStamp,
    updateSlabRow,
    convertSlabOnBlur,
    addSlabRow,
    removeSlabRow,
    cfTotalArea,
    resetCuttingForm,
    validateAndBuildCuttingRecord,
    persistCuttingRecord,
    saveCuttingForm,
    saveAndPrintCuttingForm,
    editCuttingForm,
    deleteCuttingForm,
    filteredCuttingForms,
    COUP_STAGES,
    coupDashboard,
    coupStats,
    coupQuery,
    setCoupQuery,
    filteredCoupDashboard,
    Button,
    Input,
    Select,
    Field,
    Card,
    Badge,
    Stat,
    EmptyState,
    JalaliDateField,
    MobileConnectionCard,
    Bar,
    num,
    formatRial,
    normalizePalletInput,
    formatPallet,
    rowArea,
    ROW_FIELDS,
    normalizeMarkCodeInput,
    formatMarkCode,
    normalizePlateInput,
    focusByAttr,
    handleFlatEnter,
    handleGridEnter,
    coupFormatLabel,
    COUP_FORMATS,
    isoToJalaliString,
    todayJalaliString,
    jalaliStringToIso,
    normalizedSlabDims,
    storedSlabArea,
    slabArea,
    slabRowIsEmpty
  };

  if (dataState === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-[var(--text-muted)]">
        در حال بارگذاری اطلاعات…
      </div>
    );
  }

  return (
    <AppContext.Provider value={appContext}>
      <div className="min-h-screen bg-[var(--bg)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-baseline gap-3">
            <h1 className="text-base font-semibold tracking-wide">DEPO<span className="mr-2 text-xs font-normal text-[var(--text-muted)]">مدیریت انبار و فراوری سنگ</span></h1>
            <span className="num text-xs text-[var(--text-muted)]">
              {totalStock.pallets} پالت در انبار · {num(totalStock.area)} m²
            </span>
          </div>
          <div className="flex items-center gap-2">
            {dataState === 'blocked' && <Badge tone="danger">ذخیره‌سازی متوقف است</Badge>}
            <Badge tone={saveIndicator.tone}>{saveIndicator.text}</Badge>
          </div>
        </div>
        <nav className="mx-auto flex max-w-[1500px] gap-1 px-4" role="tablist">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={`-mb-px border-b-2 px-3.5 py-2 text-sm transition-colors ${
                  active
                    ? 'border-[var(--primary)] font-semibold text-[var(--primary)]'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-[1500px] px-6 py-6">
        {dataState === 'blocked' && (
          <div className="mb-5 rounded-lg border border-[#f0cfcc] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]">
            فایل اطلاعات خوانده نشد. برای اینکه داده‌های موجود پاک نشوند، ذخیره‌سازی خودکار غیرفعال است. برنامه را ببندید و از منوی «پرونده → محل ذخیره اطلاعات» فایل را بررسی کنید.
          </div>
        )}

        {/* ---------------- Entry ---------------- */}
        {activeTab === 'entry' && <EntryTab />}

        {/* ---------------- Search ---------------- */}
        {activeTab === 'search' && <InventoryTab />}

        {/* ---------------- Pallet card ---------------- */}
        {activeTab === 'card' && <PalletCardTab />}

        {/* ---------------- Contract entry ---------------- */}
        {activeTab === 'contractEntry' && <ContractEntryTab />}

        {/* ---------------- Contract management ---------------- */}
        {activeTab === 'contractList' && <ContractListTab />}

        {/* ---------------- Waybill entry ---------------- */}
        {activeTab === 'waybillEntry' && <WaybillEntryTab />}

        {/* ---------------- Waybill list ---------------- */}
        {activeTab === 'waybillList' && <WaybillListTab />}

        {/* ---------------- Coup dashboard ---------------- */}
        {activeTab === 'coupDashboard' && <CoupDashboardTab />}

        {/* ---------------- Cutting form entry ---------------- */}
        {activeTab === 'cuttingEntry' && <CuttingEntryTab />}

        {/* ---------------- Cutting form list ---------------- */}
        {activeTab === 'cuttingList' && <CuttingListTab />}

        {/* ---------------- Stone types ---------------- */}
        {activeTab === 'types' && <StoneTypesTab />}

        {/* ---------------- Settings ---------------- */}
        {activeTab === 'settings' && <SettingsTab />}
      </main>

      <datalist id="coup-options">
        {allCoups.map((coup) => <option key={coup.id} value={coup.coupNumber} />)}
      </datalist>
        <Toasts items={toasts} onDismiss={dismissToast} />
        <ConfirmDialog request={confirmRequest} onResolve={resolveConfirm} />
      </div>
    </AppContext.Provider>
  );
}
