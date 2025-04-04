import { Node, Edge, MarkerType } from "@xyflow/react";
import { GuardProfile } from "../../bindings/GuardProfile";
import { MessageInterceptorGuardConfig } from "../../bindings/MessageInterceptorGuardConfig";

import {
  GuardProfileChainNodeData,
  GuardProfileFilterNodeData,
  GuardProfileManualApprovalNodeData,
  GuardProfileMessageLogNodeData,
  GuardProfileInputRepresentationNodeData,
  GuardProfileOutputRepresentationNodeData,
} from "./nodes";

export const convertProfileToFlow = (profile: GuardProfile): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Add input node (static)
  nodes.push({
    id: "node-input",
    type: "Input", // Custom node type for input
    position: { x: 100, y: 100 },
    data: { type: "Input" } as GuardProfileInputRepresentationNodeData,
    draggable: true, // Make input node draggable
  });

  // Start with a single node for simple interceptor
  if (profile.primary_message_interceptor.type !== "Chain") {
    // Single node for primary interceptor
    const nodeId = "node-primary";
    nodes.push({
      id: nodeId,
      type: profile.primary_message_interceptor.type.toLowerCase(),
      position: { x: 300, y: 100 },
      data: { ...profile.primary_message_interceptor } as
        | GuardProfileFilterNodeData
        | GuardProfileMessageLogNodeData
        | GuardProfileManualApprovalNodeData,
      draggable: true,
    });

    // Connect input to the primary interceptor
    edges.push({
      id: `edge-input-${nodeId}`,
      source: "node-input",
      target: nodeId,
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    });

    // Add output node (static)
    nodes.push({
      id: "node-output",
      type: "Output", // Custom node type for output
      position: { x: 500, y: 100 },
      data: { type: "Output" } as GuardProfileOutputRepresentationNodeData,
      draggable: true, // Make output node draggable
    });

    // Connect primary interceptor to output
    edges.push({
      id: `edge-${nodeId}-output`,
      source: nodeId,
      target: "node-output",
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    });

    return { nodes, edges };
  }

  // Handle chain interceptor - safe way to handle the type with TypeScript
  if (profile.primary_message_interceptor.type === "Chain") {
    const chainInterceptor = profile.primary_message_interceptor;

    // Create the chain container node
    const chainNodeId = "node-chain";
    nodes.push({
      id: chainNodeId,
      type: "Chain",
      position: { x: 300, y: 100 },
      data: {
        type: "Chain",
        chain: chainInterceptor.chain,
      } as GuardProfileChainNodeData,
      draggable: true,
    });

    // Connect input to the chain
    edges.push({
      id: `edge-input-${chainNodeId}`,
      source: "node-input",
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
        data: { ...interceptor } as
          | GuardProfileFilterNodeData
          | GuardProfileMessageLogNodeData
          | GuardProfileManualApprovalNodeData,
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
      id: "node-output",
      type: "Output", // Custom node type for output
      position: { x: 500, y: 100 },
      data: { type: "Output" } as GuardProfileOutputRepresentationNodeData,
      draggable: true, // Make output node draggable
    });

    // Connect last chain node to output if there are chain nodes
    if (chainInterceptor.chain.length > 0) {
      const lastNodeId = `node-${chainInterceptor.chain.length - 1}`;
      edges.push({
        id: `edge-${lastNodeId}-output`,
        source: lastNodeId,
        target: "node-output",
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
        target: "node-output",
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
    if (node.type === "Filter") {
      const data = node.data as GuardProfileFilterNodeData;
      return {
        type: "Filter",
        filter_logic: data.filter_logic,
        match_action: data.match_action,
        non_match_action: data.non_match_action,
      };
    } else if (node.type === "MessageLog") {
      const data = node.data as GuardProfileMessageLogNodeData;
      return {
        type: "MessageLog",
        log_level: data.log_level,
      };
    } else if (node.type === "ManualApproval") {
      return {
        type: "ManualApproval",
      } as MessageInterceptorGuardConfig;
    } else {
      // Default fallback - should never happen with proper validation
      // we should create an error node
      return {
        type: "MessageLog",
        log_level: "Info",
      };
    }
  };

  // Filter out static input/output nodes
  const interceptorNodes = nodes.filter((node) => node.type !== "Input" && node.type !== "Output");

  // Find non-static nodes (actual interceptors)
  if (interceptorNodes.length === 0) {
    // No interceptors defined, return default
    return {
      primary_message_interceptor: {
        type: "MessageLog",
        log_level: "Info",
      },
    };
  }

  // Handle case with only a single interceptor node (non-chain)
  if (interceptorNodes.length === 1) {
    const node = interceptorNodes[0];
    if (node.type !== "Chain") {
      return {
        primary_message_interceptor: getInterceptorFromNode(node),
      };
    }
  }

  // Find the chain node
  const chainNode = interceptorNodes.find((node) => node.type === "Chain");
  if (!chainNode) {
    // If no chain node but we have multiple interceptors, use the first one as primary
    const firstNode = interceptorNodes[0];
    return {
      primary_message_interceptor: getInterceptorFromNode(firstNode),
    };
  }

  // Build a directed graph from the edges
  const edgeMap = new Map<string, string[]>();
  edges.forEach((edge) => {
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
    const nextNode = nodes.find((node) => node.id === nextNodeId);

    // Skip if next node is the output node
    if (nextNode && nextNode.type === "Output") break;

    if (nextNode && nextNode.type !== "Chain" && nextNode.type !== "Input" && nextNode.type !== "Output") {
      // Extract the interceptor data based on node type
      const interceptor = getInterceptorFromNode(nextNode);
      chainInterceptors.push(interceptor);
    }

    currentNodeId = nextNodeId;
  }

  // Create the chain guard profile
  return {
    primary_message_interceptor: {
      type: "Chain",
      chain: chainInterceptors,
    },
  };
};
