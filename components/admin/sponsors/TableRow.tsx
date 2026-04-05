/**
 * Table row component for a single sponsor (editable inline)
 */
import type { SponsorRow } from "@/hooks/admin/useSponsorsAdmin";

type TableRowProps = {
  row: SponsorRow;
  selected: boolean;
  onToggle: () => void;
  onUpdate: (id: string, patch: Partial<SponsorRow>) => void;
  onDelete: (id: string) => void;
};

export default function TableRow({ row, selected, onToggle, onUpdate, onDelete }: TableRowProps) {
  return (
    <tr
      key={row.id}
      className={`border-b last:border-b-0 align-top ${!row.published ? "bg-slate-50/90 opacity-75" : ""}`}
    >
      <td className="px-3 py-2">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          aria-label={`Select ${row.name}`}
        />
      </td>

      <td className="px-3 py-2">
        <input
          className="w-full rounded-md border px-2 py-1"
          value={row.name}
          onChange={(e) => onUpdate(row.id, { name: e.target.value })}
        />
      </td>

      <td className="px-3 py-2">
        <input
          className="w-full rounded-md border px-2 py-1"
          value={row.logo_url}
          onChange={(e) => onUpdate(row.id, { logo_url: e.target.value })}
        />
      </td>

      <td className="px-3 py-2">
        <input
          className="w-full rounded-md border px-2 py-1"
          value={row.website_url ?? ""}
          onChange={(e) => onUpdate(row.id, { website_url: e.target.value || null })}
        />
      </td>

      <td className="px-3 py-2">
        <input
          type="number"
          className="w-24 rounded-md border px-2 py-1"
          value={row.sort_order}
          onChange={(e) => onUpdate(row.id, { sort_order: parseInt(e.target.value || "100", 10) })}
        />
      </td>

      <td className="px-3 py-2">
        <input
          type="checkbox"
          checked={!row.published}
          onChange={(e) => onUpdate(row.id, { published: !e.target.checked })}
          title="Hide from public site"
          aria-label={`Hide ${row.name} from public site`}
        />
      </td>

      <td className="px-3 py-2">
        <button className="rounded-md border px-2 py-1 text-xs" onClick={() => onDelete(row.id)}>
          Delete
        </button>
      </td>
    </tr>
  );
}
