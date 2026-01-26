/**
 * Header component for registrations admin page
 */
type HeaderProps = {
  loading: boolean;
  total: number;
  localRowsCount: number;
};

export default function Header({ loading, total, localRowsCount }: HeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Registrations</h1>
      <p className="text-sm opacity-70">
        {loading ? "Loading…" : `${total} in database · ${localRowsCount} local test rows`}
      </p>
      <p className="text-xs opacity-60">
        "Delete" here means remove from admin view only. Database is not modified.
      </p>
    </div>
  );
}
