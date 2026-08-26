import { NextResponse } from 'next/server';
import { buildLearningPath } from '@/lib/agents/curriculumAgent';
import { recordLearningPath } from '@/lib/orchestrator/knowledgeGraph';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = body.vendorQuery || body.topic || body.arxivUrl;
    const identifier = body.vendorId || body.studentId || 'default-auditor';

    if (typeof query !== 'string' || !query.trim()) {
      return NextResponse.json(
        { error: 'Request body must include non-empty "vendorQuery", "topic", or "arxivUrl".' },
        { status: 400 }
      );
    }
    const result = await buildLearningPath(query);
    recordLearningPath(identifier, result);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

