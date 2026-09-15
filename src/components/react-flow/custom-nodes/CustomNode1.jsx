import { Handle, Position } from "@xyflow/react";

export default function CustomNode1({ data }) {
    return (
        <div className="custom-node">
            <Handle type="target" position={Position.Top} />

            <div className="custom-node__label">{data.label}</div>

            {data.description && <div className="custom-node__description">{data.description}</div>}

            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}
