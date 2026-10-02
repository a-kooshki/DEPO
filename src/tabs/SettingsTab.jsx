/* eslint-disable no-unused-vars */
import React from 'react';
import { useAppContext } from '../app/AppContext';

/** SettingsTab keeps the existing UI and behavior while isolating this tab's markup. */
export default function SettingsTab() {
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
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Card title="چاپ" description="این تنظیمات روی کارت پالت، گزارش موجودی، حواله و فرم برش اعمال می‌شوند.">
              <div className="space-y-3">
                {[
                  { key: 'showLogoInPdf', label: 'نمایش لوگو در سربرگ چاپ' },
                  { key: 'showQrInPdf', label: 'نمایش QR در سربرگ چاپ' },
                  { key: 'printGradeInReport', label: 'نمایش ستون درجه سنگ در گزارش موجودی' },
                ].map((item) => (
                  <label key={item.key} className="flex cursor-pointer items-center justify-between rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm hover:bg-[var(--surface-sunken)]">
                    <span>{item.label}</span>
                    <input type="checkbox" checked={settings[item.key]} onChange={(e) => updateSetting(item.key, e.target.checked)} className="h-4 w-4 accent-[var(--primary)]" />
                  </label>
                ))}

                <div className="rounded-lg border border-[var(--border)] px-4 py-3">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>اندازه فونت چاپ</span>
                    <span className="num text-[var(--text-muted)]">{settings.pdfFontScale.toFixed(2)}×</span>
                  </div>
                  <input
                    type="range" min="0.8" max="3" step="0.05"
                    value={settings.pdfFontScale}
                    onChange={(e) => updateSetting('pdfFontScale', parseFloat(e.target.value))}
                    className="w-full accent-[var(--primary)]"
                  />
                </div>

                <Field label="متن سربرگ چاپ">
                  <Input value={settings.pdfHeaderText} onChange={(e) => updateSetting('pdfHeaderText', e.target.value)} placeholder="نام شرکت یا توضیح دلخواه" />
                </Field>
              </div>
            </Card>

            <Card title="لوگو و فرم">
              <div className="space-y-3">
                <div className="rounded-lg border border-[var(--border)] px-4 py-3">
                  <p className="mb-2 text-sm">لوگوی سفارشی</p>
                  {settings.customLogoDataUrl && (
                    <img src={settings.customLogoDataUrl} alt="لوگوی فعلی" className="mb-3 h-16 max-w-[180px] rounded border border-[var(--border)] bg-white object-contain p-1" />
                  )}
                  <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleLogoUpload}
                    className="block w-full text-xs file:mr-3 file:rounded file:border file:border-[var(--border-strong)] file:bg-white file:px-3 file:py-1.5 file:text-xs" />
                  <p className="mt-2 text-[11px] text-[var(--text-subtle)]">در صورت خالی بودن، فایل <code>public/logo.png</code> استفاده می‌شود.</p>
                  {settings.customLogoDataUrl && (
                    <Button size="sm" variant="danger" className="mt-2" onClick={() => updateSetting('customLogoDataUrl', '')}>حذف لوگوی سفارشی</Button>
                  )}
                </div>

                <label className="flex cursor-pointer items-start justify-between gap-3 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm hover:bg-[var(--surface-sunken)]">
                  <span>
                    حفظ مشخصات پس از ثبت پالت
                    <span className="mt-0.5 block text-[11px] text-[var(--text-subtle)]">نوع سنگ، برش و درجه برای پالت بعدی باقی می‌مانند.</span>
                  </span>
                  <input type="checkbox" checked={settings.enableFormDefaults} onChange={(e) => updateSetting('enableFormDefaults', e.target.checked)} className="mt-1 h-4 w-4 accent-[var(--primary)]" />
                </label>

                <div className="rounded-lg border border-[var(--border)] px-4 py-3 text-xs text-[var(--text-muted)]">
                  <p className="mb-1 text-sm text-[var(--text)]">اطلاعات برنامه</p>
                  <p className="num">{stones.length} ردیف در {new Set(stones.map((s) => s.palletNumber)).size} پالت</p>
                  <p className="mt-1">نسخه پشتیبان از منوی «پرونده ← تهیه نسخه پشتیبان» قابل ذخیره است.</p>
                </div>
              </div>
            </Card>

            <Card title="دستگاه‌های برش" description="دستگاه‌هایی که در فرم ثبت برش قابل انتخاب‌اند.">
              <div className="flex gap-2">
                <Input value={newMachineName} onChange={(e) => setNewMachineName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addMachine()} placeholder="مثلاً دستگاه A" className="max-w-xs" />
                <Button variant="primary" onClick={addMachine}>افزودن</Button>
              </div>
              <div className="mt-4 space-y-2">
                {machines.length === 0 ? (
                  <EmptyState title="دستگاهی ثبت نشده" description="بدون تعریف دستگاه، فرم ثبت برش قابل تکمیل نیست." />
                ) : machines.map((machine) => {
                  const blade = blades.find((b) => b.machineId === machine.id);
                  return (
                    <div key={machine.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--border)] px-4 py-2.5">
                      <div className="text-sm">
                        <span className="font-medium">{machine.name}</span>
                        <span className="mr-2 text-xs text-[var(--text-muted)]">تیغه: {blade ? blade.name : 'بدون تیغه'}</span>
                      </div>
                      <Button size="sm" variant="ghost" className="text-[var(--danger)] hover:bg-[var(--danger-soft)]" onClick={() => removeMachine(machine)}>حذف</Button>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card title="تیغه‌ها" description="هر تیغه را می‌توان به یک دستگاه تجهیز کرد؛ فرم برش هنگام ذخیره، دستگاه و تیغه‌ی فعلی را با هم ثبت می‌کند.">
              <div className="flex gap-2">
                <Input value={newBladeName} onChange={(e) => setNewBladeName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addBlade()} placeholder="مثلاً تیغه ۴۰ سگمنت" className="max-w-xs" />
                <Button variant="primary" onClick={addBlade}>افزودن</Button>
              </div>
              <div className="mt-4 space-y-2">
                {blades.length === 0 ? (
                  <EmptyState title="تیغه‌ای ثبت نشده" />
                ) : blades.map((blade) => (
                  <div key={blade.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--border)] px-4 py-2.5">
                    <span className="text-sm font-medium">{blade.name}</span>
                    <div className="flex items-center gap-2">
                      <Select value={blade.machineId || ''} onChange={(e) => equipBlade(blade.id, e.target.value)} className="w-44">
                        <option value="">بدون دستگاه</option>
                        {machines.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                      </Select>
                      <Button size="sm" variant="ghost" className="text-[var(--danger)] hover:bg-[var(--danger-soft)]" onClick={() => removeBlade(blade)}>حذف</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="کاربران ثبت موبایل" description="نامی که کاربران هنگام اتصال از موبایل انتخاب می‌کنند، بدون رمز عبور.">
              <div className="flex gap-2">
                <Input value={newOperatorName} onChange={(e) => setNewOperatorName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addOperator()} placeholder="نام کاربر" className="max-w-xs" />
                <Button variant="primary" onClick={addOperator}>افزودن</Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {operators.length === 0 ? (
                  <EmptyState title="کاربری ثبت نشده" description="بدون تعریف کاربر، ورود از موبایل ممکن نیست." />
                ) : operators.map((operator) => (
                  <span key={operator.id} className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-sunken)] px-3 py-1.5 text-sm">
                    {operator.name}
                    <button onClick={() => removeOperator(operator)} className="text-[var(--text-subtle)] hover:text-[var(--danger)]" aria-label={`حذف ${operator.name}`}>×</button>
                  </span>
                ))}
              </div>
            </Card>

            <MobileConnectionCard />
          </div>
    </>
  );
}
