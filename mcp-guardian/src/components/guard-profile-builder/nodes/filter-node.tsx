import { Handle, Position, NodeProps } from '@xyflow/react';
import { Filter } from 'lucide-react';
import type { FilterNodeData } from '../index';

// Use NodeProps from ReactFlow - fixed for proper type compatibility
const FilterNode = ({ data, selected }: NodeProps) => {
  // We need type guards to ensure we have the right data structure
  const filterData = data as FilterNodeData;
  const filterLogic = filterData?.filter_logic || { direction: 'inbound' };
  const matchAction = filterData?.match_action || 'send';
  const nonMatchAction = filterData?.non_match_action || 'drop';
  
  // Get filter logic description
  const getFilterDescription = () => {
    if (!filterLogic || typeof filterLogic !== 'object') return 'No filter logic';
    
    // Handle the different filter logic types
    if ('direction' in filterLogic) {
      return `${filterLogic.direction}`;
    } else if ('message_type' in filterLogic) {
      return `${filterLogic.message_type}`;
    } else if ('request_method' in filterLogic) {
      return `${filterLogic.request_method}`;
    } else if ('and' in filterLogic) {
      return 'AND condition';
    } else if ('or' in filterLogic) {
      return 'OR condition';
    } else if ('not' in filterLogic) {
      return 'NOT condition';
    }
    
    return 'Complex';
  };
  
  // Get action description
  const getActionDescription = (action: any) => {
    if (action === 'send') return 'Send';
    if (action === 'drop') return 'Drop';
    if (typeof action === 'object' && action.intercept) return 'Intercept';
    return 'Unknown';
  };
  
  return (
    <div className={`node filter-node rounded-lg border p-3 bg-background shadow-sm max-w-[180px] ${
      selected ? 'border-primary ring-2 ring-primary/20' : 'border-muted'
    }`}>
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 border border-amber-400 dark:border-amber-600 bg-amber-500"
      />
      
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0 w-7 h-7 bg-amber-100 dark:bg-amber-900/30 rounded-md flex items-center justify-center">
          <Filter size={14} className="text-amber-600 dark:text-amber-400" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">Filter</div>
          <div className="text-xs text-muted-foreground truncate">
            {getFilterDescription()}
          </div>
        </div>
      </div>
      
      <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
        <span className="text-muted-foreground">Match:</span>
        <span className="font-medium truncate">{getActionDescription(matchAction)}</span>
        <span className="text-muted-foreground">Non-match:</span>
        <span className="font-medium truncate">{getActionDescription(nonMatchAction)}</span>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 border border-amber-400 dark:border-amber-600 bg-amber-500"
      />
    </div>
  );
};

export default FilterNode;