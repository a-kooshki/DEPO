/* eslint-disable no-unused-vars */
import React from 'react';
import { useAppContext } from '../app/AppContext';

/** ContractListTab keeps the existing UI and behavior while isolating this tab's markup. */
export default function ContractListTab() {
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
            title="قراردادها"
            description="روی هر قرارداد کلیک کنید تا حواله‌های مربوط، تناژ و تعداد کوپ باقی‌مانده نمایش داده شود."
            actions={
              <div className="w-60">
                <Input value={contractQuery} onChange={(e) => setContractQuery(e.target.value)} placeholder="جستجو: شماره، معدن، نوع سنگ…" />
              </div>
            }
          >
            {filteredContracts.length === 0 ? (
              <EmptyState title="قراردادی پیدا نشد" description={contracts.length === 0 ? 'از تب «ثبت قرارداد» شروع کنید.' : 'عبارت جستجو را تغییر دهید.'} />
            ) : (
              <div className="space-y-3">
                {filteredContracts.map((contract) => {
                  const stats = contractStats.get(contract.id);
                  const expanded = expandedContractId === contract.id;
                  return (
                    <section key={contract.id} className="rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                      <header
                        className="flex flex-wrap cursor-pointer items-center justify-between gap-3 px-4 py-3"
                        onClick={() => setExpandedContractId(expanded ? null : contract.id)}
                      >
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="num text-sm font-semibold">قرارداد {contract.contractNumber}</span>
                          <Badge tone={contract.status === 'active' ? 'success' : 'danger'}>{contract.status === 'active' ? 'فعال' : 'غیرفعال'}</Badge>
                          <span className="text-xs text-[var(--text-muted)]">{contract.mineName} · {contract.stoneType} · {coupFormatLabel(contract.coupFormat)}</span>
                          <span className="num text-xs text-[var(--text-muted)]">فی: {formatRial(contract.pricePerTon)} ریال</span>
                        </div>
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <Button size="sm" variant={contract.status === 'active' ? 'ghost' : 'secondary'} onClick={() => toggleContractStatus(contract)}>
                            {contract.status === 'active' ? 'غیرفعال کردن' : 'فعال کردن'}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => editContract(contract)}>ویرایش</Button>
                          <Button size="sm" variant="ghost" className="text-[var(--danger)] hover:bg-[var(--danger-soft)]" onClick={() => deleteContract(contract)}>حذف</Button>
                        </div>
                      </header>

                      {expanded && stats && (
                        <div className="border-t border-[var(--border)] px-4 py-4">
                          <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                            <Stat label="تناژ مصرف‌شده / کل" value={`${num(stats.tonnageUsed)} / ${num(contract.totalTonnage)}`} unit="تن" />
                            <Stat label="تناژ باقی‌مانده" value={num(stats.tonnageRemaining)} unit="تن" />
                            <Stat label="کوپ رسیده / کل" value={`${stats.coupsArrived} / ${contract.coupCount}`} />
                            <Stat label="کوپ باقی‌مانده در معدن" value={Math.max(0, stats.coupsRemaining)} />
                            <Stat label="ارزش کل قرارداد" value={formatRial(contract.totalTonnage * contract.pricePerTon)} unit="ریال" />
                            <Stat label="ارزش باقی‌مانده" value={formatRial(Math.max(0, stats.tonnageRemaining) * contract.pricePerTon)} unit="ریال" />
                          </div>
                          <div className="mb-4 space-y-2">
                            <div>
                              <div className="mb-1 flex justify-between text-xs text-[var(--text-muted)]"><span>پیشرفت تناژ</span><span className="num">{stats.tonnagePct.toFixed(0)}%</span></div>
                              <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-sunken)]"><div className="h-full bg-[var(--primary)]" style={{ width: `${stats.tonnagePct}%` }} /></div>
                            </div>
                            <div>
                              <div className="mb-1 flex justify-between text-xs text-[var(--text-muted)]"><span>پیشرفت تعداد کوپ</span><span className="num">{stats.coupPct.toFixed(0)}%</span></div>
                              <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-sunken)]"><div className="h-full bg-[var(--accent)]" style={{ width: `${stats.coupPct}%` }} /></div>
                            </div>
                          </div>
                          {stats.relatedWaybills.length === 0 ? (
                            <EmptyState title="هنوز حواله‌ای با این قرارداد ثبت نشده" />
                          ) : (
                            <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
                              <table className="w-full min-w-[500px] text-sm">
                                <thead className="bg-[var(--surface-sunken)] text-xs text-[var(--text-muted)]">
                                  <tr>
                                    <th className="px-3 py-2 text-center font-medium">شماره حواله</th>
                                    <th className="px-3 py-2 text-center font-medium">تاریخ</th>
                                    <th className="px-3 py-2 text-center font-medium">تعداد کوپ</th>
                                    <th className="px-3 py-2 text-center font-medium">وزن (تن)</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {stats.relatedWaybills.map((w) => (
                                    <tr key={w.id} className="border-t border-[var(--border)]">
                                      <td className="num px-3 py-1.5 text-center font-medium">{w.waybillNumber}</td>
                                      <td className="px-3 py-1.5 text-center">{isoToJalaliString(w.date)}</td>
                                      <td className="num px-3 py-1.5 text-center">{w.coups.length}</td>
                                      <td className="num px-3 py-1.5 text-center">{num(w.totalWeight)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            )}
          </Card>
    </>
  );
}
