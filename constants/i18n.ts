export const i18n = {
  pt: {
    // ── Navegação
    nav_home:        'Início',
    nav_experience:  'Experiência',
    nav_projects:    'Projetos',
    nav_studies:     'Estudos',
    nav_skills:      'Habilidades',
    nav_contact:     'Contato',

    // ── Sobre mim (SobreMim)
    about_role:    'Engenheiro de Software Full Stack',
    about_focus:   'sistemas financeiros · escaláveis · alta disponibilidade',
    about_domains: 'Risco, Pricing, Pagamentos, Chargeback',
    about_stack:   'C# · .NET · Node.js · AWS · Azure · PostgreSQL',
    about_local:   'São Paulo · Remoto',
    about_bio:
      'Engenheiro de Software com mais de 6 anos de experiência no mercado financeiro e bancário, especializado em construir sistemas robustos e escaláveis. Atuei em domínios críticos como Risco de Crédito Regulatório, Risco de Mercado, Pricing, Liquidez, APIs de Pagamentos e Chargeback — entregando soluções que movimentam operações financeiras reais. Contribuí para a evolução de plataformas Legacy para Cloud.\n\nPerfil hands-on com visão de arquitetura, contribuindo para o desenvolvimento de aplicações de alta disponibilidade e seguras.',

    // ── Cabeçalhos de seção
    section_experience: 'EXPERIÊNCIA PROFISSIONAL',
    section_projects:   'PROJETOS',
    section_studies:    'ESTUDOS & ARTIGOS',
    section_skills:     'Habilidades',
    section_skills_sub: 'Tecnologias que utilizo no dia a dia.',

    // ── Placeholder (Em desenvolvimento)
    placeholder_title:    'Em Desenvolvimento',
    placeholder_subtitle: 'Breve estarão disponíveis!',

    // ── Formação (status)
    status_done:        'CONCLUÍDO',
    status_in_progress: 'EM ANDAMENTO',
    status_certified:   'CERTIFICADO',

    // ── Contato
    contact_label:    'CONTATO',
    contact_title:    'Vamos construir algo juntos?',
    contact_subtitle: 'Tem um projeto em mente ou uma vaga que combina comigo? Me chama — respondo rápido.',
    contact_email:    'Enviar e-mail',
    contact_copy:     'copiar e-mail',
    contact_copied:   '✓ Copiado!',
    contact_or:       'ou me encontre em',
  },

  en: {
    // ── Navigation
    nav_home:        'Home',
    nav_experience:  'Experience',
    nav_projects:    'Projects',
    nav_studies:     'Studies',
    nav_skills:      'Skills',
    nav_contact:     'Contact',

    // ── About me (SobreMim)
    about_role:    'Full Stack Software Engineer',
    about_focus:   'financial systems · scalable · high availability',
    about_domains: 'Risk, Pricing, Payments, Chargeback',
    about_stack:   'C# · .NET · Node.js · AWS · Azure · PostgreSQL',
    about_local:   'São Paulo · Remote',
    about_bio:
      'Software Engineer with over 6 years of experience in the financial and banking market, specialized in building robust and scalable systems. I have worked in critical domains such as Regulatory Credit Risk, Market Risk, Pricing, Liquidity, Payment APIs and Chargeback — delivering solutions that drive real financial operations. I contributed to the evolution of Legacy platforms to Cloud.\n\nHands-on profile with an architectural vision, contributing to the development of highly available and secure applications.',

    // ── Section headers
    section_experience: 'PROFESSIONAL EXPERIENCE',
    section_projects:   'PROJECTS',
    section_studies:    'STUDIES & ARTICLES',
    section_skills:     'Skills',
    section_skills_sub: 'Technologies I use every day.',

    // ── Placeholder
    placeholder_title:    'Under Development',
    placeholder_subtitle: 'Coming soon!',

    // ── Education (status)
    status_done:        'COMPLETED',
    status_in_progress: 'IN PROGRESS',
    status_certified:   'CERTIFIED',

    // ── Contact
    contact_label:    'CONTACT',
    contact_title:    "Let's build something together?",
    contact_subtitle: "Got a project in mind or a role that fits my profile? Reach out — I respond fast.",
    contact_email:    'Send email',
    contact_copy:     'copy email',
    contact_copied:   '✓ Copied!',
    contact_or:       'or find me at',
  },
} as const;

export type Lang         = keyof typeof i18n;
export type Translations = typeof i18n['pt'];
