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
  bio: 'Com 5 anos de experiência no desenvolvimento de sistemas para o mercado financeiro, atuando em domínios críticos (core banking) com API de pagamentos (Pix, boleto, crédito, débito, financiamentos, chargeback), precificação de ativos, risco de mercado e liquidez. Possuo sólidos cases de sucesso em evolução de plataformas, migração de código legado para a nuvem (cloud) e gestão de projetos sob metodologias ágeis (Scrum e Kanban). Apresento um perfil eminentemente hands-on, combinando uma forte visão arquitetônica e prática para projetar e entregar aplicações altamente disponíveis, escaláveis e seguras. Atualmente, estou profundamente imerso nos ecossistemas de IA generativa, com foco em metodologias de engenharia de software assistida por inteligência artificial para otimização de fluxos de desenvolvimento.',
  bioEn: 'With 5 years of experience building systems for the financial market, working in critical domains (core banking) with payment APIs (Pix, boleto, credit, debit, financing, chargeback), asset pricing, market risk and liquidity. I have solid success cases in platform evolution, migrating legacy code to the cloud, and managing projects under agile methodologies (Scrum and Kanban). I bring an eminently hands-on profile, combining a strong architectural vision and hands-on execution to design and deliver highly available, scalable and secure applications. Currently, I am deeply immersed in generative AI ecosystems, focused on AI-assisted software engineering methodologies to optimize development workflows.',
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
    linkedin: 'https://www.linkedin.com/in/jonathan-f-silva-60a918162',
    github: 'https://github.com/jntcloudcod2019',
  },
} as const;

export type Portfolio = typeof portfolio;
