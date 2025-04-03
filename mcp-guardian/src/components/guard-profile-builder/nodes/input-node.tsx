import { Handle, Position, NodeProps } from '@xyflow/react';
import { ArrowRight } from 'lucide-react';
import type { InputNodeData } from '../index';

// Input node represents incoming messages from MCP servers
const InputNode = ({ selected }: NodeProps) => {
  return (
    <div className={`node input-node rounded-md border p-3 bg-card shadow-sm ${
      selected ? 'border-primary ring-2 ring-primary/20' : 'border-border'
    }`}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 font-medium text-sm">
          <ArrowRight size={16} className="text-emerald-500" />
          <span>MCP Server Input</span>
        </div>
        
        <div className="text-xs text-muted-foreground mt-1">
          Messages from MCP Servers
        </div>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 bg-emerald-500" 
      />
    </div>
  );
};

export default InputNode;