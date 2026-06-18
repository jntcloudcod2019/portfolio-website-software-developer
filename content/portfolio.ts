export const portfolio = {
  name: 'Jonathan F. Silva',
  nameParts: [
    { text: 'J', bold: true },
    { text: 'onathan ', bold: false },
    { text: 'F', bold: true },
    { text: '. ', bold: false },
    { text: 'S', bold: true },
    { text: 'ilva', bold: false },
  ],
  role: 'Engenheiro de Software Full Stack',
  quote: 'Eu não falhei. Apenas descobri 10 mil maneiras que não funcionam.',
  quoteAuthor: 'Thomas Edison' ,
  bio: 'Engenheiro de Software com mais de 5 anos de experiência no mercado financeiro e bancário, especializado em construir sistemas robustos, escaláveis e de alta disponibilidade. Já atuei em domínios críticos como Risco de Crédito Regulatório, Risco de Mercado, Pricing, Liquidez, APIs de Pagamentos e Chargeback — entregando soluções que movimentam operações financeiras reais.',
  bio2: 'Perfil hands-on com visão de arquitetura: entro no código e também enxergo o sistema como um todo. Tenho experiência desde a modelagem de APIs até a observabilidade em produção, passando por integrações com mensageria, cloud e automações com IA.',
  education: [
    {
      degree: 'Bacharel em Ciências da Computação',
      institution: 'UNIP',
      status: 'Concluído' as const,
      icon: 'school' as const,
    },
    {
      degree: 'Pós-graduação em Arquitetura de Sistemas .NET & Azure',
      institution: 'FIAP',
      status: 'Em andamento' as const,
      icon: 'school-outline' as const,
    },
    {
      degree: 'AWS Certified Cloud Practitioner',
      institution: 'Amazon Web Services',
      status: 'Certificado' as const,
      icon: 'certificate' as const,
      credlyUrl: 'https://www.credly.com/badges/19c1fad5-2e52-4657-a7c0-02818f4d1458/linked_in_profile',
      badgeImageUrl: 'https://www.credly.com/badges/19c1fad5-2e52-4657-a7c0-02818f4d1458/image',
    },
  ],
  contact: {
    email: 'jonathanfrnnd3@gmail.com',
    phone: '+55 11 949908369',
    linkedin: 'https://www.linkedin.com/in/seu-perfil',
    github: 'https://github.com/jntcloudcod2019',
  },
} as const;

export type Portfolio = typeof portfolio;
