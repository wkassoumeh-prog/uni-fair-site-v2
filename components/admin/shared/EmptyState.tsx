/**
 * Empty state component for admin tables
 */
type EmptyStateProps = {
  loading: boolean;
  message?: string;
  colSpan: number;
};

export default function EmptyState({ loading, message, colSpan }: EmptyStateProps) {
  return (
    <tr>
      <td className="px-3 py-4 opacity-70" colSpan={colSpan}>
        {loading ? "Loading…" : message || "No results."}
      </td>
    </tr>
  );
}
