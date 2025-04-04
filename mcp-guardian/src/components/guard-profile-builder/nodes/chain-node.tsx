import { GitMerge } from "lucide-react";

import { Node, Handle, Position, NodeProps } from "@xyflow/react";
import { MessageInterceptorGuardConfig } from "../../../bindings/MessageInterceptorGuardConfig";

import { GuardProfileNodeData } from "./nodeData.type";

export interface GuardProfileChainNodeData extends GuardProfileNodeData {
  type: "Chain";
  chain: MessageInterceptorGuardConfig[];
}

export interface GuardProfileChainNode extends Node {
  type: "Chain";
  data: GuardProfileChainNodeData;
}

export interface GuardProfileChainNodeProps extends NodeProps {
  data: GuardProfileChainNodeData;
}

const ChainNode = ({ data, selected }: GuardProfileChainNodeProps) => {
  const chainCount = data?.chain?.length || 0;

  return (
    <div
      className={`node chain-node rounded-lg border p-3 bg-background shadow-sm max-w-[180px] ${
        selected ? "border-primary ring-2 ring-primary/20" : "border-muted"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border border-rose-400 dark:border-rose-600 bg-rose-500"
      />

      <div className="flex items-center gap-2">
        <div className="flex-shrink-0 w-7 h-7 bg-rose-100 dark:bg-rose-900/30 rounded-md flex items-center justify-center">
          <GitMerge size={14} className="text-rose-600 dark:text-rose-400" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">Chain</div>
          <div className="text-xs text-muted-foreground truncate">
            {chainCount} interceptor{chainCount !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border border-rose-400 dark:border-rose-600 bg-rose-500"
      />
    </div>
  );
};

export default ChainNode;
