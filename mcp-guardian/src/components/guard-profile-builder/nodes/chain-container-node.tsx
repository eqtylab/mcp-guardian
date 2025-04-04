// import React, { useState, useEffect } from "react";
// import { Handle, Position, NodeProps, useReactFlow } from "@xyflow/react";
// import { GitMerge, ChevronDown, ChevronUp, Plus } from "lucide-react";

// // Props specific to the chain container node
// interface ChainContainerNodeProps extends NodeProps {
//   // ReactFlow node props are included through NodeProps
//   childrenCount?: number;
// }

// /**
//  * A container node that visually groups chain interceptors and their children
//  */
// const ChainContainerNode = ({ data, selected, id }: ChainContainerNodeProps) => {
//   const [collapsed, setCollapsed] = useState(false);
//   const [isDragOver, setIsDragOver] = useState(false);
//   const reactFlowInstance = useReactFlow();

//   // Cast to our data type
//   const chainData = data as ChainNodeData;
//   const chainCount = chainData?.chain?.length || 0;

//   // Notify parent about collapse state changes for layout adjustments
//   useEffect(() => {
//     if (collapsed) {
//       // Dispatch a custom event that the parent flow can listen for
//       const event = new CustomEvent("chainNodeCollapsed", {
//         detail: { nodeId: id, collapsed: true },
//       });
//       document.dispatchEvent(event);
//     } else {
//       const event = new CustomEvent("chainNodeExpanded", {
//         detail: { nodeId: id, collapsed: false },
//       });
//       document.dispatchEvent(event);
//     }
//   }, [collapsed, id]);

//   // Handle drag events for adding nodes to the container
//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     e.dataTransfer.dropEffect = "move";
//     setIsDragOver(true);
//   };

//   const handleDragLeave = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragOver(false);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragOver(false);

//     // Extract node type from the drag data
//     const nodeType = e.dataTransfer.getData("application/reactflow");
//     if (!nodeType) return;

//     // Get node position relative to the container
//     const containerRect = e.currentTarget.getBoundingClientRect();
//     const position = {
//       x: e.clientX - containerRect.left,
//       y: e.clientY - containerRect.top,
//     };

//     // Dispatch event for adding node to container
//     const event = new CustomEvent("addNodeToContainer", {
//       detail: {
//         nodeType,
//         position,
//         containerId: id,
//         containerData: chainData,
//       },
//     });
//     document.dispatchEvent(event);
//   };

//   // Find child nodes for this container
//   const childNodes = reactFlowInstance?.getNodes().filter((node) => node.parentNode === id) || [];

//   // Determine if we should show the drop zone placeholder
//   const showDropPlaceholder = childNodes.length === 0 || isDragOver;

//   return (
//     <div
//       className={`node chain-container-node rounded-lg border shadow-md ${
//         collapsed ? "w-[280px]" : "w-[450px] min-h-[200px]"
//       } ${
//         selected
//           ? "border-primary border-2 ring-2 ring-primary/20 bg-cyan-950/5 dark:bg-cyan-800/10"
//           : isDragOver
//             ? "border-rose-400 dark:border-rose-600 border-2 border-dashed bg-rose-50/50 dark:bg-rose-950/50"
//             : "border-rose-200 dark:border-rose-800/50 border-dashed bg-rose-50/30 dark:bg-rose-950/30"
//       }`}
//       onDragOver={handleDragOver}
//       onDragLeave={handleDragLeave}
//       onDrop={handleDrop}
//     >
//       <Handle
//         type="target"
//         position={Position.Left}
//         className="w-3 h-3 border border-rose-400 dark:border-rose-600 bg-rose-500"
//       />

//       {/* Container Header */}
//       <div className="flex items-center justify-between p-3 border-b border-rose-200 dark:border-rose-800/50 bg-rose-100/30 dark:bg-rose-900/30">
//         <div className="flex items-center gap-2">
//           <div className="flex-shrink-0 w-8 h-8 bg-rose-100 dark:bg-rose-900/30 rounded-md flex items-center justify-center">
//             <GitMerge size={16} className="text-rose-600 dark:text-rose-400" />
//           </div>

//           <div className="flex-1 min-w-0">
//             <div className="font-medium text-sm">Chain Interceptor</div>
//             <div className="text-xs text-muted-foreground">
//               {childNodes.length || chainCount} interceptor{(childNodes.length || chainCount) !== 1 ? "s" : ""}
//             </div>
//           </div>
//         </div>

//         {/* Toggle button for expand/collapse */}
//         <div className="flex items-center gap-2">
//           {/* Add node button */}
//           <button
//             type="button"
//             onClick={(e) => {
//               e.stopPropagation();
//               // Dispatch event for adding a new node to this container
//               const event = new CustomEvent("addNodeToContainer", {
//                 detail: {
//                   nodeType: "messagelog", // Default to adding a messagelog node
//                   position: { x: 50, y: 50 }, // Default position within container
//                   containerId: id,
//                   containerData: chainData,
//                 },
//               });
//               document.dispatchEvent(event);
//             }}
//             className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-800/30 transition-colors cursor-pointer"
//             title="Add child node"
//           >
//             <Plus size={12} />
//           </button>

//           {/* Collapse/expand button */}
//           <button
//             type="button"
//             onClick={(e) => {
//               e.stopPropagation();
//               setCollapsed(!collapsed);
//             }}
//             className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-800/30 transition-colors cursor-pointer"
//           >
//             {collapsed ? (
//               <>
//                 <ChevronDown size={12} />
//                 <span>Expand</span>
//               </>
//             ) : (
//               <>
//                 <ChevronUp size={12} />
//                 <span>Collapse</span>
//               </>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Container Content - when expanded */}
//       {!collapsed && (
//         <div className="p-4">
//           <div className="text-sm mb-2 text-muted-foreground">
//             Child interceptors will be displayed within this container.
//           </div>

//           {/* Flow visualization placeholder or drop zone */}
//           <div
//             className={`border border-dashed rounded-lg p-6 min-h-[100px] flex items-center justify-center ${
//               isDragOver
//                 ? "border-rose-400 dark:border-rose-600 bg-rose-50/70 dark:bg-rose-900/20"
//                 : "border-rose-200 dark:border-rose-800/30"
//             }`}
//           >
//             {showDropPlaceholder ? (
//               <div className="text-sm text-muted-foreground text-center">
//                 <p>{isDragOver ? "Drop here to add interceptor" : "No interceptors in this chain."}</p>
//                 <p className="text-xs mt-1">Drag interceptors here to build a chain.</p>
//               </div>
//             ) : (
//               <div className="text-sm text-muted-foreground text-center">
//                 <p>
//                   This chain contains {childNodes.length || chainCount} interceptor
//                   {(childNodes.length || chainCount) !== 1 ? "s" : ""}.
//                 </p>
//                 <p className="text-xs mt-1">Drag more interceptors here or use the + button.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Collapsed content summary */}
//       {collapsed && (
//         <div className="p-3">
//           <div className="text-xs text-muted-foreground">
//             {childNodes.length === 0
//               ? "Empty chain (no interceptors)"
//               : `Contains: ${childNodes.length} interceptor${childNodes.length !== 1 ? "s" : ""}`}
//           </div>
//         </div>
//       )}

//       <Handle
//         type="source"
//         position={Position.Right}
//         className="w-3 h-3 border border-rose-400 dark:border-rose-600 bg-rose-500"
//       />
//     </div>
//   );
// };

// export default ChainContainerNode;
