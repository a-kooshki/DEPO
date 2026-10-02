/* eslint-disable no-unused-vars */
import React from 'react';
import { useAppContext } from '../app/AppContext';

/** PalletCardTab keeps the existing UI and behavior while isolating this tab's markup. */
export default function PalletCardTab() {
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
      <Card title="کارت پالت" description="شماره پالت را وارد کنید تا محتویات آن برای چاپ آماده شود.">
            <div className="flex flex-wrap items-end gap-3">
              <div className="w-56">
                <Field label="شماره پالت">
                  <Input
                    value={cardQuery}
                    onChange={(e) => setCardQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && findPalletCard()}
                    placeholder="A-123"
                    className="num text-center"
                  />
                </Field>
              </div>
              <Button variant="primary" onClick={findPalletCard}>جستجو</Button>
              {cardPallet && (
                <Button variant="secondary" onClick={() => printPalletCard(cardPallet.palletNumber, cardPallet.stones, cardPallet.totalArea)}>
                  چاپ کارت پالت
                </Button>
              )}
            </div>

            {cardPallet && (
              <div className="mt-5">
                <div className="mb-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                  <Stat label="شماره پالت" value={cardPallet.palletNumber} />
                  <Stat label="ردیف‌ها" value={cardPallet.stones.length} />
                  <Stat label="تعداد قطعات" value={cardPallet.totalCount} />
                  <Stat label="متراژ کل" value={num(cardPallet.totalArea)} unit="m²" />
                </div>
                <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
                  <table className="w-full min-w-[720px] text-sm">
                    <thead className="bg-[var(--surface-sunken)] text-xs text-[var(--text-muted)]">
                      <tr>
                        {['#', 'نوع', 'درجه', 'ضخامت (m)', 'طول (m)', 'عرض (m)', 'تعداد', 'متراژ (m²)'].map((h) => (
                          <th key={h} className="px-3 py-2 text-center font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {cardPallet.stones.map((stone, index) => (
                        <tr key={stone.id} className="border-t border-[var(--border)]">
                          <td className="num px-3 py-1.5 text-center text-[var(--text-subtle)]">{index + 1}</td>
                          <td className="px-3 py-1.5 text-center">{stone.type}</td>
                          <td className="px-3 py-1.5 text-center">{stone.grade || '—'}</td>
                          <td className="num px-3 py-1.5 text-center">{num(stone.thickness)}</td>
                          <td className="num px-3 py-1.5 text-center">{num(stone.length)}</td>
                          <td className="num px-3 py-1.5 text-center">{num(stone.width)}</td>
                          <td className="num px-3 py-1.5 text-center">{stone.quantity}</td>
                          <td className="num px-3 py-1.5 text-center font-semibold">{num(stone.area)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Card>
    </>
  );
}
