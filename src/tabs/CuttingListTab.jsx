/* eslint-disable no-unused-vars */
import React from 'react';
import { useAppContext } from '../app/AppContext';

/** CuttingListTab keeps the existing UI and behavior while isolating this tab's markup. */
export default function CuttingListTab() {
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
      <Card
            title="فرم‌های برش"
            description="جستجو، ویرایش، چاپ و حذف فرم‌های برش."
            actions={
              <div className="w-60">
                <Input value={cuttingQuery} onChange={(e) => setCuttingQuery(e.target.value)} placeholder="جستجو: ردیف، کوپ، حواله، دستگاه…" />
              </div>
            }
          >
            {filteredCuttingForms.length === 0 ? (
              <EmptyState title="فرمی پیدا نشد" description={cuttingForms.length === 0 ? 'از تب «ثبت برش» شروع کنید.' : 'عبارت جستجو را تغییر دهید.'} />
            ) : (
              <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
                <table className="w-full min-w-[880px] text-sm">
                  <thead className="bg-[var(--surface-sunken)] text-xs text-[var(--text-muted)]">
                    <tr>
                      {['#', 'تاریخ', 'کوپ', 'حواله', 'نوع', 'فرمت', 'دستگاه', 'تیغه', 'مساحت (m²)', 'وضعیت', ''].map((h) => (
                        <th key={h} className="px-3 py-2 text-center font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCuttingForms.map((form) => {
                      return (
                        <tr key={form.id} className="border-t border-[var(--border)] hover:bg-[var(--surface-sunken)]">
                          <td className="num px-3 py-1.5 text-center font-semibold">{form.rowNumber}</td>
                          <td className="px-3 py-1.5 text-center">{isoToJalaliString(form.date)}</td>
                          <td className="num px-3 py-1.5 text-center">{form.coupNumber}</td>
                          <td className="num px-3 py-1.5 text-center">{form.waybillNumber || '—'}</td>
                          <td className="px-3 py-1.5 text-center">{form.type}</td>
                          <td className="px-3 py-1.5 text-center">{coupFormatLabel(form.coupFormat)}</td>
                          <td className="num px-3 py-1.5 text-center">{form.cuttingMachine}</td>
                          <td className="num px-3 py-1.5 text-center">{form.bladeName || '—'}</td>
                          <td className="num px-3 py-1.5 text-center font-semibold">{num(form.totalArea)}</td>
                          <td className="px-3 py-1.5 text-center">
                            {form.exitProcessing ? <Badge tone="success">خارج از خط فراوری</Badge>
                              : form.endCut ? <Badge tone="accent">بریده‌شده</Badge>
                              : <Badge tone="neutral">در جریان</Badge>}
                          </td>
                          <td className="px-3 py-1.5">
                            <div className="flex flex-wrap justify-center gap-1.5">
                              <Button size="sm" variant="secondary" onClick={() => printCuttingForm(form)}>چاپ</Button>
                              <Button size="sm" variant="ghost" onClick={() => editCuttingForm(form)}>ویرایش</Button>
                              <Button size="sm" variant="ghost" className="text-[var(--danger)] hover:bg-[var(--danger-soft)]" onClick={() => deleteCuttingForm(form)}>حذف</Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
    </>
  );
}
