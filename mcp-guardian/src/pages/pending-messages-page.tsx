// PendingMessagesPage.tsx
import React from "react";
import { invoke } from "@tauri-apps/api/core";
import { CheckCircle, XCircle } from "lucide-react";
import ToolCall from "../components/messages/tool-call";
import ToolCallResponse from "../components/messages/tool-call-response";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardHeader, CardContent } from "../components/ui/card";
import { JsonViewer } from "../components/json-editor";

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

  const renderMessageContent = React.useCallback((value: any, direction: string) => {
    if (direction === "Outbound") {
      if (value.method === "tools/call") {
        return <ToolCall name={value.params.name} args={value.params.arguments} />;
      } else {
        return <JsonViewer data={value} maxHeight="300px" />;
      }
    } else {
      if (value.result?.content) {
        return <ToolCallResponse content={value.result.content} />;
      }
      return <JsonViewer data={value} maxHeight="300px" />;
    }
  }, []);

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
                {renderMessageContent(value, direction)}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default PendingMessagesPage;
