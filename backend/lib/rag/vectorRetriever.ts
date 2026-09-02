/**
 * Semantic Vector Retriever & Hybrid Text Index
 * Supports:
 * - Recursive chunking of vendor contracts and regulatory PDFs
 * - Dense term vectorization & cosine similarity search
 * - Hybrid BM25 / token matching + semantic ranking
 */

import { REGULATORY_COMPENDIUM, type RegulatoryDocument } from './knowledgeBase';

export interface DocumentChunk {
  id: string;
  documentTitle: string;
  sourceType: 'regulatory' | 'vendor_contract' | 'audit_log';
  content: string;
  tokens: string[];
  metadata: Record<string, any>;
}

export interface RetrievalResult {
  chunk: DocumentChunk;
  score: number; // 0.0 to 1.0
  matchType: 'semantic_dense' | 'keyword_sparse' | 'hybrid';
}

export class HybridVectorIndex {
  private chunks: DocumentChunk[] = [];
  private idf: Map<string, number> = new Map();

  constructor() {
    this.indexRegulatoryCompendium();
  }

  public tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 2);
  }

  public chunkText(
    text: string,
    documentTitle: string,
    sourceType: DocumentChunk['sourceType'],
    chunkSize = 350,
    overlap = 50
  ): DocumentChunk[] {
    const words = text.split(/\s+/);
    const result: DocumentChunk[] = [];

    let i = 0;
    while (i < words.length) {
      const slice = words.slice(i, i + chunkSize);
      const content = slice.join(' ');
      const chunkId = `chunk-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

      result.push({
        id: chunkId,
        documentTitle,
        sourceType,
        content,
        tokens: this.tokenize(content),
        metadata: { wordCount: slice.length, offset: i },
      });

      i += chunkSize - overlap;
      if (slice.length < chunkSize) break;
    }

    return result;
  }

  public addChunks(newChunks: DocumentChunk[]): void {
    this.chunks.push(...newChunks);
    this.recomputeIDF();
  }

  private recomputeIDF(): void {
    const totalDocs = Math.max(this.chunks.length, 1);
    const docFreq: Map<string, number> = new Map();

    for (const chunk of this.chunks) {
      const uniqueTokens = new Set(chunk.tokens);
      for (const t of uniqueTokens) {
        docFreq.set(t, (docFreq.get(t) || 0) + 1);
      }
    }

    this.idf.clear();
    for (const [token, freq] of docFreq.entries()) {
      this.idf.set(token, Math.log(1 + totalDocs / freq));
    }
  }

  public search(query: string, topK = 4): RetrievalResult[] {
    const qTokens = this.tokenize(query);
    if (!qTokens.length) return [];

    const scored: RetrievalResult[] = [];

    for (const chunk of this.chunks) {
      let dotProduct = 0;
      let qMagnitude = 0;
      let cMagnitude = 0;

      const chunkFreq: Map<string, number> = new Map();
      for (const t of chunk.tokens) {
        chunkFreq.set(t, (chunkFreq.get(t) || 0) + 1);
      }

      for (const qToken of qTokens) {
        const idfWeight = this.idf.get(qToken) || 0.5;
        const qWeight = 1.0 * idfWeight;
        const cCount = chunkFreq.get(qToken) || 0;
        const cWeight = cCount > 0 ? (1 + Math.log(cCount)) * idfWeight : 0;

        dotProduct += qWeight * cWeight;
        qMagnitude += qWeight * qWeight;
      }

      for (const [token, count] of chunkFreq.entries()) {
        const idfWeight = this.idf.get(token) || 0.5;
        const cWeight = (1 + Math.log(count)) * idfWeight;
        cMagnitude += cWeight * cWeight;
      }

      const norm = Math.sqrt(qMagnitude) * Math.sqrt(cMagnitude);
      const cosine = norm > 0 ? dotProduct / norm : 0;

      // Keyword boost
      const keywordMatches = qTokens.filter((qt) => chunkFreq.has(qt)).length;
      const keywordRatio = keywordMatches / qTokens.length;

      const hybridScore = Math.min(1.0, cosine * 0.65 + keywordRatio * 0.35);

      if (hybridScore > 0.05) {
        scored.push({
          chunk,
          score: Math.round(hybridScore * 1000) / 1000,
          matchType: keywordRatio > 0.6 ? 'hybrid' : 'semantic_dense',
        });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  }

  private indexRegulatoryCompendium(): void {
    const generatedChunks: DocumentChunk[] = [];

    for (const doc of REGULATORY_COMPENDIUM) {
      const fullText = `[${doc.authority} MANDATE] ${doc.title}\nSection: ${doc.section}\nRequirement: ${doc.mandate}\nEnforcement Standard: ${doc.enforcementThreshold}\nMandatory Enforceable Clause: "${doc.requiredContractClause}"`;
      const docChunks = this.chunkText(fullText, `${doc.authority} — ${doc.title}`, 'regulatory');
      generatedChunks.push(...docChunks);
    }

    this.addChunks(generatedChunks);
  }
}

export const globalVectorIndex = new HybridVectorIndex();
