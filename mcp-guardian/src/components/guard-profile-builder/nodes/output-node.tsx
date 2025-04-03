import { Handle, Position, NodeProps } from '@xyflow/react';
import { Cpu } from 'lucide-react';
import type { OutputNodeData } from '../index';

// Output node represents processed messages being delivered to the application
const OutputNode = ({ selected }: NodeProps) => {
  return (
    <div className={`node output-node rounded-lg border p-3 bg-card shadow-sm ${
      selected ? 'border-primary ring-2 ring-primary/20' : 'border-muted'
    }`}>
      {/* Flow direction indicator line */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-1 border-t-2 border-indigo-400/50 dark:border-indigo-500/50 w-4 h-0"></div>
      
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 border border-indigo-400 dark:border-indigo-600 bg-indigo-500" 
      />
      
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-md flex items-center justify-center">
          <Cpu size={16} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        
        <div className="flex flex-col">
          <div className="font-medium text-sm">
            <span>Application</span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Processed messages
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutputNode;