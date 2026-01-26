"use client";

/**
 * Registrations Admin Page
 * Manages exhibitor registrations with filtering, pagination, selection, and local test data
 */
import { useRegistrationsAdmin } from "@/hooks/admin/useRegistrationsAdmin";
import Header from "@/components/admin/registrations/Header";
import Filters from "@/components/admin/registrations/Filters";
import ActionsToolbar from "@/components/admin/registrations/ActionsToolbar";
import AddLocalForm from "@/components/admin/registrations/AddLocalForm";
import TableHead from "@/components/admin/registrations/TableHead";
import TableRow from "@/components/admin/registrations/TableRow";
import DetailsModal from "@/components/admin/registrations/DetailsModal";
import Pagination from "@/components/admin/shared/Pagination";
import EmptyState from "@/components/admin/shared/EmptyState";

export default function AdminRegistrationsPage() {
  const {
    // Data
    rows,
    total,
    localRowsCount,
    loading,
    errorMsg,
    exportError,

    // Filters
    q,
    setQ,
    institutionType,
    setInstitutionType,
    sourceFilter,
    setSourceFilter,
    sort,
    setSort,
    typeOptions,

    // Pagination
    page,
    setPage,
    totalPages,

    // Selection
    selected,
    selectedIds,
    allSelected,
    toggleOne,
    toggleAll,

    // Actions
    showAdd,
    setShowAdd,
    addLocalRegistration,
    addLocalDemoRows,
    deleteSelectedUiOnly,
    exportCsv,
    exporting,

    // Form state
    newInstitutionName,
    setNewInstitutionName,
    newContactName,
    setNewContactName,
    newEmail,
    setNewEmail,
    newInstitutionType,
    setNewInstitutionType,
    newMessage,
    setNewMessage,

    // Modal
    selectedRow,
    setSelectedRow,
  } = useRegistrationsAdmin();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <section data-section="header" className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <Header loading={loading} total={total} localRowsCount={localRowsCount} />
        <Filters
          q={q}
          setQ={setQ}
          institutionType={institutionType}
          setInstitutionType={setInstitutionType}
          sourceFilter={sourceFilter}
          setSourceFilter={setSourceFilter}
          sort={sort}
          setSort={setSort}
          typeOptions={typeOptions}
        />
      </section>

      {/* Actions Toolbar */}
      <ActionsToolbar
        showAdd={showAdd}
        setShowAdd={setShowAdd}
        selectedCount={selectedIds.length}
        loading={loading}
        exporting={exporting}
        onAddDemoRows={addLocalDemoRows}
        onDeleteSelected={deleteSelectedUiOnly}
        onExportCsv={exportCsv}
      />

      {/* Add Local Form */}
      {showAdd && (
        <section data-section="add-form">
          <AddLocalForm
            institutionName={newInstitutionName}
            setInstitutionName={setNewInstitutionName}
            contactName={newContactName}
            setContactName={setNewContactName}
            email={newEmail}
            setEmail={setNewEmail}
            institutionType={newInstitutionType}
            setInstitutionType={setNewInstitutionType}
            message={newMessage}
            setMessage={setNewMessage}
            onSave={addLocalRegistration}
          />
        </section>
      )}

      {/* Error Messages */}
      {exportError && <div className="text-sm text-red-600">Export error: {exportError}</div>}
      {errorMsg && <div className="text-sm text-red-600">Error: {errorMsg}</div>}

      {/* Table Section */}
      <section data-section="table">
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full text-sm">
            <TableHead
              allSelected={allSelected}
              onToggleAll={toggleAll}
              disabled={rows.length === 0 || loading}
            />
            <tbody>
              {loading || rows.length === 0 ? (
                <EmptyState loading={loading} colSpan={8} />
              ) : (
                rows.map((row) => (
                  <TableRow
                    key={row.id}
                    row={row}
                    selected={!!selected[row.id]}
                    onToggle={() => toggleOne(row.id)}
                    onView={() => setSelectedRow(row)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pagination */}
      <section data-section="pagination">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          loading={loading}
          onPageChange={setPage}
        />
      </section>

      {/* Details Modal */}
      {selectedRow && (
        <DetailsModal row={selectedRow} onClose={() => setSelectedRow(null)} />
      )}
    </div>
  );
}
