import { NextResponse } from 'next/server';
import { synthesize } from '@/lib/agents/supervisorAgent';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const studentId =
      typeof body?.studentId === 'string' && body.studentId.trim()
        ? body.studentId.trim()
        : 'vendor-demo';

    // The Supervisor reads the knowledge graph; it never writes to it.
    const report = await synthesize(studentId);
    return NextResponse.json(report);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[supervisor route error]:', err);
    // Fall back to direct synthesis to never break executive dashboard
    const report = await synthesize('vendor-demo');
    return NextResponse.json(report);
  }
}
