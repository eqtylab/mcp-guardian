import React, { useState } from "react";
import ReactModal from "react-modal";
import McpServersPage from "./pages/McpServersPage";
import GuardProfilesPage from "./pages/GuardProfilesPage";
import PendingMessagesPage from "./pages/PendingMessagesPage";
import "./App.css";

const PAGES = [
  {
    label: "MCP Servers",
    component: McpServersPage,
  },
  {
    label: "Guard Profiles",
    component: GuardProfilesPage,
  },
  {
    label: "Server Collections",
    component: () => <div>TODO</div>,
  },
  {
    label: "Pending Messages",
    component: PendingMessagesPage,
  },
];

ReactModal.setAppElement("#root");

const App = () => {
  const [pageIndex, setPageIndex] = useState(3);

  return (
    <main>
      <div className="main-grid">
        <div className="nav-link-container">
          {PAGES.map((page, i) => (
            <div
              key={`nav-link-${i}`}
              className={pageIndex === i ? "nav-link active" : "nav-link"}
              onClick={() => setPageIndex(i)}
            >
              {page.label}
            </div>
          ))}
        </div>
        <div>
          <div className="page">{React.createElement(PAGES[pageIndex].component)}</div>
        </div>
      </div>
    </main>
  );
};

export default App;
