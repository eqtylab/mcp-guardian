// PendingMessagesPage.tsx
import React from "react";
import { invoke } from "@tauri-apps/api/core";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import ToolCall from "../components/messages/ToolCall";
import ToolCallResponse from "../components/messages/ToolCallResponse";

interface PendingMessagesPageProps {
  pendingMessages: any;
  updatePendingMessages: () => Promise<void>;
}

const PendingMessagesPage = ({ pendingMessages, updatePendingMessages }: PendingMessagesPageProps) => {
  const handleApprove = async (id: string) => {
    await invoke("approve_message", { id });
    updatePendingMessages();
  };

  const handleDeny = async (id: string) => {
    await invoke("deny_message", { id });
    updatePendingMessages();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pending Messages</h1>

        {Object.entries(pendingMessages).length > 0 && (
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="text-shield-300" />
            <span className="text-sm font-medium">{Object.entries(pendingMessages).length} pending message(s)</span>
          </div>
        )}
      </div>

      {Object.entries(pendingMessages).length === 0 ? (
        <div className="component-container text-center py-12">
          <h2 className="text-xl font-medium text-primary-700 dark:text-cream-200">No pending messages to review</h2>
          <p className="mt-2 text-primary-600 dark:text-cream-300">New messages requiring approval will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(pendingMessages).map(([id, value]: [string, any], i) => {
            const direction = id.split("_")[0] === "inbound" ? "Inbound" : "Outbound";
            const messageComponent = (() => {
              if (direction === "Outbound") {
                if (value.method === "tools/call") {
                  return () => <ToolCall name={value.params.name} args={value.params.arguments} />;
                } else {
                  return () => <div className="font-mono text-sm">{JSON.stringify(value, null, 2)}</div>;
                }
              } else {
                if (value.result?.content) {
                  return () => <ToolCallResponse content={value.result.content} />;
                }
                return () => <div className="font-mono text-sm">{JSON.stringify(value, null, 2)}</div>;
              }
            })() as any;

            return (
              <div key={`message-${i}`} className="component-container space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full
                      ${
                        direction === "Inbound"
                          ? "bg-cream-100 text-primary-900 dark:bg-primary-700 dark:text-cream-50"
                          : "bg-shield-100 text-primary-900 dark:bg-shield-300 dark:text-primary-900"
                      }`}
                    >
                      {direction}
                    </span>
                    <span className="text-sm font-mono text-primary-700 dark:text-cream-200">ID: {id}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(id)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm btn-success"
                      title="Approve this message"
                    >
                      <CheckCircle size={16} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleDeny(id)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm btn-danger"
                      title="Deny this message"
                    >
                      <XCircle size={16} />
                      Deny
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-cream-100 dark:bg-primary-700 rounded-[var(--radius-brand)]">
                  {React.createElement(messageComponent)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PendingMessagesPage;
