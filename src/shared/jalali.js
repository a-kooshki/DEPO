// Gregorian <-> Jalali (Persian) calendar conversion.
// Self-contained (no external dependency) so the app works fully offline.
// Algorithm: the standard jalaali astronomical-observation break table, the
// same approach used by the widely used `jalaali-js` library.

const BREAKS = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210,
  1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178,
];

const div = (a, b) => ~~(a / b);
const mod = (a, b) => a - ~~(a / b) * b;

function jalCal(jy) {
  const breaksLength = BREAKS.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = BREAKS[0];
  if (jy < jp || jy >= BREAKS[breaksLength - 1]) {
    throw new Error(`سال شمسی نامعتبر: ${jy}`);
  }
  let jump = 0;
  for (let i = 1; i < breaksLength; i += 1) {
    const jm = BREAKS[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ += div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }
  let n = jy - jp;
  leapJ += div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;
  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;
  if (jump - n < 6) n = n - jump + div(jump, 33) * 33;
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;
  return { leap, gy, march };
}

function g2d(gy, gm, gd) {
  let d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4)
    + div(153 * mod(gm + 9, 12) + 2, 5)
    + gd - 34840408;
  d -= div(div(gy + div(gm - 8, 6) + 100100, 100) * 3, 4) - 752;
  return d;
}

function d2g(jdn) {
  let j = 4 * jdn + 139361631;
  j += div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

function j2d(jy, jm, jd) {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

function d2j(jdn) {
  const gy = d2g(jdn).gy;
  let jy = gy - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(r.gy, 3, r.march);
  let k = jdn - jdn1f;
  if (k >= 0) {
    if (k <= 185) return { jy, jm: 1 + div(k, 31), jd: mod(k, 31) + 1 };
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  return { jy, jm: 7 + div(k, 30), jd: mod(k, 30) + 1 };
}

const pad2 = (value) => String(value).padStart(2, '0');

/** Gregorian Date -> { jy, jm, jd } */
export function toJalali(date) {
  return d2j(g2d(date.getFullYear(), date.getMonth() + 1, date.getDate()));
}

/** { jy, jm, jd } -> Gregorian Date (local midnight) */
export function toGregorian(jy, jm, jd) {
  const { gy, gm, gd } = d2g(j2d(jy, jm, jd));
  return new Date(gy, gm - 1, gd);
}

/** Today, formatted as "YYYY/MM/DD" in the Jalali calendar. */
export function todayJalaliString() {
  const { jy, jm, jd } = toJalali(new Date());
  return `${jy}/${pad2(jm)}/${pad2(jd)}`;
}

/** ISO date string (yyyy-mm-dd or full ISO) -> "YYYY/MM/DD" Jalali, or '' if invalid. */
export function isoToJalaliString(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const { jy, jm, jd } = toJalali(date);
  return `${jy}/${pad2(jm)}/${pad2(jd)}`;
}

/** "YYYY/MM/DD" or "YYYY-MM-DD" Jalali string -> ISO date string (yyyy-mm-dd), or '' if invalid. */
export function jalaliStringToIso(value) {
  const match = String(value || '').trim().match(/^(\d{3,4})[/-](\d{1,2})[/-](\d{1,2})$/);
  if (!match) return '';
  const jy = Number(match[1]);
  const jm = Number(match[2]);
  const jd = Number(match[3]);
  if (jm < 1 || jm > 12 || jd < 1 || jd > 31) return '';
  try {
    const date = toGregorian(jy, jm, jd);
    if (Number.isNaN(date.getTime())) return '';
    // Round-trip check catches invalid day-of-month combinations (e.g. 31/12).
    const back = toJalali(date);
    if (back.jy !== jy || back.jm !== jm || back.jd !== jd) return '';
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
  } catch {
    return '';
  }
}

/** Loosely normalizes user typing into "YYYY/MM/DD" without validating the date. */
export function normalizeJalaliInput(raw) {
  const digits = String(raw || '').replace(/[^\d]/g, '');
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}/${digits.slice(4)}`;
  return `${digits.slice(0, 4)}/${digits.slice(4, 6)}/${digits.slice(6, 8)}`;
}
