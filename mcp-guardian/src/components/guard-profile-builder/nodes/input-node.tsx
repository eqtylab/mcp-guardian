import { Handle, Position, NodeProps } from '@xyflow/react';
import { Server } from 'lucide-react';
import type { InputNodeData } from '../index';

// Input node represents incoming messages from MCP servers
const InputNode = ({ selected }: NodeProps) => {
  return (
    <div className={`node input-node rounded-lg border p-3 bg-background shadow-sm ${
      selected ? 'border-primary ring-2 ring-primary/20' : 'border-muted'
    }`}>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-md flex items-center justify-center">
          <Server size={16} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        
        <div className="flex flex-col">
          <div className="font-medium text-sm">
            <span>MCP Server</span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Incoming messages
          </div>
        </div>
      </div>
      
      {/* Flow direction indicator line */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-1 border-t-2 border-emerald-400/50 dark:border-emerald-500/50 w-4 h-0"></div>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 border border-emerald-400 dark:border-emerald-600 bg-emerald-500" 
      />
    </div>
  );
};

export default InputNode;