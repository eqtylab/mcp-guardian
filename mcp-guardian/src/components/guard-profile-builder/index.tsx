import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { 
  ReactFlow, 
  Background,
  Controls,
  MarkerType,
  useEdgesState,
  useNodesState,
  addEdge,
  Connection,
  ConnectionMode,
  ReactFlowProvider,
  NodeTypes,
  applyNodeChanges,
  applyEdgeChanges
} from '@xyflow/react';
import { GitMerge } from 'lucide-react';
import type { 
  Node, 
  Edge,
  NodeChange,
  EdgeChange
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Import types from bindings
import { GuardProfile } from '../../bindings/GuardProfile';
import { MessageInterceptorGuardConfig } from '../../bindings/MessageInterceptorGuardConfig';
import { FilterLogicGuardConfig } from '../../bindings/FilterLogicGuardConfig';
import { FilterActionGuardConfig } from '../../bindings/FilterActionGuardConfig';

// Define strongly typed interfaces for our node data that conform to Record<string, unknown> requirement
export interface FilterNodeData extends Record<string, unknown> {
  type: 'Filter';
  filter_logic: FilterLogicGuardConfig;
  match_action: FilterActionGuardConfig;
  non_match_action: FilterActionGuardConfig;
}

export interface MessageLogNodeData extends Record<string, unknown> {
  type: 'MessageLog';
  log_level: string;
}

export interface ManualApprovalNodeData extends Record<string, unknown> {
  type: 'ManualApproval';
}

export interface ChainNodeData extends Record<string, unknown> {
  type: 'Chain';
  chain: MessageInterceptorGuardConfig[];
}

// Custom node type for our ReactFlow node data
export type GuardProfileNode = Node<
  FilterNodeData | MessageLogNodeData | ManualApprovalNodeData | ChainNodeData
>;

import FilterNode from './nodes/filter-node';
import ChainNode from './nodes/chain-node';
import MessageLogNode from './nodes/messagelog-node';
import ManualApprovalNode from './nodes/manualapproval-node';
import InputNode from './nodes/input-node';
import OutputNode from './nodes/output-node';
import InterceptorToolbox from './interceptor-toolbox';
import PropertyPanel from './property-panel';

// Define node types
const nodeTypes: NodeTypes = {
  filter: FilterNode,
  chain: ChainNode,
  messagelog: MessageLogNode,
  manualapproval: ManualApprovalNode,
  input: InputNode,
  output: OutputNode,
};

interface GuardProfileVisualBuilderProps {
  profile: GuardProfile;
  onChange: (profile: GuardProfile) => void;
  readOnly?: boolean;
}

/**
 * Transform a GuardProfile into ReactFlow nodes and edges
 */
// Define types for static input/output nodes
export interface InputNodeData extends Record<string, unknown> {
  type: 'Input';
}

export interface OutputNodeData extends Record<string, unknown> {
  type: 'Output';
}

export const convertProfileToFlow = (profile: GuardProfile): { nodes: Node[], edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // Add input node (static)
  nodes.push({
    id: 'node-input',
    type: 'input', // Custom node type for input
    position: { x: 100, y: 100 },
    data: { type: 'Input' } as InputNodeData,
    draggable: true // Make input node draggable
  });
  
  // Start with a single node for simple interceptor
  if (profile.primary_message_interceptor.type !== 'Chain') {
    // Single node for primary interceptor
    const nodeId = 'node-primary';
    nodes.push({
      id: nodeId,
      type: profile.primary_message_interceptor.type.toLowerCase(),
      position: { x: 300, y: 100 },
      data: { ...profile.primary_message_interceptor } as FilterNodeData | MessageLogNodeData | ManualApprovalNodeData,
      draggable: true,
    });
    
    // Connect input to the primary interceptor
    edges.push({
      id: `edge-input-${nodeId}`,
      source: 'node-input',
      target: nodeId,
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    });
    
    // Add output node (static)
    nodes.push({
      id: 'node-output',
      type: 'output', // Custom node type for output
      position: { x: 500, y: 100 },
      data: { type: 'Output' } as OutputNodeData,
      draggable: true // Make output node draggable
    });
    
    // Connect primary interceptor to output
    edges.push({
      id: `edge-${nodeId}-output`,
      source: nodeId,
      target: 'node-output',
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    });
    
    return { nodes, edges };
  }
  
  // Handle chain interceptor - safe way to handle the type with TypeScript
  if (profile.primary_message_interceptor.type === 'Chain') {
    const chainInterceptor = profile.primary_message_interceptor;
    
    // Create the chain container node
    const chainNodeId = 'node-chain';
    nodes.push({
      id: chainNodeId,
      type: 'chain',
      position: { x: 300, y: 100 },
      data: { 
        type: 'Chain',
        chain: chainInterceptor.chain 
      } as ChainNodeData,
      draggable: true,
    });
    
    // Connect input to the chain
    edges.push({
      id: `edge-input-${chainNodeId}`,
      source: 'node-input',
      target: chainNodeId,
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    });
    
    // Add child nodes for each interceptor in the chain
    let prevNodeId = chainNodeId;
    chainInterceptor.chain.forEach((interceptor, index) => {
      const nodeId = `node-${index}`;
      
      // Create node for this interceptor with proper typing
      nodes.push({
        id: nodeId,
        type: interceptor.type.toLowerCase(),
        position: { x: 300, y: 250 + index * 150 },
        data: { ...interceptor } as FilterNodeData | MessageLogNodeData | ManualApprovalNodeData,
        draggable: true,
      });
      
      // Create edge connecting to previous node
      edges.push({
        id: `edge-${prevNodeId}-${nodeId}`,
        source: prevNodeId,
        target: nodeId,
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      });
      
      prevNodeId = nodeId;
    });
    
    // Add output node (static)
    nodes.push({
      id: 'node-output',
      type: 'output', // Custom node type for output
      position: { x: 500, y: 100 },
      data: { type: 'Output' } as OutputNodeData,
      draggable: true // Make output node draggable
    });
    
    // Connect last chain node to output if there are chain nodes
    if (chainInterceptor.chain.length > 0) {
      const lastNodeId = `node-${chainInterceptor.chain.length - 1}`;
      edges.push({
        id: `edge-${lastNodeId}-output`,
        source: lastNodeId,
        target: 'node-output',
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      });
    } else {
      // If chain is empty, connect chain node directly to output
      edges.push({
        id: `edge-${chainNodeId}-output`,
        source: chainNodeId,
        target: 'node-output',
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      });
    }
  }
  
  return { nodes, edges };
};

/**
 * Transform ReactFlow nodes and edges back into a GuardProfile
 */
export const convertFlowToProfile = (nodes: Node[], edges: Edge[]): GuardProfile => {
  // Helper function to extract valid MessageInterceptorGuardConfig from node data
  const getInterceptorFromNode = (node: Node): MessageInterceptorGuardConfig => {
    if (node.type === 'filter') {
      const data = node.data as FilterNodeData;
      return {
        type: 'Filter',
        filter_logic: data.filter_logic,
        match_action: data.match_action,
        non_match_action: data.non_match_action,
      };
    } else if (node.type === 'messagelog') {
      const data = node.data as MessageLogNodeData;
      return {
        type: 'MessageLog',
        log_level: data.log_level,
      };
    } else if (node.type === 'manualapproval') {
      // ManualApprovalGuardConfig is Record<string, never>
      return {
        type: 'ManualApproval'
      } as MessageInterceptorGuardConfig;
    } else {
      // Default fallback - should never happen with proper validation
      return {
        type: 'MessageLog',
        log_level: 'Info',
      };
    }
  };

  // Filter out static input/output nodes
  const interceptorNodes = nodes.filter(node => 
    node.type !== 'input' && node.type !== 'output'
  );
  
  // Find non-static nodes (actual interceptors)
  if (interceptorNodes.length === 0) {
    // No interceptors defined, return default
    return {
      primary_message_interceptor: {
        type: 'MessageLog',
        log_level: 'Info',
      },
    };
  }
  
  // Handle case with only a single interceptor node (non-chain)
  if (interceptorNodes.length === 1) {
    const node = interceptorNodes[0];
    if (node.type !== 'chain') {
      return {
        primary_message_interceptor: getInterceptorFromNode(node),
      };
    }
  }
  
  // Find the chain node
  const chainNode = interceptorNodes.find(node => node.type === 'chain');
  if (!chainNode) {
    // If no chain node but we have multiple interceptors, use the first one as primary
    const firstNode = interceptorNodes[0];
    return {
      primary_message_interceptor: getInterceptorFromNode(firstNode),
    };
  }
  
  // Build a directed graph from the edges
  const edgeMap = new Map<string, string[]>();
  edges.forEach(edge => {
    if (!edgeMap.has(edge.source)) {
      edgeMap.set(edge.source, []);
    }
    edgeMap.get(edge.source)?.push(edge.target);
  });
  
  // Build chain by following edges from the chain node
  const chainInterceptors: MessageInterceptorGuardConfig[] = [];
  let currentNodeId = chainNode.id;
  
  // Follow the chain until we reach a node with no outgoing edges or the output node
  while (edgeMap.has(currentNodeId)) {
    const nextNodeIds = edgeMap.get(currentNodeId) || [];
    if (nextNodeIds.length === 0) break;
    
    const nextNodeId = nextNodeIds[0]; // Follow first connection
    const nextNode = nodes.find(node => node.id === nextNodeId);
    
    // Skip if next node is the output node
    if (nextNode && nextNode.type === 'output') break;
    
    if (nextNode && nextNode.type !== 'chain' && nextNode.type !== 'input' && nextNode.type !== 'output') {
      // Extract the interceptor data based on node type
      const interceptor = getInterceptorFromNode(nextNode);
      chainInterceptors.push(interceptor);
    }
    
    currentNodeId = nextNodeId;
  }
  
  // Create the chain guard profile
  return {
    primary_message_interceptor: {
      type: 'Chain',
      chain: chainInterceptors,
    },
  };
};

const GuardProfileVisualBuilder: React.FC<GuardProfileVisualBuilderProps> = ({
  profile,
  onChange,
  readOnly = false,
}) => {
  // Use a reference to track the current profile ID for change detection
  const profileRef = useRef<string>("");
  const currentProfileId = `${profile.primary_message_interceptor.type}_${JSON.stringify(profile)}`;
  
  // State for loading control
  const [loading, setLoading] = useState(true);
  
  // Store expanded state for each node
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  
  // Setup the flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<GuardProfileNode | null>(null);
  
  // We'll use a more stable approach than forcing re-renders with changing keys
  
  // Toggle expanded state for a node
  const toggleNodeExpanded = useCallback((nodeId: string) => {
    // Create a composite key that includes the profile ID to scope the expanded state
    const compositeKey = `${currentProfileId}__${nodeId}`;
    setExpandedNodes(prev => ({
      ...prev,
      [compositeKey]: !prev[compositeKey]
    }));
  }, [currentProfileId]);

  // Listen for custom events from expandable nodes
  useEffect(() => {
    const handleNodeDataChanged = (event: Event) => {
      const { nodeId, data } = (event as CustomEvent).detail;
      console.log('Node data changed from in-node form:', nodeId, data);
      
      // Make an update to the node data that preserves UI state
      setNodes(nds =>
        nds.map(node => {
          if (node.id === nodeId) {
            // Preserve UI state by merging only the core data properties
            return { 
              ...node, 
              data: { 
                ...node.data, 
                ...data,
                // Preserve UI state properties
                isExpanded: expandedNodes[`${currentProfileId}__${nodeId}`] || false,
                onToggleExpand: toggleNodeExpanded
              } 
            };
          }
          return node;
        })
      );
      
      // Also update the selected node if it's the one that changed
      if (selectedNode && selectedNode.id === nodeId) {
        setSelectedNode({ 
          ...selectedNode, 
          data: {
            ...selectedNode.data,
            ...data,
            // Preserve UI state properties
            isExpanded: expandedNodes[`${currentProfileId}__${nodeId}`] || false,
            onToggleExpand: toggleNodeExpanded
          }
        });
      }
      
      // Update the profile
      const newProfile = convertFlowToProfile(
        nodes.map(node => {
          if (node.id === nodeId) {
            // Use only core data for profile conversion, not UI state
            return { 
              ...node, 
              data: {
                ...node.data,
                ...data
              }
            };
          }
          return node;
        }), 
        edges
      );
      onChange(newProfile);
    };
    
    // Add event listener
    document.addEventListener('nodeDataChanged', handleNodeDataChanged);
    
    // Cleanup
    return () => {
      document.removeEventListener('nodeDataChanged', handleNodeDataChanged);
    };
  }, [nodes, edges, selectedNode, onChange, expandedNodes, toggleNodeExpanded]);

  // Update profile when nodes or edges change
  const updateProfile = useCallback(() => {
    // Create a deep copy of nodes and edges to avoid reference issues
    const nodesCopy = JSON.parse(JSON.stringify(nodes));
    const edgesCopy = JSON.parse(JSON.stringify(edges));
    const newProfile = convertFlowToProfile(nodesCopy, edgesCopy);
    onChange(newProfile);
  }, [nodes, edges, onChange]);
  
  // Use built-in change handlers from useNodesState/useEdgesState
  // This simplifies our code and lets React Flow handle state updates consistently
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // Filter out removal of static nodes
      const filteredChanges = changes.filter(change => {
        if (change.type === 'remove' && 'id' in change) {
          const nodeId = change.id;
          const node = nodes.find(n => n.id === nodeId);
          if (node && (node.type === 'input' || node.type === 'output')) {
            return false;
          }
        }
        return true;
      });
      
      // Use the built-in handler
      onNodesChange(filteredChanges);
      
      // Update the profile after non-selection changes, with debounce
      const nonSelectionChanges = filteredChanges.filter(change => 
        change.type !== 'select' && change.type !== 'position'
      );
      
      // Only trigger profile updates for meaningful changes, not just position changes
      if (nonSelectionChanges.length > 0) {
        setTimeout(updateProfile, 100);
      } else if (filteredChanges.some(change => change.type === 'position')) {
        // For position changes, update less frequently to avoid flicker
        setTimeout(updateProfile, 500);
      }
    },
    [nodes, onNodesChange, updateProfile]
  );
  
  // Use built-in edge changes handler
  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      // Apply changes directly
      onEdgesChange(changes);
      
      // Only update profile after a small debounce to prevent excessive updates
      // during drag operations or rapid changes
      const nonSelectChanges = changes.filter(change => change.type !== 'select');
      if (nonSelectChanges.length > 0) {
        setTimeout(updateProfile, 100);
      }
    },
    [onEdgesChange, updateProfile]
  );
  
  // Handle node selection
  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node as GuardProfileNode);
    },
    []
  );
  
  // Handle creating new connections
  const handleConnect = useCallback(
    (connection: Connection) => {
      // Create a new edge with default settings
      const newEdge: Edge = {
        ...connection,
        id: `edge-${connection.source}-${connection.target}`,
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        // Required Edge properties that might be missing from Connection
        source: connection.source || '',
        target: connection.target || '',
      };
      
      setEdges(prevEdges => addEdge(newEdge, prevEdges));
      setTimeout(updateProfile, 0);
    },
    [setEdges, updateProfile]
  );
  
  // Handle property changes
  const handlePropertyChange = useCallback(
    (nodeId: string, data: FilterNodeData | MessageLogNodeData | ManualApprovalNodeData | ChainNodeData) => {
      setNodes(nds =>
        nds.map(node => (node.id === nodeId ? { ...node, data } : node))
      );
      setTimeout(updateProfile, 0);
    },
    [setNodes, updateProfile]
  );
  
  // Handle dropping a node from toolbox
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle dropping a node
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      
      // Position where the node was dropped
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };
      
      // Generate a default config based on type
      let nodeData: FilterNodeData | MessageLogNodeData | ManualApprovalNodeData | ChainNodeData;
      
      switch (type) {
        case 'filter':
          nodeData = {
            type: 'Filter',
            filter_logic: { 
              direction: 'inbound'
            },
            match_action: 'send',
            non_match_action: 'drop'
          };
          break;
        case 'messagelog':
          nodeData = {
            type: 'MessageLog',
            log_level: 'Info'
          };
          break;
        case 'manualapproval':
          nodeData = {
            type: 'ManualApproval'
          };
          break;
        case 'chain':
          nodeData = {
            type: 'Chain',
            chain: []
          };
          break;
        default:
          // Default fallback - should never happen with proper validation
          nodeData = {
            type: 'MessageLog',
            log_level: 'Info'
          };
      }
      
      // Create the new node with proper typing
      const newNode: GuardProfileNode = {
        id: `node-${Date.now()}`,
        type,
        position,
        data: nodeData,
      };
      
      setNodes(nds => [...nds, newNode]);
      setSelectedNode(newNode);
      setTimeout(updateProfile, 0);
    },
    [setNodes, updateProfile, setSelectedNode]
  );
  
  // Clear and load flow when profile changes
  useEffect(() => {
    // Check if the profile has actually changed
    if (profileRef.current === currentProfileId) {
      return; // Skip if same profile
    }
    
    // Update the reference
    profileRef.current = currentProfileId;
    
    // Two-stage loading for smoother transitions
    const loadProfile = async () => {
      // 1. Set loading state and clear existing graph
      setLoading(true);
      
      // Save current expanded states for this profile
      const currentExpandedState: Record<string, boolean> = {};
      
      // Convert from composite keys to simple node IDs for the current profile
      Object.keys(expandedNodes).forEach(key => {
        if (key.startsWith(`${profileRef.current}__`)) {
          const nodeId = key.split('__')[1];
          currentExpandedState[nodeId] = expandedNodes[key];
        }
      });
      
      // Clear graph
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
      
      // 2. Short delay to ensure clear is complete
      await new Promise(r => setTimeout(r, 50));
      
      // 3. Load new profile
      const newFlow = convertProfileToFlow(profile);
      
      // Add UI state to nodes
      const nodesWithUIState = newFlow.nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          // Use the current node's expanded state if it existed in the previous state
          isExpanded: currentExpandedState[node.id] || false,
          onToggleExpand: toggleNodeExpanded
        }
      }));
      
      setNodes(nodesWithUIState);
      setEdges(newFlow.edges);
      
      // 4. End loading state after content is ready
      setTimeout(() => setLoading(false), 50);
    };
    
    loadProfile();
  }, [profile, setNodes, setEdges, currentProfileId, expandedNodes, toggleNodeExpanded]);
  
  return (
    <ReactFlowProvider>
      <div className="guard-profile-visual-builder h-[600px] w-full flex flex-col">
        <div className="px-4 py-3 bg-card border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <GitMerge size={16} className="text-primary" />
            </div>
            <div>
              <h3 className="font-medium leading-tight">Guard Profile Builder</h3>
              <p className="text-xs text-muted-foreground">
                Configure message processing between MCP servers and applications
              </p>
            </div>
          </div>
          
          <div className="flex items-center p-1 border border-border rounded-md bg-card/80 text-xs">
            <div className="px-3 py-1 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm bg-emerald-500"></div>
              <span>Input</span>
            </div>
            <div className="px-3 py-1 border-x border-border flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm bg-primary"></div>
              <span>Guard Profile</span>
            </div>
            <div className="px-3 py-1 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm bg-indigo-500"></div>
              <span>Output</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 bg-card border-r border-border p-4 overflow-y-auto">
            <h3 className="font-medium mb-3">Add Interceptors</h3>
            <div className="text-xs text-muted-foreground mb-4">
              Drag interceptors into the flow between input and output nodes
            </div>
            
            <InterceptorToolbox onAddNode={(type) => {
              try {
                console.log(`Adding new node of type: ${type}`);
                
                // Preserve existing node positions if available
                const currentNodes = nodes.reduce((acc, node) => {
                  acc[node.id] = node.position;
                  return acc;
                }, {} as Record<string, { x: number, y: number }>);
                
                // Create a completely fresh state with just input and output, preserving positions
                const inputNode = {
                  id: 'node-input',
                  type: 'input',
                  position: currentNodes['node-input'] || { x: 100, y: 100 },
                  data: { type: 'Input' },
                  draggable: true,
                };
                
                const outputNode = {
                  id: 'node-output',
                  type: 'output',
                  position: currentNodes['node-output'] || { x: 500, y: 100 },
                  data: { type: 'Output' },
                  draggable: true,
                };
                
                // Generate a default config based on type
                let nodeData: FilterNodeData | MessageLogNodeData | ManualApprovalNodeData | ChainNodeData;
                
                switch (type) {
                  case 'filter':
                    nodeData = {
                      type: 'Filter',
                      filter_logic: { 
                        direction: 'inbound'
                      },
                      match_action: 'send',
                      non_match_action: 'drop'
                    } as FilterNodeData;
                    break;
                  case 'messagelog':
                    nodeData = {
                      type: 'MessageLog',
                      log_level: 'Info'
                    };
                    break;
                  case 'manualapproval':
                    nodeData = {
                      type: 'ManualApproval'
                    };
                    break;
                  case 'chain':
                    nodeData = {
                      type: 'Chain',
                      chain: []
                    };
                    break;
                  default:
                    nodeData = {
                      type: 'MessageLog',
                      log_level: 'Info'
                    };
                }
                
                // Create a new interceptor node
                const newNodeId = `node-${Date.now()}`;
                const interceptorNode: GuardProfileNode = {
                  id: newNodeId,
                  type,
                  position: { x: 300, y: 100 },
                  data: nodeData,
                  // Make sure the node is draggable and properly initialized
                  draggable: true,
                };
                
                // Create completely fresh node array
                const newNodes = [inputNode, outputNode, interceptorNode];
                
                // Create completely fresh edge array with refined styling
                const newEdges = [
                  {
                    id: `edge-input-interceptor`,
                    source: 'node-input',
                    target: newNodeId,
                    animated: true,
                    style: { 
                      strokeWidth: 1.5, 
                      stroke: '#10b981', // emerald-500
                      opacity: 0.8
                    },
                    markerEnd: {
                      type: MarkerType.ArrowClosed,
                      color: '#10b981', // emerald-500
                      width: 15,
                      height: 15,
                    },
                  },
                  {
                    id: `edge-interceptor-output`,
                    source: newNodeId,
                    target: 'node-output',
                    animated: true,
                    style: { 
                      strokeWidth: 1.5, 
                      stroke: '#6366f1', // indigo-500
                      opacity: 0.8
                    },
                    markerEnd: {
                      type: MarkerType.ArrowClosed,
                      color: '#6366f1', // indigo-500
                      width: 15,
                      height: 15,
                    },
                  }
                ];
                
                // First update the nodes
                setNodes(newNodes);
                
                // Then update the edges
                setEdges(newEdges);
                
                // Set the selected node to the new interceptor
                setSelectedNode(interceptorNode);
                
                // Finally update the profile
                setTimeout(() => {
                  const newProfile: GuardProfile = {
                    primary_message_interceptor: nodeData as MessageInterceptorGuardConfig
                  };
                  onChange(newProfile);
                }, 50);
                
                console.log(`Added node successfully: ${JSON.stringify(interceptorNode)}`);
              } catch (error) {
                console.error("Error creating node:", error);
              }
            }} disabled={readOnly} />
          </div>
          
          <div className="flex-1 relative" onDragOver={onDragOver} onDrop={onDrop}>
            <ReactFlow
              nodes={nodes.map(node => ({
                ...node,
                data: {
                  ...node.data,
                  isExpanded: expandedNodes[`${currentProfileId}__${node.id}`] || false,
                  onToggleExpand: toggleNodeExpanded
                }
              }))}
              edges={edges}
              onNodesChange={handleNodesChange}
              onEdgesChange={handleEdgesChange}
              onConnect={handleConnect}
              onNodeClick={handleNodeClick}
              nodeTypes={nodeTypes}
              connectionMode={ConnectionMode.Loose}
              snapToGrid
              fitView
              proOptions={{ hideAttribution: true }}
              panOnDrag={!readOnly}
              nodesDraggable={true}
              nodesConnectable={!readOnly}
              elementsSelectable={!readOnly}
              className="bg-background"
            >
              <Background variant="dots" gap={16} size={0.5} color="#52525230" />
              
              {/* Visual indication of flow zones */}
              <div className="absolute inset-0 z-[-1] pointer-events-none flex">
                <div className="w-1/3 h-full border-r border-dashed border-border/30"></div>
                <div className="w-1/3 h-full border-r border-dashed border-border/30"></div>
              </div>
              
              {/* Show loading indicator during transitions */}
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/80">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              <Controls />
            </ReactFlow>
          </div>
          
          <div className="flex">
            {selectedNode ? (
              <PropertyPanel
                node={selectedNode}
                onChange={handlePropertyChange}
                disabled={readOnly}
              />
            ) : (
              <div className="w-80 bg-card border-l border-border p-4 overflow-y-auto text-center text-muted-foreground">
                Select a node to edit its properties
              </div>
            )}
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default GuardProfileVisualBuilder;