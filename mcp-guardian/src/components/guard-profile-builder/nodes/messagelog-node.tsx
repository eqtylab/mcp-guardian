import { Handle, Position, NodeProps } from '@xyflow/react';
import { BookOpen } from 'lucide-react';
import { MessageLogGuardConfig } from '../../../bindings/MessageLogGuardConfig';

// Use generic NodeProps from ReactFlow
const MessageLogNode = ({ data, selected }: NodeProps) => {
  // Helper to get appropriate color for log level
  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'Error': return 'text-colors-status-danger';
      case 'Warn': return 'text-colors-status-warning';
      case 'Info': return 'text-colors-status-info';
      case 'Debug': return 'text-colors-text-tertiary';
      case 'Trace': return 'text-colors-text-tertiary';
      default: return 'text-colors-text-tertiary';
    }
  };
  
  // Add type guards to safely handle data
  const logLevel = data && typeof data === 'object' && 'log_level' in data 
    ? data.log_level as string 
    : 'Info';

  return (
    <div className={`node messagelog-node rounded-md border p-3 bg-card shadow-sm ${
      selected ? 'border-primary ring-2 ring-primary/20' : 'border-border'
    }`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 font-medium text-sm">
          <BookOpen size={16} className="text-primary/80" />
          <span>Message Log</span>
        </div>
        
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-muted-foreground">Log Level:</span>
          <span className={`font-medium ${getLogLevelColor(logLevel)}`}>
            {logLevel}
          </span>
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default MessageLogNode;