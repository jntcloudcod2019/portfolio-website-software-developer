import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_lib/prisma';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    await prisma.$runCommandRaw({ ping: 1 });
    res.status(200).json({ status: 'ok', mongodb: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', mongodb: 'disconnected', error: String(err) });
  }
}
