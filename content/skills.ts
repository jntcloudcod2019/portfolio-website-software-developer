export type SkillItem = {
  id: string;
  title: string;
  href: string;
  iconKey: SkillIconKey;
};

export type SkillIconKey =
  | 'csharp'
  | 'react'
  | 'reactnative'
  | 'nextjs'
  | 'javascript'
  | 'css'
  | 'html'
  | 'dotnet'
  | 'rabbitmq'
  | 'aws'
  | 'azure'
  | 'railway'
  | 'docker'
  | 'postgresql'
  | 'mysql'
  | 'sqlserver'
  | 'grafana'
  | 'datadog'
  | 'minio';

export const skills: SkillItem[] = [
  { id: 'csharp', title: 'C#', href: 'https://learn.microsoft.com/dotnet/csharp/', iconKey: 'csharp' },
  { id: 'react-native', title: 'React Native', href: 'https://reactnative.dev/', iconKey: 'reactnative' },
  { id: 'nextjs', title: 'Next.js', href: 'https://nextjs.org/', iconKey: 'nextjs' },
  { id: 'javascript', title: 'JavaScript', href: 'https://developer.mozilla.org/docs/Web/JavaScript', iconKey: 'javascript' },
  { id: 'css', title: 'CSS', href: 'https://developer.mozilla.org/docs/Web/CSS', iconKey: 'css' },
  { id: 'html', title: 'HTML', href: 'https://developer.mozilla.org/docs/Web/HTML', iconKey: 'html' },
  { id: 'ef', title: 'Entity Framework', href: 'https://learn.microsoft.com/ef/core/', iconKey: 'dotnet' },
  { id: 'rabbitmq', title: 'RabbitMQ', href: 'https://www.rabbitmq.com/', iconKey: 'rabbitmq' },
  { id: 'aws', title: 'AWS', href: 'https://aws.amazon.com/', iconKey: 'aws' },
  { id: 'azure', title: 'Azure', href: 'https://azure.microsoft.com/', iconKey: 'azure' },
  { id: 'railway', title: 'Railway', href: 'https://railway.app/', iconKey: 'railway' },
  { id: 'docker', title: 'Docker', href: 'https://www.docker.com/', iconKey: 'docker' },
  { id: 'postgresql', title: 'PostgreSQL', href: 'https://www.postgresql.org/', iconKey: 'postgresql' },
  { id: 'mysql', title: 'MySQL', href: 'https://www.mysql.com/', iconKey: 'mysql' },
  { id: 'sqlserver', title: 'SQL Server', href: 'https://www.microsoft.com/sql-server', iconKey: 'sqlserver' },
  { id: 'grafana', title: 'Grafana', href: 'https://grafana.com/', iconKey: 'grafana' },
  { id: 'datadog', title: 'Datadog', href: 'https://www.datadoghq.com/', iconKey: 'datadog' },
  { id: 'minio', title: 'MinIO', href: 'https://min.io/', iconKey: 'minio' },
];
