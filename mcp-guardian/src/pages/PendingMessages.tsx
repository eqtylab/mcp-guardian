import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./PendingMessages.css";

const PendingMessages = () => {
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
              const message = direction === "Inbound" ? value.result.content : value;
              return (
                <tr key={`tr-${i}`}>
                  <td key={`td1-${i}`}>{direction}</td>
                  <td key={`td2-${i}`}>{JSON.stringify(message)}</td>
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

export default PendingMessages;
