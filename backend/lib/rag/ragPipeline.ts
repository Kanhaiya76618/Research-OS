/**
 * GraphRAG Pipeline Orchestrator
 * Combines:
 * 1. Hybrid Vector Search (Dense + BM25 keyword matching)
 * 2. Multi-hop Knowledge Graph Traversal (Entities, UBOs, Subprocessors, Regulations)
 * 3. Grounded Context Synthesis for Risk Agents
 */

import { globalKnowledgeGraph, type GraphNode, type GraphEdge, type GraphQueryPath } from './graphEngine';
import { globalVectorIndex, type RetrievalResult, type DocumentChunk } from './vectorRetriever';

export interface GraphRAGResponse {
  query: string;
  synthesizedContext: string;
  retrievedChunks: RetrievalResult[];
  graphEntities: GraphNode[];
  graphRelations: GraphEdge[];
  subprocessorChains: GraphQueryPath[];
  statutoryCitations: string[];
  confidenceScore: number;
}

export async function queryGraphRAG(
  query: string,
  options?: {
    vendorId?: string;
    maxChunks?: number;
    maxHops?: number;
  }
): Promise<GraphRAGResponse> {
  const maxChunks = options?.maxChunks ?? 4;
  const maxHops = options?.maxHops ?? 2;

  // 1. Vector Search across regulations and indexed disclosures
  const vectorResults = globalVectorIndex.search(query, maxChunks);

  // 2. Graph Traversal
  const seedId = options?.vendorId || (query.toLowerCase().includes('cloudgate') ? 'vendor-cloudgate' : 'vendor-cloudgate');
  const subgraph = globalKnowledgeGraph.traverseSubGraph(seedId, maxHops);
  const subprocessorChains = globalKnowledgeGraph.traceSubprocessorChains(seedId);

  // 3. Extract statutory citations
  const citations = Array.from(
    new Set(
      vectorResults
        .filter((r) => r.chunk.sourceType === 'regulatory')
        .map((r) => r.chunk.documentTitle)
    )
  );

  // 4. Synthesize structured context prompt for downstream LLM agents
  const contextSections: string[] = [];

  contextSections.push(`=== STATUTORY & REGULATORY COMPLIANCE MANDATES ===`);
  for (const vr of vectorResults) {
    contextSections.push(`[${vr.chunk.documentTitle}] (Relevance: ${Math.round(vr.score * 100)}%)\n${vr.chunk.content}`);
  }

  if (subgraph.nodes.length > 0) {
    contextSections.push(`\n=== KNOWLEDGE GRAPH ENTITY RELATIONSHIPS ===`);
    for (const edge of subgraph.edges) {
      const src = subgraph.nodes.find((n) => n.id === edge.source)?.label || edge.source;
      const tgt = subgraph.nodes.find((n) => n.id === edge.target)?.label || edge.target;
      contextSections.push(`(Entity) ${src} --[${edge.relation}]--> ${tgt}`);
    }
  }

  if (subprocessorChains.length > 0) {
    contextSections.push(`\n=== 4TH-PARTY SUBPROCESSOR SUPPLY CHAIN TRAILS ===`);
    for (const chain of subprocessorChains) {
      contextSections.push(`- ${chain.explanation}`);
    }
  }

  const confidence = vectorResults.length > 0 ? Math.min(0.98, vectorResults[0].score + 0.2) : 0.75;

  return {
    query,
    synthesizedContext: contextSections.join('\n\n'),
    retrievedChunks: vectorResults,
    graphEntities: subgraph.nodes,
    graphRelations: subgraph.edges,
    subprocessorChains,
    statutoryCitations: citations,
    confidenceScore: Math.round(confidence * 100) / 100,
  };
}

export function ingestVendorContractToRAG(
  documentTitle: string,
  rawText: string,
  metadata: {
    vendorName: string;
    subprocessors?: string[];
    contractType?: string;
  }
): { chunksCreated: number } {
  // Chunk and add to vector index
  const chunks = globalVectorIndex.chunkText(rawText, documentTitle, 'vendor_contract');
  globalVectorIndex.addChunks(chunks);

  // Add vendor node to graph if not present
  const vendorId = `vendor-${metadata.vendorName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  if (!globalKnowledgeGraph.getNode(vendorId)) {
    globalKnowledgeGraph.addNode({
      id: vendorId,
      label: metadata.vendorName,
      type: 'vendor',
      riskWeight: 50,
      metadata: { contractType: metadata.contractType || 'MSA' },
    });
  }

  // Link subprocessors in knowledge graph
  if (metadata.subprocessors) {
    for (const sub of metadata.subprocessors) {
      const subId = `sub-${sub.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      if (!globalKnowledgeGraph.getNode(subId)) {
        globalKnowledgeGraph.addNode({
          id: subId,
          label: sub,
          type: 'subprocessor',
          riskWeight: 40,
          metadata: {},
        });
      }
      globalKnowledgeGraph.addEdge({
        id: `edge-${vendorId}-${subId}`,
        source: vendorId,
        target: subId,
        relation: 'USES_SUBPROCESSOR',
      });
    }
  }

  return { chunksCreated: chunks.length };
}
