import { Handle, Position, NodeProps } from '@xyflow/react';
import { UserCheck } from 'lucide-react';
// No need for data type import as component only uses 'selected' prop

// Use NodeProps from ReactFlow - fixed for proper type compatibility
const ManualApprovalNode = ({ selected }: NodeProps) => {
  return (
    <div className={`node approval-node rounded-md border p-3 bg-card shadow-sm ${
      selected ? 'border-primary ring-2 ring-primary/20' : 'border-border'
    }`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 font-medium text-sm">
          <UserCheck size={16} className="text-primary/80" />
          <span>Manual Approval</span>
        </div>
        
        <div className="text-xs text-muted-foreground mt-1">
          Requires user confirmation before proceeding
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default ManualApprovalNode;