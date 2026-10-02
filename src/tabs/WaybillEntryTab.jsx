/* eslint-disable no-unused-vars */
import React from 'react';
import { useAppContext } from '../app/AppContext';

/** WaybillEntryTab keeps the existing UI and behavior while isolating this tab's markup. */
export default function WaybillEntryTab() {
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
              title={editingWaybillId ? `ویرایش حواله ${wbNumber}` : 'ثبت حواله'}
              description="ابتدا قرارداد را انتخاب کنید تا معدن، نوع سنگ و فرمت کوپ خودکار پر شوند. مجموع وزن تقریبی کوپ‌ها باید دقیقاً با وزن کل برابر باشد."
              actions={editingWaybillId && <Button variant="secondary" size="sm" onClick={resetWaybillForm}>لغو ویرایش</Button>}
            >
              {activeContracts.length === 0 && (
                <div className="mb-4 rounded-lg border border-[#ecd9b4] bg-[var(--accent-soft)] px-4 py-2.5 text-sm text-[var(--accent)]">
                  هیچ قرارداد فعالی ثبت نشده است. ابتدا از تب «ثبت قرارداد» یک قرارداد ثبت کنید.
                </div>
              )}
              <div className="grid grid-cols-1 gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-accent)] p-4 md:grid-cols-4">
                <div data-wb-field="0" onKeyDown={(e) => handleFlatEnter(e, 'data-wb-field', 0, 6)}>
                  <Field label="شماره حواله">
                    <Input value={wbNumber} onChange={(e) => setWbNumber(e.target.value)} placeholder="1234" className="num" autoFocus />
                  </Field>
                </div>
                <div data-wb-field="1" onKeyDown={(e) => handleFlatEnter(e, 'data-wb-field', 1, 6)}>
                  <JalaliDateField label="تاریخ حواله" value={wbDate} onChange={setWbDate} />
                </div>
                <div data-wb-field="2" onKeyDown={(e) => handleFlatEnter(e, 'data-wb-field', 2, 6)}>
                  <Field label="قرارداد">
                    <Select value={wbContractNumber} onChange={(e) => handleContractSelect(e.target.value)}>
                      <option value="">انتخاب کنید</option>
                      {selectedContract === null && wbContractNumber && (
                        <option value={wbContractNumber} disabled>{wbContractNumber} (غیرفعال/نامعتبر)</option>
                      )}
                      {activeContracts.map((c) => <option key={c.id} value={c.contractNumber}>{c.contractNumber} — {c.mineName}</option>)}
                    </Select>
                  </Field>
                </div>
                <div data-wb-field="3" onKeyDown={(e) => handleFlatEnter(e, 'data-wb-field', 3, 6)}>
                  <Field label="شماره پلاک ماشین" hint="۵ رقم">
                    <Input value={wbPlate} onChange={(e) => setWbPlate(normalizePlateInput(e.target.value))} placeholder="12345" className="num text-center" />
                  </Field>
                </div>
                <div data-wb-field="4" onKeyDown={(e) => handleFlatEnter(e, 'data-wb-field', 4, 6)}>
                  <Field label="نام راننده">
                    <Input value={wbDriver} onChange={(e) => setWbDriver(e.target.value)} />
                  </Field>
                </div>
                <div data-wb-field="5" onKeyDown={(e) => handleFlatEnter(e, 'data-wb-field', 5, 6)}>
                  <Field label="وزن کل حواله (تن)">
                    <Input type="number" numeric step="0.01" value={wbTotalWeight} onChange={(e) => setWbTotalWeight(e.target.value)} />
                  </Field>
                </div>
                <div data-wb-field="6" onKeyDown={(e) => handleFlatEnter(e, 'data-wb-field', 6, 6, () => document.querySelector('[data-coup-row="0"][data-coup-field="0"] input')?.focus())}>
                  <Field label="نام معدن">
                    <Input value={wbMine} onChange={(e) => setWbMine(e.target.value)} />
                  </Field>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--border)]">
                <table className="w-full min-w-[860px] text-sm">
                  <thead className="bg-[var(--surface-sunken)] text-xs text-[var(--text-muted)]">
                    <tr>
                      <th className="w-10 px-2 py-2 text-center font-medium">#</th>
                      <th className="px-2 py-2 text-center font-medium">شماره کوپ</th>
                      <th className="px-2 py-2 text-center font-medium">کد مارک</th>
                      <th className="px-2 py-2 text-center font-medium">نوع سنگ</th>
                      <th className="px-2 py-2 text-center font-medium">فرمت</th>
                      <th className="px-2 py-2 text-center font-medium">درجه کوپ</th>
                      <th className="px-2 py-2 text-center font-medium">وزن تقریبی (تن)</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {coupRows.map((row, index) => (
                      <tr key={row.key} className="border-t border-[var(--border)] hover:bg-[var(--surface-sunken)]">
                        <td className="num px-2 py-1.5 text-center text-xs text-[var(--text-subtle)]">{index + 1}</td>
                        <td className="px-1 py-1.5" data-coup-row={index} data-coup-field="0" onKeyDown={(e) => handleGridEnter(e, 'data-coup-row', 'data-coup-field', index, 0, 6, addCoupRow)}>
                          <Input value={row.coupNumber} onChange={(e) => updateCoupRow(row.key, 'coupNumber', e.target.value)} placeholder="شماره کوپ" className="num text-center" />
                        </td>
                        <td className="px-1 py-1.5" data-coup-row={index} data-coup-field="1" onKeyDown={(e) => handleGridEnter(e, 'data-coup-row', 'data-coup-field', index, 1, 6, addCoupRow)}>
                          <Input value={row.markCode} onChange={(e) => updateCoupRow(row.key, 'markCode', normalizeMarkCodeInput(e.target.value))} onBlur={() => updateCoupRow(row.key, 'markCode', formatMarkCode(row.markCode) || row.markCode)} placeholder="ABC-123" className="num text-center" />
                        </td>
                        <td className="px-1 py-1.5" data-coup-row={index} data-coup-field="2" onKeyDown={(e) => handleGridEnter(e, 'data-coup-row', 'data-coup-field', index, 2, 6, addCoupRow)}>
                          <Select value={row.type} onChange={(e) => updateCoupRow(row.key, 'type', e.target.value)}>
                            <option value="">انتخاب کنید</option>
                            {stoneTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                          </Select>
                        </td>
                        <td className="px-1 py-1.5" data-coup-row={index} data-coup-field="3" onKeyDown={(e) => handleGridEnter(e, 'data-coup-row', 'data-coup-field', index, 3, 6, addCoupRow)}>
                          <Select value={row.coupFormat} onChange={(e) => updateCoupRow(row.key, 'coupFormat', e.target.value)}>
                            <option value="">انتخاب کنید</option>
                            {COUP_FORMATS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                          </Select>
                        </td>
                        <td className="px-1 py-1.5" data-coup-row={index} data-coup-field="4" onKeyDown={(e) => handleGridEnter(e, 'data-coup-row', 'data-coup-field', index, 4, 6, addCoupRow)}>
                          <Input value={row.coupGrade} onChange={(e) => updateCoupRow(row.key, 'coupGrade', e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 1))} maxLength={1} className="text-center uppercase" placeholder="A" />
                        </td>
                        <td className="px-1 py-1.5" data-coup-row={index} data-coup-field="5" onKeyDown={(e) => handleGridEnter(e, 'data-coup-row', 'data-coup-field', index, 5, 6, (rowIndex) => { addCoupRow(); requestAnimationFrame(() => document.querySelector(`[data-coup-row="${rowIndex + 1}"][data-coup-field="0"] input`)?.focus()); })}>
                          <Input type="number" numeric step="0.01" value={row.approxWeight} onChange={(e) => updateCoupRow(row.key, 'approxWeight', e.target.value)} />
                        </td>
                        <td className="px-1 py-1.5">
                          <button type="button" onClick={() => removeCoupRow(row.key)} className="h-7 w-7 rounded text-[var(--text-subtle)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]" aria-label={`حذف ردیف ${index + 1}`}>×</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
                <Button variant="secondary" onClick={addCoupRow}>افزودن کوپ</Button>
                <div className="flex items-center gap-4">
                  <span className={`num text-sm font-medium ${weightsMatch ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                    مجموع کوپ‌ها: {num(coupWeightTotal)} / وزن کل: {num(wbTotalWeight)}
                    {!weightsMatch && Number(wbTotalWeight) > 0 && ` (اختلاف ${num(Math.abs(weightDifference))})`}
                  </span>
                  <Button variant="primary" size="lg" onClick={saveWaybill} disabled={!weightsMatch}>
                    {editingWaybillId ? 'ذخیره تغییرات' : 'ثبت حواله'}
                  </Button>
                </div>
              </div>
            </Card>

            {lastSavedWaybill && (
              <Card
                title="آخرین حواله ثبت‌شده"
                actions={<Button variant="secondary" size="sm" onClick={() => printWaybill(lastSavedWaybill)}>چاپ حواله</Button>}
              >
                <div className="mb-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                  <Stat label="شماره حواله" value={lastSavedWaybill.waybillNumber} />
                  <Stat label="تعداد کوپ" value={lastSavedWaybill.coups.length} />
                  <Stat label="وزن کل" value={num(lastSavedWaybill.totalWeight)} unit="تن" />
                  <Stat label="تاریخ" value={isoToJalaliString(lastSavedWaybill.date)} />
                </div>
              </Card>
            )}
          </div>
    </>
  );
}
