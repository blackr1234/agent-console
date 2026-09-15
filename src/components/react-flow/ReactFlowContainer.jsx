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
import { Box, Button, Paper, Typography } from "@mui/material";

import "@xyflow/react/dist/style.css";

import initialData from "./testData.json";

const palette = [
	{ type: "input", label: "Input" },
	{ type: "default", label: "Default" },
	{ type: "output", label: "Output" },
];

const nodeId = () => `node_${Date.now()}`;

function Sidebar() {
	const onDragStart = (e, type) => {
		e.dataTransfer.setData("application/reactflow", type);
		e.dataTransfer.effectAllowed = "move";
	};

	return (
		<Box sx={{ width: 180, p: 2, bgcolor: "background.default" }}>
			<Typography variant="h6" sx={{ mb: 2 }}>
				Nodes
			</Typography>

			<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
				{palette.map(({ type, label }) => (
					<Paper
						key={type}
						draggable
						onDragStart={(e) => onDragStart(e, type)}
						variant="outlined"
						sx={{ p: 1.5, cursor: "grab" }}
					>
						{label}
					</Paper>
				))}
			</Box>
		</Box>
	);
}

function JsonViewer({ open, onClose, data }) {
	const [copied, setCopied] = useState(false);
	if (!open) return null;

	const json = JSON.stringify(data, null, 2);

	const copy = async () => {
		await navigator.clipboard.writeText(json);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<Box
			sx={{
				position: "absolute",
				top: 0,
				right: 0,
				width: 320,
				height: "100%",
				bgcolor: "background.paper",
				p: 2,
				overflow: "auto",
				zIndex: 10,
			}}
		>
			<Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mb: 2 }}>
				<Button size="small" onClick={copy}>
					{copied ? "Copied!" : "Copy JSON"}
				</Button>
				<Button size="small" onClick={onClose}>
					Close
				</Button>
			</Box>

			<pre>{json}</pre>
		</Box>
	);
}

function FlowCanvas() {
	const [nodes, setNodes, onNodesChange] = useNodesState(initialData.nodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialData.edges);
	const [jsonOpen, setJsonOpen] = useState(false);
	const { screenToFlowPosition, setViewport, toObject } = useReactFlow();
	const viewport = useViewport();

	const onConnect = useCallback((params) => setEdges((edges) => addEdge(params, edges)), [setEdges]);

	const onDrop = (e) => {
		e.preventDefault();
		const type = e.dataTransfer.getData("application/reactflow");
		if (!type) return;

		setNodes((nodes) => [
			...nodes,
			{
				id: nodeId(),
				type,
				position: screenToFlowPosition({
					x: e.clientX,
					y: e.clientY,
				}),
				data: { label: `${type} node` },
			},
		]);
	};

	const save = () => {
		localStorage.setItem("example-flow", JSON.stringify(toObject()));
	};

	const restore = () => {
		const saved = localStorage.getItem("example-flow");
		if (!saved) return;

		const { nodes = [], edges = [], viewport = { x: 0, y: 0, zoom: 1 } } = JSON.parse(saved);

		setNodes(nodes);
		setEdges(edges);
		setViewport(viewport);
	};

	const addNode = () =>
		setNodes((nodes) => [
			...nodes,
			{
				id: nodeId(),
				data: { label: "Added node" },
				position: {
					x: Math.random() * 400,
					y: Math.random() * 400,
				},
			},
		]);

	return (
		<Box sx={{ display: "flex", height: "100vh" }}>
			<Sidebar />

			<Box sx={{ flex: 1, position: "relative" }}>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					defaultViewport={initialData.viewport} // If "fitView" is enabled, this will be ignored.
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
					fitView // Note: This prevents "defaultViewport" from taking effect.
				>
					<Background />
					<Controls />

					<Panel position="top-right">
						<Button onClick={save}>Save</Button>
						<Button onClick={restore}>Restore</Button>
						<Button onClick={addNode}>Add node</Button>
						<Button onClick={() => setJsonOpen((v) => !v)}>{jsonOpen ? "Hide JSON" : "View JSON"}</Button>
					</Panel>
				</ReactFlow>

				<JsonViewer open={jsonOpen} onClose={() => setJsonOpen(false)} data={{ nodes, edges, viewport }} />
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
