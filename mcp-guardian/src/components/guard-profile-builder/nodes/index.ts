import { NodeTypes } from "@xyflow/react";

import FilterNode, { GuardProfileFilterNode, GuardProfileFilterNodeData } from "./filter-node";
import ChainNode, { GuardProfileChainNode, GuardProfileChainNodeData } from "./chain-node";
import MessageLogNode, { GuardProfileMessageLogNode, GuardProfileMessageLogNodeData } from "./messagelog-node";
import ManualApprovalNode, {
  GuardProfileManualApprovalNode,
  GuardProfileManualApprovalNodeData,
} from "./manualapproval-node";
import InputRepresentationNode, {
  GuardProfileInputRepresentationNode,
  GuardProfileInputRepresentationNodeData,
} from "./representation-input-node";
import OutputRepresentationNode, {
  GuardProfileOutputRepresentationNode,
  GuardProfileOutputRepresentationNodeData,
} from "./representation-output-node";

export {
  type GuardProfileFilterNodeData,
  type GuardProfileChainNodeData,
  type GuardProfileManualApprovalNodeData,
  type GuardProfileMessageLogNodeData,
  type GuardProfileInputRepresentationNodeData,
  type GuardProfileOutputRepresentationNodeData,
};

export type GuardProfileNode =
  | GuardProfileFilterNode
  | GuardProfileChainNode
  | GuardProfileMessageLogNode
  | GuardProfileManualApprovalNode
  | GuardProfileInputRepresentationNode
  | GuardProfileOutputRepresentationNode;

export const guardProfileReactFlowNodeTypes: NodeTypes = {
  Filter: FilterNode,
  Chain: ChainNode,
  MessageLog: MessageLogNode,
  Input: InputRepresentationNode,
  Output: OutputRepresentationNode,
};
