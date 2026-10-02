/* eslint-disable no-unused-vars */
import React from 'react';
import { useAppContext } from '../app/AppContext';

/** InventoryTab keeps the existing UI and behavior while isolating this tab's markup. */
export default function InventoryTab() {
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
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Stat label="پالت‌های نتیجه" value={searchTotals.pallets} />
              <Stat label="ردیف‌ها" value={filteredStones.length} />
              <Stat label="تعداد قطعات" value={searchTotals.pieces} />
              <Stat label="متراژ نتایج" value={num(searchTotals.area)} unit="m²" />
            </div>

            <Card
              title="فیلترها"
              description={activeFilterCount > 0 ? `${activeFilterCount} فیلتر فعال است.` : 'برای محدود کردن نتایج، فیلترها را تنظیم کنید.'}
              actions={
                <>
                  <Button variant="ghost" size="sm" onClick={resetFilters} disabled={activeFilterCount === 0}>پاک‌کردن فیلترها</Button>
                  <Button variant="secondary" size="sm" onClick={printSearchReport}>چاپ گزارش</Button>
                </>
              }
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-4">
                <Field label="نوع سنگ">
                  <Select value={filters.type} onChange={(e) => updateFilter('type', e.target.value)}>
                    <option value="">همه</option>
                    {stoneTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                  </Select>
                </Field>
                <Field label="شماره پالت">
                  <Input value={filters.palletNumber} onChange={(e) => updateFilter('palletNumber', e.target.value)} placeholder="A-123" className="num" />
                </Field>
                <Field label="درجه">
                  <Input maxLength={1} value={filters.grade} onChange={(e) => updateFilter('grade', e.target.value.toUpperCase())} className="text-center uppercase" />
                </Field>
                <Field label="کد کوپ">
                  <Input value={filters.cutCode} onChange={(e) => updateFilter('cutCode', e.target.value)} placeholder="شماره کوپ" />
                </Field>
                <Field label="طول (متر)">
                  <div className="flex gap-2">
                    <Input type="number" numeric step="0.01" placeholder="از" value={filters.minLength} onChange={(e) => updateFilter('minLength', e.target.value)} />
                    <Input type="number" numeric step="0.01" placeholder="تا" value={filters.maxLength} onChange={(e) => updateFilter('maxLength', e.target.value)} />
                  </div>
                </Field>
                <Field label="عرض (متر)">
                  <div className="flex gap-2">
                    <Input type="number" numeric step="0.01" placeholder="از" value={filters.minWidth} onChange={(e) => updateFilter('minWidth', e.target.value)} />
                    <Input type="number" numeric step="0.01" placeholder="تا" value={filters.maxWidth} onChange={(e) => updateFilter('maxWidth', e.target.value)} />
                  </div>
                </Field>
                <Field label="ضخامت (متر)">
                  <div className="flex gap-2">
                    <Input type="number" numeric step="0.01" placeholder="از" value={filters.minThickness} onChange={(e) => updateFilter('minThickness', e.target.value)} />
                    <Input type="number" numeric step="0.01" placeholder="تا" value={filters.maxThickness} onChange={(e) => updateFilter('maxThickness', e.target.value)} />
                  </div>
                </Field>
                <Field label="شماره فاکتور">
                  <Input value={filters.invoiceNumber} onChange={(e) => updateFilter('invoiceNumber', e.target.value)} placeholder="INV-1001" />
                </Field>
              </div>
              <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" checked={filters.showSold} onChange={(e) => updateFilter('showSold', e.target.checked)} className="h-4 w-4 accent-[var(--primary)]" />
                نمایش پالت‌های فروخته‌شده
              </label>
            </Card>

            <Card title="ثبت فروش گروهی" description="پالت‌های موردنظر را از فهرست پایین انتخاب کنید، سپس شماره فاکتور را وارد کنید.">
              <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-4">
                <div className="md:col-span-2">
                  <Field label="شماره فاکتور">
                    <Input value={bulkInvoice} onChange={(e) => setBulkInvoice(e.target.value)} placeholder="INV-1001" />
                  </Field>
                </div>
                <Button variant="primary" onClick={markSold} disabled={selectedPallets.length === 0}>
                  ثبت فروش ({selectedPallets.length})
                </Button>
                <Button variant="danger" onClick={clearInvoice} disabled={selectedPallets.length === 0}>
                  برگشت از فروش
                </Button>
              </div>
            </Card>

            {inventorySummary.labels.length > 0 && (
              <Card title="متراژ به تفکیک نوع سنگ">
                <div className="h-64">
                  <Bar
                    data={{
                      labels: inventorySummary.labels,
                      datasets: [
                        { label: 'در انبار', data: inventorySummary.inStock, backgroundColor: '#1f5560', borderRadius: 3 },
                        { label: 'فروخته‌شده', data: inventorySummary.sold, backgroundColor: '#c7ced4', borderRadius: 3 },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: { stacked: true, grid: { display: false }, ticks: { color: '#5d666f' } },
                        y: { stacked: true, grid: { color: '#e7eaee' }, ticks: { color: '#5d666f' } },
                      },
                      plugins: { legend: { position: 'top', labels: { color: '#5d666f', boxWidth: 12 } } },
                    }}
                  />
                </div>
              </Card>
            )}

            <div className="space-y-3">
              {palletGroups.length > 0 && (
                <div className="flex items-center justify-between px-1">
                  <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-[var(--text-muted)]">
                    <input type="checkbox" checked={allVisibleSelected} onChange={toggleAllVisible} className="h-4 w-4 accent-[var(--primary)]" />
                    انتخاب همه‌ی {palletGroups.length} پالت نمایش‌داده‌شده
                  </label>
                  {selectedPallets.length > 0 && (
                    <button onClick={() => setSelectedPallets([])} className="text-xs text-[var(--primary)] hover:underline">
                      لغو انتخاب ({selectedPallets.length})
                    </button>
                  )}
                </div>
              )}

              {palletGroups.length === 0 ? (
                <EmptyState
                  title="نتیجه‌ای پیدا نشد"
                  description={stones.length === 0 ? 'هنوز پالتی ثبت نشده است. از تب «ثبت پالت» شروع کنید.' : 'فیلترها را تغییر دهید یا نمایش پالت‌های فروخته‌شده را روشن کنید.'}
                />
              ) : (
                palletGroups.map((group) => {
                  const invoice = getInvoice(group.palletNumber);
                  const selected = selectedPallets.includes(group.palletNumber);
                  return (
                    <section
                      key={group.palletNumber}
                      className={`rounded-lg border bg-[var(--surface)] transition-colors ${selected ? 'border-[var(--primary)] ring-1 ring-[var(--primary-soft)]' : 'border-[var(--border)]'}`}
                    >
                      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-2.5">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={(e) => togglePallet(group.palletNumber, e.target.checked)}
                            className="h-4 w-4 accent-[var(--primary)]"
                            aria-label={`انتخاب پالت ${group.palletNumber}`}
                          />
                          <span className="num text-sm font-semibold">{group.palletNumber}</span>
                          <Badge tone={invoice ? 'danger' : 'success'}>{invoice ? `فروخته‌شده · ${invoice}` : 'در انبار'}</Badge>
                          <span className="num text-xs text-[var(--text-muted)]">
                            {group.stones.length} ردیف · {group.totalCount} قطعه · {num(group.totalArea)} m²
                          </span>
                        </div>
                        <div className="flex gap-1.5">
                          <Button size="sm" variant="secondary" onClick={() => printPalletCard(group.palletNumber, group.stones, group.totalArea)}>چاپ کارت</Button>
                          <Button size="sm" variant="ghost" onClick={() => editPallet(group.palletNumber)}>ویرایش</Button>
                          <Button size="sm" variant="ghost" className="text-[var(--danger)] hover:bg-[var(--danger-soft)]" onClick={() => deletePallet(group.palletNumber)}>حذف</Button>
                        </div>
                      </header>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[820px] text-sm">
                          <thead className="bg-[var(--surface-sunken)] text-xs text-[var(--text-muted)]">
                            <tr>
                              {['نوع', 'کد کوپ', 'درجه', 'ضخامت (m)', 'طول (m)', 'عرض (m)', 'تعداد', 'متراژ (m²)', 'یادداشت'].map((h) => (
                                <th key={h} className="px-3 py-2 text-center font-medium">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {group.stones.map((stone) => (
                              <tr key={stone.id} className="border-t border-[var(--border)] hover:bg-[var(--surface-sunken)]">
                                <td className="px-3 py-1.5 text-center">{stone.type}</td>
                                <td className="num px-3 py-1.5 text-center">{stone.cutCode}</td>
                                <td className="px-3 py-1.5 text-center">{stone.grade || '—'}</td>
                                <td className="num px-3 py-1.5 text-center">{num(stone.thickness)}</td>
                                <td className="num px-3 py-1.5 text-center">{num(stone.length)}</td>
                                <td className="num px-3 py-1.5 text-center">{num(stone.width)}</td>
                                <td className="num px-3 py-1.5 text-center">{stone.quantity}</td>
                                <td className="num px-3 py-1.5 text-center font-semibold">{num(stone.area)}</td>
                                <td className="px-3 py-1.5 text-center text-xs text-[var(--text-muted)]">{stone.notes || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  );
                })
              )}
            </div>
          </div>
    </>
  );
}
