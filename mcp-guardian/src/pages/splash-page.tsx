import PACKAGE_JSON from "../../package.json";
import GuardianLogo from "../assets/guardian-logo.png";
import { Badge } from "../components/ui/badge";
import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

const SplashPage = () => {
  const { version } = PACKAGE_JSON;

  return (
    <div className="p-0 relative">
      {/* More subtle background grid overlay */}
      <div className="absolute inset-0 cyber-grid -z-10 opacity-15 pointer-events-none"></div>
      
      <div className="flex justify-between items-center mb-6">
        <h1>MCP Guardian</h1>
        <Badge variant="secondary" className="text-xs">v{version}</Badge>
      </div>

      <Card 
        variant="cyber" 
        grid="none" 
        glow="none" 
        className="mb-6 border-border"
      >
        <CardHeader>
          <CardTitle className="text-lg">Security Control Plane</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            <div className="flex flex-col gap-4 flex-1">
              <p>
                MCP Guardian provides a technical security layer between AI assistants and external 
                resources, enabling real-time monitoring and control over tool access.
              </p>
              
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="primary">Tooling Security</Badge>
                  <Badge variant="primary">AI Governance</Badge>
                  <Badge variant="primary">Access Control</Badge>
                </div>
              </div>
            </div>
            
            <div style={{ width: "180px" }}>
              <img
                src={GuardianLogo}
                alt="Guardian Logo"
                style={{ width: "100%", height: "auto" }}
                className="relative z-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 mb-6">
        <Card 
          variant="angular" 
          grid="none" 
          className="flex-1 border-[rgba(var(--neon-blue-rgb),0.2)]"
        >
          <CardHeader>
            <CardTitle className="text-sm">Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="m-0 pl-4 text-sm">
              <li className="mb-2">Create <strong className="text-primary">MCP Server</strong> configurations</li>
              <li className="mb-2">Define <strong className="text-primary">Guard Profiles</strong> for security rules</li>
              <li className="mb-2">Combine them in <strong className="text-primary">Server Collections</strong></li>
              <li>Monitor and approve requests in <strong className="text-primary">Pending Messages</strong></li>
            </ol>
          </CardContent>
        </Card>

        <Card 
          variant="angular" 
          grid="none" 
          className="flex-1 border-[rgba(var(--neon-blue-rgb),0.2)]"
        >
          <CardHeader>
            <CardTitle className="text-sm">Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="m-0 pl-4 text-sm">
              <li className="mb-2">Full visibility into AI tool interactions</li>
              <li className="mb-2">Fine-grained approval workflows</li>
              <li className="mb-2">Structured logging of all activities</li>
              <li>Centralized security policy management</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button 
          asChild
          variant="secondary"
          size="sm"
        >
          <a 
            href="https://mcp-guardian.org" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </Button>
        <Button 
          asChild
          variant="primary"
          size="sm"
        >
          <a 
            href="https://github.com/eqtylab/mcp-guardian" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            GitHub Repository
          </a>
        </Button>
      </div>
    </div>
  );
};

export default SplashPage;