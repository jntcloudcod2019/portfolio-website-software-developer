export const i18n = {
  pt: {
    sobre:      'Sobre Mim',
    experiencia:'Experiência',
    projetos:   'Projetos',
    estudos:    'Estudos e Artigos',
    habilidades:'Habilidades',
    contato:    'Contato',
    disponivel: 'Disponível para projetos',
    verTodos:   'Ver Todos',
    maisProj:   'Mais Projetos',
    enviar:     'Enviar mensagem',
  },
  en: {
    sobre:      'About Me',
    experiencia:'Experience',
    projetos:   'Projects',
    estudos:    'Studies & Articles',
    habilidades:'Skills',
    contato:    'Contact',
    disponivel: 'Available for projects',
    verTodos:   'See All',
    maisProj:   'More Projects',
    enviar:     'Send message',
  },
} as const;

export type I18nKey      = keyof typeof i18n['pt'];
export type Translations = typeof i18n['pt'];
