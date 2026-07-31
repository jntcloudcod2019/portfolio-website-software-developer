import { PrismaClient } from '@prisma/client';

const DATABASE_URL = 'mongodb+srv://j1997silva_db_user:C9cqCcYxgL1jx6R2@cluster0.c7myaex.mongodb.net/portfolio_analytics?retryWrites=true&w=majority&appName=Cluster0';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: { db: { url: DATABASE_URL } },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

globalForPrisma.prisma = prisma;
