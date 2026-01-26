"use client";

/**
 * Sponsors CMS Page
 * Manages sponsors with inline editing, bulk operations, and seeding
 */
import { useSponsorsAdmin } from "@/hooks/admin/useSponsorsAdmin";
import Header from "@/components/admin/sponsors/Header";
import AddForm from "@/components/admin/sponsors/AddForm";
import BulkActions from "@/components/admin/sponsors/BulkActions";
import TableHead from "@/components/admin/sponsors/TableHead";
import TableRow from "@/components/admin/sponsors/TableRow";
import EmptyState from "@/components/admin/shared/EmptyState";

export default function SponsorsCmsPage() {
  const {
    // Data
    rows,
    loading,
    msg,
    errorMsg,

    // Selection
    selected,
    selectedIds,
    allSelected,
    toggleOne,
    toggleAll,

    // Form state
    name,
    setName,
    logoUrl,
    setLogoUrl,
    websiteUrl,
    setWebsiteUrl,
    sortOrder,
    setSortOrder,
    published,
    setPublished,
    saving,
    seeding,

    // Actions
    addSponsor,
    updateSponsor,
    removeSponsor,
    seedFromExamples,
    deleteSelected,
  } = useSponsorsAdmin();

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <section data-section="header">
        <Header />
      </section>

      {/* Add Form Section */}
      <section data-section="add-form">
        <AddForm
          name={name}
          setName={setName}
          logoUrl={logoUrl}
          setLogoUrl={setLogoUrl}
          websiteUrl={websiteUrl}
          setWebsiteUrl={setWebsiteUrl}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          published={published}
          setPublished={setPublished}
          saving={saving}
          seeding={seeding}
          onAdd={addSponsor}
          onSeedMerge={() => seedFromExamples({ replace: false })}
          onSeedReplace={() => seedFromExamples({ replace: true })}
        />
      </section>

      {/* Status Messages */}
      {msg && <div className="text-sm text-green-700">{msg}</div>}
      {errorMsg && <div className="text-sm text-red-600">Error: {errorMsg}</div>}

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedIds.length}
        allSelected={allSelected}
        disabled={rows.length === 0}
        onToggleAll={toggleAll}
        onDeleteSelected={deleteSelected}
      />

      {/* Table Section */}
      <section data-section="table">
        <div className="rounded-md border overflow-x-auto">
          <table className="min-w-[980px] w-full text-sm">
            <TableHead
              allSelected={allSelected}
              onToggleAll={toggleAll}
              disabled={rows.length === 0}
            />
            <tbody>
              {loading || rows.length === 0 ? (
                <EmptyState loading={loading} message="No sponsors yet." colSpan={7} />
              ) : (
                rows.map((row) => (
                  <TableRow
                    key={row.id}
                    row={row}
                    selected={!!selected[row.id]}
                    onToggle={() => toggleOne(row.id)}
                    onUpdate={updateSponsor}
                    onDelete={removeSponsor}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Help Text */}
      <p className="text-xs opacity-60">
        Tip: set <span className="font-mono">sort_order</span> to control ordering (lower appears first).
      </p>
    </div>
  );
}
