/* eslint-disable no-unused-vars */
import React from 'react';
import { useAppContext } from '../app/AppContext';

/** CuttingEntryTab keeps the existing UI and behavior while isolating this tab's markup. */
export default function CuttingEntryTab() {
  const {
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
  } = useAppContext();

  return (
    <>
      <div className="space-y-5">
            <Card
              title={editingCuttingFormId ? `ویرایش فرم برش #${cuttingForms.find((f) => f.id === editingCuttingFormId)?.rowNumber ?? ''}` : `ثبت برش — ردیف #${nextCuttingRowNumber}`}
              description="شماره کوپ را وارد کنید تا نوع، حواله، فرمت و وزن به‌طور خودکار پر شود. جدول ابعاد را می‌توانید بعداً — پس از برش فیزیکی — تکمیل کنید؛ تا آن زمان فرم با جدول خالی هم قابل ثبت است. دکمه‌ی «ذخیره و چاپ» فرم را ذخیره می‌کند و بلافاصله چاپش را باز می‌کند."
              actions={(
                <>
                  <Button variant="secondary" size="sm" onClick={saveAndPrintCuttingForm}>ذخیره و چاپ</Button>
                  {editingCuttingFormId && <Button variant="secondary" size="sm" onClick={resetCuttingForm}>لغو ویرایش</Button>}
                </>
              )}
            >
              <div className="grid grid-cols-1 gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-accent)] p-4 md:grid-cols-4">
                {(() => { const machineFieldIndex = matchedCutCoup ? 2 : 4; return (
                <>
                <div data-cf-field="0" onKeyDown={(e) => handleFlatEnter(e, 'data-cf-field', 0, machineFieldIndex)}>
                  <JalaliDateField label="تاریخ" value={cfDate} onChange={setCfDate} />
                </div>
                <div data-cf-field="1" onKeyDown={(e) => handleFlatEnter(e, 'data-cf-field', 1, machineFieldIndex)}>
                  <Field label="شماره کوپ">
                    <Input list="coup-options" value={cfCoupNumber} onChange={(e) => setCfCoupNumber(e.target.value)} placeholder="شماره کوپ" className="num text-center" autoFocus />
                    {cfCoupNumber.trim() !== '' && (
                      matchedCutCoup ? (
                        <span className="mt-1 block text-[11px] text-[var(--success)]">
                          ✓ حواله {matchedCutCoup.waybillNumber} · {matchedCutCoup.type} · {coupFormatLabel(matchedCutCoup.coupFormat)} · {num(matchedCutCoup.approxWeight)} تن
                        </span>
                      ) : (
                        <span className="mt-1 block text-[11px] text-[var(--text-subtle)]">در حواله‌ها یافت نشد — اطلاعات را دستی وارد کنید</span>
                      )
                    )}
                  </Field>
                </div>
                {!matchedCutCoup && cfCoupNumber.trim() !== '' && (
                  <>
                    <div data-cf-field="2" onKeyDown={(e) => handleFlatEnter(e, 'data-cf-field', 2, machineFieldIndex)}>
                      <Field label="نوع سنگ (دستی)">
                        <Select value={cfManualType} onChange={(e) => setCfManualType(e.target.value)}>
                          <option value="">انتخاب کنید</option>
                          {stoneTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                        </Select>
                      </Field>
                    </div>
                    <div data-cf-field="3" onKeyDown={(e) => handleFlatEnter(e, 'data-cf-field', 3, machineFieldIndex)}>
                      <Field label="فرمت کوپ (دستی)">
                        <Select value={cfManualFormat} onChange={(e) => setCfManualFormat(e.target.value)}>
                          <option value="">انتخاب کنید</option>
                          {COUP_FORMATS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                        </Select>
                      </Field>
                    </div>
                    <Field label="شماره حواله (دستی)">
                      <Input value={cfManualWaybill} onChange={(e) => setCfManualWaybill(e.target.value)} />
                    </Field>
                  </>
                )}
                <div data-cf-field={machineFieldIndex} onKeyDown={(e) => handleFlatEnter(e, 'data-cf-field', machineFieldIndex, machineFieldIndex, () => document.querySelector('[data-slab-row="0"][data-slab-field="0"] input')?.focus())}>
                  <Field label="دستگاه برش" hint={machines.length === 0 ? 'ابتدا از تب «تنظیمات» یک دستگاه اضافه کنید' : undefined}>
                    <Select value={cfMachineId} onChange={(e) => setCfMachineId(e.target.value)} disabled={machines.length === 0}>
                      <option value="">انتخاب کنید</option>
                      {machines.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </Select>
                  </Field>
                  {cfMachineId && (
                    <span className="mt-1 block text-[11px] text-[var(--text-muted)]">
                      تیغه‌ی نصب‌شده: {equippedBlade ? equippedBlade.name : 'بدون تیغه‌ی ثبت‌شده'}
                    </span>
                  )}
                </div>
                </>
                ); })()}
              </div>

              <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--border)]">
                <table className="w-full min-w-[560px] text-sm">
                  <thead className="bg-[var(--surface-sunken)] text-xs text-[var(--text-muted)]">
                    <tr>
                      <th className="w-10 px-2 py-2 text-center font-medium">#</th>
                      <th className="px-2 py-2 text-center font-medium">طول (cm)</th>
                      <th className="px-2 py-2 text-center font-medium">عرض (cm)</th>
                      <th className="px-2 py-2 text-center font-medium">ضخامت (cm)</th>
                      <th className="px-2 py-2 text-center font-medium">تعداد</th>
                      <th className="px-2 py-2 text-center font-medium">مساحت</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {cfSlabs.map((row, index) => (
                      <tr key={row.key} className="border-t border-[var(--border)] hover:bg-[var(--surface-sunken)]">
                        <td className="num px-2 py-1.5 text-center text-xs text-[var(--text-subtle)]">{index + 1}</td>
                        <td className="px-1 py-1.5" data-slab-row={index} data-slab-field="0" onKeyDown={(e) => handleGridEnter(e, 'data-slab-row', 'data-slab-field', index, 0, 4, addSlabRow)}>
                          <Input type="number" numeric step="0.1" value={row.length} onChange={(e) => updateSlabRow(row.key, 'length', e.target.value)} onBlur={() => convertSlabOnBlur(row.key, 'length')} />
                        </td>
                        <td className="px-1 py-1.5" data-slab-row={index} data-slab-field="1" onKeyDown={(e) => handleGridEnter(e, 'data-slab-row', 'data-slab-field', index, 1, 4, addSlabRow)}>
                          <Input type="number" numeric step="0.1" value={row.width} onChange={(e) => updateSlabRow(row.key, 'width', e.target.value)} onBlur={() => convertSlabOnBlur(row.key, 'width')} />
                        </td>
                        <td className="px-1 py-1.5" data-slab-row={index} data-slab-field="2" onKeyDown={(e) => handleGridEnter(e, 'data-slab-row', 'data-slab-field', index, 2, 4, addSlabRow)}>
                          <Input type="number" numeric step="0.1" value={row.thickness} onChange={(e) => updateSlabRow(row.key, 'thickness', e.target.value)} />
                        </td>
                        <td className="px-1 py-1.5" data-slab-row={index} data-slab-field="3" onKeyDown={(e) => handleGridEnter(e, 'data-slab-row', 'data-slab-field', index, 3, 4, (rowIndex) => { addSlabRow(); requestAnimationFrame(() => document.querySelector(`[data-slab-row="${rowIndex + 1}"][data-slab-field="0"] input`)?.focus()); })}>
                          <Input type="number" numeric min="1" step="1" value={row.quantity} onChange={(e) => updateSlabRow(row.key, 'quantity', e.target.value)} />
                        </td>
                        <td className="num px-2 py-1.5 text-center text-xs font-semibold">{num(slabArea(row))}</td>
                        <td className="px-1 py-1.5"><button type="button" onClick={() => removeSlabRow(row.key)} className="h-7 w-7 rounded text-[var(--text-subtle)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]" aria-label={`حذف ردیف ${index + 1}`}>×</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-[var(--text-subtle)]">طول و عرض به سانتی‌متر وارد و با خروج از فیلد به متر تبدیل می‌شوند. جدول را می‌توانید خالی بگذارید و بعداً تکمیل کنید. مساحت = طول × عرض × تعداد.</p>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                {[
                  { label: 'شروع برش', stamp: editingCuttingRecord?.startCut, hint: 'با ذخیره‌ی دستگاه برش ثبت می‌شود' },
                  { label: 'ورود به خط فراوری', stamp: editingCuttingRecord?.entryProcessing, hint: 'با ذخیره‌ی اولین ابعاد و تعداد ثبت می‌شود' },
                ].map(({ label, stamp, hint }) => (
                  <div key={label} className="rounded-lg border border-[var(--border)] bg-[var(--surface-sunken)] p-3">
                    <p className="mb-1 text-sm font-medium">{label}</p>
                    {stamp ? (
                      <p className="num text-sm text-[var(--success)]">{isoToJalaliString(stamp.date)} — {stamp.time}</p>
                    ) : (
                      <p className="text-xs text-[var(--text-subtle)]">هنوز ثبت نشده · {hint}</p>
                    )}
                  </div>
                ))}
                {[
                  { label: 'پایان برش', value: cfEnd, setValue: setCfEnd },
                  { label: 'خروج از خط فراوری', value: cfExit, setValue: setCfExit },
                ].map(({ label, value, setValue }) => (
                  <div key={label} className="rounded-lg border border-[var(--border)] p-3">
                    <p className="mb-2 text-sm font-medium">{label}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <JalaliDateField label="تاریخ" value={value.date} onChange={(v) => setValue((p) => ({ ...p, date: v }))} />
                      <Field label="ساعت">
                        <Input type="time" value={value.time} onChange={(e) => setValue((p) => ({ ...p, time: e.target.value }))} className="num text-center" />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
                <div className="flex items-center gap-4">
                  <Button variant="secondary" onClick={addSlabRow}>افزودن ردیف</Button>
                  <span className="num text-xs text-[var(--text-muted)]">مساحت کل: {num(cfTotalArea)} m²</span>
                </div>
                <Button variant="primary" size="lg" onClick={saveCuttingForm}>{editingCuttingFormId ? 'ذخیره تغییرات' : 'ثبت فرم برش'}</Button>
              </div>
            </Card>

            {lastSavedCuttingForm && (
              <Card
                title="آخرین فرم برش ثبت‌شده"
                actions={<Button variant="secondary" size="sm" onClick={() => printCuttingForm(lastSavedCuttingForm)}>چاپ فرم برش</Button>}
              >
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  <Stat label="ردیف" value={`#${lastSavedCuttingForm.rowNumber}`} />
                  <Stat label="کوپ" value={lastSavedCuttingForm.coupNumber} />
                  <Stat label="دستگاه" value={lastSavedCuttingForm.cuttingMachine} detail={lastSavedCuttingForm.bladeName ? `تیغه: ${lastSavedCuttingForm.bladeName}` : undefined} />
                  <Stat label="مساحت کل" value={num(lastSavedCuttingForm.totalArea)} unit="m²" />
                </div>
              </Card>
            )}
          </div>
    </>
  );
}
