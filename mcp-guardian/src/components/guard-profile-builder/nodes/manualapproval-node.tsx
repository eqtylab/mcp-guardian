import { Handle, Position, NodeProps } from '@xyflow/react';
import { UserCheck } from 'lucide-react';
// No need for data type import as component only uses 'selected' prop

// Use NodeProps from ReactFlow - fixed for proper type compatibility
const ManualApprovalNode = ({ selected }: NodeProps) => {
  return (
    <div className={`node approval-node rounded-lg border p-3 bg-background shadow-sm max-w-[180px] ${
      selected ? 'border-primary ring-2 ring-primary/20' : 'border-muted'
    }`}>
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 border border-violet-400 dark:border-violet-600 bg-violet-500"
      />
      
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0 w-7 h-7 bg-violet-100 dark:bg-violet-900/30 rounded-md flex items-center justify-center">
          <UserCheck size={14} className="text-violet-600 dark:text-violet-400" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">Manual Approval</div>
          <div className="text-xs text-muted-foreground truncate">
            User confirmation
          </div>
        </div>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 border border-violet-400 dark:border-violet-600 bg-violet-500"
      />
    </div>
  );
};

export default ManualApprovalNode;