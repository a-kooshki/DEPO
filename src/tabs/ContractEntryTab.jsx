/* eslint-disable no-unused-vars */
import React from 'react';
import { useAppContext } from '../app/AppContext';

/** ContractEntryTab keeps the existing UI and behavior while isolating this tab's markup. */
export default function ContractEntryTab() {
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
            title={editingContractId ? `ویرایش قرارداد ${ctNumber}` : 'ثبت قرارداد'}
            description="هر قرارداد بعد از ثبت به‌طور خودکار فعال است. اطلاعات این قرارداد در فرم ثبت حواله برای پرکردن خودکار معدن و نوع سنگ استفاده می‌شود."
            actions={editingContractId && <Button variant="secondary" size="sm" onClick={resetContractForm}>لغو ویرایش</Button>}
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div data-ct-field="0" onKeyDown={(e) => handleFlatEnter(e, 'data-ct-field', 0, 6)}>
                <Field label="شماره قرارداد">
                  <Input value={ctNumber} onChange={(e) => setCtNumber(e.target.value)} className="num" autoFocus />
                </Field>
              </div>
              <div data-ct-field="1" onKeyDown={(e) => handleFlatEnter(e, 'data-ct-field', 1, 6)}>
                <Field label="تناژ کل قرارداد (تن)">
                  <Input type="number" numeric step="0.01" value={ctTonnage} onChange={(e) => setCtTonnage(e.target.value)} />
                </Field>
              </div>
              <div data-ct-field="2" onKeyDown={(e) => handleFlatEnter(e, 'data-ct-field', 2, 6)}>
                <Field label="نام معدن">
                  <Input value={ctMine} onChange={(e) => setCtMine(e.target.value)} />
                </Field>
              </div>
              <div data-ct-field="3" onKeyDown={(e) => handleFlatEnter(e, 'data-ct-field', 3, 6)}>
                <Field label="نوع سنگ">
                  <Select value={ctStoneType} onChange={(e) => setCtStoneType(e.target.value)}>
                    <option value="">انتخاب کنید</option>
                    {stoneTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </Select>
                </Field>
              </div>
              <div data-ct-field="4" onKeyDown={(e) => handleFlatEnter(e, 'data-ct-field', 4, 6)}>
                <Field label="فرمت کوپ قرارداد">
                  <Select value={ctFormat} onChange={(e) => setCtFormat(e.target.value)}>
                    <option value="">انتخاب کنید</option>
                    {COUP_FORMATS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </Select>
                </Field>
              </div>
              <div data-ct-field="5" onKeyDown={(e) => handleFlatEnter(e, 'data-ct-field', 5, 6)}>
                <Field label="قیمت فی هر تن (ریال)" hint={ctPrice !== '' ? `${formatRial(ctPrice)} ریال` : undefined}>
                  <Input type="number" numeric step="0.01" value={ctPrice} onChange={(e) => setCtPrice(e.target.value)} />
                </Field>
              </div>
              <div data-ct-field="6" onKeyDown={(e) => handleFlatEnter(e, 'data-ct-field', 6, 6, saveContract)}>
                <Field label="تعداد کوپ قرارداد">
                  <Input type="number" numeric step="1" min="1" value={ctCoupCount} onChange={(e) => setCtCoupCount(e.target.value)} />
                </Field>
              </div>
            </div>
            <div className="mt-4 flex justify-end border-t border-[var(--border)] pt-4">
              <Button variant="primary" size="lg" onClick={saveContract}>{editingContractId ? 'ذخیره تغییرات' : 'ثبت قرارداد'}</Button>
            </div>
          </Card>
    </>
  );
}
