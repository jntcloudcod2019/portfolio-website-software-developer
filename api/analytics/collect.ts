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

    for (const event of events) {
      await prisma.event.create({
        data: {
          sessionId,
          visitorId,
          type: event.type,
          name: event.name,
          target: event.target,
          value: event.value,
          metadata: event.metadata ? JSON.stringify(event.metadata) : undefined,
          timestamp: new Date(event.timestamp || Date.now()),
          page: event.page,
        },
      });

      if (event.type === 'pageview') {
        await prisma.pageView.create({
          data: {
            sessionId,
            visitorId,
            path: event.target || event.page,
            title: event.value || '',
            timestamp: new Date(event.timestamp || Date.now()),
            referrer: referrer || undefined,
            viewport: profile?.viewport || null,
          },
        });
      }
    }

    res.status(200).json({ ok: true, eventsStored: events.length });
  } catch (err) {
    console.error('[Analytics] collect error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
