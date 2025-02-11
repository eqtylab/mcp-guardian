import { CopyBlock } from "react-code-blocks";
import "./ToolCall.css";

interface ToolCallProps {
  name: string;
  args: any;
}

const ToolCall = ({ name, args }: ToolCallProps) => {
  return (
    <div className="tool-call-container">
      <b>Function:</b> {name}
      <div className="label">Arguments:</div>
      <div className="value">
        <CopyBlock text={JSON.stringify(args, null, 2)} language="json" />
      </div>
    </div>
  );
};

export default ToolCall;
