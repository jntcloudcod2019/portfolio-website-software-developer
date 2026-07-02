export type StudyItem = {
  id: string;
  title: string;
  type: 'Curso' | 'Artigo';
  description: string;
  url: string;
  /** Chaves i18n para tradução dinâmica; `title`/`description` servem de fallback PT. */
  titleKey?: string;
  descKey?: string;
};

export const studies: StudyItem[] = [
  {
    id: 'cloud-architecture',
    title: 'Cloud Architecture Fundamentals',
    type: 'Curso',
    description: 'Fundamentos de arquitetura em AWS e Azure.',
    url: 'https://aws.amazon.com/training/',
    titleKey: 'study_cloud_title',
    descKey: 'study_cloud_desc',
  },
  {
    id: 'react-native-docs',
    title: 'React Native — Documentação oficial',
    type: 'Artigo',
    description: 'Guias e referência para desenvolvimento mobile.',
    url: 'https://reactnative.dev/docs/getting-started',
    titleKey: 'study_rn_title',
    descKey: 'study_rn_desc',
  },
  {
    id: 'entity-framework',
    title: 'Entity Framework Core',
    type: 'Artigo',
    description: 'ORM e migrations em .NET.',
    url: 'https://learn.microsoft.com/en-us/ef/core/',
    titleKey: 'study_ef_title',
    descKey: 'study_ef_desc',
  },
  {
    id: 'rabbitmq-guide',
    title: 'RabbitMQ Tutorials',
    type: 'Curso',
    description: 'Mensageria e padrões de filas.',
    url: 'https://www.rabbitmq.com/tutorials',
    titleKey: 'study_rabbit_title',
    descKey: 'study_rabbit_desc',
  },
];
