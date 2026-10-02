/* eslint-disable no-unused-vars */
import React from 'react';
import { useAppContext } from '../app/AppContext';

/** EntryTab keeps the existing UI and behavior while isolating this tab's markup. */
export default function EntryTab() {
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
              title={editingPallet ? `ویرایش پالت ${editingPallet}` : 'ثبت پالت'}
              description="مشخصات مشترک را یک‌بار بالای جدول وارد کنید. ردیف‌های خالی همیشه همین مشخصات را نشان می‌دهند؛ به‌محض تایپ در یک ردیف، مشخصات روی آن ردیف قفل می‌شود و تغییر بعدی مشخصات فقط روی ردیف‌های جدید اثر می‌گذارد."
              actions={editingPallet && (
                <Button variant="secondary" size="sm" onClick={() => resetEntryForm(true)}>لغو ویرایش</Button>
              )}
            >
              <div className="grid grid-cols-1 gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-accent)] p-4 md:grid-cols-4">
                <Field label="شماره پالت">
                  <Input
                    data-header-field="pallet"
                    value={headerPallet}
                    onChange={(e) => setHeaderPallet(normalizePalletInput(e.target.value))}
                    onBlur={() => setHeaderPallet((prev) => formatPallet(prev) || prev)}
                    placeholder="A-123"
                    className="num text-center font-semibold"
                    autoFocus
                  />
                </Field>
                <Field label="نوع سنگ">
                  <Select value={headerSpec.type} onChange={(e) => setHeaderSpec((p) => ({ ...p, type: e.target.value }))}>
                    <option value="">انتخاب کنید</option>
                    {stoneTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                  </Select>
                </Field>
                <Field label="کد کوپ">
                  <Input
                    list="coup-options"
                    value={headerSpec.cutCode}
                    onChange={(e) => {
                      const value = e.target.value;
                      const match = findCoup(value);
                      setHeaderSpec((p) => ({ ...p, cutCode: value, ...(match ? { type: match.type } : {}) }));
                    }}
                    placeholder="شماره کوپ"
                  />
                  {headerSpec.cutCode.trim() !== '' && (
                    findCoup(headerSpec.cutCode) ? (
                      <span className="mt-1 block text-[11px] text-[var(--success)]">
                        ✓ حواله {findCoup(headerSpec.cutCode).waybillNumber} · {findCoup(headerSpec.cutCode).type}
                      </span>
                    ) : (
                      <span className="mt-1 block text-[11px] text-[var(--text-subtle)]">در حواله‌ها یافت نشد</span>
                    )
                  )}
                </Field>
                <Field label="درجه">
                  <Input
                    maxLength={1}
                    value={headerSpec.grade}
                    onChange={(e) => setHeaderSpec((p) => ({ ...p, grade: e.target.value.toUpperCase() }))}
                    className="text-center uppercase"
                    placeholder="A"
                  />
                </Field>
              </div>

              <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--border)]">
                <table className="w-full min-w-[980px] text-sm">
                  <thead className="bg-[var(--surface-sunken)] text-xs text-[var(--text-muted)]">
                    <tr>
                      <th className="w-10 px-2 py-2 text-center font-medium">#</th>
                      <th className="w-52 px-3 py-2 text-right font-medium">مشخصات ردیف</th>
                      <th className="px-2 py-2 text-center font-medium">ضخامت (cm)</th>
                      <th className="px-2 py-2 text-center font-medium">طول (cm)</th>
                      <th className="px-2 py-2 text-center font-medium">عرض (cm)</th>
                      <th className="px-2 py-2 text-center font-medium">تعداد</th>
                      <th className="px-2 py-2 text-right font-medium">یادداشت</th>
                      <th className="w-24 px-2 py-2 text-center font-medium">متراژ</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {entryRows.map((row, rowIndex) => {
                      const spec = specOf(row);
                      const ownSpec = spec !== headerSpec;
                      const specText = [spec.type || '—', String(spec.cutCode ?? '') !== '' ? spec.cutCode : '—', spec.grade || '—'].join(' · ');
                      const cells = [
                        <Input key="t" type="number" numeric min="0" step="0.1" value={row.thickness}
                          onChange={(e) => updateRow(row.key, 'thickness', e.target.value)} />,
                        <Input key="l" type="number" numeric min="0" step="0.1" value={row.length}
                          onChange={(e) => updateRow(row.key, 'length', e.target.value)}
                          onBlur={() => convertOnBlur(row.key, 'length')} />,
                        <Input key="w" type="number" numeric min="0" step="0.1" value={row.width}
                          onChange={(e) => updateRow(row.key, 'width', e.target.value)}
                          onBlur={() => convertOnBlur(row.key, 'width')} />,
                        <Input key="q" type="number" numeric min="1" step="1" placeholder="تعداد" value={row.quantity}
                          onChange={(e) => updateRow(row.key, 'quantity', e.target.value)} />,
                        <Input key="n" value={row.notes} placeholder="اختیاری"
                          onChange={(e) => updateRow(row.key, 'notes', e.target.value)} />,
                      ];
                      return (
                        <tr key={row.key} className="border-t border-[var(--border)] hover:bg-[var(--surface-sunken)]">
                          <td className="num px-2 py-1.5 text-center text-xs text-[var(--text-subtle)]">{rowIndex + 1}</td>
                          <td className="px-3 py-1.5">
                            <div className="flex items-center gap-2">
                              <span className={`num truncate text-xs ${ownSpec ? 'text-[var(--text)]' : 'text-[var(--text-subtle)]'}`}>
                                {specText}
                              </span>
                              {ownSpec ? (
                                <button
                                  type="button"
                                  onClick={() => relinkRowToHeader(row.key)}
                                  className="shrink-0 text-[11px] text-[var(--primary)] underline-offset-2 hover:underline"
                                  title="مشخصات فعلی بالای جدول را روی این ردیف اعمال کن"
                                >
                                  به‌روزرسانی
                                </button>
                              ) : (
                                <Badge tone="accent">از سربرگ</Badge>
                              )}
                            </div>
                          </td>
                          {cells.map((cell, fieldIndex) => (
                            <td key={fieldIndex} className="px-1 py-1.5" data-cell={`${rowIndex}-${fieldIndex}`}
                              onKeyDown={(e) => handleRowKeyDown(e, rowIndex, fieldIndex)}>
                              {cell}
                            </td>
                          ))}
                          <td className="num px-2 py-1.5 text-center text-xs font-semibold">{num(rowArea(row))}</td>
                          <td className="px-1 py-1.5">
                            <button
                              type="button"
                              onClick={() => removeRow(row.key)}
                              className="h-7 w-7 rounded text-[var(--text-subtle)] transition-colors hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
                              aria-label={`حذف ردیف ${rowIndex + 1}`}
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <p className="mt-2 text-xs text-[var(--text-subtle)]">
                طول و عرض را به سانتی‌متر وارد کنید؛ با خروج از فیلد، مقدار به متر تبدیل می‌شود. با Enter به فیلد بعدی و در انتهای ردیف به ردیف تازه می‌روید.
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
                <div className="flex items-center gap-4">
                  <Button variant="secondary" onClick={addRow}>افزودن ردیف</Button>
                  <span className="num text-xs text-[var(--text-muted)]">
                    {entryTotals.rows} ردیف · {entryTotals.pieces} قطعه · {num(entryTotals.area)} m²
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setEntryRows([createEntryRow()])}>پاک‌کردن جدول</Button>
                  <Button variant="primary" size="lg" onClick={savePallet}>
                    {editingPallet ? 'ذخیره تغییرات' : 'ثبت پالت'}
                  </Button>
                </div>
              </div>
            </Card>

            <Card
              title="آخرین پالت ثبت‌شده"
              actions={lastSavedBatch && (
                <>
                  <Button variant="secondary" size="sm" onClick={() => printPalletCard(lastSavedBatch.palletNumber, lastSavedBatch.stones, lastSavedBatch.totalArea)}>
                    چاپ کارت پالت
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => editPallet(lastSavedBatch.palletNumber)}>ویرایش</Button>
                </>
              )}
            >
              {!lastSavedBatch ? (
                <EmptyState title="هنوز پالتی در این نشست ثبت نشده" description="پس از ثبت، خلاصه‌ی پالت اینجا نمایش داده می‌شود." />
              ) : (
                <>
                  <div className="mb-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                    <Stat label="شماره پالت" value={lastSavedBatch.palletNumber} />
                    <Stat label="ردیف‌ها" value={lastSavedBatch.stones.length} />
                    <Stat label="تعداد قطعات" value={lastSavedBatch.totalCount} />
                    <Stat label="متراژ کل" value={num(lastSavedBatch.totalArea)} unit="m²" />
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
                    <table className="w-full min-w-[720px] text-sm">
                      <thead className="bg-[var(--surface-sunken)] text-xs text-[var(--text-muted)]">
                        <tr>
                          {['#', 'نوع', 'کد کوپ', 'درجه', 'ضخامت (m)', 'طول (m)', 'عرض (m)', 'تعداد', 'متراژ (m²)'].map((h) => (
                            <th key={h} className="px-3 py-2 text-center font-medium">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {lastSavedBatch.stones.map((stone, index) => (
                          <tr key={stone.id} className="border-t border-[var(--border)]">
                            <td className="num px-3 py-1.5 text-center text-[var(--text-subtle)]">{index + 1}</td>
                            <td className="px-3 py-1.5 text-center">{stone.type}</td>
                            <td className="num px-3 py-1.5 text-center">{stone.cutCode}</td>
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
                </>
              )}
            </Card>
          </div>
    </>
  );
}
