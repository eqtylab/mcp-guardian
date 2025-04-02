import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitMerge } from 'lucide-react';
import { ChainGuardConfig } from '../../../bindings/ChainGuardConfig';

// Use generic NodeProps from ReactFlow
const ChainNode = ({ data, selected }: NodeProps) => {
  // Add type guards to safely handle data
  const chainConfig = data && typeof data === 'object' && 'chainConfig' in data 
    ? data.chainConfig as { chain: any[] } 
    : { chain: [] };
  
  const chainCount = chainConfig.chain?.length || 0;
  
  return (
    <div className={`node chain-node rounded-md border p-3 bg-card shadow-sm ${
      selected ? 'border-primary ring-2 ring-primary/20' : 'border-border'
    }`}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 font-medium text-sm">
          <GitMerge size={16} className="text-primary/80" />
          <span>Chain</span>
        </div>
        
        <div className="text-xs mt-1">
          <span className="text-muted-foreground">
            {chainCount} interceptor{chainCount !== 1 ? 's' : ''} in chain
          </span>
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default ChainNode;