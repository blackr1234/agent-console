import React, { useState, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
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

/**
 * Shared style helpers so every node feels consistent.
 * Adjust `accent` per node type to give quick visual identity.
 */
const nodeShell = (accent) => ({
    minWidth: 240,
    maxWidth: 280,
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    borderTop: "3px solid",
    borderTopColor: accent,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    bgcolor: "background.paper",
});

const headerRow = {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 1,
};

const handleStyle = (color) => ({
    width: 10,
    height: 10,
    background: color,
    border: "2px solid white",
});

/* ------------------------------------------------------------------ */
/* 2. LLMNode — represents a model call with configurable params      */
/* ------------------------------------------------------------------ */
export default function LLMNode({ data }) {
    const accent = "#0ea5e9"; // sky blue

    // Local state fallback for both controls: keeps the Select and Slider
    // responsive even if the parent hasn't wired up onModelChange /
    // onTemperatureChange to update this node's data yet.
    const [model, setModel] = useState(data?.model || "claude-sonnet-5");
    const [temperature, setTemperature] = useState(data?.temperature ?? 0.7);

    useEffect(() => {
        if (data?.model !== undefined) setModel(data.model);
    }, [data?.model]);

    useEffect(() => {
        if (data?.temperature !== undefined) setTemperature(data.temperature);
    }, [data?.temperature]);

    const handleModelChange = (e) => {
        const next = e.target.value;
        setModel(next);
        data?.onModelChange?.(next);
    };

    const handleTemperatureChange = (_, val) => {
        setTemperature(val);
        data?.onTemperatureChange?.(val);
    };

    return (
        <Card sx={nodeShell(accent)}>
            <Handle type="target" position={Position.Left} style={handleStyle(accent)} />
            <Handle type="source" position={Position.Right} style={handleStyle(accent)} />
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Box sx={headerRow}>
                    <Cpu size={16} color={accent} />
                    <Typography variant="subtitle2" fontWeight={600} sx={{ flex: 1 }}>
                        {data?.label || "LLM Call"}
                    </Typography>
                    <Tooltip title="Configure model">
                        <IconButton size="small" onClick={data?.onConfigure} className="nodrag">
                            <Settings2 size={14} />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Select
                    fullWidth
                    size="small"
                    value={model}
                    onChange={handleModelChange}
                    className="nodrag"
                    // MUI renders the dropdown in a portal outside the node's DOM,
                    // so the open menu also needs nodrag or its clicks get swallowed.
                    MenuProps={{
                        className: "nodrag",
                        disablePortal: false,
                    }}
                    sx={{ fontSize: 12, mb: 1.5, borderRadius: 2 }}
                >
                    <MenuItem value="claude-opus-5" sx={{ fontSize: 12 }}>
                        Claude Opus 5
                    </MenuItem>
                    <MenuItem value="claude-sonnet-5" sx={{ fontSize: 12 }}>
                        Claude Sonnet 5
                    </MenuItem>
                    <MenuItem value="claude-haiku-4-5-20251001" sx={{ fontSize: 12 }}>
                        Claude Haiku 4.5
                    </MenuItem>
                </Select>

                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                    Temperature: {temperature}
                </Typography>
                <Slider
                    size="small"
                    min={0}
                    max={1}
                    step={0.1}
                    value={temperature}
                    onChange={handleTemperatureChange}
                    className="nodrag nowheel"
                    sx={{ color: accent }}
                />

                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="caption" color="text.secondary">
                        Max tokens
                    </Typography>
                    <Typography variant="caption" fontWeight={600}>
                        {data?.maxTokens || 1024}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}
