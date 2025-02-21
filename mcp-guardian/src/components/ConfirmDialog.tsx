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
                   bg-cream-50 dark:bg-primary-800 
                   rounded-lg shadow-xl"
        role="dialog"
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-cream-100 dark:hover:bg-primary-700 rounded"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
          </div>

          <p className="mb-6">{message}</p>

          <div className="flex justify-end gap-4">
            <button onClick={onClose} className="bg-cream-100 dark:bg-primary-700">
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="btn-danger"
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
