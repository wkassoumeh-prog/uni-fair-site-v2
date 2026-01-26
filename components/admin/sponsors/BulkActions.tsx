/**
 * Bulk actions component for sponsors
 */
type BulkActionsProps = {
  selectedCount: number;
  allSelected: boolean;
  disabled: boolean;
  onToggleAll: () => void;
  onDeleteSelected: () => void;
};

export default function BulkActions({
  selectedCount,
  allSelected,
  disabled,
  onToggleAll,
  onDeleteSelected,
}: BulkActionsProps) {
  return (
    <div className="flex items-center justify-between" data-section="bulk-actions">
      <div className="text-sm opacity-70">Selected: {selectedCount}</div>

      <div className="flex gap-2">
        <button
          className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
          onClick={onToggleAll}
          disabled={disabled}
        >
          {allSelected ? "Unselect all" : "Select all"}
        </button>

        <button
          className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
          onClick={onDeleteSelected}
          disabled={selectedCount === 0}
        >
          Delete selected
        </button>
      </div>
    </div>
  );
}
