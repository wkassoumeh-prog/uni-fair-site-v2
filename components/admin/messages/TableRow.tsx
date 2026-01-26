/**
 * Table row component for a single message
 */
import type { MsgRow } from "@/hooks/admin/useMessagesAdmin";

type TableRowProps = {
  row: MsgRow;
  selected: boolean;
  deleting: boolean;
  onToggle: () => void;
  onView: () => void;
  onToggleStatus: () => void;
  onArchive: () => void;
  onDelete: () => void;
};

export default function TableRow({
  row,
  selected,
  deleting,
  onToggle,
  onView,
  onToggleStatus,
  onArchive,
  onDelete,
}: TableRowProps) {
  return (
    <tr className="border-b last:border-b-0 align-top">
      <td className="px-3 py-2">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          aria-label="Select row"
        />
      </td>

      <td className="px-3 py-2 whitespace-nowrap">
        <div>{new Date(row.created_at).toLocaleDateString()}</div>
        <div>{new Date(row.created_at).toLocaleTimeString()}</div>
      </td>

      <td className="px-3 py-2">
        <span className="rounded-md border px-2 py-1 text-xs">{row.status}</span>
      </td>

      <td className="px-3 py-2">
        <span className="rounded-md border px-2 py-1 text-xs">{row.source}</span>
      </td>

      <td className="px-3 py-2">{row.name ?? <span className="opacity-50">—</span>}</td>

      <td className="px-3 py-2">
        {row.email ? (
          <a className="underline" href={`mailto:${row.email}`}>
            {row.email}
          </a>
        ) : (
          <span className="opacity-50">—</span>
        )}
      </td>

      <td className="px-3 py-2">{row.subject ?? <span className="opacity-50">—</span>}</td>

      <td
        className="px-3 py-2 max-w-[380px] cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onView}
        title="Click to view full message"
      >
        <div className="line-clamp-2">{row.message}</div>
      </td>

      <td className="px-3 py-2">
        <div className="flex flex-wrap gap-2">
          <button className="rounded-md border px-2 py-1 text-xs" onClick={onView}>
            View
          </button>

          <button className="rounded-md border px-2 py-1 text-xs" onClick={onToggleStatus}>
            {row.status === "read" ? "Mark unread" : "Mark read"}
          </button>

          <button
            className="rounded-md border px-2 py-1 text-xs"
            onClick={onArchive}
            disabled={row.status === "archived"}
          >
            Archive
          </button>

          <button
            className="rounded-md border px-2 py-1 text-xs disabled:opacity-50"
            onClick={onDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
}
