import React, { useCallback, useEffect, useState, useRef } from "react";
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
  BackgroundVariant,
} from "@xyflow/react";
import { GitMerge } from "lucide-react";
import type { Node, Edge, NodeChange, EdgeChange } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { GuardProfile } from "../../bindings/GuardProfile";
import { MessageInterceptorGuardConfig } from "../../bindings/MessageInterceptorGuardConfig";

import InterceptorToolbox from "./interceptor-toolbox";
import PropertyPanel from "./property-panel";

import { convertProfileToFlow, convertFlowToProfile } from "./dataConversion.utils";

import {
  GuardProfileNode,
  GuardProfileFilterNodeData,
  GuardProfileMessageLogNodeData,
  GuardProfileManualApprovalNodeData,
  GuardProfileChainNodeData,
  guardProfileReactFlowNodeTypes,
} from "./nodes";

export interface GuardProfileVisualBuilderProps {
  profile: GuardProfile;
  onChange: (profile: GuardProfile) => void;
  readOnly?: boolean;
}

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
  const [nodes, setNodes, onNodesChange] = useNodesState<GuardProfileNode>([]); // the hook casts it into Node[]
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNode, setSelectedNode] = useState<GuardProfileNode | null>(null);

  // We'll use a more stable approach than forcing re-renders with changing keys

  // Toggle expanded state for a node
  const toggleNodeExpanded = useCallback(
    (nodeId: string) => {
      // Create a composite key that includes the profile ID to scope the expanded state
      const compositeKey = `${currentProfileId}__${nodeId}`;
      setExpandedNodes((prev) => ({
        ...prev,
        [compositeKey]: !prev[compositeKey],
      }));
    },
    [currentProfileId],
  );

  // Listen for custom events from expandable nodes
  useEffect(() => {
    const handleNodeDataChanged = (event: Event) => {
      const { nodeId, data } = (event as CustomEvent).detail;
      console.log("Node data changed from in-node form:", nodeId, data);

      // Make an update to the node data that preserves UI state
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            // Preserve UI state by merging only the core data properties
            return {
              ...node,
              data: {
                ...node.data,
                ...data,
                // Preserve UI state properties
                isExpanded: expandedNodes[`${currentProfileId}__${nodeId}`] || false,
                onToggleExpand: toggleNodeExpanded,
              },
            };
          }
          return node;
        }),
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
            onToggleExpand: toggleNodeExpanded,
          },
        });
      }

      // Update the profile
      const newProfile = convertFlowToProfile(
        nodes.map((node) => {
          if (node.id === nodeId) {
            // Use only core data for profile conversion, not UI state
            return {
              ...node,
              data: {
                ...node.data,
                ...data,
              },
            };
          }
          return node;
        }),
        edges,
      );
      onChange(newProfile);
    };

    // Add event listener
    document.addEventListener("nodeDataChanged", handleNodeDataChanged);

    // Cleanup
    return () => {
      document.removeEventListener("nodeDataChanged", handleNodeDataChanged);
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
      const filteredChanges = changes.filter((change) => {
        if (change.type === "remove" && "id" in change) {
          const nodeId = change.id;
          const node = nodes.find((n) => n.id === nodeId);
          if (node && (node.type === "Input" || node.type === "Output")) {
            return false;
          }
        }
        return true;
      }) as NodeChange<GuardProfileNode>[];

      // Use the built-in handler
      onNodesChange(filteredChanges);

      // Update the profile after non-selection changes, with debounce
      const nonSelectionChanges = filteredChanges.filter(
        (change) => change.type !== "select" && change.type !== "position",
      );

      // Only trigger profile updates for meaningful changes, not just position changes
      if (nonSelectionChanges.length > 0) {
        setTimeout(updateProfile, 100);
      } else if (filteredChanges.some((change) => change.type === "position")) {
        // For position changes, update less frequently to avoid flicker
        setTimeout(updateProfile, 500);
      }
    },
    [nodes, onNodesChange, updateProfile],
  );

  // Use built-in edge changes handler
  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      // Apply changes directly
      onEdgesChange(changes);

      // Only update profile after a small debounce to prevent excessive updates
      // during drag operations or rapid changes
      const nonSelectChanges = changes.filter((change) => change.type !== "select");
      if (nonSelectChanges.length > 0) {
        setTimeout(updateProfile, 100);
      }
    },
    [onEdgesChange, updateProfile],
  );

  // Handle node selection
  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node as GuardProfileNode);
  }, []);

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
        source: connection.source || "",
        target: connection.target || "",
      };

      setEdges((prevEdges) => addEdge(newEdge, prevEdges));
      setTimeout(updateProfile, 0);
    },
    [setEdges, updateProfile],
  );

  // Handle property changes
  const handlePropertyChange = useCallback(
    (
      nodeId: string,
      data:
        | GuardProfileFilterNodeData
        | GuardProfileMessageLogNodeData
        | GuardProfileManualApprovalNodeData
        | GuardProfileChainNodeData,
    ) => {
      setNodes((nds) => nds.map((node) => (node.id === nodeId ? { ...node, data } : node)) as GuardProfileNode[]);
      setTimeout(updateProfile, 0);
    },
    [setNodes, updateProfile],
  );

  // Handle dropping a node from toolbox
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Handle dropping a node
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow") as GuardProfileNode["type"];

      // Position where the node was dropped
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      // Generate a default config based on type
      let nodeData:
        | GuardProfileFilterNodeData
        | GuardProfileMessageLogNodeData
        | GuardProfileManualApprovalNodeData
        | GuardProfileChainNodeData;

      switch (type) {
        case "Filter":
          nodeData = {
            type: "Filter",
            filter_logic: {
              direction: "inbound",
            },
            match_action: "send",
            non_match_action: "drop",
          } as GuardProfileFilterNodeData;
          break;
        case "MessageLog":
          nodeData = {
            type: "MessageLog",
            log_level: "Info",
          } as GuardProfileMessageLogNodeData;
          break;
        case "ManualApproval":
          nodeData = {
            type: "ManualApproval",
          } as GuardProfileManualApprovalNodeData;
          break;
        case "Chain":
          nodeData = {
            type: "Chain",
            chain: [] as Array<MessageInterceptorGuardConfig>,
          } as GuardProfileChainNodeData;
          break;
        default:
          // Default fallback - should never happen with proper validation
          nodeData = {
            type: "MessageLog",
            log_level: "Info",
          } as GuardProfileMessageLogNodeData;
      }

      // Create the new node with proper typing
      const newNode = {
        id: `node-${Date.now()}`,
        type,
        position,
        data: nodeData,
      } as GuardProfileNode;

      setNodes((nds) => [...nds, newNode]);
      setSelectedNode(newNode);
      setTimeout(updateProfile, 0);
    },
    [setNodes, updateProfile, setSelectedNode],
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
      Object.keys(expandedNodes).forEach((key) => {
        if (key.startsWith(`${profileRef.current}__`)) {
          const nodeId = key.split("__")[1];
          currentExpandedState[nodeId] = expandedNodes[key];
        }
      });

      // Clear graph
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);

      // 2. Short delay to ensure clear is complete
      await new Promise((r) => setTimeout(r, 50));

      // 3. Load new profile
      const newFlow = convertProfileToFlow(profile);

      // Add UI state to nodes
      const nodesWithUIState = newFlow.nodes.map(
        (node) =>
          ({
            ...node,
            data: {
              ...node.data,
              // Use the current node's expanded state if it existed in the previous state
              isExpanded: currentExpandedState[node.id] || false,
              onToggleExpand: toggleNodeExpanded,
            },
          }) as GuardProfileNode,
      );

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

            <InterceptorToolbox
              onAddNode={(type) => {
                try {
                  console.log(`Adding new node of type: ${type}`);

                  // Preserve existing node positions if available
                  const currentNodes = nodes.reduce(
                    (acc, node) => {
                      acc[node.id] = node.position;
                      return acc;
                    },
                    {} as Record<string, { x: number; y: number }>,
                  );

                  // Create a completely fresh state with just input and output, preserving positions
                  const inputNode = {
                    id: "node-input",
                    type: "input",
                    position: currentNodes["node-input"] || { x: 100, y: 100 },
                    data: { type: "Input" },
                    draggable: true,
                  };

                  const outputNode = {
                    id: "node-output",
                    type: "output",
                    position: currentNodes["node-output"] || { x: 500, y: 100 },
                    data: { type: "Output" },
                    draggable: true,
                  };

                  // Generate a default config based on type
                  let nodeData:
                    | GuardProfileFilterNodeData
                    | GuardProfileMessageLogNodeData
                    | GuardProfileManualApprovalNodeData
                    | GuardProfileChainNodeData;

                  switch (type) {
                    case "filter":
                      nodeData = {
                        type: "Filter",
                        filter_logic: {
                          direction: "inbound",
                        },
                        match_action: "send",
                        non_match_action: "drop",
                      } as GuardProfileFilterNodeData;
                      break;
                    case "messagelog":
                      nodeData = {
                        type: "MessageLog",
                        log_level: "Info",
                      } as GuardProfileMessageLogNodeData;
                      break;
                    case "manualapproval":
                      nodeData = {
                        type: "ManualApproval",
                      } as GuardProfileManualApprovalNodeData;
                      break;
                    case "chain":
                      nodeData = {
                        type: "Chain",
                        chain: [] as Array<MessageInterceptorGuardConfig>,
                      } as GuardProfileChainNodeData;
                      break;
                    default:
                      nodeData = {
                        type: "MessageLog",
                        log_level: "Info",
                      } as GuardProfileMessageLogNodeData;
                  }

                  // Create a new interceptor node
                  const newNodeId = `node-${Date.now()}`;
                  const interceptorNode = {
                    id: newNodeId,
                    type,
                    position: { x: 300, y: 100 },
                    data: nodeData,
                    // Make sure the node is draggable and properly initialized
                    draggable: true,
                  } as GuardProfileNode;

                  // Create completely fresh node array
                  const newNodes = [inputNode, outputNode, interceptorNode] as GuardProfileNode[];

                  // Create completely fresh edge array with refined styling
                  const newEdges = [
                    {
                      id: `edge-input-interceptor`,
                      source: "node-input",
                      target: newNodeId,
                      animated: true,
                      style: {
                        strokeWidth: 1.5,
                        stroke: "#10b981", // emerald-500
                        opacity: 0.8,
                      },
                      markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: "#10b981", // emerald-500
                        width: 15,
                        height: 15,
                      },
                    },
                    {
                      id: `edge-interceptor-output`,
                      source: newNodeId,
                      target: "node-output",
                      animated: true,
                      style: {
                        strokeWidth: 1.5,
                        stroke: "#6366f1", // indigo-500
                        opacity: 0.8,
                      },
                      markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: "#6366f1", // indigo-500
                        width: 15,
                        height: 15,
                      },
                    },
                  ] as any; // TODO:FIX ME

                  // First update the nodes
                  setNodes(newNodes);

                  // Then update the edges
                  setEdges(newEdges);

                  // Set the selected node to the new interceptor
                  setSelectedNode(interceptorNode);

                  // Finally update the profile
                  setTimeout(() => {
                    const newProfile: GuardProfile = {
                      primary_message_interceptor: nodeData as MessageInterceptorGuardConfig,
                    };
                    onChange(newProfile);
                  }, 50);

                  console.log(`Added node successfully: ${JSON.stringify(interceptorNode)}`);
                } catch (error) {
                  console.error("Error creating node:", error);
                }
              }}
              disabled={readOnly}
            />
          </div>

          <div className="flex-1 relative" onDragOver={onDragOver} onDrop={onDrop}>
            <ReactFlow
              nodes={nodes.map((node) => ({
                ...node,
                data: {
                  ...node.data,
                  isExpanded: expandedNodes[`${currentProfileId}__${node.id}`] || false,
                  onToggleExpand: toggleNodeExpanded,
                },
              }))}
              edges={edges}
              onNodesChange={handleNodesChange}
              onEdgesChange={handleEdgesChange}
              onConnect={handleConnect}
              onNodeClick={handleNodeClick}
              nodeTypes={guardProfileReactFlowNodeTypes}
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
              <Background variant={BackgroundVariant.Dots} gap={16} size={0.5} color="#52525230" />

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
              <PropertyPanel node={selectedNode} onChange={handlePropertyChange} disabled={readOnly} />
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
