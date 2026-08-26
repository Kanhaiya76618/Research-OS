import { NextResponse } from 'next/server';
import { critiqueDraft } from '@/lib/agents/criticAgent';
import { recordCritique } from '@/lib/orchestrator/knowledgeGraph';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text = body.contractText || body.draftText;
    const identifier = body.vendorId || body.studentId || 'default-auditor';

    if (typeof text !== 'string' || !text.trim()) {
      return NextResponse.json(
        { error: 'Request body must include non-empty "contractText" or "draftText".' },
        { status: 400 }
      );
    }
    const result = await critiqueDraft(text, identifier);
    recordCritique(identifier, result);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

