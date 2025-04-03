import { Handle, Position, NodeProps } from '@xyflow/react';
import { Server, ArrowRight } from 'lucide-react';
import type { InputNodeData } from '../index';

// Input node represents incoming messages from MCP servers
const InputNode = ({ selected }: NodeProps) => {
  return (
    <div className={`node input-node rounded-md border-2 p-3 bg-gradient-to-r from-emerald-50 to-card dark:from-emerald-950/30 dark:to-card shadow-md ${
      selected ? 'border-primary ring-2 ring-primary/20' : 'border-emerald-300 dark:border-emerald-800'
    }`}>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
          <Server size={18} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 font-medium text-sm">
            <span>MCP Server</span>
            <ArrowRight size={14} className="text-emerald-500 ml-1" />
          </div>
          
          <div className="text-xs text-muted-foreground">
            Incoming messages
          </div>
        </div>
      </div>
      
      {/* Add flow visualization arrow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 w-6 h-6 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center">
          <ArrowRight size={10} className="text-emerald-600 dark:text-emerald-400" />
        </div>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-4 h-4 border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-500/80" 
        style={{ zIndex: 10 }}
      />
    </div>
  );
};

export default InputNode;