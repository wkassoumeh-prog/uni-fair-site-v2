/**
 * Actions toolbar component for registrations admin page
 */
type ActionsToolbarProps = {
  showAdd: boolean;
  setShowAdd: (show: boolean) => void;
  selectedCount: number;
  loading: boolean;
  exporting: boolean;
  onAddDemoRows: () => void;
  onDeleteSelected: () => void;
  onExportCsv: () => void;
};

export default function ActionsToolbar({
  showAdd,
  setShowAdd,
  selectedCount,
  loading,
  exporting,
  onAddDemoRows,
  onDeleteSelected,
  onExportCsv,
}: ActionsToolbarProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center" data-section="actions">
      <button className="rounded-md border px-3 py-2 text-sm" onClick={() => setShowAdd(!showAdd)}>
        {showAdd ? "Close" : "Add (local)"}
      </button>

      <button className="rounded-md border px-3 py-2 text-sm" onClick={onAddDemoRows}>
        Add demo rows (local)
      </button>

      <button
        className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
        onClick={onDeleteSelected}
        disabled={selectedCount === 0 || loading}
        title={selectedCount === 0 ? "Select rows first" : ""}
      >
        Delete selected ({selectedCount})
      </button>

      <button
        className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
        onClick={onExportCsv}
        disabled={exporting || loading}
      >
        {exporting ? "Exporting…" : "Export CSV"}
      </button>
    </div>
  );
}
