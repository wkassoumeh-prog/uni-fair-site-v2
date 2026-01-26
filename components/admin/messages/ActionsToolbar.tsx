/**
 * Actions toolbar component for messages admin page
 */
type ActionsToolbarProps = {
  showAdd: boolean;
  setShowAdd: (show: boolean) => void;
  selectedCount: number;
  loading: boolean;
  exporting: boolean;
  bulkStatusTarget: "new" | "read" | null;
  onDeleteSelected: () => void;
  onBulkStatusToggle: () => void;
  onExportCsv: () => void;
};

export default function ActionsToolbar({
  showAdd,
  setShowAdd,
  selectedCount,
  loading,
  exporting,
  bulkStatusTarget,
  onDeleteSelected,
  onBulkStatusToggle,
  onExportCsv,
}: ActionsToolbarProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center" data-section="actions">
      <button className="rounded-md border px-3 py-2 text-sm" onClick={() => setShowAdd(!showAdd)}>
        {showAdd ? "Close" : "Add new message"}
      </button>

      <button
        className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
        onClick={onDeleteSelected}
        disabled={selectedCount === 0 || loading}
        title={selectedCount === 0 ? "Select messages first" : ""}
      >
        Delete selected ({selectedCount})
      </button>

      <button
        className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
        onClick={onBulkStatusToggle}
        disabled={selectedCount === 0 || loading || !bulkStatusTarget}
        title={selectedCount === 0 ? "Select messages first" : ""}
      >
        Mark {bulkStatusTarget === "read" ? "read" : "unread"} ({selectedCount})
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
