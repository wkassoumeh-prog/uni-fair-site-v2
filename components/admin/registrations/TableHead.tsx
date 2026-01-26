/**
 * Table header component for registrations
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
        <th className="text-left font-medium px-3 py-2 w-[220px]">Institution</th>
        <th className="text-left font-medium px-3 py-2 w-[180px]">Contact</th>
        <th className="text-left font-medium px-3 py-2 w-[240px]">Email</th>
        <th className="text-left font-medium px-3 py-2 w-[140px]">Type</th>
        <th className="text-left font-medium px-3 py-2 w-[110px]">Source</th>
        <th className="text-left font-medium px-3 py-2">Message</th>
        <th className="text-left font-medium px-3 py-2 w-[160px]">Created</th>
      </tr>
    </thead>
  );
}
