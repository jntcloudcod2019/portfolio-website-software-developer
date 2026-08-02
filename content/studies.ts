export type StudyItem = {
  id: string;
  title: string;
  type: 'Curso' | 'Artigo';
  description: string;
  /** Link externo. Ignorado quando `route` está presente. */
  url: string;
  /** Rota interna do app; quando presente, o card navega em vez de abrir link externo. */
  route?: string;
  /** Chaves i18n para tradução dinâmica; `title`/`description` servem de fallback PT. */
  titleKey?: string;
  descKey?: string;
};

export const studies: StudyItem[] = [
  {
    id: 'inteligencia-agentica',
    title: 'Inteligência Autônoma em Ecossistemas de Multiagentes e Kubernetes',
    type: 'Artigo',
    description:
      'AIOps, sistemas multi-agentes, Kubernetes autônomo e GraphRAG aplicados à operação de infraestrutura.',
    url: '',
    route: '/estudo/inteligencia-agentica',
    titleKey: 'study_agentica_title',
    descKey: 'study_agentica_desc',
  },
];
