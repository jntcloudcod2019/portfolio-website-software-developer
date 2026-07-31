import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 86400000 - randomInt(0, 86400) * 1000);
}

async function main() {
  const browsers = ['Chrome', 'Chrome', 'Chrome', 'Firefox', 'Safari', 'Edge', 'Opera', 'Samsung Internet'];
  const oss = ['Windows', 'macOS', 'macOS', 'Linux', 'Android', 'iOS'];
  const devices: ('mobile' | 'tablet' | 'desktop')[] = ['mobile', 'mobile', 'desktop', 'desktop', 'desktop', 'tablet'];
  const deviceModels: { model: string; vendor: string }[] = [
    { model: 'Pixel 9', vendor: 'Google' },
    { model: 'Galaxy S25', vendor: 'Samsung' },
    { model: 'iPhone 16 Pro', vendor: 'Apple' },
    { model: 'MacBook Pro', vendor: 'Apple' },
    { model: 'PC', vendor: 'Microsoft' },
    { model: 'iPad Pro', vendor: 'Apple' },
    { model: 'Galaxy S24', vendor: 'Samsung' },
    { model: 'iPhone 15', vendor: 'Apple' },
    { model: 'PC', vendor: '' },
    { model: 'Linux', vendor: '' },
  ];
  const viewports = ['1920x1080', '1440x900', '1366x768', '390x844', '430x932', '375x812', '768x1024', '1536x864', '2560x1440', '1280x720'];
  const countries = [
    { country: 'Brazil', region: 'SP', city: 'São Paulo', timezone: 'America/Sao_Paulo' },
    { country: 'Brazil', region: 'RJ', city: 'Rio de Janeiro', timezone: 'America/Sao_Paulo' },
    { country: 'Brazil', region: 'MG', city: 'Belo Horizonte', timezone: 'America/Sao_Paulo' },
    { country: 'Brazil', region: 'RS', city: 'Porto Alegre', timezone: 'America/Sao_Paulo' },
    { country: 'United States', region: 'CA', city: 'San Francisco', timezone: 'America/Los_Angeles' },
    { country: 'United States', region: 'NY', city: 'New York', timezone: 'America/New_York' },
    { country: 'Portugal', region: 'Lisbon', city: 'Lisboa', timezone: 'Europe/Lisbon' },
    { country: 'Germany', region: 'BE', city: 'Berlin', timezone: 'Europe/Berlin' },
    { country: 'United Kingdom', region: 'ENG', city: 'London', timezone: 'Europe/London' },
    { country: 'Canada', region: 'ON', city: 'Toronto', timezone: 'America/Toronto' },
  ];
  const languages = ['pt-BR', 'pt-BR', 'pt-BR', 'en-US', 'en-US', 'en', 'es', 'de', 'fr', 'pt-PT'];
  const referrers = [
    null, null, null, null,
    'https://github.com/jonathanf',
    'https://linkedin.com/in/jonathanfsilva',
    'https://google.com',
    'https://google.com/search?q=jonathan+silva+software+engineer',
    null,
    null,
  ];
  const utmSources: (string | null)[] = [null, null, null, null, 'github', 'linkedin', 'google', null];

  const pages = [
    { path: '/', title: 'Jonathan F. Silva | Software Engineer' },
    { path: '/projects', title: 'Projetos' },
    { path: '/project/mypregiato', title: 'MyPregiato' },
    { path: '/project/lambda-pregiato', title: 'Lambda Pregiato' },
  ];

  console.log('🌱 Seeding portfolio_analytics...\n');

  const totalVisitors = 50;

  for (let v = 0; v < totalVisitors; v++) {
    const visitorId = `visitor-${Date.now()}-${v}-${randomInt(1000, 9999)}`;
    const sessionId = `session-${Date.now()}-${v}-${randomInt(1000, 9999)}`;
    const geo = randomItem(countries);
    const browser = randomItem(browsers);
    const os = randomItem(oss);
    const deviceType = randomItem(devices);
    const deviceInfo = randomItem(deviceModels);
    const viewport = randomItem(viewports);
    const language = randomItem(languages);
    const referrer = randomItem(referrers);
    const utmSource = randomItem(utmSources);
    const firstSeen = daysAgo(randomInt(1, 60));
    const sessionStart = new Date(firstSeen.getTime() + randomInt(0, 3600) * 1000);
    const consent = Math.random() > 0.2;

    const numPageviews = randomInt(1, 5);
    const visitorPageviews: typeof pages = [];
    const numPV = Math.min(numPageviews, pages.length);
    const shuffled = [...pages].sort(() => Math.random() - 0.5).slice(0, numPV);

    for (let p = 0; p < shuffled.length; p++) {
      visitorPageviews.push(shuffled[p]);
    }

    const totalPageviews = visitorPageviews.length;
    const totalEvents = totalPageviews + randomInt(0, 3);

    await prisma.visitor.create({
      data: {
        visitorId,
        firstSeen,
        lastSeen: sessionStart,
        totalSessions: 1,
        totalPageviews,
        totalEvents,
        country: geo.country,
        region: geo.region,
        city: geo.city,
        timezone: geo.timezone,
        language,
        deviceType,
        deviceModel: deviceInfo.model,
        deviceVendor: deviceInfo.vendor,
        viewport,
        os,
        browser,
        utmSource,
        consentAnalytics: consent,
        consentTimestamp: consent ? firstSeen : undefined,
      },
    });

    await prisma.session.create({
      data: {
        sessionId,
        visitorId,
        startedAt: sessionStart,
        endedAt: new Date(sessionStart.getTime() + randomInt(30000, 600000)),
        durationMs: randomInt(30000, 600000),
        entryPage: visitorPageviews[0].path,
        exitPage: visitorPageviews[visitorPageviews.length - 1].path,
        referrer,
        deviceModel: deviceInfo.model,
        deviceVendor: deviceInfo.vendor,
        viewport,
        utmSource,
      },
    });

    for (let p = 0; p < visitorPageviews.length; p++) {
      const pv = visitorPageviews[p];
      const ts = new Date(sessionStart.getTime() + p * randomInt(10000, 120000));
      await prisma.pageView.create({
        data: {
          sessionId,
          visitorId,
          path: pv.path,
          title: pv.title,
          timestamp: ts,
          referrer: p === 0 ? referrer : null,
          viewport,
          loadTimeMs: randomInt(400, 3000),
          scrollDepth: Math.random() > 0.3 ? randomInt(25, 100) : undefined,
          timeOnPageMs: p < visitorPageviews.length - 1 ? randomInt(5000, 120000) : undefined,
        },
      });

      await prisma.event.create({
        data: {
          sessionId,
          visitorId,
          type: 'pageview',
          name: 'page_view',
          target: pv.path,
          timestamp: ts,
          page: pv.path,
        },
      });
    }

    const extraEvents = totalEvents - totalPageviews;
    for (let e = 0; e < extraEvents; e++) {
      const eventTypes = ['project_view', 'cv_download', 'contact_click', 'external_link'];
      const eventType = randomItem(eventTypes);
      let eventName = eventType;
      let target = '';
      let value: string | undefined;

      switch (eventType) {
        case 'project_view':
          target = randomItem(['mypregiato', 'lambda-pregiato']);
          value = target === 'mypregiato' ? 'MyPregiato' : 'Lambda Pregiato';
          break;
        case 'cv_download':
          target = 'Jonathan_F_Silva_CV.pdf';
          break;
        case 'contact_click':
          target = randomItem(['email', 'whatsapp', 'linkedin']);
          break;
        case 'external_link':
          target = randomItem([
            'https://github.com/jonathanf',
            'https://linkedin.com/in/jonathanfsilva',
          ]);
          break;
      }

      await prisma.event.create({
        data: {
          sessionId,
          visitorId,
          type: eventType,
          name: eventName,
          target,
          value,
          timestamp: new Date(sessionStart.getTime() + randomInt(60000, 300000)),
          page: randomItem(pages).path,
        },
      });
    }

    if ((v + 1) % 10 === 0) console.log(`   ${v + 1}/${totalVisitors} visitors inserted`);
  }

  const counts = await Promise.all([
    prisma.visitor.count(),
    prisma.session.count(),
    prisma.pageView.count(),
    prisma.event.count(),
  ]);

  console.log(`\n📊 Seeding complete:
   Visitors:  ${counts[0]}
   Sessions:  ${counts[1]}
   PageViews: ${counts[2]}
   Events:    ${counts[3]}`);
}

main()
  .then(() => {
    console.log('\n✅ Seed finished successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
