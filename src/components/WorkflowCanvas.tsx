'use client';

import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { ArrowRight, ArrowLeft, Workflow } from 'lucide-react';

const nodeColors: Record<string, { bg: string; border: string }> = {
  start: { bg: '#22d3ee', border: '#0891b2' },
  end: { bg: '#22d3ee', border: '#0891b2' },
  process: { bg: '#3b82f6', border: '#1d4ed8' },
  decision: { bg: '#f59e0b', border: '#d97706' },
  database: { bg: '#8b5cf6', border: '#7c3aed' },
  api: { bg: '#10b981', border: '#059669' },
  user: { bg: '#ec4899', border: '#db2777' },
};

export function WorkflowCanvas() {
  const { workflowData, nextStep, prevStep } = useAppStore();

  const { initialNodes, initialEdges } = useMemo(() => {
    if (!workflowData?.pipelines?.length) {
      return { initialNodes: [], initialEdges: [] };
    }

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let yOffset = 0;

    workflowData.pipelines.forEach((pipeline, pipelineIndex) => {
      // Add pipeline label
      nodes.push({
        id: `pipeline-label-${pipelineIndex}`,
        type: 'default',
        data: { label: pipeline.name },
        position: { x: 0, y: yOffset },
        style: {
          background: 'transparent',
          border: 'none',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#22d3ee',
          width: 200,
        },
      });

      yOffset += 50;

      pipeline.steps.forEach((step, stepIndex) => {
        const colors = nodeColors[step.type] || nodeColors.process;
        nodes.push({
          id: step.id,
          type: 'default',
          data: {
            label: (
              <div className="text-center">
                <div className="font-semibold">{step.name}</div>
                <div className="text-xs opacity-70">{step.description}</div>
              </div>
            ),
          },
          position: { x: stepIndex * 220, y: yOffset },
          style: {
            background: colors.bg,
            border: `2px solid ${colors.border}`,
            borderRadius: step.type === 'decision' ? '0' : '8px',
            transform: step.type === 'decision' ? 'rotate(45deg)' : 'none',
            padding: '12px',
            minWidth: '150px',
            color: '#030712',
          },
        });
      });

      pipeline.connections.forEach((conn) => {
        edges.push({
          id: `${conn.from}-${conn.to}`,
          source: conn.from,
          target: conn.to,
          label: conn.label,
          type: 'smoothstep',
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: '#22d3ee', strokeWidth: 2 },
          labelStyle: { fill: '#e5e7eb', fontSize: 12 },
        });
      });

      yOffset += 150;
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [workflowData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  if (!workflowData?.pipelines?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No workflow data available. Please go back and generate a workflow.</p>
        <Button variant="outline" onClick={prevStep} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-magenta-400 bg-clip-text text-transparent">
          Visual Workflow
        </h2>
        <p className="mt-2 text-muted-foreground">
          AI-generated workflow pipelines for your app
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5 text-cyan-400" />
            Workflow Pipelines
          </CardTitle>
          <CardDescription>
            Drag nodes to rearrange, scroll to zoom
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] rounded-lg overflow-hidden border border-border">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
              attributionPosition="bottom-left"
            >
              <Background color="#374151" gap={20} />
              <Controls className="bg-card border-border" />
              <MiniMap
                nodeColor={(node) => {
                  const type = workflowData.pipelines
                    .flatMap((p) => p.steps)
                    .find((s) => s.id === node.id)?.type;
                  return nodeColors[type || 'process']?.bg || '#3b82f6';
                }}
                className="bg-card border-border"
              />
            </ReactFlow>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button size="lg" onClick={nextStep} className="gap-2">
          Choose Database
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
