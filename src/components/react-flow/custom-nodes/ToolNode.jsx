import React from "react";
import { Handle, Position } from "@xyflow/react";
import {
    Card,
    CardContent,
    Box,
    Typography,
    Chip,
    Select,
    MenuItem,
    Slider,
    TextField,
    Divider,
    IconButton,
    Tooltip,
} from "@mui/material";
import { MessageSquare, Cpu, Wrench, FileOutput, Settings2, CheckCircle2, AlertTriangle } from "lucide-react";

import { nodeShell } from "./styles";

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
/* 3. ToolNode — represents a tool/function call step                 */
/* ------------------------------------------------------------------ */
export default function ToolNode({ data }) {
    const accent = "#f59e0b"; // amber
    const status = data?.status; // 'idle' | 'running' | 'success' | 'error'

    const statusIcon = {
        success: <CheckCircle2 size={14} color="#22c55e" />,
        error: <AlertTriangle size={14} color="#ef4444" />,
    }[status];

    return (
        <Card sx={nodeShell(accent)}>
            <Handle type="target" position={Position.Left} style={handleStyle(accent)} />
            <Handle type="source" position={Position.Right} style={handleStyle(accent)} />
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Box sx={headerRow}>
                    <Wrench size={16} color={accent} />
                    <Typography variant="subtitle2" fontWeight={600} sx={{ flex: 1 }}>
                        {data?.label || "Tool Call"}
                    </Typography>
                    <Tooltip title="Configure model">
                        <IconButton size="small" onClick={data?.onConfigure} className="nodrag">
                            <Settings2 size={14} />
                        </IconButton>
                    </Tooltip>
                    {statusIcon}
                </Box>

                <Chip
                    label={data?.toolName || "search_web"}
                    size="small"
                    sx={{
                        fontFamily: "monospace",
                        fontSize: 11,
                        bgcolor: "rgba(245,158,11,0.1)",
                        color: accent,
                        mb: 1,
                    }}
                />

                <Box
                    sx={{
                        bgcolor: "grey.50",
                        borderRadius: 2,
                        p: 1,
                        fontFamily: "monospace",
                        fontSize: 11,
                        color: "text.secondary",
                        maxHeight: 60,
                        overflow: "hidden",
                    }}
                >
                    {data?.paramsPreview || '{ query: "..." }'}
                </Box>
            </CardContent>
        </Card>
    );
}
