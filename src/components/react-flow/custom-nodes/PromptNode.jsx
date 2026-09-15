import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, Box, Typography, Chip, TextField } from "@mui/material";
import { MessageSquare } from "lucide-react";

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

export default function PromptNode({ data }) {
    const accent = "#6366f1";

    const value = data?.prompt || "";

    const handleChange = (e) => {
        data?.onChange?.(e.target.value);
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
                        "& .MuiInputBase-root": {
                            fontSize: 12,
                            borderRadius: 2,
                        },
                    }}
                />

                <Box
                    sx={{
                        display: "flex",
                        gap: 0.5,
                        mt: 1,
                        flexWrap: "wrap",
                    }}
                >
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
