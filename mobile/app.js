import {
  COUP_FORMATS, coupFormatLabel, num,
  normalizePalletInput, formatPallet, createEntryRow, rowIsEmpty, normalizedRowDims, rowArea,
  createSlabRow, slabRowIsEmpty, slabArea, normalizedSlabDims, findCoupByNumber,
  convertDimensionOnBlur,
} from '/shared/domain.js';
import { todayJalaliString, jalaliStringToIso, normalizeJalaliInput } from '/shared/jalali.js';

const OPERATOR_KEY = 'depo-mobile-operator';
const root = document.getElementById('app');

/* ------------------------------------------------------------------ */
/* Tiny DOM builder — no framework, but avoids raw innerHTML strings   */
/* ------------------------------------------------------------------ */

function h(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs || {}).forEach(([key, value]) => {
    if (value === null || value === undefined || value === false) return;
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2), value);
    else if (key === 'html') node.innerHTML = value;
    else if (value === true) node.setAttribute(key, '');
    else node.setAttribute(key, value);
  });
  (Array.isArray(children) ? children : [children]).forEach((child) => {
    if (child === null || child === undefined || child === false) return;
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  });
  return node;
}

/* ------------------------------------------------------------------ */
/* State                                                                */
/* ------------------------------------------------------------------ */

const state = {
  operator: localStorage.getItem(OPERATOR_KEY) || '',
  tab: 'pallet',
  reference: null,
  loadError: '',
};

const palletForm = {
  header: { palletNumber: '', type: '', cutCode: '', grade: '' },
  rows: [createEntryRow()],
  submitting: false,
  lastSaved: null,
  editingPalletNumber: null,
  invoiceNumber: '',
};

const cuttingForm = {
  date: todayJalaliString(),
  coupNumber: '',
  machineId: '',
  manualType: '',
  manualWaybill: '',
  manualWeight: '',
  manualFormat: '',
  slabs: [createSlabRow()],
  end: { date: '', time: '' },
  exit: { date: '', time: '' },
  submitting: false,
  lastSaved: null,
};

/* ------------------------------------------------------------------ */
/* API                                                                  */
/* ------------------------------------------------------------------ */

async function loadReference() {
  try {
    const res = await fetch('/api/state');
    if (!res.ok) throw new Error('bad status');
    state.reference = await res.json();
    state.loadError = '';
  } catch {
    state.loadError = 'اتصال به سرور برقرار نشد. اتصال Wi-Fi/شبکه را بررسی کنید و دوباره تلاش کنید.';
  }
  render();
}

function subscribeToUpdates() {
  try {
    const source = new EventSource('/api/events');
    source.onmessage = () => loadReference();
    source.onerror = () => { source.close(); setTimeout(subscribeToUpdates, 5000); };
  } catch {
    // SSE not available — reference data just won't live-refresh; forms still work.
  }
}

async function postJson(url, body) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) throw new Error(data.error || 'ثبت ناموفق بود.');
  return data;
}

/* ------------------------------------------------------------------ */
/* Toast                                                                */
/* ------------------------------------------------------------------ */

let toastTimer = null;
function showToast(message, tone) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  clearTimeout(toastTimer);
  const toast = h('div', { class: `toast ${tone}`, text: message });
  document.body.appendChild(toast);
  toastTimer = setTimeout(() => toast.remove(), 3200);
}

/* ------------------------------------------------------------------ */
/* Operator gate                                                       */
/* ------------------------------------------------------------------ */

function renderOperatorPicker() {
  const operators = state.reference?.operators || [];
  return h('div', { class: 'picker-screen' }, [
    h('h1', { text: 'DEPO' }),
    h('p', { text: 'برای ادامه، نام خود را انتخاب کنید.' }),
    operators.length === 0
      ? h('div', { class: 'empty-note', text: 'کاربری تعریف نشده است. ابتدا از برنامه‌ی اصلی، در تب «تنظیمات»، یک کاربر اضافه کنید.' })
      : h('div', { class: 'picker-list' }, operators.map((op) => h('button', {
        text: op.name,
        onclick: () => { state.operator = op.name; localStorage.setItem(OPERATOR_KEY, op.name); render(); },
      }))),
  ]);
}

/* ------------------------------------------------------------------ */
/* Pallet entry                                                        */
/* ------------------------------------------------------------------ */

function specOfRow(row) {
  const own = { type: row.type, cutCode: row.cutCode, grade: row.grade };
  const usable = Boolean(own.type) && String(own.cutCode ?? '').trim() !== '';
  return row.specLocked && usable ? own : palletForm.header;
}

function renderPalletTab() {
  const { header, rows } = palletForm;
  const coups = state.reference?.coups || [];
  const stoneTypes = state.reference?.stoneTypes || [];
  const matchedCoup = findCoupByNumber(coups, header.cutCode);

  const headerCard = h('div', { class: 'card' }, [
    h('h2', { text: palletForm.editingPalletNumber ? `ویرایش پالت ${palletForm.editingPalletNumber}` : 'مشخصات پالت' }),
    palletForm.editingPalletNumber ? h('p', { class: 'hint', style: 'color:var(--accent)', text: 'اطلاعات ثبت‌شده بارگذاری شده است. تغییرات را ویرایش و ذخیره کنید.' }) : null,
    palletForm.editingPalletNumber ? h('button', { class: 'secondary', text: 'لغو ویرایش پالت', onclick: cancelPalletEdit }) : null,
    h('p', { class: 'hint', text: 'این مشخصات برای ردیف‌های تازه اعمال می‌شود؛ ردیف‌هایی که قبلاً پر شده‌اند تغییر نمی‌کنند.' }),
    h('div', { class: 'field' }, [
      h('label', { text: 'شماره پالت' }),
      h('input', {
        value: header.palletNumber, inputmode: 'text', placeholder: 'A-123', disabled: palletForm.editingPalletNumber ? true : null,
        oninput: (e) => { header.palletNumber = normalizePalletInput(e.target.value); e.target.value = header.palletNumber; },
        onblur: (e) => { header.palletNumber = formatPallet(header.palletNumber) || header.palletNumber; e.target.value = header.palletNumber; loadExistingPallet(header.palletNumber); },
      }),
    ]),
    h('div', { class: 'grid-2' }, [
      h('div', { class: 'field' }, [
        h('label', { text: 'نوع سنگ' }),
        h('select', {
          onchange: (e) => { header.type = e.target.value; },
        }, [
          h('option', { value: '', text: 'انتخاب کنید' }),
          ...stoneTypes.map((t) => h('option', { value: t, text: t, selected: t === header.type ? true : null })),
        ]),
      ]),
      h('div', { class: 'field' }, [
        h('label', { text: 'کد کوپ' }),
        h('input', {
          value: header.cutCode, placeholder: 'شماره کوپ',
          oninput: (e) => {
            header.cutCode = e.target.value;
            const match = findCoupByNumber(coups, header.cutCode);
            if (match) { header.type = match.type; renderPalletTabInPlace(); }
          },
        }),
      ]),
    ]),
    header.cutCode.trim() !== ''
      ? (matchedCoup
        ? h('p', { class: 'hint', style: 'color:var(--success)', text: `✓ حواله ${matchedCoup.waybillNumber} · ${matchedCoup.type}` })
        : h('p', { class: 'hint', text: 'در حواله‌ها یافت نشد' }))
      : null,
    h('div', { class: 'field' }, [
      h('label', { text: 'درجه' }),
      h('input', {
        value: header.grade, maxlength: '1',
        oninput: (e) => { header.grade = e.target.value.toUpperCase().slice(0, 1); e.target.value = header.grade; },
      }),
    ]),
  ]);

  const rowCards = rows.map((row, index) => {
    const spec = specOfRow(row);
    const ownSpec = spec !== palletForm.header;
    const specLabel = `${spec.type || '—'} · ${spec.cutCode !== '' ? spec.cutCode : '—'} · ${spec.grade || '—'}`;

    const markDirty = (field, value) => {
      Object.assign(row, { [field]: value, specLocked: true, ...palletForm.header });
      if (field === 'length') row.lengthInMeters = false;
      if (field === 'width') row.widthInMeters = false;
    };

    return h('div', { class: 'row-card' }, [
      h('div', { class: 'row-head' }, [
        h('span', { class: 'row-spec', text: `${index + 1}. ${specLabel}${ownSpec ? '' : ' (از سربرگ)'}` }),
        rows.length > 1 ? h('button', { class: 'row-remove', text: '×', onclick: () => { palletForm.rows = rows.filter((r) => r !== row); renderPalletTabInPlace(); } }) : null,
      ]),
      h('div', { class: 'grid-3' }, [
        h('div', { class: 'field' }, [
          h('label', { text: 'ضخامت (cm)' }),
          h('input', { type: 'number', inputmode: 'decimal', value: row.thickness, oninput: (e) => markDirty('thickness', e.target.value) }),
        ]),
        h('div', { class: 'field' }, [
          h('label', { text: 'طول (cm)' }),
          h('input', {
            type: 'number', inputmode: 'decimal', value: row.length,
            oninput: (e) => markDirty('length', e.target.value),
            onblur: (e) => { const next = convertDimensionOnBlur(row, 'length'); Object.assign(row, next); e.target.value = row.length; renderPalletTabInPlace(); },
          }),
        ]),
        h('div', { class: 'field' }, [
          h('label', { text: 'عرض (cm)' }),
          h('input', {
            type: 'number', inputmode: 'decimal', value: row.width,
            oninput: (e) => markDirty('width', e.target.value),
            onblur: (e) => { const next = convertDimensionOnBlur(row, 'width'); Object.assign(row, next); e.target.value = row.width; renderPalletTabInPlace(); },
          }),
        ]),
      ]),
      h('div', { class: 'grid-2' }, [
        h('div', { class: 'field' }, [
          h('label', { text: 'تعداد' }),
          h('input', { type: 'number', inputmode: 'numeric', value: row.quantity, oninput: (e) => markDirty('quantity', e.target.value) }),
        ]),
        h('div', { class: 'field' }, [
          h('label', { text: 'یادداشت' }),
          h('input', { value: row.notes, oninput: (e) => markDirty('notes', e.target.value) }),
        ]),
      ]),
      h('div', { class: 'row-area', text: `مساحت: ${num(rowArea(row))} m²` }),
    ]);
  });

  const totalArea = rows.filter((r) => !rowIsEmpty(r)).reduce((sum, r) => sum + rowArea(r), 0);

  const rowsCard = h('div', { class: 'card' }, [
    h('h2', { text: 'ردیف‌ها' }),
    ...rowCards,
    h('button', { class: 'add-row-btn', text: '+ افزودن ردیف', onclick: () => { palletForm.rows.push(createEntryRow()); renderPalletTabInPlace(); } }),
    h('p', { class: 'hint', text: `مساحت کل: ${num(totalArea)} m²` }),
    h('button', {
      class: 'primary', text: palletForm.submitting ? 'در حال ذخیره…' : palletForm.editingPalletNumber ? 'ذخیره تغییرات پالت' : 'ثبت پالت', disabled: palletForm.submitting,
      onclick: submitPallet,
    }),
  ]);

  const lastSavedCard = palletForm.lastSaved
    ? h('div', { class: 'card' }, [
      h('h2', { text: 'آخرین پالت ثبت‌شده' }),
      h('p', { class: 'hint', text: `${palletForm.lastSaved.palletNumber} — ${palletForm.lastSaved.count} ردیف — ${num(palletForm.lastSaved.area)} m²` }),
    ])
    : null;

  return h('div', {}, [headerCard, rowsCard, lastSavedCard]);
}

// Re-renders just the pallet tab in place — used for structural changes
// (row add/remove, coup auto-fill) so typing elsewhere on the page is never
// interrupted by a full-page rebuild.
function renderPalletTabInPlace() {
  const container = document.getElementById('tab-content');
  if (container) container.replaceChildren(renderPalletTab());
}

function cancelPalletEdit() {
  palletForm.editingPalletNumber = null;
  palletForm.invoiceNumber = '';
  palletForm.header = { palletNumber: '', type: palletForm.header.type, cutCode: '', grade: palletForm.header.grade };
  palletForm.rows = [createEntryRow()];
  renderPalletTabInPlace();
}

async function loadExistingPallet(palletNumber) {
  if (!palletNumber || palletNumber === palletForm.editingPalletNumber) return;
  try {
    const response = await fetch(`/api/pallets/${encodeURIComponent(palletNumber)}`);
    if (response.status === 404) return;
    if (!response.ok) throw new Error('bad status');
    const { stones } = await response.json();
    if (!Array.isArray(stones) || stones.length === 0) return;

    const first = stones[0];
    palletForm.editingPalletNumber = palletNumber;
    palletForm.invoiceNumber = first.invoiceNumber || '';
    palletForm.header = {
      palletNumber,
      type: first.type || '',
      cutCode: String(first.cutCode ?? ''),
      grade: first.grade || '',
    };
    palletForm.rows = stones.map((stone) => ({
      ...createEntryRow(),
      specLocked: true,
      type: stone.type || '',
      cutCode: String(stone.cutCode ?? ''),
      grade: stone.grade || '',
      thickness: stone.thickness ? String(Number((Number(stone.thickness) * 100).toFixed(2))) : '',
      length: stone.length ?? '',
      width: stone.width ?? '',
      quantity: String(stone.quantity ?? 1),
      notes: stone.notes || '',
      lengthInMeters: true,
      widthInMeters: true,
    }));
    renderPalletTabInPlace();
    showToast(`پالت ${palletNumber} برای ویرایش بارگذاری شد.`, 'success');
  } catch {
    showToast('دریافت اطلاعات پالت ناموفق بود. اتصال شبکه را بررسی کنید.', 'error');
  }
}

async function submitPallet() {
  const pallet = formatPallet(palletForm.header.palletNumber);
  if (!pallet) { showToast('شماره پالت را مانند A-123 وارد کنید.', 'error'); return; }

  const filled = palletForm.rows.filter((row) => !rowIsEmpty(row));
  if (filled.length === 0) { showToast('حداقل یک ردیف را کامل کنید.', 'error'); return; }

  const invalid = filled.filter((row) => {
    const spec = specOfRow(row);
    return !spec.type || String(spec.cutCode).trim() === ''
      || !(Number(row.length) > 0) || !(Number(row.width) > 0) || !(Number(row.quantity) > 0);
  });
  if (invalid.length > 0) { showToast(`${invalid.length} ردیف کامل نیست.`, 'error'); return; }

  const stamp = new Date().toISOString();
  const newStones = filled.map((row, index) => {
    const spec = specOfRow(row);
    const { length, width } = normalizedRowDims(row);
    const quantity = Number(row.quantity);
    return {
      id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
      palletNumber: pallet,
      type: spec.type,
      cutCode: spec.cutCode,
      grade: spec.grade,
      notes: row.notes,
      invoiceNumber: palletForm.invoiceNumber || '',
      thickness: String(row.thickness).trim() === '' ? 0 : Number(row.thickness) / 100,
      length,
      width,
      quantity,
      area: Number((length * width * quantity).toFixed(2)),
      createdAt: stamp,
      enteredBy: state.operator,
    };
  });

  const editingPalletNumber = palletForm.editingPalletNumber;
  palletForm.submitting = true;
  renderPalletTabInPlace();
  try {
    await postJson('/api/pallets', { palletNumber: pallet, editingPalletNumber, stones: newStones });
    palletForm.lastSaved = { palletNumber: pallet, count: newStones.length, area: newStones.reduce((s, x) => s + x.area, 0) };
    palletForm.header = { palletNumber: '', type: palletForm.header.type, cutCode: '', grade: palletForm.header.grade };
    palletForm.rows = [createEntryRow()];
    palletForm.editingPalletNumber = null;
    palletForm.invoiceNumber = '';
    showToast(editingPalletNumber ? `پالت ${pallet} به‌روزرسانی شد.` : `پالت ${pallet} با ${newStones.length} ردیف ثبت شد.`, 'success');
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    palletForm.submitting = false;
    render();
  }
}

/* ------------------------------------------------------------------ */
/* Cutting-form entry                                                   */
/* ------------------------------------------------------------------ */

function renderCuttingTab() {
  const coups = state.reference?.coups || [];
  const stoneTypes = state.reference?.stoneTypes || [];
  const machines = state.reference?.machines || [];
  const blades = state.reference?.blades || [];
  const matchedCoup = findCoupByNumber(coups, cuttingForm.coupNumber);
  const equippedBlade = cuttingForm.machineId ? blades.find((b) => b.machineId === cuttingForm.machineId) : null;

  const headerCard = h('div', { class: 'card' }, [
    h('h2', { text: 'ثبت برش' }),
    h('p', { class: 'hint', text: 'ابتدا مشخصات برش و زمان پایان آن را ثبت کنید؛ سپس برای ثبت ابعاد اسلب‌ها به تب «ثبت تخلیه» بروید.' }),
    h('div', { class: 'field' }, [
      h('label', { text: 'تاریخ' }),
      h('input', {
        value: cuttingForm.date, placeholder: '1403/07/25',
        oninput: (e) => { cuttingForm.date = normalizeJalaliInput(e.target.value); e.target.value = cuttingForm.date; },
      }),
    ]),
    h('div', { class: 'field' }, [
      h('label', { text: 'شماره کوپ' }),
      h('input', {
        value: cuttingForm.coupNumber, placeholder: 'شماره کوپ',
        oninput: (e) => { cuttingForm.coupNumber = e.target.value; renderCuttingTabInPlace(); },
      }),
    ]),
    cuttingForm.coupNumber.trim() !== ''
      ? (matchedCoup
        ? h('p', { class: 'hint', style: 'color:var(--success)', text: `✓ حواله ${matchedCoup.waybillNumber} · ${matchedCoup.type} · ${coupFormatLabel(matchedCoup.coupFormat)}` })
        : h('p', { class: 'hint', text: 'در حواله‌ها یافت نشد — اطلاعات را دستی وارد کنید' }))
      : null,
    !matchedCoup && cuttingForm.coupNumber.trim() !== ''
      ? h('div', {}, [
        h('div', { class: 'field' }, [
          h('label', { text: 'نوع سنگ (دستی)' }),
          h('select', { onchange: (e) => { cuttingForm.manualType = e.target.value; } }, [
            h('option', { value: '', text: 'انتخاب کنید' }),
            ...stoneTypes.map((t) => h('option', { value: t, text: t, selected: t === cuttingForm.manualType ? true : null })),
          ]),
        ]),
        h('div', { class: 'field' }, [
          h('label', { text: 'فرمت کوپ (دستی)' }),
          h('select', { onchange: (e) => { cuttingForm.manualFormat = e.target.value; } }, [
            h('option', { value: '', text: 'انتخاب کنید' }),
            ...COUP_FORMATS.map((f) => h('option', { value: f.value, text: f.label, selected: f.value === cuttingForm.manualFormat ? true : null })),
          ]),
        ]),
        h('div', { class: 'field' }, [
          h('label', { text: 'شماره حواله (دستی)' }),
          h('input', { value: cuttingForm.manualWaybill, oninput: (e) => { cuttingForm.manualWaybill = e.target.value; } }),
        ]),
      ])
      : null,
    h('div', { class: 'field' }, [
      h('label', { text: 'دستگاه برش' }),
      machines.length === 0
        ? h('p', { class: 'hint', text: 'ابتدا از برنامه‌ی اصلی یک دستگاه در تنظیمات اضافه کنید.' })
        : h('select', { onchange: (e) => { cuttingForm.machineId = e.target.value; renderCuttingTabInPlace(); } }, [
          h('option', { value: '', text: 'انتخاب کنید' }),
          ...machines.map((m) => h('option', { value: m.id, text: m.name, selected: m.id === cuttingForm.machineId ? true : null })),
        ]),
    ]),
    cuttingForm.machineId
      ? h('p', { class: 'hint', text: `تیغه‌ی نصب‌شده: ${equippedBlade ? equippedBlade.name : 'بدون تیغه‌ی ثبت‌شده'}` })
      : null,
  ]);

  const timingCard = h('div', { class: 'card' }, [
    h('h2', { text: 'پایان برش' }),
    h('div', { class: 'grid-2' }, [
      h('div', { class: 'field' }, [
        h('label', { text: 'تاریخ پایان برش' }),
        h('input', { value: cuttingForm.end.date, placeholder: '1403/07/25', oninput: (e) => { cuttingForm.end.date = normalizeJalaliInput(e.target.value); e.target.value = cuttingForm.end.date; } }),
      ]),
      h('div', { class: 'field' }, [
        h('label', { text: 'ساعت پایان برش' }),
        h('input', { type: 'time', value: cuttingForm.end.time, oninput: (e) => { cuttingForm.end.time = e.target.value; } }),
      ]),
    ]),
    h('button', { class: 'primary', text: 'ادامه به ثبت تخلیه', onclick: continueToUnloading }),
  ]);

  return h('div', {}, [headerCard, timingCard]);
}

function renderUnloadingTab() {
  const slabCards = cuttingForm.slabs.map((row, index) => h('div', { class: 'row-card' }, [
    h('div', { class: 'row-head' }, [
      h('span', { class: 'row-spec', text: `ردیف ${index + 1}` }),
      cuttingForm.slabs.length > 1 ? h('button', { class: 'row-remove', text: '×', onclick: () => { cuttingForm.slabs = cuttingForm.slabs.filter((r) => r !== row); renderCuttingTabInPlace(); } }) : null,
    ]),
    h('div', { class: 'grid-3' }, [
      h('div', { class: 'field' }, [
        h('label', { text: 'طول (cm)' }),
        h('input', {
          type: 'number', inputmode: 'decimal', value: row.length,
          oninput: (e) => { row.length = e.target.value; row.lengthInMeters = false; },
          onblur: (e) => { Object.assign(row, convertDimensionOnBlur(row, 'length')); e.target.value = row.length; renderCuttingTabInPlace(); },
        }),
      ]),
      h('div', { class: 'field' }, [
        h('label', { text: 'عرض (cm)' }),
        h('input', {
          type: 'number', inputmode: 'decimal', value: row.width,
          oninput: (e) => { row.width = e.target.value; row.widthInMeters = false; },
          onblur: (e) => { Object.assign(row, convertDimensionOnBlur(row, 'width')); e.target.value = row.width; renderCuttingTabInPlace(); },
        }),
      ]),
      h('div', { class: 'field' }, [
        h('label', { text: 'ضخامت (cm)' }),
        h('input', { type: 'number', inputmode: 'decimal', value: row.thickness, oninput: (e) => { row.thickness = e.target.value; } }),
      ]),
    ]),
    h('div', { class: 'field' }, [
      h('label', { text: 'تعداد' }),
      h('input', { type: 'number', inputmode: 'numeric', value: row.quantity, oninput: (e) => { row.quantity = e.target.value; } }),
    ]),
    h('div', { class: 'row-area', text: `مساحت: ${num(slabArea(row))} m²` }),
  ]));

  const totalArea = cuttingForm.slabs.filter((row) => !slabRowIsEmpty(row)).reduce((sum, row) => sum + slabArea(row), 0);
  const slabsCard = h('div', { class: 'card' }, [
    h('h2', { text: 'ثبت تخلیه' }),
    h('p', { class: 'hint', text: `کوپ: ${cuttingForm.coupNumber || 'ثبت نشده'} — ابعاد و تعداد اسلب‌های تخلیه‌شده را وارد کنید.` }),
    ...slabCards,
    h('button', { class: 'add-row-btn', text: '+ افزودن ردیف', onclick: () => { cuttingForm.slabs.push(createSlabRow()); renderCuttingTabInPlace(); } }),
    h('p', { class: 'hint', text: `مساحت کل: ${num(totalArea)} m²` }),
  ]);

  const timingCard = h('div', { class: 'card' }, [
    h('h2', { text: 'پایان تخلیه' }),
    h('div', { class: 'grid-2' }, [
      h('div', { class: 'field' }, [
        h('label', { text: 'تاریخ پایان تخلیه' }),
        h('input', { value: cuttingForm.exit.date, placeholder: '1403/07/25', oninput: (e) => { cuttingForm.exit.date = normalizeJalaliInput(e.target.value); e.target.value = cuttingForm.exit.date; } }),
      ]),
      h('div', { class: 'field' }, [
        h('label', { text: 'ساعت پایان تخلیه' }),
        h('input', { type: 'time', value: cuttingForm.exit.time, oninput: (e) => { cuttingForm.exit.time = e.target.value; } }),
      ]),
    ]),
    h('button', {
      class: 'primary', text: cuttingForm.submitting ? 'در حال ثبت…' : 'ثبت فرم برش و تخلیه', disabled: cuttingForm.submitting,
      onclick: submitCuttingForm,
    }),
  ]);

  const lastSavedCard = cuttingForm.lastSaved
    ? h('div', { class: 'card' }, [
      h('h2', { text: 'آخرین فرم ثبت‌شده' }),
      h('p', { class: 'hint', text: `ردیف #${cuttingForm.lastSaved.rowNumber} — کوپ ${cuttingForm.lastSaved.coupNumber} — ${num(cuttingForm.lastSaved.totalArea)} m²` }),
    ])
    : null;

  return h('div', {}, [slabsCard, timingCard, lastSavedCard]);
}

function renderCuttingTabInPlace() {
  const container = document.getElementById('tab-content');
  if (container) container.replaceChildren(state.tab === 'unloading' ? renderUnloadingTab() : renderCuttingTab());
}

function getCuttingSetup() {
  const isoDate = jalaliStringToIso(cuttingForm.date);
  if (!isoDate) { showToast('تاریخ برش معتبر نیست.', 'error'); return null; }
  if (!cuttingForm.coupNumber.trim()) { showToast('شماره کوپ را وارد کنید.', 'error'); return null; }

  const machines = state.reference?.machines || [];
  const blades = state.reference?.blades || [];
  const selectedMachine = machines.find((machine) => machine.id === cuttingForm.machineId);
  if (!selectedMachine) { showToast('دستگاه برش را انتخاب کنید.', 'error'); return null; }

  const matchedCoup = findCoupByNumber(state.reference?.coups || [], cuttingForm.coupNumber);
  const type = matchedCoup ? matchedCoup.type : cuttingForm.manualType.trim();
  if (!type) { showToast('نوع کوپ مشخص نیست. نوع را دستی انتخاب کنید.', 'error'); return null; }

  return {
    isoDate,
    selectedMachine,
    equippedBlade: blades.find((blade) => blade.machineId === selectedMachine.id) || null,
    matchedCoup,
    type,
  };
}

function continueToUnloading() {
  if (!getCuttingSetup()) return;
  state.tab = 'unloading';
  render();
}

function manualStamp(value) {
  return value.date || value.time ? { date: jalaliStringToIso(value.date) || '', time: value.time } : null;
}

async function submitCuttingForm() {
  const setup = getCuttingSetup();
  if (!setup) return;
  const { isoDate, selectedMachine, equippedBlade, matchedCoup, type } = setup;
  const waybillNumber = matchedCoup ? matchedCoup.waybillNumber : cuttingForm.manualWaybill.trim();
  const approxWeight = matchedCoup ? matchedCoup.approxWeight : (cuttingForm.manualWeight === '' ? null : Number(cuttingForm.manualWeight));
  const coupFormat = matchedCoup ? matchedCoup.coupFormat : cuttingForm.manualFormat;

  const filledSlabs = cuttingForm.slabs.filter((row) => !slabRowIsEmpty(row));
  const invalidSlab = filledSlabs.find((row) => !(Number(row.length) > 0) || !(Number(row.width) > 0) || !(Number(row.quantity) > 0));
  if (invalidSlab) { showToast('طول، عرض و تعداد هر ردیف پرشده باید بزرگ‌تر از صفر باشد.', 'error'); return; }

  const totalArea = filledSlabs.reduce((sum, row) => sum + slabArea(row), 0);

  const record = {
    date: isoDate,
    coupNumber: cuttingForm.coupNumber.trim(),
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
    totalArea: Number(totalArea.toFixed(2)),
    endCut: manualStamp(cuttingForm.end),
    exitProcessing: manualStamp(cuttingForm.exit),
    enteredBy: state.operator,
  };

  cuttingForm.submitting = true;
  renderCuttingTabInPlace();
  try {
    const result = await postJson('/api/cutting-forms', record);
    cuttingForm.lastSaved = { rowNumber: result.record.rowNumber, coupNumber: result.record.coupNumber, totalArea: result.record.totalArea };
    cuttingForm.date = todayJalaliString();
    cuttingForm.coupNumber = ''; cuttingForm.machineId = '';
    cuttingForm.manualType = ''; cuttingForm.manualWaybill = ''; cuttingForm.manualWeight = ''; cuttingForm.manualFormat = '';
    cuttingForm.slabs = [createSlabRow()];
    cuttingForm.end = { date: '', time: '' }; cuttingForm.exit = { date: '', time: '' };
    showToast(`فرم برش #${result.record.rowNumber} ثبت شد.`, 'success');
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    cuttingForm.submitting = false;
    render();
  }
}

/* ------------------------------------------------------------------ */
/* Shell / render                                                       */
/* ------------------------------------------------------------------ */

function render() {
  root.replaceChildren();

  if (state.loadError) {
    root.appendChild(h('div', { class: 'picker-screen' }, [
      h('h1', { text: 'DEPO' }),
      h('p', { text: state.loadError }),
      h('button', { class: 'primary', text: 'تلاش دوباره', onclick: loadReference }),
    ]));
    return;
  }

  if (!state.reference) {
    root.appendChild(h('p', { class: 'loading', text: 'در حال بارگذاری…' }));
    return;
  }

  if (!state.operator) {
    root.appendChild(renderOperatorPicker());
    return;
  }

  const topbar = h('div', { class: 'topbar' }, [
    h('span', { class: 'brand', text: 'DEPO' }),
    h('span', { class: 'operator' }, [
      h('span', { text: state.operator }),
      h('button', { text: 'تغییر کاربر', onclick: () => { state.operator = ''; localStorage.removeItem(OPERATOR_KEY); render(); } }),
    ]),
  ]);

  const tabs = h('div', { class: 'tabs' }, [
    h('button', { class: `tab-btn ${state.tab === 'pallet' ? 'active' : ''}`, text: 'ثبت پالت', onclick: () => { state.tab = 'pallet'; render(); } }),
    h('button', { class: `tab-btn ${state.tab === 'cutting' ? 'active' : ''}`, text: 'ثبت برش', onclick: () => { state.tab = 'cutting'; render(); } }),
    h('button', { class: `tab-btn ${state.tab === 'unloading' ? 'active' : ''}`, text: 'ثبت تخلیه', onclick: () => { state.tab = 'unloading'; render(); } }),
  ]);

  const content = h('main', { id: 'tab-content' }, [
    state.tab === 'pallet' ? renderPalletTab() : state.tab === 'cutting' ? renderCuttingTab() : renderUnloadingTab(),
  ]);

  root.appendChild(topbar);
  root.appendChild(tabs);
  root.appendChild(content);
}

/* ------------------------------------------------------------------ */
/* Boot                                                                 */
/* ------------------------------------------------------------------ */

loadReference();
subscribeToUpdates();
