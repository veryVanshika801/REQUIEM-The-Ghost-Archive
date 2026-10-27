import React, { useState, useMemo } from 'react';
import { Network, ZoomIn, ZoomOut, RotateCcw, List, Layers, ShieldCheck, AlertTriangle, HelpCircle, FileText } from 'lucide-react';
import { DreamNode, DreamEdge, DreamNodeType, DreamNodeStatus } from '../types/archive';
import reconstructionCodexImg from '../assets/images/reconstruction_codex_1793105369521.jpg';

interface UnfinishedDreamsMapSectionProps {
  nodes: DreamNode[];
  edges: DreamEdge[];
}

export const UnfinishedDreamsMapSection: React.FC<UnfinishedDreamsMapSectionProps> = ({
  nodes,
  edges
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(nodes[1]?.id || nodes[0]?.id || null);
  const [activeFilter, setActiveFilter] = useState<DreamNodeType | 'all'>('all');
  const [viewMode, setViewMode] = useState<'graph' | 'list'>('graph');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [imgSrc, setImgSrc] = useState<string>(reconstructionCodexImg || '/images/codex-hologram.jpg');

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;

  // Connected nodes
  const connectedNodeIds = useMemo(() => {
    if (!selectedNodeId) return new Set<string>();
    const ids = new Set<string>();
    edges.forEach(e => {
      if (e.source === selectedNodeId) ids.add(e.target);
      if (e.target === selectedNodeId) ids.add(e.source);
    });
    return ids;
  }, [selectedNodeId, edges]);

  const getNodeColor = (status: DreamNodeStatus) => {
    switch (status) {
      case 'verified': return '#10b981'; // emerald
      case 'incomplete': return '#f59e0b'; // amber
      case 'uncertain': return '#956bff'; // violet
      case 'blocked': return '#ef4444'; // red
      default: return '#75d8ff';
    }
  };

  const filteredNodes = useMemo(() => {
    if (activeFilter === 'all') return nodes;
    return nodes.filter(n => n.type === activeFilter);
  }, [nodes, activeFilter]);

  return (
    <section id="dreams-map" className="relative py-28 bg-[#0b081a] overflow-hidden border-t border-[#17102E]">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs tracking-[0.2em] text-[#75D8FF] uppercase font-mono mb-4">
              <span className="w-6 h-[1px] bg-[#75D8FF]" />
              <span>Section 08 · Topological Archaeology</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#ECEAF5] tracking-tight font-display mb-4">
              THE UNFINISHED DREAMS MAP
            </h2>
            <p className="text-base text-[#A8A4B8] leading-relaxed font-light">
              Interactive topological node graph mapping implemented systems, incomplete modules, unfulfilled RFC intents, and blocking deadlocks.
            </p>
          </div>

          {/* View Mode & Zoom Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center p-1 bg-[#17102E] rounded-lg border border-[#30215B]">
              <button
                onClick={() => setViewMode('graph')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-md transition-colors ${
                  viewMode === 'graph' ? 'bg-[#956BFF] text-white' : 'text-[#A8A4B8] hover:text-[#ECEAF5]'
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                <span>Node Graph</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-[#956BFF] text-white' : 'text-[#A8A4B8] hover:text-[#ECEAF5]'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Accessible List</span>
              </button>
            </div>

            {viewMode === 'graph' && (
              <div className="flex items-center gap-1 p-1 bg-[#17102E] rounded-lg border border-[#30215B]">
                <button
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.45))}
                  className="p-1.5 text-[#A8A4B8] hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.7))}
                  className="p-1.5 text-[#A8A4B8] hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="p-1.5 text-[#A8A4B8] hover:text-white"
                  title="Reset View"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 mb-8 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[#A8A4B8]">Verified Module</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-[#A8A4B8]">Incomplete (Panic / Stub)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#956BFF]" />
            <span className="text-[#A8A4B8]">Uncertain / Inferred RFC</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="text-[#A8A4B8]">Blocking Dependency</span>
          </div>
        </div>

        {/* Graph / List View Container */}
        {viewMode === 'graph' ? (
          <div className="relative rounded-2xl bg-[#080712] border border-[#30215B] h-[550px] overflow-hidden flex flex-col justify-between shadow-2xl">
            {/* Background Holographic Codex Asset */}
            <div className="absolute right-0 bottom-0 w-80 h-80 opacity-15 pointer-events-none mix-blend-screen">
              <img
                src={imgSrc}
                onError={() => setImgSrc('/images/codex-hologram.jpg')}
                alt="Codex Hologram"
                className="w-full h-full object-contain"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Interactive SVG Canvas */}
            <svg
              className="w-full h-full cursor-grab active:cursor-grabbing select-none"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}
              viewBox="0 0 800 500"
            >
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-angle"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#30215B" />
                </marker>
                <marker
                  id="arrow-active"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-angle"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#956BFF" />
                </marker>
              </defs>

              {/* Render Edges */}
              {edges.map(edge => {
                const sourceNode = nodes.find(n => n.id === edge.source);
                const targetNode = nodes.find(n => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const isConnectedToSelected =
                  selectedNodeId === edge.source || selectedNodeId === edge.target;

                return (
                  <g key={edge.id}>
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={isConnectedToSelected ? '#956BFF' : '#221745'}
                      strokeWidth={isConnectedToSelected ? 2.5 : 1.5}
                      strokeDasharray={edge.relationType === 'intends' ? '4 4' : undefined}
                      markerEnd={isConnectedToSelected ? 'url(#arrow-active)' : 'url(#arrow)'}
                    />
                    {edge.label && (
                      <text
                        x={(sourceNode.x + targetNode.x) / 2}
                        y={(sourceNode.y + targetNode.y) / 2 - 8}
                        fill={isConnectedToSelected ? '#75D8FF' : '#574d75'}
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Render Nodes */}
              {nodes.map(node => {
                const isSelected = selectedNodeId === node.id;
                const isNeighbor = connectedNodeIds.has(node.id);
                const color = getNodeColor(node.status);

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className="cursor-pointer transition-transform duration-200"
                    transform={`translate(${node.x}, ${node.y})`}
                  >
                    {/* Pulsing ring for selected node */}
                    {isSelected && (
                      <circle
                        r="32"
                        fill="none"
                        stroke={color}
                        strokeWidth="1.5"
                        opacity="0.4"
                        className="animate-ping"
                      />
                    )}

                    <circle
                      r="22"
                      fill="#080712"
                      stroke={isSelected ? '#ECEAF5' : color}
                      strokeWidth={isSelected ? 3 : 2}
                      className="shadow-lg"
                    />

                    {/* Inner status dot */}
                    <circle r="6" fill={color} />

                    {/* Node Label */}
                    <text
                      y="36"
                      fill={isSelected ? '#ECEAF5' : '#A8A4B8'}
                      fontSize="11"
                      fontFamily="monospace"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      textAnchor="middle"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Bottom floating inspection card */}
            {selectedNode && (
              <div className="p-4 bg-[#0f0b21]/95 backdrop-blur border-t border-[#30215B] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 z-10">
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: getNodeColor(selectedNode.status) }}
                  />
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#A8A4B8]">
                      <span className="uppercase text-[#ECEAF5] font-semibold">{selectedNode.label}</span>
                      <span>·</span>
                      <span className="capitalize">{selectedNode.type}</span>
                      <span>·</span>
                      <span className="text-[#75D8FF]">{selectedNode.filename}</span>
                    </div>
                    <div className="text-xs text-[#A8A4B8] max-w-2xl mt-0.5">
                      {selectedNode.description}
                    </div>
                  </div>
                </div>

                <div className="text-xs font-mono text-[#A8A4B8] shrink-0">
                  Status: <strong className="uppercase text-[#ECEAF5]">{selectedNode.status}</strong>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Accessible List View */
          <div className="space-y-4">
            {filteredNodes.map(node => (
              <div
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className="p-6 rounded-xl bg-[#0f0b21] border border-[#30215B] hover:border-[#956BFF] transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-4 h-4 rounded-full mt-1 shrink-0"
                    style={{ backgroundColor: getNodeColor(node.status) }}
                  />
                  <div>
                    <h3 className="text-base font-bold text-[#ECEAF5] font-display">
                      {node.label}
                    </h3>
                    <div className="text-xs font-mono text-[#75D8FF] mb-1">
                      {node.filename} · {node.type}
                    </div>
                    <p className="text-xs text-[#A8A4B8] leading-relaxed">
                      {node.description}
                    </p>
                  </div>
                </div>

                <div className="text-xs font-mono uppercase tracking-wider text-[#A8A4B8] shrink-0">
                  Status: <span className="text-[#ECEAF5]">{node.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
