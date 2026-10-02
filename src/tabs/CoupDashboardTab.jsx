/* eslint-disable no-unused-vars */
import React from 'react';
import { useAppContext } from '../app/AppContext';

/** CoupDashboardTab keeps the existing UI and behavior while isolating this tab's markup. */
export default function CoupDashboardTab() {
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
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Stat label="موجود در انبار (بریده‌نشده)" value={coupStats.inDepot} detail={`وزن: ${num(coupStats.inDepotWeight)} تن`} />
              <Stat label="بریده‌شده" value={coupStats.cut} detail={`وزن: ${num(coupStats.cutWeight)} تن · متراژ: ${num(coupStats.cutArea)} m²`} />
              <Stat label="بریده‌شده و فروخته‌شده" value={coupStats.cutAndSold} detail={`وزن: ${num(coupStats.cutAndSoldWeight)} تن · متراژ: ${num(coupStats.soldArea)} m²`} />
            </div>

            <Card
              title="کوپ‌ها"
              description="ردیابی هر کوپ از ورود به انبار تا برش، پالت‌شدن و فروش."
              actions={
                <div className="w-64">
                  <Input value={coupQuery} onChange={(e) => setCoupQuery(e.target.value)} placeholder="جستجو: کوپ، مارک، حواله، قرارداد…" />
                </div>
              }
            >
              {filteredCoupDashboard.length === 0 ? (
                <EmptyState title="کوپی پیدا نشد" description={allCoups.length === 0 ? 'از تب «ثبت حواله» شروع کنید.' : 'عبارت جستجو را تغییر دهید.'} />
              ) : (
                <div className="space-y-3">
                  {filteredCoupDashboard.map((coup) => {
                    const stageInfo = COUP_STAGES[coup.stage];
                    return (
                      <div key={coup.id} className="rounded-lg border border-[var(--border)] p-4">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="num text-sm font-semibold">کوپ {coup.coupNumber}</span>
                            <span className="num text-xs text-[var(--text-muted)]">مارک: {coup.markCode || '—'}</span>
                            <Badge tone={stageInfo.tone}>{stageInfo.label}</Badge>
                          </div>
                          <span className="num text-xs text-[var(--text-muted)]">
                            حواله {coup.waybillNumber} · قرارداد {coup.contractNumber || '—'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs md:grid-cols-4 lg:grid-cols-6">
                          <div><span className="text-[var(--text-muted)]">نوع: </span>{coup.type}</div>
                          <div><span className="text-[var(--text-muted)]">فرمت: </span>{coupFormatLabel(coup.coupFormat)}</div>
                          <div><span className="text-[var(--text-muted)]">درجه کوپ: </span>{coup.coupGrade || '—'}</div>
                          <div><span className="text-[var(--text-muted)]">وزن: </span><span className="num">{num(coup.approxWeight)} تن</span></div>
                          <div><span className="text-[var(--text-muted)]">دستگاه برش: </span><span className="num">{coup.cuttingMachine || '—'}</span></div>
                          <div><span className="text-[var(--text-muted)]">تیغه: </span><span className="num">{coup.bladeName || '—'}</span></div>
                          <div><span className="text-[var(--text-muted)]">ضخامت برش: </span><span className="num">{coup.cutThickness != null ? num(coup.cutThickness) : '—'}</span></div>
                          <div><span className="text-[var(--text-muted)]">تعداد/متراژ برش: </span><span className="num">{coup.cutQty} / {num(coup.cutArea)} m²</span></div>
                          <div><span className="text-[var(--text-muted)]">تعداد/متراژ در پالت: </span><span className="num">{coup.palletQty} / {num(coup.palletArea)} m²</span></div>
                          <div><span className="text-[var(--text-muted)]">تعداد/متراژ فروخته‌شده: </span><span className="num">{coup.soldQty} / {num(coup.soldArea)} m²</span></div>
                          <div><span className="text-[var(--text-muted)]">درجه سنگ پس از برش: </span>{coup.stoneGrades.length > 0 ? coup.stoneGrades.join('، ') : '—'}</div>
                        </div>

                        {coup.cutArea > 0 && (
                          <div className="mt-3 space-y-1.5">
                            <div className="flex justify-between text-[11px] text-[var(--text-muted)]"><span>سهم پالت‌شده از مساحت بریده‌شده</span><span className="num">{coup.palletizedPct.toFixed(0)}%</span></div>
                            <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-sunken)]"><div className="h-full bg-[var(--primary)]" style={{ width: `${coup.palletizedPct}%` }} /></div>
                            <div className="flex justify-between text-[11px] text-[var(--text-muted)]"><span>سهم فروخته‌شده از مساحت بریده‌شده</span><span className="num">{coup.soldPct.toFixed(0)}%</span></div>
                            <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-sunken)]"><div className="h-full bg-[var(--danger)]" style={{ width: `${coup.soldPct}%` }} /></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
    </>
  );
}
