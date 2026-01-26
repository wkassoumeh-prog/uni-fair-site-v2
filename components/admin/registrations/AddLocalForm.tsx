/**
 * Form component for adding local test registrations
 */
type AddLocalFormProps = {
  institutionName: string;
  setInstitutionName: (value: string) => void;
  contactName: string;
  setContactName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  institutionType: string;
  setInstitutionType: (value: string) => void;
  message: string;
  setMessage: (value: string) => void;
  onSave: () => void;
};

export default function AddLocalForm({
  institutionName,
  setInstitutionName,
  contactName,
  setContactName,
  email,
  setEmail,
  institutionType,
  setInstitutionType,
  message,
  setMessage,
  onSave,
}: AddLocalFormProps) {
  return (
    <div className="rounded-md border p-4 space-y-3">
      <div className="text-sm font-medium">Add local test registration (not saved to Supabase)</div>

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Institution name *"
          value={institutionName}
          onChange={(e) => setInstitutionName(e.target.value)}
        />
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Institution type *"
          value={institutionType}
          onChange={(e) => setInstitutionType(e.target.value)}
        />
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Contact name *"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
        />
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <textarea
        className="w-full min-h-[90px] rounded-md border p-3 text-sm"
        placeholder="Message (optional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button className="rounded-md bg-black text-white px-4 py-2 text-sm" onClick={onSave}>
        Add to admin view
      </button>
    </div>
  );
}
