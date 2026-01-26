/**
 * Header component for messages admin page
 */
type HeaderProps = {
  loading: boolean;
  total: number;
};

export default function Header({ loading, total }: HeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Contact messages</h1>
      <p className="text-sm opacity-70">{loading ? "Loading…" : `${total} total`}</p>
    </div>
  );
}
