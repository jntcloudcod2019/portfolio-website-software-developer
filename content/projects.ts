export type Project = {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  stack: string[];
  componentId?: string;
};

export const projects: Project[] = [
  {
    id: 'conversor-moedas',
    name: 'Conversor de Moedas',
    shortDescription: 'Conversor em tempo real com a Free Currency API.',
    description:
      'Conversor de moedas que consome a Free Currency API para obter taxas de câmbio atualizadas em tempo real.',
    imageUrl: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=600&h=400&fit=crop',
    videoUrl: '',
    stack: ['React Native', 'TypeScript', 'Expo', 'Free Currency API'],
    componentId: 'conversor-moedas',
  },
  {
    id: 'lambda-pregiato',
    name: 'Lambda.Pregiato',
    shortDescription: 'Integrador assíncrono de contratos digitais em C#/.NET 8 com RabbitMQ e Authentique.',
    description:
      'Integrador assíncrono de contratos digitais — consome filas RabbitMQ, busca contratos em PostgreSQL, converte PDFs e aciona a API Authentique para assinatura eletrônica via WhatsApp.',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
    videoUrl: '',
    stack: ['C#', '.NET 8', 'RabbitMQ', 'PostgreSQL', 'EF Core', 'Docker'],
  },
];

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
