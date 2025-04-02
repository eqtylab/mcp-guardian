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
                   bg-colors-bg-surface
                   border border-colors-border-subtle
                   rounded-md shadow-md overflow-hidden"
        role="dialog"
      >
        {/* Header */}
        <div className="p-3 bg-colors-bg-elevated border-b border-colors-border-subtle flex justify-between items-center">
          <h2 className="text-sm m-0 font-medium">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 bg-transparent border-0 text-colors-text-primary hover:text-colors-text-secondary transition-colors"
            aria-label="Close dialog"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 bg-colors-bg-surface">
          <p className="mb-4 text-colors-text-secondary">{message}</p>

          <div className="flex justify-end gap-2">
            <button 
              onClick={onClose} 
              className="py-1 px-2 text-xs font-medium rounded-sm
                       bg-colors-bg-interactive border border-colors-border-subtle
                       text-colors-text-primary transition-colors
                       hover:bg-colors-bg-interactive/80 focus:outline-none 
                       focus:ring-1 focus:ring-colors-accent-primary"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="py-1 px-2 text-xs font-medium rounded-sm
                        bg-colors-status-danger text-white border-0
                        hover:bg-colors-status-danger/90 transition-colors
                        focus:outline-none focus:ring-1 focus:ring-colors-status-danger"
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
