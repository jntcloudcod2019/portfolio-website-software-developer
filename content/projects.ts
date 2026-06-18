export type Project = {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  stack: string[];
};

export const projects: Project[] = [
  {
    id: 'api-evora',
    name: 'API Évora',
    shortDescription: 'API REST com arquitetura em camadas e mensageria.',
    description:
      'API desenvolvida para gestão de portfólio e integrações. Utiliza padrões de clean architecture, Entity Framework, filas com RabbitMQ e deploy em cloud. O projeto demonstra boas práticas de versionamento, testes e observabilidade.',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    stack: ['C#', 'Entity Framework', 'RabbitMQ', 'PostgreSQL', 'Docker'],
  },
  {
    id: 'portfolio-app',
    name: 'Portfolio App',
    shortDescription: 'App multiplataforma com Expo (web + mobile).',
    description:
      'Protótipo de portfólio profissional com navegação por seções, carrossel de tecnologias na web e páginas de detalhe de projetos com contador de likes em memória.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    stack: ['React Native', 'Expo', 'TypeScript'],
  },
  {
    id: 'observability-stack',
    name: 'Observability Stack',
    shortDescription: 'Monitoramento com Grafana, Datadog e MinIO.',
    description:
      'Stack de observabilidade para métricas, logs e armazenamento de objetos. Integração com dashboards Grafana, alertas e pipelines de dados em ambientes AWS e Azure.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    stack: ['Grafana', 'Datadog', 'MinIO', 'AWS', 'Docker'],
  },
];

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
