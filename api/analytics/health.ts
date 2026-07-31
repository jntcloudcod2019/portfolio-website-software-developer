import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/prisma';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    res.status(200).json({ status: 'ok', mongodb: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', mongodb: 'disconnected', error: String(err) });
  }
}
