import {
  CyberDialog as Dialog,
  CyberDialogContent as DialogContent,
  CyberDialogHeader as DialogHeader,
  CyberDialogTitle as DialogTitle,
  CyberDialogClose as DialogClose,
  CyberDialogBody as DialogBody,
  CyberDialogFooter as DialogFooter,
} from "./ui/cyber-dialog";
import { Button } from "./ui/button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }: ConfirmDialogProps) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent variant="cyber" glow="subtle" className="max-w-md">
        <DialogHeader variant="cyber">
          <DialogTitle>{title}</DialogTitle>
          <DialogClose variant="cyber" />
        </DialogHeader>
        <DialogBody variant="cyber">
          <p className="mb-4 text-muted-foreground">{message}</p>
        </DialogBody>
        <DialogFooter variant="cyber">
          <Button size="sm" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" variant="danger" onClick={handleConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;