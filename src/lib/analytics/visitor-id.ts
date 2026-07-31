import { sha256 } from './crypto';

const VISITOR_KEY = 'portfolio_visitor_id';
const SESSION_KEY = 'portfolio_session_id';

function uuidv4(): string {
  const crypto = globalThis.crypto;
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

export function getOrCreateSessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = uuidv4();
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return uuidv4();
  }
}

export function getOrCreateVisitorId(): string {
  try {
    const existing = localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
    const id = uuidv4();
    localStorage.setItem(VISITOR_KEY, id);
    return id;
  } catch {
    return uuidv4();
  }
}

export async function getPublicIP(): Promise<string | null> {
  try {
    const res = await fetch('https://api.ipify.org?format=json', {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.ip || null;
  } catch {
    return null;
  }
}

export async function getIPHash(): Promise<string | null> {
  const ip = await getPublicIP();
  if (!ip) return null;
  return sha256(ip);
}

export function resetSessionId(): void {
  try { sessionStorage.removeItem(SESSION_KEY); } catch {}
}

export function resetVisitorId(): void {
  try { localStorage.removeItem(VISITOR_KEY); } catch {}
}
