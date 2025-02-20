import PACKAGE_JSON from "../../package.json";
import GuardianLogo from "../assets/guardian-logo.png";
import "./SplashPage.css";

const SplashPage = () => {
  const { version } = PACKAGE_JSON;

  return (
    <div className="splash-page-container">
      <h1>MCP Guardian</h1>

      <img className="splash-page-logo" src={GuardianLogo} alt="Guardian Logo" />

      <p>mcp-guardian.org</p>

      <p>github.com/eqtylab/mcp-guardian</p>

      <p>v{version}</p>
    </div>
  );
};

export default SplashPage;
