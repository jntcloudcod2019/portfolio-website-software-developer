export type StudyItem = {
  id: string;
  title: string;
  type: 'Curso' | 'Artigo';
  description: string;
  url: string;
};

export const studies: StudyItem[] = [
  {
    id: 'cloud-architecture',
    title: 'Cloud Architecture Fundamentals',
    type: 'Curso',
    description: 'Fundamentos de arquitetura em AWS e Azure.',
    url: 'https://aws.amazon.com/training/',
  },
  {
    id: 'react-native-docs',
    title: 'React Native — Documentação oficial',
    type: 'Artigo',
    description: 'Guias e referência para desenvolvimento mobile.',
    url: 'https://reactnative.dev/docs/getting-started',
  },
  {
    id: 'entity-framework',
    title: 'Entity Framework Core',
    type: 'Artigo',
    description: 'ORM e migrations em .NET.',
    url: 'https://learn.microsoft.com/en-us/ef/core/',
  },
  {
    id: 'rabbitmq-guide',
    title: 'RabbitMQ Tutorials',
    type: 'Curso',
    description: 'Mensageria e padrões de filas.',
    url: 'https://www.rabbitmq.com/tutorials',
  },
];
