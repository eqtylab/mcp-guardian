import React, { useState, useEffect, SVGProps } from 'react';
import { Input } from '../ui/input';
import { FormField, FormLabel } from '../ui/form-field';

// Create a simple select component that is compatible with our use case
const BasicSelect: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ value, onChange, disabled, children }) => (
  <select 
    value={value}
    onChange={onChange}
    disabled={disabled}
    className="flex h-9 w-full items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
  >
    {children}
  </select>
);

import { GuardProfileNode, FilterNodeData, MessageLogNodeData, ManualApprovalNodeData, ChainNodeData } from './index';

interface PropertyPanelProps {
  node: GuardProfileNode;
  onChange: (nodeId: string, data: FilterNodeData | MessageLogNodeData | ManualApprovalNodeData | ChainNodeData) => void;
  disabled?: boolean;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({ node, onChange, disabled = false }) => {
  // We start with unknown type because the node data can be of different types
  const [localData, setLocalData] = useState<any>(node.data);
  
  // Reset local data when the selected node changes (including type changes)
  useEffect(() => {
    setLocalData(node.data);
  }, [node.id, node.type, node.data]);
  
  // Update local state when a field changes - type-safe version with auto-apply
  const handleFieldChange = <K extends string, V>(field: K, value: V) => {
    const newData = {
      ...localData,
      [field]: value,
    };
    setLocalData(newData);
    
    // Automatically apply changes after a short delay
    setTimeout(() => {
      onChange(node.id, newData);
    }, 0);
  };
  
  // Handle nested object field changes - type-safe version with auto-apply
  const handleNestedFieldChange = <P extends string, K extends string, V>(parentField: P, field: K, value: V) => {
    let newData: any = localData;
    
    // Make sure parent exists and is an object
    const parent = localData[parentField];
    if (typeof parent === 'object' && parent !== null) {
      newData = {
        ...localData,
        [parentField]: {
          ...parent,
          [field]: value,
        },
      };
      
      setLocalData(newData);
      
      // Automatically apply changes after a short delay
      setTimeout(() => {
        onChange(node.id, newData);
      }, 0);
    }
  };
  
  // Get detailed information about the interceptor type
  const getInterceptorInfo = () => {
    switch (node.type) {
      case 'filter':
        return {
          title: 'Filter Interceptor',
          tagline: 'Message criteria-based control',
          description: 'Conditionally process messages based on content, direction, or message type. Filters can send, drop, or intercept messages based on matching criteria.',
          details: [
            'Apply different actions to messages that match vs. don\'t match criteria',
            'Filter by direction (inbound/outbound), message type, or request method',
            'Use logical operators (AND, OR, NOT) for complex conditions',
            'Actions include: send (pass through), drop (discard), or intercept (stop for review)'
          ],
          color: 'amber',
          icon: 'filter',
          docsUrl: 'https://docs.example.com/mcp-guardian/interceptors/filter'
        };
      case 'messagelog':
        return {
          title: 'Message Log Interceptor',
          tagline: 'Transparent message inspection',
          description: 'Log messages passing through the system at different severity levels. Useful for debugging, auditing, and monitoring message flow without affecting processing.',
          details: [
            'Choose from five logging severity levels (Error, Warn, Info, Debug, Trace)',
            'Logs message content without modifying or blocking it',
            'Use for debugging, compliance, and activity monitoring',
            'Create audit trails of all message traffic through the system'
          ],
          color: 'emerald',
          icon: 'file-text',
          docsUrl: 'https://docs.example.com/mcp-guardian/interceptors/messagelog'
        };
      case 'manualapproval':
        return {
          title: 'Manual Approval Interceptor',
          tagline: 'Human-in-the-loop verification',
          description: 'Requires human approval before messages can proceed through the system. Creates approval requests that must be explicitly accepted or rejected.',
          details: [
            'Halts message processing until explicit approval is provided',
            'Presents message content for review in the pending messages queue',
            'Provides approve/reject options with optional comments',
            'Ideal for sensitive operations or high-risk AI interactions'
          ],
          color: 'violet',
          icon: 'user-check',
          docsUrl: 'https://docs.example.com/mcp-guardian/interceptors/manualapproval'
        };
      case 'chain':
        return {
          title: 'Chain Interceptor',
          tagline: 'Multi-stage processing pipeline',
          description: 'Combines multiple interceptors to be processed in sequence. Allows creating complex processing pipelines with multiple steps and conditions.',
          details: [
            'Connect multiple interceptors in a specific processing order',
            'Create sophisticated approval workflows with multiple checks',
            'Each interceptor in the chain is executed in sequence',
            'Enables complex logic without writing custom code'
          ],
          color: 'blue',
          icon: 'link',
          docsUrl: 'https://docs.example.com/mcp-guardian/interceptors/chain'
        };
      default:
        return {
          title: 'Unknown Interceptor',
          tagline: 'Unrecognized node type',
          description: 'No information available for this interceptor type.',
          details: [],
          color: 'gray',
          icon: 'help-circle',
          docsUrl: ''
        };
    }
  };

  // Render form based on node type
  const renderForm = () => {
    const info = getInterceptorInfo();
    
    // Determine icon component
    const renderIcon = (iconName: string, color: string) => {
      const iconSize = 18;
      const colorClass = `text-${color}-500 dark:text-${color}-400`;
      
      // Common SVG props
      const svgProps: SVGProps<SVGSVGElement> = {
        width: iconSize,
        height: iconSize,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round" as "round",
        strokeLinejoin: "round" as "round",
        className: `lucide lucide-${iconName} ${colorClass}`
      };
      
      // Select icon based on name
      switch (iconName) {
        case 'filter':
          return (
            <svg {...svgProps}>
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
          );
        case 'file-text':
          return (
            <svg {...svgProps}>
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <line x1="10" y1="9" x2="8" y2="9"/>
            </svg>
          );
        case 'user-check':
          return (
            <svg {...svgProps}>
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <polyline points="16 11 18 13 22 9"/>
            </svg>
          );
        case 'link':
          return (
            <svg {...svgProps}>
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          );
        default:
          return (
            <svg {...svgProps}>
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          );
      }
    };
    
    return (
      <>
        <div className={`mb-6 pb-4 border-b border-border relative overflow-hidden`}>
          {/* Subtle background grid for cyberpunk feel */}
          <div className="cyber-card-grid-subtle absolute inset-0 opacity-30" />
          
          <div className="relative">
            {/* Header with icon */}
            <div className="flex items-center gap-2 mb-2">
              {/* Icon with color-specific background */}
              <div className={`flex-shrink-0 w-8 h-8 bg-${info.color}-100 dark:bg-${info.color}-900/30 rounded-md flex items-center justify-center`}>
                {renderIcon(info.icon, info.color)}
              </div>
              
              <div>
                <h3 className="font-medium text-foreground">{info.title}</h3>
                <p className="text-xs text-muted-foreground cyber-text-glow">
                  {info.tagline}
                </p>
              </div>
            </div>
            
            {/* Main description */}
            <p className="text-sm text-foreground/80 mb-3 leading-relaxed">
              {info.description}
            </p>
            
            {/* Bullet points for details */}
            {info.details.length > 0 && (
              <div className="bg-muted/30 rounded p-3 mb-3 cyber-card-grid-subtle relative overflow-hidden">
                <h4 className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-medium">Key Capabilities</h4>
                <ul className="space-y-1 text-xs text-foreground/80 pl-4 list-disc">
                  {info.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Documentation link with cyber styling */}
            {info.docsUrl && (
              <a 
                href={info.docsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`text-xs inline-flex items-center gap-1 text-${info.color}-500 dark:text-${info.color}-400 hover:underline cyber-btn-enhanced py-1 px-2 rounded`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                View documentation
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-b border-border -mx-4 px-4 py-2 mb-4 bg-muted/30">
          <h4 className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
            Configuration
          </h4>
        </div>

        {node.type === 'filter' && renderFilterForm()}
        {node.type === 'messagelog' && renderMessageLogForm()}
        {node.type === 'manualapproval' && renderManualApprovalForm()}
        {node.type === 'chain' && renderChainForm()}
      </>
    );
  };
  
  // Render form for FilterNode
  const renderFilterForm = () => {
    // Cast to FilterNodeData to ensure correct typing for this form
    const filterData = localData as FilterNodeData;
    const filterLogic = filterData.filter_logic || { direction: 'inbound' };
    const filterType = Object.keys(filterLogic)[0] || 'direction';
    const info = getInterceptorInfo();
    
    return (
      <div className="space-y-4">
        <FormField className="mb-4">
          <FormLabel htmlFor="filter-type" className={`text-${info.color}-600 dark:text-${info.color}-400`}>Filter Type</FormLabel>
          <BasicSelect
            value={filterType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              // Create a new filter logic object based on the selected type
              let newFilterLogic: any = {};
              
              switch (e.target.value) {
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
              
              handleFieldChange('filter_logic', newFilterLogic);
            }}
            disabled={disabled}
          >
            <option value="direction">Direction</option>
            <option value="message_type">Message Type</option>
            <option value="request_method">Request Method</option>
            <option value="and">AND Condition</option>
            <option value="or">OR Condition</option>
            <option value="not">NOT Condition</option>
          </BasicSelect>
        </FormField>
        
        {/* Render different inputs based on the filter type */}
        {filterType === 'direction' && (
          <FormField className="mb-4">
            <FormLabel htmlFor="direction">Direction</FormLabel>
            <BasicSelect
              value={'direction' in filterLogic ? filterLogic.direction : 'inbound'}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleNestedFieldChange('filter_logic', 'direction', e.target.value)}
              disabled={disabled}
            >
              <option value="inbound">Inbound</option>
              <option value="outbound">Outbound</option>
            </BasicSelect>
          </FormField>
        )}
        
        {filterType === 'message_type' && (
          <FormField className="mb-4">
            <FormLabel htmlFor="message-type">Message Type</FormLabel>
            <BasicSelect
              value={'message_type' in filterLogic ? filterLogic.message_type : 'request'}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleNestedFieldChange('filter_logic', 'message_type', e.target.value)}
              disabled={disabled}
            >
              <option value="request">Request</option>
              <option value="response">Response</option>
              <option value="responseSuccess">Response Success</option>
              <option value="responseFailure">Response Failure</option>
              <option value="notification">Notification</option>
              <option value="unknown">Unknown</option>
            </BasicSelect>
          </FormField>
        )}
        
        {filterType === 'request_method' && (
          <FormField className="mb-4">
            <FormLabel htmlFor="request-method">Request Method</FormLabel>
            <Input
              value={'request_method' in filterLogic ? filterLogic.request_method : ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNestedFieldChange('filter_logic', 'request_method', e.target.value)}
              placeholder="Enter method name"
              disabled={disabled}
            />
          </FormField>
        )}
        
        {/* For compound conditions (AND, OR, NOT), we'll add a message with cyber styling */}
        {(filterType === 'and' || filterType === 'or' || filterType === 'not') && (
          <div className={`text-sm text-muted-foreground mb-4 p-3 border border-${info.color}-500/30 rounded bg-muted/20`}>
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-${info.color}-500`}>
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <path d="m15 9-6 6"/>
                <path d="m9 9 6 6"/>
              </svg>
              Complex conditions must be edited in JSON format.
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <FormField className="mb-4">
            <FormLabel htmlFor="match-action" className={`text-${info.color}-600 dark:text-${info.color}-400`}>Match Action</FormLabel>
            <BasicSelect
              value={typeof localData.match_action === 'string' ? localData.match_action : 'intercept'}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('match_action', e.target.value)}
              disabled={disabled}
            >
              <option value="send">Send</option>
              <option value="drop">Drop</option>
              <option value="intercept">Intercept</option>
            </BasicSelect>
          </FormField>
          
          <FormField className="mb-4">
            <FormLabel htmlFor="non-match-action" className={`text-${info.color}-600 dark:text-${info.color}-400`}>Non-Match Action</FormLabel>
            <BasicSelect
              value={typeof localData.non_match_action === 'string' ? localData.non_match_action : 'intercept'}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('non_match_action', e.target.value)}
              disabled={disabled}
            >
              <option value="send">Send</option>
              <option value="drop">Drop</option>
              <option value="intercept">Intercept</option>
            </BasicSelect>
          </FormField>
        </div>
      </div>
    );
  };
  
  // Render form for MessageLogNode
  const renderMessageLogForm = () => {
    const info = getInterceptorInfo();
    return (
      <div className="space-y-4">
        <FormField className="mb-4">
          <FormLabel htmlFor="log-level" className={`text-${info.color}-600 dark:text-${info.color}-400`}>Log Level</FormLabel>
          <BasicSelect
            value={(localData as MessageLogNodeData).log_level || 'Info'}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange('log_level', e.target.value)}
            disabled={disabled}
          >
            <option value="Error">Error</option>
            <option value="Warn">Warn</option>
            <option value="Info">Info</option>
            <option value="Debug">Debug</option>
            <option value="Trace">Trace</option>
          </BasicSelect>
        </FormField>
        
        {/* Log level description helper */}
        <div className={`text-sm bg-${info.color}-50 dark:bg-${info.color}-950/30 p-3 rounded border border-${info.color}-200 dark:border-${info.color}-800/50`}>
          <h5 className={`text-${info.color}-700 dark:text-${info.color}-300 text-xs font-medium mb-1`}>About Log Levels</h5>
          <div className="grid grid-cols-5 gap-1 text-xs">
            <div className={`p-1 rounded bg-red-100 dark:bg-red-900/30 text-center font-medium text-red-600 dark:text-red-400`}>Error</div>
            <div className={`p-1 rounded bg-orange-100 dark:bg-orange-900/30 text-center font-medium text-orange-600 dark:text-orange-400`}>Warn</div>
            <div className={`p-1 rounded bg-${info.color}-100 dark:bg-${info.color}-900/30 text-center font-medium text-${info.color}-600 dark:text-${info.color}-400`}>Info</div>
            <div className={`p-1 rounded bg-blue-100 dark:bg-blue-900/30 text-center font-medium text-blue-600 dark:text-blue-400`}>Debug</div>
            <div className={`p-1 rounded bg-gray-100 dark:bg-gray-900/30 text-center font-medium text-gray-600 dark:text-gray-400`}>Trace</div>
          </div>
          <p className="text-xs mt-2 text-muted-foreground">
            Higher verbosity levels include all lower levels. For production use, Info is recommended.
          </p>
        </div>
      </div>
    );
  };
  
  // Render form for ManualApprovalNode
  const renderManualApprovalForm = () => {
    const info = getInterceptorInfo();
    return (
      <div className="space-y-4">
        <div className={`p-4 border border-${info.color}-500/30 rounded bg-muted/20 cyber-card-grid-subtle relative overflow-hidden`}>
          <div className="flex items-center gap-2 mb-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-${info.color}-500`}>
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
              <path d="M12 16v.01"/>
              <path d="M12 8v4"/>
            </svg>
            <span className={`text-${info.color}-600 dark:text-${info.color}-400 font-medium text-sm`}>Note</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Manual approval interceptors require human intervention. When a message matches this interceptor, it will appear in the Pending Messages queue for manual review.
          </p>
          
          <div className="mt-3 flex items-center gap-2">
            <div className={`p-1 px-2 rounded bg-${info.color}-100 dark:bg-${info.color}-900/30 text-xs font-medium text-${info.color}-600 dark:text-${info.color}-400 cyber-text-glow`}>
              No Configuration Required
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render form for ChainNode
  const renderChainForm = () => {
    const chainConfig = localData.chain || [];
    const chainLength = Array.isArray(chainConfig) ? chainConfig.length : 0;
    const info = getInterceptorInfo();
    
    return (
      <div className="space-y-4">
        <div className={`p-4 border border-${info.color}-500/30 rounded bg-muted/20 cyber-card-grid-subtle`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-${info.color}-500`}>
                <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4"/>
                <path d="M19 17V5a2 2 0 0 0-2-2H4"/>
              </svg>
              <span className={`text-${info.color}-600 dark:text-${info.color}-400 font-medium text-sm`}>Chain Information</span>
            </div>
            
            <div className={`py-1 px-2 rounded-full bg-${info.color}-100 dark:bg-${info.color}-900/30 text-xs font-medium text-${info.color}-600 dark:text-${info.color}-400`}>
              {chainLength} interceptor{chainLength !== 1 ? 's' : ''}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            Chain interceptors execute multiple interceptors in sequence. The processing order is determined by how you connect the interceptors.
          </p>
          
          {chainLength === 0 ? (
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              No interceptors in chain
            </div>
          ) : (
            <div className="bg-background/50 border border-border rounded p-2">
              <div className="text-xs font-medium mb-1">Chain Execution Order:</div>
              <ol className="pl-5 text-xs list-decimal">
                {Array.isArray(chainConfig) && chainConfig.map((item: any, index: number) => (
                  <li key={index} className="text-muted-foreground">
                    {item.type || 'Unknown'} Interceptor
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Get a color-specific class string based on the interceptor type
  const getTypeColorClasses = () => {
    const info = getInterceptorInfo();
    return {
      borderColor: `border-${info.color}-500/30`,
      bgColor: `bg-${info.color}-50 dark:bg-${info.color}-900/10`,
      textColor: `text-${info.color}-600 dark:text-${info.color}-400`,
      iconBgColor: `bg-${info.color}-100 dark:bg-${info.color}-900/30`,
    };
  };

  // No node selected state
  if (!node || !node.type) {
    return (
      <div className="property-panel p-4 h-full flex flex-col items-center justify-center text-center border-l border-border">
        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mb-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="12" cy="12" r="1" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-1">No Node Selected</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Select a node in the diagram to view and edit its properties here.
        </p>
      </div>
    );
  }

  const colorClasses = getTypeColorClasses();
  
  return (
    <div className="property-panel h-full overflow-y-auto border-l border-border">
      {/* Header with node type indicator */}
      <div className={`sticky top-0 z-10 px-4 py-3 border-b ${colorClasses.borderColor} ${colorClasses.bgColor} flex items-center gap-2`}>
        <div className={`w-3 h-3 rounded-full ${colorClasses.textColor} ring-2 ring-current opacity-80`} />
        <h3 className={`text-sm font-medium ${colorClasses.textColor}`}>
          {node.type.charAt(0).toUpperCase() + node.type.slice(1)} Properties
        </h3>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {renderForm()}
      </div>
      
      {/* Footer with optional debug info */}
      <div className="mt-auto p-2 border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <div>Node ID: {node.id.substring(0, 8)}</div>
          <div>Type: {node.type}</div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPanel;