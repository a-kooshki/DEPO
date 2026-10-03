/* eslint-disable no-unused-vars */
import React from 'react';
import { useAppContext } from '../app/AppContext';

/** WaybillListTab keeps the existing UI and behavior while isolating this tab's markup. */
export default function WaybillListTab() {
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

  const reportTotalWeight = filteredWaybills.reduce((sum, waybill) => sum + Number(waybill.totalWeight || 0), 0);
  const reportTotalFreight = filteredWaybills.reduce((sum, waybill) => sum + Number(waybill.freightAmount || 0), 0);

  return (
    <>
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="حواله‌های نمایش‌داده‌شده" value={filteredWaybills.length} />
        <Stat label="وزن کل" value={num(reportTotalWeight)} unit="تن" />
        <Stat label="جمع کرایه" value={formatRial(reportTotalFreight)} unit="ریال" />
      </div>
      <Card
            title="حواله‌ها"
            description="جستجو، ویرایش، چاپ و حذف حواله‌های ثبت‌شده."
            actions={
              <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                <div className="w-60">
                  <Input value={waybillQuery} onChange={(e) => setWaybillQuery(e.target.value)} placeholder="جستجو: شماره حواله، راننده، معدن، کوپ…" />
                </div>
                <Button variant="secondary" size="sm" onClick={printWaybillReport} disabled={filteredWaybills.length === 0}>چاپ گزارش</Button>
              </div>
            }
          >
            {filteredWaybills.length === 0 ? (
              <EmptyState title="حواله‌ای پیدا نشد" description={waybills.length === 0 ? 'از تب «ثبت حواله» شروع کنید.' : 'عبارت جستجو را تغییر دهید.'} />
            ) : (
              <div className="space-y-3">
                {filteredWaybills.map((waybill) => (
                  <section key={waybill.id} className="rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <span className="num text-sm font-semibold">حواله {waybill.waybillNumber}</span>
                        <span className="text-xs text-[var(--text-muted)]">{isoToJalaliString(waybill.date)}</span>
                        <span className="num text-xs text-[var(--text-muted)]">
                          {waybill.coups.length} کوپ · {num(waybill.totalWeight)} تن
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="secondary" onClick={() => printWaybill(waybill)}>چاپ</Button>
                        <Button size="sm" variant="ghost" onClick={() => editWaybill(waybill)}>ویرایش</Button>
                        <Button size="sm" variant="ghost" className="text-[var(--danger)] hover:bg-[var(--danger-soft)]" onClick={() => deleteWaybill(waybill)}>حذف</Button>
                      </div>
                    </header>
                    <div className="grid grid-cols-2 gap-3 px-4 py-3 text-xs text-[var(--text-muted)] md:grid-cols-4">
                      <div>راننده: <span className="text-[var(--text)]">{waybill.driverName || '—'}</span></div>
                      <div>پلاک: <span className="num text-[var(--text)]">{waybill.plateNumber || '—'}</span></div>
                      <div>معدن: <span className="text-[var(--text)]">{waybill.mineName || '—'}</span></div>
                      <div>قرارداد: <span className="num text-[var(--text)]">{waybill.contractNumber || '—'}</span></div>
                      <div>فی کرایه: <span className="num text-[var(--text)]">{formatRial(waybill.freightPerTon || 0)} ریال/تن</span></div>
                      <div>کرایه حواله: <span className="num font-semibold text-[var(--primary)]">{formatRial(waybill.freightAmount || 0)} ریال</span></div>
                    </div>
                    <div className="overflow-x-auto px-4 pb-4">
                      <table className="w-full min-w-[680px] text-sm">
                        <thead className="bg-[var(--surface-sunken)] text-xs text-[var(--text-muted)]">
                          <tr>
                            <th className="px-3 py-2 text-center font-medium">شماره کوپ</th>
                            <th className="px-3 py-2 text-center font-medium">کد مارک</th>
                            <th className="px-3 py-2 text-center font-medium">نوع</th>
                            <th className="px-3 py-2 text-center font-medium">فرمت</th>
                            <th className="px-3 py-2 text-center font-medium">درجه کوپ</th>
                            <th className="px-3 py-2 text-center font-medium">وزن تقریبی (تن)</th>
                            <th className="px-3 py-2 text-center font-medium">وضعیت</th>
                          </tr>
                        </thead>
                        <tbody>
                          {waybill.coups.map((coup) => (
                            <tr key={coup.id} className="border-t border-[var(--border)]">
                              <td className="num px-3 py-1.5 text-center font-medium">{coup.coupNumber}</td>
                              <td className="num px-3 py-1.5 text-center">{coup.markCode || '—'}</td>
                              <td className="px-3 py-1.5 text-center">{coup.type}</td>
                              <td className="px-3 py-1.5 text-center">{coupFormatLabel(coup.coupFormat)}</td>
                              <td className="px-3 py-1.5 text-center">{coup.coupGrade || '—'}</td>
                              <td className="num px-3 py-1.5 text-center">{num(coup.approxWeight)}</td>
                              <td className="px-3 py-1.5 text-center">
                                {cutCoupNumbers.has(coup.coupNumber.trim().toUpperCase())
                                  ? <Badge tone="accent">برش خورده</Badge>
                                  : <Badge tone="neutral">در انتظار برش</Badge>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                ))}
              </div>
            )}
          </Card>
    </>
  );
}
