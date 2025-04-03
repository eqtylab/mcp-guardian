import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
    draggable: false, // Static node
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
      draggable: false, // Static node
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
      draggable: false, // Static node
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
  // Initialize nodes and edges from the profile
  const initialFlow = useMemo(() => convertProfileToFlow(profile), [profile]);
  
  // State for nodes and edges
  const [nodes, setNodes] = useNodesState(initialFlow.nodes);
  const [edges, setEdges] = useEdgesState(initialFlow.edges);
  const [selectedNode, setSelectedNode] = useState<GuardProfileNode | null>(null);

  // Update profile when nodes or edges change
  const updateProfile = useCallback(() => {
    const newProfile = convertFlowToProfile(nodes, edges);
    onChange(newProfile);
  }, [nodes, edges, onChange]);
  
  // Handle node changes
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // Filter out changes to static nodes (input/output)
      const filteredChanges = changes.filter(change => {
        // Always allow selection changes
        if (change.type === 'select') return true;
        
        // For position changes and removals, check if it's a static node
        if ('id' in change) {
          const nodeId = change.id;
          const node = nodes.find(n => n.id === nodeId);
          // Don't allow changes to input/output nodes except selection
          if (node && (node.type === 'input' || node.type === 'output')) {
            return false;
          }
        }
        return true;
      });
      
      const updatedNodes = applyNodeChanges(filteredChanges, nodes);
      setNodes(updatedNodes);
      
      // Don't trigger onChange for selection changes
      const nonSelectionChanges = filteredChanges.filter(change => change.type !== 'select');
      if (nonSelectionChanges.length > 0) {
        setTimeout(updateProfile, 0);
      }
    },
    [nodes, setNodes, updateProfile]
  );
  
  // Handle edge changes
  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges(prev => applyEdgeChanges(changes, prev));
      setTimeout(updateProfile, 0);
    },
    [setEdges, updateProfile]
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
  
  // Sync with external profile changes
  useEffect(() => {
    const newFlow = convertProfileToFlow(profile);
    setNodes(newFlow.nodes);
    setEdges(newFlow.edges);
  }, [profile, setNodes, setEdges]);
  
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
                
                // Create a completely fresh state with just input and output
                const inputNode = {
                  id: 'node-input',
                  type: 'input',
                  position: { x: 100, y: 100 },
                  data: { type: 'Input' },
                  draggable: false,
                };
                
                const outputNode = {
                  id: 'node-output',
                  type: 'output',
                  position: { x: 500, y: 100 },
                  data: { type: 'Output' },
                  draggable: false,
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
              nodes={nodes}
              edges={edges}
              onNodesChange={handleNodesChange}
              onEdgesChange={handleEdgesChange}
              onConnect={handleConnect}
              onNodeClick={handleNodeClick}
              nodeTypes={nodeTypes}
              connectionMode={ConnectionMode.Loose}
              snapToGrid
              fitView
              attributionPosition="bottom-right"
              panOnDrag={!readOnly}
              nodesDraggable={!readOnly}
              nodesConnectable={!readOnly}
              elementsSelectable={!readOnly}
            >
              <Background variant="dots" gap={16} size={0.5} color="#52525230" />
              
              {/* Visual indication of flow zones */}
              <div className="absolute inset-0 z-[-1] pointer-events-none flex">
                <div className="w-1/3 h-full border-r border-dashed border-border/30"></div>
                <div className="w-1/3 h-full border-r border-dashed border-border/30"></div>
              </div>
              
              <Controls />
            </ReactFlow>
          </div>
          
          <div className="w-80 bg-card border-l border-border p-4 overflow-y-auto">
            {selectedNode ? (
              <PropertyPanel
                node={selectedNode}
                onChange={handlePropertyChange}
                disabled={readOnly}
              />
            ) : (
              <div className="text-center text-muted-foreground p-4">
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