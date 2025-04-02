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
import InterceptorToolbox from './interceptor-toolbox';
import PropertyPanel from './property-panel';

// Define node types
const nodeTypes: NodeTypes = {
  filter: FilterNode,
  chain: ChainNode,
  messagelog: MessageLogNode,
  manualapproval: ManualApprovalNode,
};

interface GuardProfileVisualBuilderProps {
  profile: GuardProfile;
  onChange: (profile: GuardProfile) => void;
  readOnly?: boolean;
}

/**
 * Transform a GuardProfile into ReactFlow nodes and edges
 */
export const convertProfileToFlow = (profile: GuardProfile): { nodes: Node[], edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // Start with a single node for simple interceptor
  if (profile.primary_message_interceptor.type !== 'Chain') {
    // Single node for primary interceptor
    nodes.push({
      id: 'node-primary',
      type: profile.primary_message_interceptor.type.toLowerCase(),
      position: { x: 100, y: 100 },
      data: { ...profile.primary_message_interceptor } as FilterNodeData | MessageLogNodeData | ManualApprovalNodeData,
    });
    return { nodes, edges };
  }
  
  // Handle chain interceptor - safe way to handle the type with TypeScript
  if (profile.primary_message_interceptor.type === 'Chain') {
    const chainInterceptor = profile.primary_message_interceptor;
    
    // Create the chain container node
    nodes.push({
      id: 'node-chain',
      type: 'chain',
      position: { x: 100, y: 100 },
      data: { 
        type: 'Chain',
        chain: chainInterceptor.chain 
      } as ChainNodeData,
    });
    
    // Add child nodes for each interceptor in the chain
    let prevNodeId = 'node-chain';
    chainInterceptor.chain.forEach((interceptor, index) => {
      const nodeId = `node-${index}`;
      
      // Create node for this interceptor with proper typing
      nodes.push({
        id: nodeId,
        type: interceptor.type.toLowerCase(),
        position: { x: 100, y: 200 + index * 150 },
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
  }
  
  return { nodes, edges };
};

/**
 * Transform ReactFlow nodes and edges back into a GuardProfile
 */
export const convertFlowToProfile = (nodes: Node[], edges: Edge[]): GuardProfile => {
  // Handle case with only a single node (non-chain interceptor)
  if (nodes.length === 1) {
    const node = nodes[0];
    
    // Use our node types to extract valid MessageInterceptorGuardConfig from node data
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
    
    return {
      primary_message_interceptor: getInterceptorFromNode(node),
    };
  }
  
  // Find the chain node
  const chainNode = nodes.find(node => node.type === 'chain');
  if (!chainNode) {
    // Fallback if no chain node found (shouldn't happen)
    return {
      primary_message_interceptor: {
        type: 'MessageLog',
        log_level: 'Info',
      },
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
  
  // Follow the chain until we reach a node with no outgoing edges
  while (edgeMap.has(currentNodeId)) {
    const nextNodeIds = edgeMap.get(currentNodeId) || [];
    if (nextNodeIds.length === 0) break;
    
    const nextNodeId = nextNodeIds[0]; // Follow first connection
    const nextNode = nodes.find(node => node.id === nextNodeId);
    
    if (nextNode && nextNode.type !== 'chain') {
      // Extract the interceptor data based on node type
      let interceptor: MessageInterceptorGuardConfig;
      
      switch (nextNode.type) {
        case 'filter':
          const filterData = nextNode.data as FilterNodeData;
          interceptor = {
            type: 'Filter',
            filter_logic: filterData.filter_logic,
            match_action: filterData.match_action,
            non_match_action: filterData.non_match_action,
          };
          break;
        case 'messagelog':
          const logData = nextNode.data as MessageLogNodeData;
          interceptor = {
            type: 'MessageLog',
            log_level: logData.log_level,
          };
          break;
        case 'manualapproval':
          // ManualApprovalGuardConfig is Record<string, never>
          interceptor = {
            type: 'ManualApproval'
          } as MessageInterceptorGuardConfig;
          break;
        default:
          // Shouldn't happen with proper validation
          interceptor = {
            type: 'MessageLog',
            log_level: 'Info',
          };
      }
      
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
      const updatedNodes = applyNodeChanges(changes, nodes);
      setNodes(updatedNodes);
      // Don't trigger onChange for selection changes
      const nonSelectionChanges = changes.filter(change => change.type !== 'select');
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
        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 bg-card border-r border-border p-4 overflow-y-auto">
            <InterceptorToolbox onAddNode={(type) => {
              // Create a new node directly instead of simulating a drop event
              const position = { x: 250, y: 150 };
              
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
              <Background color="#5252528f" />
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