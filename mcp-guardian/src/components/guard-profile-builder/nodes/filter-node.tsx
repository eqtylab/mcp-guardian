import { Handle, Position, NodeProps } from '@xyflow/react';
import { Filter } from 'lucide-react';
import { FilterGuardConfig } from '../../../bindings/FilterGuardConfig';

// Use generic NodeProps from ReactFlow but with our custom data type
const FilterNode = ({ data, selected }: NodeProps) => {
  // Add type guards to safely handle data
  const filterData = data && typeof data === 'object' ? data : {};
  const filterLogic = 'filter_logic' in filterData ? filterData.filter_logic : {};
  const matchAction = 'match_action' in filterData ? filterData.match_action : 'send';
  const nonMatchAction = 'non_match_action' in filterData ? filterData.non_match_action : 'drop';
  
  // Get filter logic description
  const getFilterDescription = () => {
    if (!filterLogic || typeof filterLogic !== 'object') return 'No filter logic';
    
    // Handle the different filter logic types
    if ('direction' in filterLogic) {
      return `Direction: ${filterLogic.direction}`;
    } else if ('message_type' in filterLogic) {
      return `Type: ${filterLogic.message_type}`;
    } else if ('request_method' in filterLogic) {
      return `Method: ${filterLogic.request_method}`;
    } else if ('and' in filterLogic) {
      return 'Multiple conditions (AND)';
    } else if ('or' in filterLogic) {
      return 'Multiple conditions (OR)';
    } else if ('not' in filterLogic) {
      return 'Negated condition';
    }
    
    return 'Complex filter';
  };
  
  // Get action description
  const getActionDescription = (action: any) => {
    if (action === 'send') return 'Send';
    if (action === 'drop') return 'Drop';
    if (typeof action === 'object' && action.intercept) return 'Intercept';
    return 'Unknown';
  };
  
  return (
    <div className={`node filter-node rounded-md border p-3 bg-card shadow-sm ${
      selected ? 'border-primary ring-2 ring-primary/20' : 'border-border'
    }`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 font-medium text-sm">
          <Filter size={16} className="text-primary/80" />
          <span>Filter</span>
        </div>
        
        <div className="text-xs">
          <div>{getFilterDescription()}</div>
          <div className="mt-1 flex justify-between">
            <span className="text-muted-foreground">Match:</span>
            <span className="font-medium">{getActionDescription(matchAction)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Non-match:</span>
            <span className="font-medium">{getActionDescription(nonMatchAction)}</span>
          </div>
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default FilterNode;