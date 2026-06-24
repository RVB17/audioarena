import { NextResponse } from 'next/server';
import { processMatchmakingQueue } from '@/lib/matchmaking/engine';

export async function POST(request: Request) {
  try {
    // In a production app, you would secure this endpoint with a secret key
    // so only an authorized cron job (e.g., Vercel Cron) can trigger it.
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await processMatchmakingQueue();
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Matchmaking processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Allow GET for easy testing during development
export async function GET(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
  
  try {
    const result = await processMatchmakingQueue();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
