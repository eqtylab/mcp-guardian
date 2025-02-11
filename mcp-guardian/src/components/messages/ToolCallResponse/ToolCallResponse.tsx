import { CopyBlock } from "react-code-blocks";
import "./ToolCallResponse.css";

interface ToolCallResponseProps {
  content: any[];
}

const ToolCallResponse = ({ content }: ToolCallResponseProps) => {
  return (
    <div className="tool-call-response-container">
      <div className="label">Response:</div>
      {content.map((item, i) => {
        const json = (() => {
          if (item.type === "text") {
            return JSON.stringify(JSON.parse(item.text), null, 2);
          } else {
            return JSON.stringify(item, null, 2);
          }
        })();
        return (
          <div key={i} className="code-block-container">
            <CopyBlock text={json} language="json" />
          </div>
        );
      })}
    </div>
  );
};

export default ToolCallResponse;
