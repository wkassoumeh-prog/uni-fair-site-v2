/**
 * Table row component for a single registration
 */
import type { UiRow } from "@/hooks/admin/useRegistrationsAdmin";

type TableRowProps = {
  row: UiRow;
  selected: boolean;
  onToggle: () => void;
  onView: () => void;
};

export default function TableRow({ row, selected, onToggle, onView }: TableRowProps) {
  return (
    <tr className="border-b last:border-b-0">
      <td className="px-3 py-2">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          aria-label="Select row"
        />
      </td>

      <td className="px-3 py-2">
        {row.institution_name ?? <span className="opacity-50">—</span>}
        {row._local ? (
          <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px]">
            local
          </span>
        ) : null}
      </td>
      <td className="px-3 py-2">{row.contact_name ?? <span className="opacity-50">—</span>}</td>
      <td className="px-3 py-2">
        {row.email ? (
          <a className="underline" href={`mailto:${row.email}`}>
            {row.email}
          </a>
        ) : (
          <span className="opacity-50">—</span>
        )}
      </td>
      <td className="px-3 py-2">{row.institution_type ?? <span className="opacity-50">—</span>}</td>
      <td className="px-3 py-2">
        <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
          {row.source}
        </span>
      </td>
      <td
        className="px-3 py-2 max-w-[380px] cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onView}
        title="Click to view full details"
      >
        <div className="line-clamp-2">{row.message ?? <span className="opacity-50">—</span>}</div>
      </td>

      <td className="px-3 py-2 whitespace-nowrap">{new Date(row.created_at).toLocaleString()}</td>
    </tr>
  );
}
