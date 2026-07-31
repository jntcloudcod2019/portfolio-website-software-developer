import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔌 Testing MongoDB connection...\n');

  // 1. Ping
  const ping = await prisma.$runCommandRaw({ ping: 1 });
  console.log('✅ Connection OK:', JSON.stringify(ping));

  // 2. Insert test data
  const now = new Date();
  const visitorId = `test-visitor-${Date.now()}`;
  const sessionId = `test-session-${Date.now()}`;

  console.log(`\n📝 Inserting test data...`);
  console.log(`   visitorId: ${visitorId}`);
  console.log(`   sessionId: ${sessionId}`);

  const visitor = await prisma.visitor.create({
    data: {
      visitorId,
      firstSeen: now,
      lastSeen: now,
      totalPageviews: 2,
      totalEvents: 3,
      language: 'pt-BR',
      deviceType: 'desktop',
      os: 'macOS',
      browser: 'Chrome',
      country: 'Brazil',
      region: 'SP',
      city: 'São Paulo',
      timezone: 'America/Sao_Paulo',
      utmSource: 'github',
      utmMedium: 'social',
      utmCampaign: 'portfolio-launch',
      consentAnalytics: true,
      consentTimestamp: now,
    },
  });
  console.log('✅ Visitor created:', visitor.visitorId);

  const session = await prisma.session.create({
    data: {
      sessionId,
      visitorId,
      startedAt: now,
      entryPage: '/',
      referrer: 'https://github.com/jonathanf',
      utmSource: 'github',
      utmMedium: 'social',
      utmCampaign: 'portfolio-launch',
    },
  });
  console.log('✅ Session created:', session.sessionId);

  const pageview1 = await prisma.pageView.create({
    data: {
      sessionId,
      visitorId,
      path: '/',
      title: 'Jonathan F. Silva | Software Engineer',
      timestamp: now,
      referrer: 'https://github.com/jonathanf',
      loadTimeMs: 1234,
    },
  });
  console.log('✅ PageView 1 created:', pageview1.path);

  const pageview2 = await prisma.pageView.create({
    data: {
      sessionId,
      visitorId,
      path: '/projects',
      title: 'Projetos',
      timestamp: new Date(now.getTime() + 30000),
      loadTimeMs: 980,
      scrollDepth: 75,
      timeOnPageMs: 28000,
    },
  });
  console.log('✅ PageView 2 created:', pageview2.path);

  const event1 = await prisma.event.create({
    data: {
      sessionId,
      visitorId,
      type: 'pageview',
      name: 'page_view',
      target: '/',
      timestamp: now,
      page: '/',
    },
  });
  console.log('✅ Event 1 (pageview) created');

  const event2 = await prisma.event.create({
    data: {
      sessionId,
      visitorId,
      type: 'project_view',
      name: 'project_view',
      target: 'mypregiato',
      value: 'MyPregiato',
      timestamp: new Date(now.getTime() + 15000),
      page: '/projects',
    },
  });
  console.log('✅ Event 2 (project_view) created');

  const event3 = await prisma.event.create({
    data: {
      sessionId,
      visitorId,
      type: 'cv_download',
      name: 'cv_download',
      target: 'Jonathan_F_Silva_CV.pdf',
      timestamp: new Date(now.getTime() + 45000),
      page: '/',
    },
  });
  console.log('✅ Event 3 (cv_download) created');

  // 3. Verify count
  console.log('\n📊 Verifying counts...');

  const visitorCount = await prisma.visitor.count();
  const sessionCount = await prisma.session.count();
  const pageviewCount = await prisma.pageView.count();
  const eventCount = await prisma.event.count();

  console.log(`   Visitors:  ${visitorCount}`);
  console.log(`   Sessions:  ${sessionCount}`);
  console.log(`   PageViews: ${pageviewCount}`);
  console.log(`   Events:    ${eventCount}`);

  // 4. Read back and display
  console.log('\n🔍 Reading back test data...');

  const readVisitor = await prisma.visitor.findUnique({
    where: { visitorId },
    include: { sessions: true, pageviews: true, events: true },
  });

  if (readVisitor) {
    console.log(`\n   Visitor: ${readVisitor.visitorId}`);
    console.log(`   Country: ${readVisitor.country}, OS: ${readVisitor.os}, Browser: ${readVisitor.browser}`);
    console.log(`   Sessions: ${readVisitor.sessions.length}`);
    console.log(`   PageViews: ${readVisitor.pageviews.length}`);
    console.log(`   Events: ${readVisitor.events.length}`);
    console.log(`   UTM: ${readVisitor.utmSource} / ${readVisitor.utmMedium} / ${readVisitor.utmCampaign}`);
  }

  // 5. Cleanup test data
  console.log('\n🧹 Cleaning up test data...');

  await prisma.event.deleteMany({ where: { visitorId } });
  await prisma.pageView.deleteMany({ where: { visitorId } });
  await prisma.session.deleteMany({ where: { visitorId } });
  await prisma.visitor.delete({ where: { visitorId } });

  console.log('✅ Test data cleaned up successfully');

  const finalCount = await prisma.visitor.count({ where: { visitorId } });
  console.log(`   Visitor count after cleanup: ${finalCount} (expected: 0)`);
}

main()
  .then(() => {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ Test failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
