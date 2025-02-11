import React, { useState } from "react";
import PendingMessages from "./pages/PendingMessages";
import "./App.css";


const PAGES = [
  {
    label: "MCP Servers",
    component: () => <div>TODO</div>,
  },
  {
    label: "Guard Profiles",
    component: () => <div>TODO</div>,
  },
  {
    label: "Pending Messages",
    component: PendingMessages,
  },
];

const App = () => {
  const [pageIndex, setPageIndex] = useState(2);

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
          <div className="page">
            {React.createElement(PAGES[pageIndex].component)}
          </div>
        </div>
      </div>
    </main>
  );
};

export default App;
