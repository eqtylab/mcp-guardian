import PACKAGE_JSON from "../../package.json";
import GuardianLogo from "../assets/guardian-logo.png";

const SplashPage = () => {
  const { version } = PACKAGE_JSON;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cream-50 dark:bg-primary-800 p-3">
      <div className="space-y-3 text-center">
        <h1 className="text-2xl font-bold text-primary-900 dark:text-cream-50">MCP Guardian</h1>

        <img
          className="w-[300px] h-auto transition-transform duration-300 hover:scale-105"
          src={GuardianLogo}
          alt="Guardian Logo"
        />

        <div className="space-y-0.5 text-primary-700 dark:text-cream-200">
          <p className="hover:text-shield-300 transition-colors">
            <a href="https://mcp-guardian.org" target="_blank" rel="noopener noreferrer">
              mcp-guardian.org
            </a>
          </p>

          <p className="hover:text-shield-300 transition-colors">
            <a href="https://github.com/eqtylab/mcp-guardian" target="_blank" rel="noopener noreferrer">
              github.com/eqtylab/mcp-guardian
            </a>
          </p>

          <p className="mt-1.5 text-sm font-mono bg-cream-100 dark:bg-primary-700 px-2 py-0.5 rounded-md inline-block">
            v{version}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
