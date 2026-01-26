/**
 * Form component for adding new test messages
 */
type AddFormProps = {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  subject: string;
  setSubject: (value: string) => void;
  message: string;
  setMessage: (value: string) => void;
  saving: boolean;
  onSave: () => void;
};

export default function AddForm({
  name,
  setName,
  email,
  setEmail,
  subject,
  setSubject,
  message,
  setMessage,
  saving,
  onSave,
}: AddFormProps) {
  return (
    <div className="rounded-md border p-4 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="rounded-md border px-3 py-2 text-sm"
          placeholder="Email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="sm:col-span-2 rounded-md border px-3 py-2 text-sm"
          placeholder="Subject (optional)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <textarea
        className="w-full min-h-[90px] rounded-md border p-3 text-sm"
        placeholder="Message (required)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        className="rounded-md bg-black text-white px-4 py-2 text-sm disabled:opacity-60"
        onClick={onSave}
        disabled={saving}
      >
        {saving ? "Saving…" : "Save message (seed)"}
      </button>
    </div>
  );
}
