import { Handle, Position, NodeProps } from '@xyflow/react';
import { ArrowRight } from 'lucide-react';
import type { OutputNodeData } from '../index';

// Output node represents processed messages being delivered to the application
const OutputNode = ({ selected }: NodeProps) => {
  return (
    <div className={`node output-node rounded-md border p-3 bg-card shadow-sm ${
      selected ? 'border-primary ring-2 ring-primary/20' : 'border-border'
    }`}>
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 bg-emerald-500" 
      />
      
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 font-medium text-sm">
          <ArrowRight size={16} className="text-emerald-500" />
          <span>Application Output</span>
        </div>
        
        <div className="text-xs text-muted-foreground mt-1">
          Processed messages to application
        </div>
      </div>
    </div>
  );
};

export default OutputNode;