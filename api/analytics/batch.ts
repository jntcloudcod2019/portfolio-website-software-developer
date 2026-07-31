import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_lib/prisma';
import { lookupGeo } from '../_lib/geoip';
import { parseUA } from '../_lib/ua';

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

    await prisma.visitor.upsert({
      where: { visitorId },
      update: {
        lastSeen: now,
        totalSessions: { increment: 0 },
        totalPageviews: { increment: pageviewCount },
        totalEvents: { increment: events.length },
        country: geo.country || undefined,
        region: geo.region || undefined,
        city: geo.city || undefined,
        timezone: geo.timezone || profile?.timezone || undefined,
        language: profile?.language || undefined,
        deviceType,
        deviceModel: deviceModel || undefined,
        deviceVendor: deviceVendor || undefined,
        os,
        browser,
        viewport: profile?.viewport || undefined,
        consentAnalytics: consent || undefined,
        consentTimestamp: consent ? now : undefined,
      },
      create: {
        visitorId,
        firstSeen: now,
        lastSeen: now,
        totalPageviews: pageviewCount,
        totalEvents: events.length,
        language: profile?.language || 'unknown',
        deviceType,
        deviceModel,
        deviceVendor,
        os,
        browser,
        viewport: profile?.viewport || null,
        country: geo.country,
        region: geo.region,
        city: geo.city,
        timezone: geo.timezone || profile?.timezone,
        utmSource: utm?.source || null,
        utmMedium: utm?.medium || null,
        utmCampaign: utm?.campaign || null,
        consentAnalytics: consent || false,
        consentTimestamp: consent ? now : undefined,
      },
    });

    const firstEvent = events[0];
    await prisma.session.upsert({
      where: { sessionId },
      update: {
        endedAt: now,
        exitPage: events[events.length - 1]?.page || undefined,
        deviceModel: deviceModel || undefined,
        deviceVendor: deviceVendor || undefined,
        viewport: profile?.viewport || undefined,
      },
      create: {
        sessionId,
        visitorId,
        startedAt: new Date(firstEvent?.timestamp || Date.now()),
        entryPage: firstEvent?.page || '/',
        referrer: referrer || undefined,
        deviceModel,
        deviceVendor,
        viewport: profile?.viewport || null,
        utmSource: utm?.source || null,
        utmMedium: utm?.medium || null,
        utmCampaign: utm?.campaign || null,
      },
    });

    const eventData = events.map((event: any) => ({
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
      await prisma.event.createMany({ data: eventData });
    }

    if (pageviewData.length > 0) {
      await prisma.pageView.createMany({ data: pageviewData });
    }

    res.status(200).json({ ok: true, eventsStored: events.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Analytics] batch error:', msg, err);
    res.status(500).json({ error: msg, hint: 'Check DATABASE_URL env and prisma generate' });
  }
}
