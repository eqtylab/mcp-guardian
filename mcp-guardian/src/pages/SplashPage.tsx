import PACKAGE_JSON from "../../package.json";

const SplashPage = () => {
  const { version } = PACKAGE_JSON;

  return (
    <div className="container">
      <h1>MCP Guardian</h1>

      <p>version {version}</p>

      <p>mcp-guardian.org</p>

      <p>github.com/eqtylab/mcp-guardian</p>
    </div>
  );
};

export default SplashPage;
