export type GuardProfileNodeData = Record<string, unknown> & {
  isExpanded: boolean;
  onToggleExpand: (nodeId: string) => void;
};
