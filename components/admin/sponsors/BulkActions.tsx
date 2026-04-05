/**
 * Bulk actions component for sponsors
 */
type BulkActionsProps = {
  selectedCount: number;
  allSelected: boolean;
  disabled: boolean;
  onToggleAll: () => void;
  onPublishSelected: () => void;
  onHideSelected: () => void;
  onDeleteSelected: () => void;
};

export default function BulkActions({
  selectedCount,
  allSelected,
  disabled,
  onToggleAll,
  onPublishSelected,
  onHideSelected,
  onDeleteSelected,
}: BulkActionsProps) {
  const noneSelected = selectedCount === 0;

  return (
    <div className="flex items-center justify-between" data-section="bulk-actions">
      <div className="text-sm opacity-70">Selected: {selectedCount}</div>

      <div className="flex flex-wrap gap-2 justify-end">
        <button
          className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
          onClick={onToggleAll}
          disabled={disabled}
        >
          {allSelected ? "Unselect all" : "Select all"}
        </button>

        <button
          className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
          onClick={onPublishSelected}
          disabled={noneSelected}
        >
          Publish selected
        </button>

        <button
          className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
          onClick={onHideSelected}
          disabled={noneSelected}
        >
          Hide selected
        </button>

        <button
          className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
          onClick={onDeleteSelected}
          disabled={noneSelected}
        >
          Delete selected
        </button>
      </div>
    </div>
  );
}
