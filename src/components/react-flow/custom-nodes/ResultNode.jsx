import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, Box, Typography, Chip, IconButton, Tooltip } from "@mui/material";
import { MessageSquare, Cpu, Wrench, FileOutput, Settings2, CheckCircle2, AlertTriangle } from "lucide-react";

import { nodeShell } from "./styles";

const headerRow = {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 1,
    minWidth: 0,
};

const handleStyle = (color) => ({
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: color,
    border: "2px solid white",
});

export default function OutputNode({ data }) {
    const accent = "#22c55e"; // green

    return (
        <Card sx={nodeShell(accent)}>
            <Handle type="target" position={Position.Left} style={handleStyle(accent)} />
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Box sx={headerRow}>
                    <FileOutput size={16} color={accent} style={{ flexShrink: 0 }} />
                    <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        noWrap
                        sx={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                        {data?.label || "Output"}
                    </Typography>
                    <Tooltip title="Configure model">
                        <IconButton size="small" onClick={data?.onConfigure} className="nodrag">
                            <Settings2 size={14} />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Box
                    sx={{
                        bgcolor: "rgba(34,197,94,0.06)",
                        border: "1px dashed",
                        borderColor: "rgba(34,197,94,0.4)",
                        borderRadius: 2,
                        p: 1.25,
                        fontSize: 12,
                        color: "text.primary",
                        minHeight: 48,
                        maxHeight: 180,
                        overflowY: "auto",
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                        wordBreak: "break-word",
                    }}
                >
                    {data?.result || "Result will appear here..."}
                </Box>

                {data?.format && (
                    <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        <Chip label={data.format} size="small" variant="outlined" sx={{ fontSize: 10, height: 20 }} />
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
