export type Project = {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  stack: string[];
  componentId?: string;
  /** Quando true, o componente interativo renderiza a página inteira (hero próprio),
   *  então o [id].tsx não desenha título/descrição/stack padrão. */
  fullBleed?: boolean;
  /** Chaves i18n para tradução dinâmica; `name`/`shortDescription`/`description` servem de fallback PT.
   *  `nameKey` só existe onde o nome é traduzível — nomes próprios (Lambda.Pregiato,
   *  MyPregiato) não têm chave e permanecem iguais nos dois idiomas. */
  nameKey?: string;
  shortKey?: string;
  descKey?: string;
  /** Cor de destaque do cartão (hex). */
  accent?: string;
  /** Número de exibição do cartão (ex: "01"). */
  num?: string;
  /** URL do repositório no GitHub (botão do cartão). */
  github?: string;
  /** Aparece na vitrine de 3 da home. Os não-destacados só existem em /projects. */
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: 'hyperledger-transactions',
    name: 'HyperLedger.Transactions',
    shortDescription:
      'Motor de processamento de transações financeiras em .NET 10 — hexagonal, Outbox sobre MongoDB, Kafka e Stripe.',
    description:
      'Núcleo transacional financeiro: recebe a ordem de pagamento, cobra pelo Stripe, atualiza o saldo e grava o lançamento no livro-razão imutável. Arquitetura hexagonal em .NET 10, idempotência durável, Outbox Pattern sobre transação multi-documento do MongoDB e consumers paralelos por partição no Kafka.',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop&fm=webp&q=80',
    videoUrl: '',
    stack: ['C# 14', '.NET 10', 'MongoDB 8', 'Kafka 3.9', 'Redis 7.4', 'Stripe', 'Docker'],
    shortKey: 'proj_hyperledger_short',
    descKey: 'proj_hyperledger_desc',
    accent: '#38bdf8',
    num: '01',
    github: 'https://github.com/MySystemProjetcs/HyperLedger-II',
    featured: true,
  },
  {
    id: 'zap-blaster',
    name: 'Zap Blaster',
    shortDescription:
      'Bot de WhatsApp que consome uma fila RabbitMQ e dispara mensagens via whatsapp-web.js.',
    description:
      'Bot de WhatsApp que consome mensagens de uma fila RabbitMQ e as envia automaticamente via whatsapp-web.js — WhatsApp Web automatizado com Puppeteer/Chromium headless, sessão persistida, templates dinâmicos e retry inteligente.',
    imageUrl: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=600&h=400&fit=crop&fm=webp&q=80',
    videoUrl: '',
    stack: ['Node.js 18+', 'whatsapp-web.js', 'RabbitMQ', 'amqplib', 'Puppeteer', 'Docker'],
    shortKey: 'proj_zapblaster_short',
    descKey: 'proj_zapblaster_desc',
    accent: '#25d366',
    num: '02',
    github: 'https://github.com/jntcloudcod2019/zap-blaster-projeto',
  },
  {
    id: 'conversor-moedas',
    name: 'Conversor de Moedas',
    shortDescription: 'Conversor em tempo real com a Free Currency API.',
    description:
      'Conversor de moedas que consome a Free Currency API para obter taxas de câmbio atualizadas em tempo real.',
    imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=600&h=400&fit=crop&fm=webp&q=80',
    videoUrl: '',
    stack: ['React Native', 'TypeScript', 'Expo', 'Free Currency API'],
    componentId: 'conversor-moedas',
    fullBleed: true,
    nameKey: 'proj_conversor_name',
    shortKey: 'proj_conversor_short',
    descKey: 'proj_conversor_desc',
    accent: '#34d399',
    num: '03',
  },
  {
    id: 'lambda-pregiato',
    name: 'Lambda.Pregiato',
    shortDescription: 'Integrador assíncrono de contratos digitais em C#/.NET 8 com RabbitMQ e Authentique.',
    description:
      'Integrador assíncrono de contratos digitais — consome filas RabbitMQ, busca contratos em PostgreSQL, converte PDFs e aciona a API Authentique para assinatura eletrônica via WhatsApp.',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop&fm=webp&q=80',
    videoUrl: '',
    stack: ['C#', '.NET 8', 'RabbitMQ', 'PostgreSQL', 'EF Core', 'Docker'],
    shortKey: 'proj_lambda_short',
    descKey: 'proj_lambda_desc',
    accent: '#38bdf8',
    num: '04',
    featured: true,
  },
  {
    id: 'mypregiato',
    name: 'MyPregiato',
    shortDescription: 'Plataforma SaaS full-stack de gestão para agência de modelos — .NET 8 + React.',
    description:
      'Plataforma full-stack de gestão para agência de modelos — backend .NET 8 em Clean Architecture, SPA React + TypeScript, autenticação Clerk, mensageria, real-time e geração de documentos. Monorepo com deploy containerizado na Railway.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop&fm=webp&q=80',
    videoUrl: '',
    stack: ['C#', '.NET 8', 'React 18', 'TypeScript', 'RabbitMQ', 'Docker'],
    shortKey: 'proj_mypregiato_short',
    descKey: 'proj_mypregiato_desc',
    accent: '#38bdf8',
    num: '05',
    github: 'https://github.com/jntcloudcod2019/mypregiato',
    featured: true,
  },
];

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
