import { NextResponse } from 'next/server';
import { ingestVendorContractToRAG } from '@/lib/rag/ragPipeline';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { documentTitle, rawText, vendorName, subprocessors, contractType } = body;

    if (!documentTitle || !rawText || !vendorName) {
      return NextResponse.json(
        { error: 'Request body must include "documentTitle", "rawText", and "vendorName".' },
        { status: 400 }
      );
    }

    const result = ingestVendorContractToRAG(documentTitle, rawText, {
      vendorName,
      subprocessors: Array.isArray(subprocessors) ? subprocessors : [],
      contractType,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully ingested document "${documentTitle}" into GraphRAG store.`,
      chunksCreated: result.chunksCreated,
      vendorName,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
