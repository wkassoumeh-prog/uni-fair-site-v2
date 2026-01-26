/**
 * Modal component for displaying registration details
 */
import type { UiRow } from "@/hooks/admin/useRegistrationsAdmin";

type DetailsModalProps = {
  row: UiRow;
  onClose: () => void;
};

export default function DetailsModal({ row, onClose }: DetailsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex items-center justify-between bg-gray-50 rounded-t-lg">
          <h3 className="font-semibold text-gray-800">Registration Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black transition-colors">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Email-like Header Section */}
          <div className="space-y-3 border-b pb-6">
            <div className="flex items-start gap-3">
              <span className="text-gray-500 w-24 shrink-0 font-medium">Institution:</span>
              <span className="text-gray-900 font-semibold">{row.institution_name || "—"}</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gray-500 w-24 shrink-0 font-medium">Contact:</span>
              <span className="text-gray-900">{row.contact_name || "—"}</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gray-500 w-24 shrink-0 font-medium">Email:</span>
              {row.email ? (
                <a href={`mailto:${row.email}`} className="text-blue-600 hover:underline">
                  {row.email}
                </a>
              ) : (
                <span className="text-gray-900">—</span>
              )}
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gray-500 w-24 shrink-0 font-medium">Type:</span>
              <span className="text-gray-900 capitalize">{row.institution_type || "—"}</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gray-500 w-24 shrink-0 font-medium">Source:</span>
              <span className="px-2 py-0.5 rounded-full border text-xs bg-gray-50 text-gray-700">
                {row.source}
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gray-500 w-24 shrink-0 font-medium">Submitted:</span>
              <span className="text-gray-600 text-sm">
                {new Date(row.created_at).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Message Section */}
          <div className="space-y-2">
            <h4 className="text-gray-500 font-medium">Message:</h4>
            <div className="bg-gray-50 p-4 rounded-md text-gray-800 whitespace-pre-wrap leading-relaxed min-h-[100px]">
              {row.message || <span className="text-gray-400 italic">No message provided</span>}
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
