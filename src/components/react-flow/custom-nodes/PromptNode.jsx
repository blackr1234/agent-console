import React, { useState, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, Box, Typography, Chip, TextField } from "@mui/material";
import { MessageSquare } from "lucide-react";

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
/* 1. PromptNode — captures the initial user/system prompt input      */
/* ------------------------------------------------------------------ */
export default function PromptNode({ data }) {
    const accent = "#6366f1"; // indigo

    // Local state fallback: keeps typing responsive even if the parent
    // hasn't wired data.onChange to update this node's data yet.
    // If data.prompt changes from outside (e.g. loaded from a saved flow),
    // this stays in sync via the effect below.
    const [value, setValue] = useState(data?.prompt || "");

    useEffect(() => {
        setValue(data?.prompt || "");
    }, [data?.prompt]);

    const handleChange = (e) => {
        const next = e.target.value;
        setValue(next); // update local state immediately so the field never feels "stuck"
        data?.onChange?.(next); // propagate up to parent state if a handler was provided
    };

    return (
        <Card sx={nodeShell(accent)}>
            <Handle type="source" position={Position.Right} style={handleStyle(accent)} />
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Box sx={headerRow}>
                    <MessageSquare size={16} color={accent} />
                    <Typography variant="subtitle2" fontWeight={600}>
                        {data?.label || "Prompt Input"}
                    </Typography>
                </Box>

                <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    maxRows={4}
                    size="small"
                    placeholder="Enter your prompt..."
                    value={value}
                    onChange={handleChange}
                    className="nodrag nowheel"
                    sx={{
                        "& .MuiInputBase-root": { fontSize: 12, borderRadius: 2 },
                    }}
                />

                <Box sx={{ display: "flex", gap: 0.5, mt: 1, flexWrap: "wrap" }}>
                    {(data?.variables || []).map((v) => (
                        <Chip
                            key={v}
                            label={`{{${v}}}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: 10, height: 20 }}
                        />
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
}
