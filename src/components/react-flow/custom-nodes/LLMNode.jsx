import React from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import {
    Card,
    CardContent,
    Box,
    Typography,
    Select,
    MenuItem,
    Slider,
    Divider,
    IconButton,
    Tooltip,
} from "@mui/material";
import { Cpu, Settings2 } from "lucide-react";

import { nodeShell } from "./styles";

const MODEL_OPTIONS = [
    { value: "claude-opus-5", label: "Claude Opus 5" },
    { value: "claude-sonnet-5", label: "Claude Sonnet 5" },
    { value: "claude-haiku-4-5", label: "Claude Haiku 4.5" },
];

function LLMNodeHandles() {
    return (
        <>
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
        </>
    );
}

function LLMNodeHeader({ label, onConfigure }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Cpu size={16} />

            <Typography variant="subtitle2" fontWeight={600} noWrap sx={{ flex: 1, minWidth: 0 }}>
                {label || "LLM Call"}
            </Typography>

            <Tooltip title="Configure">
                <IconButton size="small" onClick={onConfigure} className="nodrag">
                    <Settings2 size={14} />
                </IconButton>
            </Tooltip>
        </Box>
    );
}

function ModelSelector({ value, onChange }) {
    return (
        <Select
            fullWidth
            size="small"
            value={value}
            onChange={onChange}
            className="nodrag"
            MenuProps={{ className: "nodrag" }}
        >
            {MODEL_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </Select>
    );
}

function SliderControl({ value, onChange }) {
    return (
        <Box>
            <Typography variant="caption" color="text.secondary">
                Temperature: {value}
            </Typography>

            <Slider
                size="small"
                min={0}
                max={1}
                step={0.1}
                value={value}
                onChange={onChange}
                className="nodrag nowheel"
            />
        </Box>
    );
}

function MaxTokensDisplay({ maxTokens }) {
    return (
        <Box display="flex" sx={{ justifyContent: "space-between" }}>
            <Typography variant="caption" color="text.secondary">
                Max tokens: {maxTokens || 1024}
            </Typography>
        </Box>
    );
}

export default function LLMNode({ id, data }) {
    const { updateNodeData } = useReactFlow();

    const model = data?.model ?? "claude-sonnet-5";
    const temperature = data?.temperature ?? 0.7;

    const handleModelChange = (event) => {
        updateNodeData(id, {
            model: event.target.value,
        });
    };

    const handleTemperatureChange = (_, value) => {
        updateNodeData(id, {
            temperature: value,
        });
    };

    return (
        <Card variant="outlined" sx={nodeShell("#0ea5e9")}>
            <LLMNodeHandles />

            <CardContent>
                <LLMNodeHeader label={data?.label} onConfigure={data?.onConfigure} />

                <ModelSelector value={model} onChange={handleModelChange} />

                <SliderControl value={temperature} onChange={handleTemperatureChange} />

                <Divider />

                <MaxTokensDisplay maxTokens={data?.maxTokens} />
            </CardContent>
        </Card>
    );
}
