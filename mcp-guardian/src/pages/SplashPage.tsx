import PACKAGE_JSON from "../../package.json";
import GuardianLogo from "../assets/guardian-logo.png";

const SplashPage = () => {
  const { version } = PACKAGE_JSON;

  return (
    <div className="p-0">
      <div className="flex-row space-between mb-lg">
        <h1>MCP Guardian</h1>
        <div className="tag text-xs">v{version}</div>
      </div>

      <div className="card mb-lg">
        <div className="card-header">
          <h2 className="m-0">Security Control Plane</h2>
        </div>
        <div className="card-content">
          <div className="flex-row gap-lg">
            <div className="flex-col gap-md flex-1">
              <p>
                MCP Guardian provides a technical security layer between AI assistants and external 
                resources, enabling real-time monitoring and control over tool access.
              </p>
              
              <div className="flex-col gap-sm">
                <div className="flex-row gap-sm">
                  <div className="tag tag-primary">Tooling Security</div>
                  <div className="tag tag-primary">AI Governance</div>
                  <div className="tag tag-primary">Access Control</div>
                </div>
              </div>
            </div>
            
            <div style={{ width: "180px" }}>
              <img
                src={GuardianLogo}
                alt="Guardian Logo"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-row gap-md mb-lg">
        <div className="card flex-1">
          <div className="card-header">
            <h3 className="m-0 text-sm">Getting Started</h3>
          </div>
          <div className="card-content">
            <ol className="m-0 pl-4 text-sm">
              <li className="mb-sm">Create <strong>MCP Server</strong> configurations</li>
              <li className="mb-sm">Define <strong>Guard Profiles</strong> for security rules</li>
              <li className="mb-sm">Combine them in <strong>Server Collections</strong></li>
              <li>Monitor and approve requests in <strong>Pending Messages</strong></li>
            </ol>
          </div>
        </div>

        <div className="card flex-1">
          <div className="card-header">
            <h3 className="m-0 text-sm">Key Features</h3>
          </div>
          <div className="card-content">
            <ul className="m-0 pl-4 text-sm">
              <li className="mb-sm">Full visibility into AI tool interactions</li>
              <li className="mb-sm">Fine-grained approval workflows</li>
              <li className="mb-sm">Structured logging of all activities</li>
              <li>Centralized security policy management</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex-row gap-sm">
        <a 
          href="https://mcp-guardian.org" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-secondary btn-sm"
        >
          Documentation
        </a>
        <a 
          href="https://github.com/eqtylab/mcp-guardian" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-sm"
        >
          GitHub Repository
        </a>
      </div>
    </div>
  );
};

export default SplashPage;