import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import ToolCall from "../components/messages/ToolCall";
import ToolCallResponse from "../components/messages/ToolCallResponse";
import "./PendingMessagesPage.css";

const PendingMessagesPage = () => {
  const [pendingApprovals, setPendingApprovals] = useState({} as any);

  const updatePendingApprovals = async () => {
    const newPendingApprovals = await invoke("get_pending_messages", {});
    setPendingApprovals(newPendingApprovals);
  };

  useEffect(() => {
    updatePendingApprovals();
  }, []);

  const handleApprove = async (id: string) => {
    await invoke("approve_message", { id });
    updatePendingApprovals();
  };

  const handleDeny = async (id: string) => {
    await invoke("deny_message", { id });
    updatePendingApprovals();
  };

  return (
    <div className="container">
      <h1>Pending Messages</h1>

      <button onClick={updatePendingApprovals}>Refresh</button>

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
            {Object.entries(pendingApprovals).map(([id, value]: [string, any], i) => {
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
