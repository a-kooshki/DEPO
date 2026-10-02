// Pure, framework-free helpers shared between the desktop app (imported by
// Vite/React) and the mobile page (loaded natively as an ES module in the
// browser, no build step). Keeping this logic in one file means the two
// surfaces can never quietly drift apart on what counts as a valid entry.

export const DEFAULT_STONE_TYPES = ['Granite', 'Marble', 'Limestone'];

// A coup arrives from the mine either as a raw, unshaped block ("لاشه") or a
// squared/dressed block ("قواره"). Stored as a stable code, shown in Persian.
export const COUP_FORMATS = [
  { value: 'rough', label: 'لاشه' },
  { value: 'dressed', label: 'قواره' },
];
export const coupFormatLabel = (value) => COUP_FORMATS.find((f) => f.value === value)?.label || '—';

export const num = (value, digits = 2) => Number(value || 0).toFixed(digits);

// Rial amounts are always shown grouped in three digits (e.g. 1,250,000).
export const formatRial = (value) => Math.round(Number(value || 0)).toLocaleString('en-US');

/* -------- pallet number (A-123) -------- */

export const normalizePalletInput = (rawValue) => {
  const cleaned = String(rawValue || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const letterIndex = cleaned.search(/[A-Z]/);
  if (letterIndex === -1) return '';
  const letter = cleaned[letterIndex];
  const digits = cleaned.slice(letterIndex + 1).replace(/[^0-9]/g, '').slice(0, 3);
  return `${letter}${digits}`;
};

export const formatPallet = (rawValue) => {
  const match = normalizePalletInput(rawValue).match(/^([A-Z])(\d{1,3})$/);
  return match ? `${match[1]}-${match[2]}` : '';
};

/* -------- pallet entry rows -------- */

let rowCounter = 0;
// A row starts out "unlocked": it has no spec of its own and simply shows
// whatever is currently in the header. The spec is copied onto the row the
// first time the user types into it, so rows already filled in keep their
// spec when the header changes, while blank rows follow the new header.
export const createEntryRow = () => ({
  key: `row-${Date.now()}-${(rowCounter += 1)}-${Math.random().toString(36).slice(2, 6)}`,
  specLocked: false,
  type: '',
  cutCode: '',
  grade: '',
  thickness: '',
  length: '',
  width: '',
  quantity: '',
  notes: '',
  lengthInMeters: false,
  widthInMeters: false,
});

export const rowIsEmpty = (row) => ['thickness', 'length', 'width', 'quantity', 'notes'].every((f) => String(row[f] || '').trim() === '');

export const ROW_FIELDS = ['thickness', 'length', 'width', 'quantity', 'notes'];

export const metresOf = (row, field) => {
  const value = Number(row[field] || 0);
  if (!Number.isFinite(value)) return 0;
  return (field === 'length' ? row.lengthInMeters : row.widthInMeters) ? value : value / 100;
};

// Converts a centimetre value the user just typed into metres, in place, the
// moment they leave the field. Idempotent via the lengthInMeters/widthInMeters
// flag: blurring an already-converted field again is a no-op. Works the same
// for pallet-entry rows and cutting-form slab rows (identical field shape).
export const convertDimensionOnBlur = (row, field) => {
  const flag = field === 'length' ? 'lengthInMeters' : 'widthInMeters';
  if (row[flag]) return row;
  const value = Number(row[field]);
  if (!Number.isFinite(value) || value <= 0) return row;
  return { ...row, [field]: (value / 100).toFixed(2), [flag]: true };
};

export const rowArea = (row) => metresOf(row, 'length') * metresOf(row, 'width') * (Number(row.quantity) || 0);

// If the user swaps which box they typed the longer/shorter side into, this
// silently corrects it on save — "length" is always the larger of the two.
// Area is unaffected either way.
export const normalizedRowDims = (row) => {
  const a = metresOf(row, 'length');
  const b = metresOf(row, 'width');
  return { length: Math.max(a, b), width: Math.min(a, b) };
};

/* -------- cutting-form slab rows -------- */

let slabRowCounter = 0;
export const createSlabRow = () => ({
  key: `slab-${Date.now()}-${(slabRowCounter += 1)}-${Math.random().toString(36).slice(2, 6)}`,
  length: '',
  width: '',
  thickness: '',
  quantity: '1',
  lengthInMeters: false,
  widthInMeters: false,
});

export const slabRowIsEmpty = (row) => ['length', 'width', 'thickness'].every((f) => String(row[f] || '').trim() === '');
export const slabMetres = metresOf;
export const slabArea = rowArea;
export const normalizedSlabDims = normalizedRowDims;

// Saved slabs/rows are already stored in metres (converted once, at save
// time) and carry no lengthInMeters/widthInMeters flags — those only exist on
// draft rows mid-entry. Reusing slabArea()/rowArea() on a saved record divides
// its metres by 100 again, producing near-zero areas. This is the correct
// formula for stored records: length × width × quantity, no further conversion.
export const storedSlabArea = (slab) => Number(slab.length || 0) * Number(slab.width || 0) * (Number(slab.quantity) || 0);

/* -------- coup registry (derived from waybills) -------- */

// Every coup logged through a waybill, flattened for lookup — identical shape
// on the server (electron/main.cjs, duplicated in plain CJS there) and here.
export const flattenCoups = (waybills) => (
  waybills.flatMap((w) => w.coups.map((c) => ({ ...c, waybillNumber: w.waybillNumber, waybillId: w.id, contractNumber: w.contractNumber })))
);

export const findCoupByNumber = (coups, coupNumber) => {
  const key = String(coupNumber || '').trim().toUpperCase();
  if (!key) return null;
  return coups.find((c) => c.coupNumber.trim().toUpperCase() === key) || null;
};

export const WEIGHT_EPSILON = 0.005;
