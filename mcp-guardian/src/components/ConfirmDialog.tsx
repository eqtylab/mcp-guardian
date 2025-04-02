// ConfirmDialog.tsx
import { X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }: ConfirmDialogProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                   w-full max-w-md z-50 
                   bg-bg-surface
                   border border-border-subtle
                   rounded-md shadow-lg
                   card"
        role="dialog"
      >
        <div className="card-header">
          <h2 className="text-sm m-0">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 bg-transparent border-0"
            aria-label="Close dialog"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        <div className="card-content">
          <p className="mb-md">{message}</p>

          <div className="btn-group justify-end">
            <button onClick={onClose} className="btn-sm">
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="btn-danger btn-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;
