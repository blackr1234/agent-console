"use client";

import React, { useCallback, useState } from "react";
import {
    ReactFlow,
    ReactFlowProvider,
    Background,
    Controls,
    Panel,
    addEdge,
    useNodesState,
    useEdgesState,
    useReactFlow,
    useViewport,
} from "@xyflow/react";
import { Box, Button, Paper, Slide, Typography } from "@mui/material";

import "@xyflow/react/dist/style.css";
import { nodeTypes } from "./nodeTypes";
import initialData from "./testData.json";

const palette = [
    { type: "prompt", label: "Prompt" },
    { type: "llm", label: "LLM" },
    { type: "tool", label: "Tool" },
    { type: "result", label: "Result" },
];

const nodeId = () => `node_${Date.now()}`;

function FlowCanvas() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialData.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialData.edges);
    const [jsonOpen, setJsonOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const { screenToFlowPosition, setViewport, toObject } = useReactFlow();
    const viewport = useViewport();

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const onDrop = (e) => {
        e.preventDefault();
        const type = e.dataTransfer.getData("application/reactflow");
        if (!type) return;
        setNodes((nds) => [
            ...nds,
            {
                id: nodeId(),
                type,
                position: screenToFlowPosition({ x: e.clientX, y: e.clientY }),
                data: { label: `${type} node` },
            },
        ]);
    };

    const save = () => localStorage.setItem("example-flow", JSON.stringify(toObject()));
    const restore = () => {
        const saved = localStorage.getItem("example-flow");
        if (!saved) return;
        const { nodes = [], edges = [], viewport: vp = { x: 0, y: 0, zoom: 1 } } = JSON.parse(saved);
        setNodes(nodes);
        setEdges(edges);
        setViewport(vp);
    };

    const addNode = () =>
        setNodes((nds) => [
            ...nds,
            {
                id: nodeId(),
                data: { label: "Added node" },
                position: { x: Math.random() * 400, y: Math.random() * 400 },
            },
        ]);

    const copyJson = async () => {
        await navigator.clipboard.writeText(JSON.stringify({ nodes, edges, viewport }, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <Box sx={{ width: 180, p: 2, bgcolor: "background.default" }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Nodes
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {palette.map(({ type, label }) => (
                        <Paper
                            key={type}
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData("application/reactflow", type);
                                e.dataTransfer.effectAllowed = "move";
                            }}
                            variant="outlined"
                            sx={{ p: 1.5, cursor: "grab" }}
                        >
                            {label}
                        </Paper>
                    ))}
                </Box>
            </Box>

            <Box sx={{ flex: 1, position: "relative", overflow: "hidden" }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    defaultViewport={initialData.viewport}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDrop={onDrop}
                    onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                    }}
                    defaultEdgeOptions={{ animated: true }}
                    colorMode="dark"
                    fitView
                >
                    <Background />
                    <Controls />
                    <Panel position="top-right">
                        <Button onClick={save}>Save</Button>
                        <Button onClick={restore}>Restore</Button>
                        <Button onClick={addNode}>Add node</Button>
                        <Button onClick={() => setJsonOpen((v) => !v)}>View JSON</Button>
                    </Panel>
                </ReactFlow>

                <Slide direction="left" in={jsonOpen} mountOnEnter unmountOnExit>
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: 350,
                            height: "100%",
                            bgcolor: "background.paper",
                            overflow: "auto",
                            zIndex: 10,
                            boxShadow: 10,
                        }}
                    >
                        <Box
                            sx={{
                                position: "sticky",
                                top: 0,
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 1,
                                p: 2,
                                pb: 1,
                                bgcolor: "background.paper",
                                zIndex: 1,
                            }}
                        >
                            <Button size="small" onClick={copyJson}>
                                {copied ? "Copied!" : "Copy JSON"}
                            </Button>
                            <Button size="small" onClick={() => setJsonOpen(false)}>
                                Close
                            </Button>
                        </Box>
                        <Box>
                            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0 }}>
                                {JSON.stringify({ nodes, edges, viewport }, null, 2)}
                            </pre>
                        </Box>
                    </Box>
                </Slide>
            </Box>
        </Box>
    );
}

export default function ReactFlowDnDApp() {
    return (
        <ReactFlowProvider>
            <FlowCanvas />
        </ReactFlowProvider>
    );
}
