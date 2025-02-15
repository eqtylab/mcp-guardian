import React from "react";
import { invoke } from "@tauri-apps/api/core";
import ToolCall from "../components/messages/ToolCall";
import ToolCallResponse from "../components/messages/ToolCallResponse";
import "./PendingMessagesPage.css";

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
    <div className="container">
      <h1>Pending Messages</h1>

      <div>
        <table>
          <thead>
            <tr>
              <th>Direction</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(pendingMessages).map(([id, value]: [string, any], i) => {
              const direction = id.split("_")[0] === "inbound" ? "Inbound" : "Outbound";
              const messageComponent = (() => {
                if (direction === "Outbound") {
                  if (value.method === "tools/call") {
                    return () => <ToolCall name={value.params.name} args={value.params.arguments} />;
                  } else {
                    return () => <div>{JSON.stringify(value)}</div>;
                  }
                } else {
                  if (value.result?.content) {
                    return () => <ToolCallResponse content={value.result.content} />;
                  }
                  return () => <div>{JSON.stringify(value)}</div>;
                }
              })() as any;
              return (
                <tr key={`tr-${i}`}>
                  <td key={`td1-${i}`}>{direction}</td>
                  <td key={`td2-${i}`} className="message">
                    {React.createElement(messageComponent)}
                  </td>
                  <td key={`td3-${i}`}>
                    <button className="approve" onClick={() => handleApprove(id)} key={`btn1-${i}`}>
                      Approve
                    </button>
                    <button className="deny" onClick={() => handleDeny(id)} key={`btn2-${i}`}>
                      Deny
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingMessagesPage;
