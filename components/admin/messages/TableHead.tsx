/**
 * Table header component for messages
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
        <th className="text-left font-medium px-3 py-2 w-[170px]">Created</th>
        <th className="text-left font-medium px-3 py-2 w-[120px]">Status</th>
        <th className="text-left font-medium px-3 py-2 w-[120px]">Source</th>
        <th className="text-left font-medium px-3 py-2 w-[180px]">Name</th>
        <th className="text-left font-medium px-3 py-2 w-[240px]">Email</th>
        <th className="text-left font-medium px-3 py-2 w-[220px]">Subject</th>
        <th className="text-left font-medium px-3 py-2">Message</th>
        <th className="text-left font-medium px-3 py-2 w-[220px]">Actions</th>
      </tr>
    </thead>
  );
}
