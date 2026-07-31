import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/prisma';
import { lookupGeo } from '../_lib/geoip';
import { parseUA } from '../_lib/ua';

const STORED_EVENT_TYPES = new Set([
  'cv_download', 'project_view', 'contact_click', 'external_link',
  'scroll_depth', 'time_on_page', 'theme_toggle', 'custom',
]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId, visitorId, events, profile, ip: clientIP, utm, referrer, consent } = req.body;

    if (!sessionId || !visitorId || !events?.length) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const ua = profile?.userAgent || '';
    const { deviceType, deviceModel, deviceVendor, os, browser } = parseUA(ua);

    const headerIP = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || '';
    const effectiveIP = clientIP || headerIP;
    const geo = await lookupGeo(effectiveIP);

    const now = new Date();
    const pageviewCount = events.filter((e: any) => e.type === 'pageview').length;
    const storedEvents = events.filter((e: any) => STORED_EVENT_TYPES.has(e.type));

    const db = await getDb();

    const visitorUpdate: Record<string, any> = { lastSeen: now };
    if (geo.country) visitorUpdate.country = geo.country;
    if (geo.region) visitorUpdate.region = geo.region;
    if (geo.city) visitorUpdate.city = geo.city;
    const timezoneVal = geo.timezone || profile?.timezone;
    if (timezoneVal) visitorUpdate.timezone = timezoneVal;
    if (profile?.language) visitorUpdate.language = profile.language;
    visitorUpdate.deviceType = deviceType;
    if (deviceModel) visitorUpdate.deviceModel = deviceModel;
    if (deviceVendor) visitorUpdate.deviceVendor = deviceVendor;
    if (os) visitorUpdate.os = os;
    if (browser) visitorUpdate.browser = browser;
    if (profile?.viewport) visitorUpdate.viewport = profile.viewport;
    if (consent) {
      visitorUpdate.consentAnalytics = true;
      visitorUpdate.consentTimestamp = now;
    }

    await db.collection('Visitor').updateOne(
      { visitorId },
      {
        $set: visitorUpdate,
        $inc: { totalPageviews: pageviewCount, totalEvents: storedEvents.length },
        $setOnInsert: {
          visitorId,
          firstSeen: now,
          utmSource: utm?.source || null,
          utmMedium: utm?.medium || null,
          utmCampaign: utm?.campaign || null,
        },
      },
      { upsert: true },
    );

    const firstEvent = events[0];
    const sessionUpdate: Record<string, any> = { endedAt: now };
    sessionUpdate.exitPage = events[events.length - 1]?.page || null;
    if (deviceModel) sessionUpdate.deviceModel = deviceModel;
    if (deviceVendor) sessionUpdate.deviceVendor = deviceVendor;
    if (profile?.viewport) sessionUpdate.viewport = profile.viewport;

    await db.collection('Session').updateOne(
      { sessionId },
      {
        $set: sessionUpdate,
        $setOnInsert: {
          sessionId,
          visitorId,
          startedAt: new Date(firstEvent?.timestamp || Date.now()),
          entryPage: firstEvent?.page || '/',
          referrer: referrer || null,
          utmSource: utm?.source || null,
          utmMedium: utm?.medium || null,
          utmCampaign: utm?.campaign || null,
        },
      },
      { upsert: true },
    );

    const eventData = storedEvents.map((event: any) => ({
      sessionId,
      visitorId,
      type: event.type,
      name: event.name,
      target: event.target || null,
      value: event.value || null,
      metadata: event.metadata ? JSON.stringify(event.metadata) : null,
      timestamp: new Date(event.timestamp || Date.now()),
      page: event.page,
    }));

    const pageviewData = events
      .filter((e: any) => e.type === 'pageview')
      .map((e: any) => ({
        sessionId,
        visitorId,
        path: e.target || e.page,
        title: e.value || '',
        timestamp: new Date(e.timestamp || Date.now()),
        referrer: referrer || null,
        viewport: profile?.viewport || null,
      }));

    if (eventData.length > 0) {
      await db.collection('Event').insertMany(eventData);
    }

    if (pageviewData.length > 0) {
      await db.collection('PageView').insertMany(pageviewData);
    }

    res.status(200).json({
      ok: true,
      pageviewsStored: pageviewData.length,
      eventsStored: eventData.length,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Analytics] batch error:', msg, err);
    res.status(500).json({ error: msg, hint: 'Check DATABASE_URL env' });
  }
}
