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
    <div className="p-0">
      <div className="flex-row space-between mb-md">
        <h1>Pending Messages</h1>

        {Object.entries(pendingMessages).length > 0 && (
          <div className="tag tag-warning">
            {Object.entries(pendingMessages).length} pending
          </div>
        )}
      </div>

      {Object.entries(pendingMessages).length === 0 ? (
        <div className="card">
          <div className="card-content text-center">
            <p className="text-sm mb-0">
              No pending messages to review. Messages requiring approval will appear here.
            </p>
          </div>
        </div>
      ) : (
        Object.entries(pendingMessages).map(([id, value]: [string, any], i) => {
          const direction = id.split("_")[0] === "inbound" ? "Inbound" : "Outbound";
          const messageComponent = (() => {
            if (direction === "Outbound") {
              if (value.method === "tools/call") {
                return () => <ToolCall name={value.params.name} args={value.params.arguments} />;
              } else {
                return () => <div className="json-editor">{JSON.stringify(value, null, 2)}</div>;
              }
            } else {
              if (value.result?.content) {
                return () => <ToolCallResponse content={value.result.content} />;
              }
              return () => <div className="json-editor">{JSON.stringify(value, null, 2)}</div>;
            }
          })() as any;

          return (
            <div key={`message-${i}`} className="card mb-md">
              <div className="card-header">
                <div className="flex-row gap-sm">
                  <div className={`tag ${direction === "Inbound" ? "" : "tag-primary"}`}>
                    {direction}
                  </div>
                  <div className="text-xs text-text-tertiary">ID: {id}</div>
                </div>

                <div className="btn-group">
                  <button
                    onClick={() => handleApprove(id)}
                    className="btn-success btn-sm"
                    title="Approve this message"
                  >
                    <CheckCircle size={14} strokeWidth={2.5} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleDeny(id)}
                    className="btn-danger btn-sm"
                    title="Deny this message"
                  >
                    <XCircle size={14} strokeWidth={2.5} />
                    Deny
                  </button>
                </div>
              </div>

              <div className="card-content">
                {React.createElement(messageComponent)}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default PendingMessagesPage;
