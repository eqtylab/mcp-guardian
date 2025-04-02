import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
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
  
  // Reset local data when the selected node changes
  useEffect(() => {
    setLocalData(node.data);
  }, [node.id, node.data]);
  
  // Apply changes to the node
  const handleApplyChanges = () => {
    onChange(node.id, localData);
  };
  
  // Update local state when a field changes - type-safe version
  const handleFieldChange = <K extends string, V>(field: K, value: V) => {
    setLocalData((prevData: any) => ({
      ...prevData,
      [field]: value,
    }));
  };
  
  // Handle nested object field changes - type-safe version
  const handleNestedFieldChange = <P extends string, K extends string, V>(parentField: P, field: K, value: V) => {
    setLocalData((prevData: any) => {
      const parent = prevData[parentField];
      if (typeof parent === 'object' && parent !== null) {
        return {
          ...prevData,
          [parentField]: {
            ...parent,
            [field]: value,
          },
        };
      }
      return prevData;
    });
  };
  
  // Render form based on node type
  const renderForm = () => {
    switch (node.type) {
      case 'filter':
        return renderFilterForm();
      case 'messagelog':
        return renderMessageLogForm();
      case 'manualapproval':
        return renderManualApprovalForm();
      case 'chain':
        return renderChainForm();
      default:
        return <div>Unknown node type</div>;
    }
  };
  
  // Render form for FilterNode
  const renderFilterForm = () => {
    // Cast to FilterNodeData to ensure correct typing for this form
    const filterData = localData as FilterNodeData;
    const filterLogic = filterData.filter_logic || { direction: 'inbound' };
    const filterType = Object.keys(filterLogic)[0] || 'direction';
    
    return (
      <>
        <h3 className="font-medium mb-3">Filter Properties</h3>
        
        <FormField className="mb-4">
          <FormLabel htmlFor="filter-type">Filter Type</FormLabel>
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
              // id removed
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
              // id removed
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
              // id removed
              value={'request_method' in filterLogic ? filterLogic.request_method : ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNestedFieldChange('filter_logic', 'request_method', e.target.value)}
              placeholder="Enter method name"
              disabled={disabled}
            />
          </FormField>
        )}
        
        {/* For compound conditions (AND, OR, NOT), we'll add a message for now */}
        {(filterType === 'and' || filterType === 'or' || filterType === 'not') && (
          <div className="text-sm text-colors-text-tertiary mb-4">
            Complex conditions must be edited in JSON format.
          </div>
        )}
        
        <FormField className="mb-4">
          <FormLabel htmlFor="match-action">Match Action</FormLabel>
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
          <FormLabel htmlFor="non-match-action">Non-Match Action</FormLabel>
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
      </>
    );
  };
  
  // Render form for MessageLogNode
  const renderMessageLogForm = () => {
    return (
      <>
        <h3 className="font-medium mb-3">Message Log Properties</h3>
        
        <FormField className="mb-4">
          <FormLabel htmlFor="log-level">Log Level</FormLabel>
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
      </>
    );
  };
  
  // Render form for ManualApprovalNode
  const renderManualApprovalForm = () => {
    return (
      <>
        <h3 className="font-medium mb-3">Manual Approval Properties</h3>
        
        <div className="text-sm text-colors-text-tertiary mb-4">
          Manual approval interceptors do not have configurable properties.
        </div>
      </>
    );
  };
  
  // Render form for ChainNode
  const renderChainForm = () => {
    const chainConfig = localData.chain || [];
    const chainLength = Array.isArray(chainConfig) ? chainConfig.length : 0;
    
    return (
      <>
        <h3 className="font-medium mb-3">Chain Properties</h3>
        
        <div className="text-sm mb-4">
          <div>This node acts as a container for a chain of interceptors.</div>
          <div className="mt-2">
            <span className="text-colors-text-tertiary">Interceptors in chain: </span>
            <span className="font-medium">{chainLength}</span>
          </div>
        </div>
        
        <div className="text-sm text-colors-text-tertiary mb-4">
          Connect additional interceptors to this node to build your chain. The order of connections matters.
        </div>
      </>
    );
  };
  
  return (
    <div className="property-panel">
      {renderForm()}
      
      {!disabled && (
        <div className="mt-4">
          <Button
            variant="primary"
            className="w-full"
            onClick={handleApplyChanges}
          >
            Apply Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default PropertyPanel;