import { FC, useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import type { FilterNodeData } from '../index';

// Micro component for compact select
const CompactSelect: React.FC<{
  value: string;
  options: {value: string, label: string}[];
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}> = ({ value, options, onChange, label, className = '' }) => (
  <div className={`text-xs ${className}`}>
    {label && <label className="block text-muted-foreground text-[10px] mb-0.5">{label}</label>}
    <select 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full py-1 px-1.5 rounded border border-border bg-background text-xs"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

// Use NodeProps from ReactFlow - fixed for proper type compatibility
const FilterNode = ({ data, selected, id }: NodeProps) => {
  // We need type guards to ensure we have the right data structure
  const filterData = data as FilterNodeData;
  const [expanded, setExpanded] = useState<boolean>(false);
  const [localFilterLogic, setLocalFilterLogic] = useState<any>(filterData?.filter_logic || { direction: 'inbound' });
  const [localMatchAction, setLocalMatchAction] = useState<string>(filterData?.match_action || 'send');
  const [localNonMatchAction, setLocalNonMatchAction] = useState<string>(filterData?.non_match_action || 'drop');
  const [filterType, setFilterType] = useState<string>('direction');
  
  // Initialize filter type
  useEffect(() => {
    if (localFilterLogic) {
      if ('direction' in localFilterLogic) setFilterType('direction');
      else if ('message_type' in localFilterLogic) setFilterType('message_type');
      else if ('request_method' in localFilterLogic) setFilterType('request_method');
      else if ('and' in localFilterLogic) setFilterType('and');
      else if ('or' in localFilterLogic) setFilterType('or');
      else if ('not' in localFilterLogic) setFilterType('not');
    }
  }, []);
  
  // Apply local changes to the node data
  const applyChanges = () => {
    // Create event to notify parent about data change
    const event = new CustomEvent('nodeDataChanged', {
      detail: {
        nodeId: id,
        data: {
          ...filterData,
          filter_logic: localFilterLogic,
          match_action: localMatchAction,
          non_match_action: localNonMatchAction,
        }
      }
    });
    document.dispatchEvent(event);
  };
  
  // Update filter logic type
  const updateFilterType = (type: string) => {
    let newFilterLogic: any = {};
    
    switch (type) {
      case 'direction':
        newFilterLogic = { direction: 'inbound' };
        break;
      case 'message_type':
        newFilterLogic = { message_type: 'request' };
        break;
      case 'request_method':
        newFilterLogic = { request_method: '' };
        break;
      case 'and':
        newFilterLogic = { and: [] };
        break;
      case 'or':
        newFilterLogic = { or: [] };
        break;
      case 'not':
        newFilterLogic = { not: { direction: 'inbound' } };
        break;
      default:
        newFilterLogic = { direction: 'inbound' };
    }
    
    setFilterType(type);
    setLocalFilterLogic(newFilterLogic);
    
    // Apply changes after state update
    setTimeout(() => {
      applyChanges();
    }, 0);
  };
  
  // Get filter logic description
  const getFilterDescription = () => {
    if (!localFilterLogic || typeof localFilterLogic !== 'object') return 'No filter logic';
    
    // Handle the different filter logic types
    if ('direction' in localFilterLogic) {
      return `${localFilterLogic.direction}`;
    } else if ('message_type' in localFilterLogic) {
      return `${localFilterLogic.message_type}`;
    } else if ('request_method' in localFilterLogic) {
      return `${localFilterLogic.request_method}`;
    } else if ('and' in localFilterLogic) {
      return 'AND condition';
    } else if ('or' in localFilterLogic) {
      return 'OR condition';
    } else if ('not' in localFilterLogic) {
      return 'NOT condition';
    }
    
    return 'Complex';
  };
  
  // Get action description
  const getActionDescription = (action: any) => {
    if (action === 'send') return 'Send';
    if (action === 'drop') return 'Drop';
    if (action === 'intercept') return 'Intercept';
    if (typeof action === 'object' && action.intercept) return 'Intercept';
    return 'Unknown';
  };
  
  return (
    <div 
      className={`node filter-node rounded-lg border p-3 bg-background shadow-sm ${
        expanded ? 'w-[280px]' : 'max-w-[200px]'
      } ${
        selected ? 'border-primary ring-2 ring-primary/20' : 'border-muted'
      }`}
      style={{ zIndex: 5, visibility: 'visible', pointerEvents: 'all' }}
    >
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 border border-amber-400 dark:border-amber-600 bg-amber-500"
        style={{ zIndex: 6 }}
      />
      
      {/* Header row */}
      <div className="flex items-center justify-between gap-2">
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
        
        {/* Toggle button for expand/collapse */}
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/30 transition-colors"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>
      
      {/* Compact summary when not expanded */}
      {!expanded && (
        <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
          <span className="text-muted-foreground">Match:</span>
          <span className="font-medium truncate">{getActionDescription(localMatchAction)}</span>
          <span className="text-muted-foreground">Non-match:</span>
          <span className="font-medium truncate">{getActionDescription(localNonMatchAction)}</span>
        </div>
      )}
      
      {/* Configuration content when expanded */}
      {expanded && (
        <div className="mt-3 border-t border-muted pt-3 space-y-3">
          <div className="grid grid-cols-1 gap-y-3">
            {/* Filter Type */}
            <CompactSelect
              label="Filter Type"
              value={filterType}
              options={[
                { value: 'direction', label: 'Direction' },
                { value: 'message_type', label: 'Message Type' },
                { value: 'request_method', label: 'Request Method' },
                { value: 'and', label: 'AND Condition' },
                { value: 'or', label: 'OR Condition' },
                { value: 'not', label: 'NOT Condition' }
              ]}
              onChange={updateFilterType}
            />
            
            {/* Condition specific fields */}
            {filterType === 'direction' && (
              <CompactSelect
                label="Direction"
                value={localFilterLogic.direction || 'inbound'}
                options={[
                  { value: 'inbound', label: 'Inbound' },
                  { value: 'outbound', label: 'Outbound' }
                ]}
                onChange={(value) => {
                  setLocalFilterLogic({ ...localFilterLogic, direction: value });
                  setTimeout(applyChanges, 0);
                }}
              />
            )}
            
            {filterType === 'message_type' && (
              <CompactSelect
                label="Message Type"
                value={localFilterLogic.message_type || 'request'}
                options={[
                  { value: 'request', label: 'Request' },
                  { value: 'response', label: 'Response' },
                  { value: 'responseSuccess', label: 'Response Success' },
                  { value: 'responseFailure', label: 'Response Failure' },
                  { value: 'notification', label: 'Notification' },
                  { value: 'unknown', label: 'Unknown' }
                ]}
                onChange={(value) => {
                  setLocalFilterLogic({ ...localFilterLogic, message_type: value });
                  setTimeout(applyChanges, 0);
                }}
              />
            )}
            
            {filterType === 'request_method' && (
              <div className="text-xs">
                <label className="block text-muted-foreground text-[10px] mb-0.5">Request Method</label>
                <input
                  type="text"
                  value={localFilterLogic.request_method || ''}
                  onChange={(e) => {
                    setLocalFilterLogic({ ...localFilterLogic, request_method: e.target.value });
                    setTimeout(applyChanges, 0);
                  }}
                  placeholder="Enter method name"
                  className="w-full py-1 px-1.5 rounded border border-border bg-background text-xs"
                />
              </div>
            )}
            
            {(filterType === 'and' || filterType === 'or' || filterType === 'not') && (
              <div className="text-xs p-1.5 border border-amber-500/20 bg-amber-50/20 dark:bg-amber-950/20 rounded text-amber-600 dark:text-amber-400">
                <div className="flex items-center gap-1 mb-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                    <path d="M12 16v.01"/>
                    <path d="M12 8v4"/>
                  </svg>
                  <span className="font-medium">Complex Condition</span>
                </div>
                Complex conditions must be edited in the property panel JSON view
              </div>
            )}
            
            {/* Match Actions */}
            <div className="grid grid-cols-2 gap-x-2">
              <CompactSelect
                label="Match Action"
                value={localMatchAction}
                options={[
                  { value: 'send', label: 'Send' },
                  { value: 'drop', label: 'Drop' },
                  { value: 'intercept', label: 'Intercept' }
                ]}
                onChange={(value) => {
                  setLocalMatchAction(value);
                  setTimeout(applyChanges, 0);
                }}
              />
              
              <CompactSelect
                label="Non-Match Action"
                value={localNonMatchAction}
                options={[
                  { value: 'send', label: 'Send' },
                  { value: 'drop', label: 'Drop' },
                  { value: 'intercept', label: 'Intercept' }
                ]}
                onChange={(value) => {
                  setLocalNonMatchAction(value);
                  setTimeout(applyChanges, 0);
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 border border-amber-400 dark:border-amber-600 bg-amber-500"
        style={{ zIndex: 6 }}
      />
    </div>
  );
};

export default FilterNode;