/**
 * GraphRAG Entity & Relationship Traversal Engine
 * Represents multi-hop entity graphs linking:
 * - Vendors & Merchants
 * - 4th-Party Subprocessors & Cloud Regions
 * - Directors & Ultimate Beneficial Owners (UBOs)
 * - Audited Certifications
 * - Enforceable Regulations & Compliance Breaches
 */

export type GraphEntityType =
  | 'vendor'
  | 'subprocessor'
  | 'director_ubo'
  | 'cloud_region'
  | 'certification'
  | 'regulation'
  | 'risk_hazard';

export type GraphRelationType =
  | 'USES_SUBPROCESSOR'
  | 'HOSTED_IN'
  | 'CONTROLLED_BY'
  | 'ATTESTS_CERTIFICATION'
  | 'SUBJECT_TO'
  | 'VIOLATES_REGULATION'
  | 'EXPOSES_HAZARD';

export interface GraphNode {
  id: string;
  label: string;
  type: GraphEntityType;
  metadata: Record<string, any>;
  riskWeight: number; // 0 to 100
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relation: GraphRelationType;
  metadata?: Record<string, any>;
}

export interface GraphQueryPath {
  nodes: GraphNode[];
  edges: GraphEdge[];
  explanation: string;
  hops: number;
}

export class KnowledgeGraphStore {
  private nodes: Map<string, GraphNode> = new Map();
  private edges: Map<string, GraphEdge> = new Map();
  private adjacency: Map<string, Set<string>> = new Map();

  constructor() {
    this.seedDefaultFintechGraph();
  }

  public addNode(node: GraphNode): void {
    this.nodes.set(node.id, node);
    if (!this.adjacency.has(node.id)) {
      this.adjacency.set(node.id, new Set());
    }
  }

  public addEdge(edge: GraphEdge): void {
    this.edges.set(edge.id, edge);
    if (!this.adjacency.has(edge.source)) {
      this.adjacency.set(edge.source, new Set());
    }
    this.adjacency.get(edge.source)!.add(edge.id);
  }

  public getNode(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }

  public getAllNodes(): GraphNode[] {
    return Array.from(this.nodes.values());
  }

  public getAllEdges(): GraphEdge[] {
    return Array.from(this.edges.values());
  }

  /**
   * Multi-hop breadth-first graph traversal for an entity
   */
  public traverseSubGraph(seedId: string, maxDepth = 2): { nodes: GraphNode[]; edges: GraphEdge[] } {
    const visitedNodes = new Set<string>();
    const traversedEdges = new Set<GraphEdge>();
    const queue: Array<{ id: string; depth: number }> = [{ id: seedId, depth: 0 }];

    while (queue.length > 0) {
      const { id, depth } = queue.shift()!;
      if (visitedNodes.has(id) || depth > maxDepth) continue;
      visitedNodes.add(id);

      const outgoingEdgeIds = this.adjacency.get(id) || new Set();
      for (const edgeId of outgoingEdgeIds) {
        const edge = this.edges.get(edgeId);
        if (edge) {
          traversedEdges.add(edge);
          if (!visitedNodes.has(edge.target)) {
            queue.push({ id: edge.target, depth: depth + 1 });
          }
        }
      }
    }

    const resultNodes = Array.from(visitedNodes)
      .map((nid) => this.nodes.get(nid))
      .filter((n): n is GraphNode => n !== undefined);

    return {
      nodes: resultNodes,
      edges: Array.from(traversedEdges),
    };
  }

  /**
   * Identifies 4th-party subprocessor data egress paths
   */
  public traceSubprocessorChains(vendorId: string): GraphQueryPath[] {
    const paths: GraphQueryPath[] = [];
    const outgoing = this.adjacency.get(vendorId) || new Set();

    for (const edgeId of outgoing) {
      const edge = this.edges.get(edgeId);
      if (edge && edge.relation === 'USES_SUBPROCESSOR') {
        const subNode = this.nodes.get(edge.target);
        if (subNode) {
          // Check next hop (e.g. region or violation)
          const secondHopEdges = this.adjacency.get(subNode.id) || new Set();
          for (const sEdgeId of secondHopEdges) {
            const sEdge = this.edges.get(sEdgeId);
            if (sEdge) {
              const targetNode = this.nodes.get(sEdge.target);
              if (targetNode) {
                paths.push({
                  nodes: [this.nodes.get(vendorId)!, subNode, targetNode],
                  edges: [edge, sEdge],
                  hops: 2,
                  explanation: `${this.nodes.get(vendorId)?.label} routes data to ${subNode.label} (${sEdge.relation} ${targetNode.label})`,
                });
              }
            }
          }
        }
      }
    }
    return paths;
  }

  /**
   * Pre-populates realistic Indian fintech counterparties and regulatory dependencies
   */
  private seedDefaultFintechGraph(): void {
    // Entities
    this.addNode({
      id: 'vendor-cloudgate',
      label: 'CloudGate Infrastructure Ltd.',
      type: 'vendor',
      riskWeight: 45,
      metadata: { cin: 'U72200KA2019PTC128491', gstin: '29ABCDE1234F1Z5', incorporation: 2019 },
    });

    this.addNode({
      id: 'sub-aws',
      label: 'AWS ap-south-1 (Mumbai)',
      type: 'cloud_region',
      riskWeight: 10,
      metadata: { country: 'India', jurisdiction: 'MeitY Empanelled' },
    });

    this.addNode({
      id: 'sub-elastic',
      label: 'Elastic NV (US-East)',
      type: 'subprocessor',
      riskWeight: 75,
      metadata: { country: 'United States', crossBorderTransfer: true },
    });

    this.addNode({
      id: 'ubo-vikram',
      label: 'Vikramaditya Rao (Director/UBO 54%)',
      type: 'director_ubo',
      riskWeight: 15,
      metadata: { din: '08429184', kycStatus: 'Verified' },
    });

    this.addNode({
      id: 'cert-soc2',
      label: 'SOC2 Type II (AICPA 2024)',
      type: 'certification',
      riskWeight: 5,
      metadata: { assessor: 'Deloitte India', validUntil: '2025-11-30' },
    });

    this.addNode({
      id: 'reg-rbi-outsourcing',
      label: 'RBI IT Outsourcing Mandate 2024',
      type: 'regulation',
      riskWeight: 90,
      metadata: { requiresConsent: true, noticeDays: 30 },
    });

    this.addNode({
      id: 'hazard-subprocessor-egress',
      label: 'Cross-Border 4th-Party Data Egress without RBI Consent',
      type: 'risk_hazard',
      riskWeight: 85,
      metadata: { severity: 'critical', impact: 'Regulatory Injunction & DPDP Penalty' },
    });

    // Edges
    this.addEdge({
      id: 'e1',
      source: 'vendor-cloudgate',
      target: 'sub-aws',
      relation: 'HOSTED_IN',
    });

    this.addEdge({
      id: 'e2',
      source: 'vendor-cloudgate',
      target: 'sub-elastic',
      relation: 'USES_SUBPROCESSOR',
    });

    this.addEdge({
      id: 'e3',
      source: 'vendor-cloudgate',
      target: 'ubo-vikram',
      relation: 'CONTROLLED_BY',
    });

    this.addEdge({
      id: 'e4',
      source: 'vendor-cloudgate',
      target: 'cert-soc2',
      relation: 'ATTESTS_CERTIFICATION',
    });

    this.addEdge({
      id: 'e5',
      source: 'sub-elastic',
      target: 'hazard-subprocessor-egress',
      relation: 'EXPOSES_HAZARD',
    });

    this.addEdge({
      id: 'e6',
      source: 'vendor-cloudgate',
      target: 'reg-rbi-outsourcing',
      relation: 'SUBJECT_TO',
    });
  }
}

export const globalKnowledgeGraph = new KnowledgeGraphStore();
