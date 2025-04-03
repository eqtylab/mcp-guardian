import { Handle, Position, NodeProps } from '@xyflow/react';
import { BookOpen } from 'lucide-react';
import type { MessageLogNodeData } from '../index';

// Use NodeProps from ReactFlow - fixed for proper type compatibility
const MessageLogNode = ({ data, selected }: NodeProps) => {
  // Helper to get appropriate color for log level
  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'Error': return 'text-red-600 dark:text-red-400';
      case 'Warn': return 'text-orange-600 dark:text-orange-400';
      case 'Info': return 'text-blue-600 dark:text-blue-400';
      case 'Debug': return 'text-purple-600 dark:text-purple-400';
      case 'Trace': return 'text-slate-600 dark:text-slate-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };
  
  // We need to cast to our data type
  const logData = data as MessageLogNodeData;
  const logLevel = logData?.log_level || 'Info';

  return (
    <div className={`node messagelog-node rounded-lg border p-3 bg-background shadow-sm max-w-[180px] ${
      selected ? 'border-primary ring-2 ring-primary/20' : 'border-muted'
    }`}>
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 border border-cyan-400 dark:border-cyan-600 bg-cyan-500"
      />
      
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0 w-7 h-7 bg-cyan-100 dark:bg-cyan-900/30 rounded-md flex items-center justify-center">
          <BookOpen size={14} className="text-cyan-600 dark:text-cyan-400" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">Message Log</div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Level:</span>
            <span className={`font-medium ${getLogLevelColor(logLevel)}`}>
              {logLevel}
            </span>
          </div>
        </div>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 border border-cyan-400 dark:border-cyan-600 bg-cyan-500"
      />
    </div>
  );
};

export default MessageLogNode;