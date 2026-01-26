"use client";

/**
 * Messages Admin Page
 * Manages contact messages with filtering, pagination, selection, and status updates
 */
import { useMessagesAdmin } from "@/hooks/admin/useMessagesAdmin";
import Header from "@/components/admin/messages/Header";
import Filters from "@/components/admin/messages/Filters";
import ActionsToolbar from "@/components/admin/messages/ActionsToolbar";
import AddForm from "@/components/admin/messages/AddForm";
import TableHead from "@/components/admin/messages/TableHead";
import TableRow from "@/components/admin/messages/TableRow";
import DetailsModal from "@/components/admin/messages/DetailsModal";
import Pagination from "@/components/admin/shared/Pagination";
import EmptyState from "@/components/admin/shared/EmptyState";

export default function AdminMessagesPage() {
  const {
    // Data
    rows,
    total,
    loading,
    errorMsg,
    exportError,

    // Filters
    q,
    setQ,
    status,
    setStatus,
    source,
    setSource,
    sort,
    setSort,

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
    addMessageSeed,
    deleteMessage,
    deleteSelected,
    setRowStatus,
    setBulkStatus,
    bulkStatusTarget,
    exportCsv,
    exporting,
    deletingId,

    // Form state
    newName,
    setNewName,
    newEmail,
    setNewEmail,
    newSubject,
    setNewSubject,
    newMessage,
    setNewMessage,
    savingNew,

    // Modal
    selectedMsg,
    setSelectedMsg,
  } = useMessagesAdmin();

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <section data-section="header" className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <Header loading={loading} total={total} />
        <Filters q={q} setQ={setQ} status={status} setStatus={setStatus} source={source} setSource={setSource} sort={sort} setSort={setSort} />
      </section>

      {/* Actions Toolbar */}
      <ActionsToolbar
        showAdd={showAdd}
        setShowAdd={setShowAdd}
        selectedCount={selectedIds.length}
        loading={loading}
        exporting={exporting}
        bulkStatusTarget={bulkStatusTarget}
        onDeleteSelected={deleteSelected}
        onBulkStatusToggle={() => {
          if (bulkStatusTarget === "new" || bulkStatusTarget === "read") {
            setBulkStatus(bulkStatusTarget);
          }
        }}
        onExportCsv={exportCsv}
      />

      {/* Add Form */}
      {showAdd && (
        <section data-section="add-form">
          <AddForm
            name={newName}
            setName={setNewName}
            email={newEmail}
            setEmail={setNewEmail}
            subject={newSubject}
            setSubject={setNewSubject}
            message={newMessage}
            setMessage={setNewMessage}
            saving={savingNew}
            onSave={addMessageSeed}
          />
        </section>
      )}

      {/* Error Messages */}
      {exportError && <div className="text-sm text-red-600">Export error: {exportError}</div>}
      {errorMsg && <div className="text-sm text-red-600">Error: {errorMsg}</div>}

      {/* Table Section */}
      <section data-section="table">
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <TableHead
              allSelected={allSelected}
              onToggleAll={toggleAll}
              disabled={rows.length === 0 || loading}
            />
            <tbody>
              {loading || rows.length === 0 ? (
                <EmptyState loading={loading} colSpan={9} />
              ) : (
                rows.map((row) => (
                  <TableRow
                    key={row.id}
                    row={row}
                    selected={!!selected[row.id]}
                    deleting={deletingId === row.id}
                    onToggle={() => toggleOne(row.id)}
                    onView={() => setSelectedMsg(row)}
                    onToggleStatus={() => setRowStatus(row.id, row.status === "read" ? "new" : "read")}
                    onArchive={() => setRowStatus(row.id, "archived")}
                    onDelete={() => deleteMessage(row.id)}
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
      {selectedMsg && (
        <DetailsModal
          message={selectedMsg}
          onClose={() => setSelectedMsg(null)}
          onToggleStatus={() => {
            const newStatus = selectedMsg.status === "read" ? "new" : "read";
            setRowStatus(selectedMsg.id, newStatus);
            setSelectedMsg((prev) => (prev ? { ...prev, status: newStatus } : null));
          }}
          onArchive={() => {
            setRowStatus(selectedMsg.id, "archived");
            setSelectedMsg((prev) => (prev ? { ...prev, status: "archived" } : null));
          }}
        />
      )}
    </div>
  );
}
