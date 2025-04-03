import { Handle, Position, NodeProps } from '@xyflow/react';
import { ArrowRight, Cpu } from 'lucide-react';
import type { OutputNodeData } from '../index';

// Output node represents processed messages being delivered to the application
const OutputNode = ({ selected }: NodeProps) => {
  return (
    <div className={`node output-node rounded-md border-2 p-3 bg-gradient-to-r from-card to-indigo-50 dark:from-card dark:to-indigo-950/30 shadow-md ${
      selected ? 'border-primary ring-2 ring-primary/20' : 'border-indigo-300 dark:border-indigo-800'
    }`}>
      {/* Add flow visualization arrow */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 w-6 h-6 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900 border border-indigo-300 dark:border-indigo-700 flex items-center justify-center">
          <ArrowRight size={10} className="text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
      
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-4 h-4 border-2 border-indigo-300 dark:border-indigo-700 bg-indigo-500/80" 
        style={{ zIndex: 10 }}
      />
      
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
          <Cpu size={18} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 font-medium text-sm">
            <ArrowRight size={14} className="text-indigo-500 mr-1" />
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