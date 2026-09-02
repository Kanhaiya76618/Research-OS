import { NextResponse } from 'next/server';
import { queryGraphRAG } from '@/lib/rag/ragPipeline';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, vendorId, maxChunks, maxHops } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Request body must include a valid "query" string.' },
        { status: 400 }
      );
    }

    const result = await queryGraphRAG(query, { vendorId, maxChunks, maxHops });
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
