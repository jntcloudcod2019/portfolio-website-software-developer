interface GeoResult {
  country: string | null;
  region: string | null;
  city: string | null;
  timezone: string | null;
}

const cache = new Map<string, GeoResult>();

export async function lookupGeo(ip: string): Promise<GeoResult> {
  const fallback: GeoResult = { country: null, region: null, city: null, timezone: null };

  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip === 'localhost' || ip === '0.0.0.0') {
    return fallback;
  }

  if (ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('172.16.')) {
    return fallback;
  }

  const cached = cache.get(ip);
  if (cached) return cached;

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,timezone,query`, {
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      console.warn(`[GeoIP] HTTP ${res.status} for IP ${ip}`);
      return fallback;
    }

    const data = await res.json();

    if (data.status !== 'success') {
      console.warn(`[GeoIP] API returned failure for IP ${ip}:`, data);
      return fallback;
    }

    const result: GeoResult = {
      country: data.country || null,
      region: data.regionName || null,
      city: data.city || null,
      timezone: data.timezone || null,
    };

    cache.set(ip, result);
    if (cache.size > 500) cache.clear();

    return result;
  } catch (err) {
    console.warn(`[GeoIP] Request failed for IP ${ip}:`, err);
    return fallback;
  }
}
