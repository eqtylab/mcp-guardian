import React from 'react';
import { Filter, BookOpen, UserCheck, GitMerge } from 'lucide-react';

interface InterceptorToolboxProps {
  onAddNode: (type: string) => void;
  disabled?: boolean;
}

// Define interceptor types with their metadata
const interceptorTypes = [
  {
    type: 'filter',
    icon: Filter,
    label: 'Filter',
    description: 'Conditionally process messages based on content or type',
  },
  {
    type: 'messagelog',
    icon: BookOpen,
    label: 'Message Log',
    description: 'Log messages for debugging and auditing',
  },
  {
    type: 'manualapproval',
    icon: UserCheck,
    label: 'Manual Approval',
    description: 'Require human approval before proceeding',
  },
  {
    type: 'chain',
    icon: GitMerge,
    label: 'Chain',
    description: 'Combine multiple interceptors in sequence',
  },
];

const InterceptorToolbox: React.FC<InterceptorToolboxProps> = ({ onAddNode, disabled = false }) => {
  // We'll now use click handlers instead of drag and drop for simplicity
  const handleClick = (nodeType: string) => {
    if (!disabled) {
      onAddNode(nodeType);
    }
  };
  
  return (
    <div>
      <h3 className="font-medium mb-3">Interceptors</h3>
      <div className="space-y-3">
        {interceptorTypes.map((interceptor) => (
          <div
            key={interceptor.type}
            className={`flex items-start p-3 border rounded-md shadow-sm ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-card/80'
            } transition-colors`}
            onClick={() => handleClick(interceptor.type)}
          >
            <div className="mr-3 mt-0.5">
              <interceptor.icon size={16} className="text-primary/80" />
            </div>
            <div>
              <div className="font-medium text-sm">{interceptor.label}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {interceptor.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterceptorToolbox;