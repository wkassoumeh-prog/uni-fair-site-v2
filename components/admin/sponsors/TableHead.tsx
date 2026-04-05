/**
 * Table header component for sponsors
 */
type TableHeadProps = {
  allSelected: boolean;
  onToggleAll: () => void;
  disabled: boolean;
};

export default function TableHead({ allSelected, onToggleAll, disabled }: TableHeadProps) {
  return (
    <thead className="border-b bg-gray-50">
      <tr>
        <th className="text-left font-medium px-3 py-2 w-[52px]">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onToggleAll}
            disabled={disabled}
            aria-label="Select all"
          />
        </th>
        <th className="text-left font-medium px-3 py-2 w-[220px]">Name</th>
        <th className="text-left font-medium px-3 py-2 w-[320px]">Logo URL</th>
        <th className="text-left font-medium px-3 py-2 w-[260px]">Website</th>
        <th className="text-left font-medium px-3 py-2 w-[120px]">Sort</th>
        <th className="text-left font-medium px-3 py-2 w-[120px]">Hide</th>
        <th className="text-left font-medium px-3 py-2 w-[120px]">Actions</th>
      </tr>
    </thead>
  );
}
