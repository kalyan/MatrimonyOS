import { NextRequest, NextResponse } from 'next/server';
import { calculateMatchScore } from '@/lib/matchmaking/scoring';

export async function POST(req: NextRequest) {
  try {
    const { candidate, userProfile, preferences } = await req.json();
    if (!candidate || !userProfile) {
      return NextResponse.json({ error: 'Missing candidate or userProfile' }, { status: 400 });
    }
    const result = calculateMatchScore(candidate, userProfile, preferences);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Scoring calculation failed' }, { status: 500 });
  }
}
