import { ComponentType, useState, useEffect } from "react";
import _ReactModal from "react-modal";
import { invoke } from "@tauri-apps/api/core";
import { deterministicStringify } from "../utils";
import "./ClaudeExportModal.css";
import { notifyError, notifySuccess} from "./toast";

// TODO: untangle this typescript incompatibility
const ReactModal = _ReactModal as unknown as ComponentType<_ReactModal["props"]>;

interface ClaudeExportModalProps {
  isOpen: boolean;
  setIsOpen: (b: boolean) => void;
  serverCollectionNamespace: string;
  serverCollectionName: string;
}

const ClaudeExportModal = ({
  isOpen,
  setIsOpen,
  serverCollectionNamespace,
  serverCollectionName,
}: ClaudeExportModalProps) => {
  const [claudeConfig, setClaudeConfig] = useState<string>("");
  const [proxyPath, setProxyPath] = useState<string>("");

  const getClaudeConfig = async (): Promise<any> => {
    let argSet: any = { namespace: serverCollectionNamespace, name: serverCollectionName };
    if (proxyPath.length > 0) {
      argSet["proxyPath"] = proxyPath;
    }
    console.log(argSet);
    try {
      const config = await invoke("generate_claude_config_for_server_collection", argSet);
      notifySuccess(`Claude config "${argSet.namespace}.${argSet.name}" generated`);
      return config;
    } catch (e: any) {
      notifyError(e);
    }
  };

  const applyClaudeConfig = async (): Promise<void> => {
    let argSet: any = { namespace: serverCollectionNamespace, name: serverCollectionName };
    if (proxyPath.length > 0) {
      argSet["proxyPath"] = proxyPath;
    }
    try{
      await invoke("apply_claude_config_for_server_collection", argSet);
      notifySuccess(`Claude config "${argSet.namespace}.${argSet.name}" applied`);
    } catch (e: any) {
      notifyError(e);
    }
  };

  useEffect(() => {
    (async () => {
      const claudeConfig = await getClaudeConfig();
      setClaudeConfig(deterministicStringify(claudeConfig));
    })();
  }, [serverCollectionNamespace, serverCollectionName, proxyPath]);

  return (
    <div className="export-server-collection-modal-container">
      <ReactModal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
        <h1>Export Server Collection</h1>

        <hr />

        <b>Claude Desktop Config:</b>

        <br />
        <br />

        <textarea value={claudeConfig} rows={24} />

        <br />
        <br />

        <b>Proxy Path: </b>
        <input
          className="proxy-path-input"
          type="text"
          placeholder="Specify path for `mcp-guardian-proxy` if it's not in PATH"
          value={proxyPath}
          onChange={(e) => setProxyPath(e.target.value)}
        />

        <br />
        <br />

        <button className="claude-apply-btn" onClick={applyClaudeConfig}>
          Apply to Claude Desktop
        </button>
      </ReactModal>
    </div>
  );
};

export default ClaudeExportModal;
