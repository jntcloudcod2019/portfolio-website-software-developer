import { COLORS } from './tokens';
import { ICON, iconSvg } from './svg';

// ── Conteúdo/dados do myPregiato ──────────────────────────────────────────────
// Dados declarativos (separados dos componentes) para hero, diagrama e grid.

export const HERO = {
  eyebrow: '// projeto · plataforma saas full-stack',
  description:
    'Plataforma full-stack de gestão para agência de modelos — backend .NET 8 em Clean Architecture, SPA React + TypeScript, autenticação Clerk, mensageria, real-time e geração de documentos. Monorepo com deploy containerizado na Railway.',
  githubUrl: 'https://github.com/jntcloudcod2019/mypregiato',
  commits: '484',
} as const;

export const SECTIONS = {
  flowLabel: 'Fluxo da Aplicação',
  flowRight: 'clean architecture · 6 camadas',
  archLabel: 'Arquitetura do Monorepo',
  stepsSuffix: '· requisição atravessando as camadas',
} as const;

export type TechTag = { label: string; color: string };
export const TECH_TAGS: TechTag[] = [
  { label: 'C# · .NET 8', color: COLORS.purple },
  { label: 'React 18 · TypeScript', color: COLORS.cyan },
  { label: 'Clerk · JWT', color: COLORS.green },
  { label: 'RabbitMQ · SignalR', color: COLORS.orange },
  { label: 'EF Core · MinIO', color: COLORS.blue },
  { label: 'Docker · Railway', color: COLORS.docker },
];

export type FlowNodeDef = {
  namespace: string;
  name: string;
  sub: string;
  color: string;
  icon: string;
  left: number;
  top: number;
  width: number;
  delay: string;
};

export const NODES: FlowNodeDef[] = [
  { namespace: 'FRONT.REACT', name: 'React SPA', sub: 'Vite · shadcn/ui', color: COLORS.cyan, icon: iconSvg(ICON.monitor, COLORS.cyan), left: 16, top: 28, width: 208, delay: '0s' },
  { namespace: 'AUTH.CLERK', name: 'Clerk Auth', sub: 'Sessões · JWT', color: COLORS.purple, icon: iconSvg(ICON.shieldCheck, COLORS.purple), left: 338, top: 28, width: 192, delay: '0.4s' },
  { namespace: 'PREGIATO.API', name: 'ASP.NET API', sub: 'Swagger · SignalR', color: COLORS.green, icon: iconSvg(ICON.code, COLORS.green), left: 660, top: 28, width: 194, delay: '0.8s' },
  { namespace: 'PREGIATO.APPLICATION', name: 'Application', sub: 'Use cases · DTOs', color: COLORS.amber, icon: iconSvg(ICON.layers, COLORS.amber), left: 660, top: 272, width: 194, delay: '1.2s' },
  { namespace: 'PREGIATO.CORE', name: 'Core · Domínio', sub: 'Entidades · Interfaces', color: COLORS.blue, icon: iconSvg(ICON.box, COLORS.blue), left: 338, top: 272, width: 192, delay: '1.6s' },
  { namespace: 'PREGIATO.INFRASTRUCTURE', name: 'Infrastructure', sub: 'EF Core · MinIO · MQ', color: COLORS.orange, icon: iconSvg(ICON.database, COLORS.orange), left: 16, top: 272, width: 208, delay: '2s' },
];

export type DataLabelDef = { text: string; left: number; top: number; width: number };
export const DATA_LABELS: DataLabelDef[] = [
  { text: 'sessão · token', left: 59, top: 144, width: 130 },
  { text: 'Bearer JWT · REST', left: 373, top: 148, width: 130 },
  { text: 'request DTO', left: 789, top: 181, width: 110 },
  { text: 'use cases · entidades', left: 539, top: 238, width: 130 },
  { text: 'interfaces · repos', left: 204, top: 236, width: 130 },
];

export type StepDef = { n: string; color: string };
export const STEPS: StepDef[] = [
  { n: '01', color: COLORS.cyan },
  { n: '02', color: COLORS.purple },
  { n: '03', color: COLORS.green },
  { n: '04', color: COLORS.amber },
  { n: '05', color: COLORS.blue },
  { n: '06', color: COLORS.orange },
];

export type ArchItemDef = { dot: string; title: string; sub: string };
export type ArchCardDef = {
  title: string;
  sub: string;
  accent: string;
  icon: string;
  items: ArchItemDef[];
};

export const ARCH_CARDS: ArchCardDef[] = [
  {
    title: 'back/',
    sub: 'Clean Architecture · .NET 8',
    accent: COLORS.purple,
    icon: iconSvg(ICON.layers, COLORS.purple, 20),
    items: [
      { dot: COLORS.green, title: 'Pregiato.API', sub: 'ASP.NET Core · Swagger · SignalR' },
      { dot: COLORS.amber, title: 'Pregiato.Application', sub: 'Use cases · FluentValidation · AutoMapper' },
      { dot: COLORS.blue, title: 'Core + Infrastructure', sub: 'EF Core · MinIO/S3 · PuppeteerSharp' },
    ],
  },
  {
    title: 'front/',
    sub: 'SPA · React 18 + TypeScript',
    accent: COLORS.cyan,
    icon: iconSvg(ICON.code, COLORS.cyan, 20),
    items: [
      { dot: COLORS.cyan, title: 'Vite + React Router', sub: 'Tailwind · shadcn/ui · Radix' },
      { dot: COLORS.cyan, title: 'Estado & Dados', sub: 'Zustand · TanStack Query · Zod' },
      { dot: COLORS.cyan, title: 'Real-time & Export', sub: 'Socket.io · Recharts · xlsx' },
    ],
  },
  {
    title: 'Infra & Integrações',
    sub: 'Deploy · mensageria · storage',
    accent: COLORS.orange,
    icon: iconSvg(ICON.cloud, COLORS.orange, 20),
    items: [
      { dot: COLORS.docker, title: 'Docker + Railway', sub: 'docker-compose · railway.json' },
      { dot: COLORS.orange, title: 'RabbitMQ + SignalR', sub: 'Filas assíncronas · tempo real' },
      { dot: COLORS.purple, title: 'Clerk + Serilog', sub: 'Auth gerenciada · logging estruturado' },
    ],
  },
];
