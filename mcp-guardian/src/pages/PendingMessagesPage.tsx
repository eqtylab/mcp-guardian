// PendingMessagesPage.tsx
import React from "react";
import { invoke } from "@tauri-apps/api/core";
import { CheckCircle, XCircle } from "lucide-react";
import ToolCall from "../components/messages/ToolCall";
import ToolCallResponse from "../components/messages/ToolCallResponse";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { JSONViewer } from "../components/ui/JSONViewer";

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

  const pendingCount = Object.entries(pendingMessages).length;

  return (
    <div className="p-0">
      <div className="flex justify-between items-center mb-4">
        <h1>Pending Messages</h1>

        {pendingCount > 0 && (
          <Badge variant="warning">
            {pendingCount} pending
          </Badge>
        )}
      </div>

      {pendingCount === 0 ? (
        <Card>
          <CardContent className="text-center py-4">
            <p className="text-sm mb-0">
              No pending messages to review. Messages requiring approval will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(pendingMessages).map(([id, value]: [string, any], i) => {
          const direction = id.split("_")[0] === "inbound" ? "Inbound" : "Outbound";
          const messageComponent = (() => {
            if (direction === "Outbound") {
              if (value.method === "tools/call") {
                return () => <ToolCall name={value.params.name} args={value.params.arguments} />;
              } else {
                return () => <JSONViewer data={value} />;
              }
            } else {
              if (value.result?.content) {
                return () => <ToolCallResponse content={value.result.content} />;
              }
              return () => <JSONViewer data={value} />;
            }
          })() as any;

          return (
            <Card key={`message-${i}`} className="mb-4">
              <CardHeader className="flex justify-between items-center px-4 py-3">
                <div className="flex items-center gap-2">
                  <Badge variant={direction === "Inbound" ? "secondary" : "primary"}>
                    {direction}
                  </Badge>
                  <span className="text-xs text-colors-text-tertiary">ID: {id}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprove(id)}
                    variant="success"
                    size="sm"
                    title="Approve this message"
                  >
                    <CheckCircle size={14} strokeWidth={2.5} className="mr-1" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleDeny(id)}
                    variant="danger"
                    size="sm"
                    title="Deny this message"
                  >
                    <XCircle size={14} strokeWidth={2.5} className="mr-1" />
                    Deny
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                {React.createElement(messageComponent)}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default PendingMessagesPage;
