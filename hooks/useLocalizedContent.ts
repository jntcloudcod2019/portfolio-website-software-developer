import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import { getProjectById, projects, type Project } from '@/content/projects';
import { studies, type StudyItem } from '@/content/studies';

// Conteúdo dos projetos/estudos é armazenado em português nos arquivos de `content/`
// (que servem de fallback) e traduzido dinamicamente via chaves i18n (`*Key`).
// Estes hooks centralizam a resolução para que os componentes só troquem a fonte
// de dados e recebam os textos já no idioma ativo.

export type LocalizedProject = Project;
export type LocalizedStudy = StudyItem & { typeLabel: string };

function localizeProject(p: Project, t: TFunction): LocalizedProject {
  return {
    ...p,
    shortDescription: p.shortKey
      ? t(p.shortKey, { defaultValue: p.shortDescription })
      : p.shortDescription,
    description: p.descKey ? t(p.descKey, { defaultValue: p.description }) : p.description,
  };
}

export function useLocalizedProjects(): LocalizedProject[] {
  const { t } = useTranslation();
  return projects.map((p) => localizeProject(p, t));
}

export function useLocalizedProject(id: string): LocalizedProject | undefined {
  const { t } = useTranslation();
  const project = getProjectById(id);
  return project ? localizeProject(project, t) : undefined;
}

export function useLocalizedStudies(): LocalizedStudy[] {
  const { t } = useTranslation();
  return studies.map((s) => ({
    ...s,
    title: s.titleKey ? t(s.titleKey, { defaultValue: s.title }) : s.title,
    description: s.descKey ? t(s.descKey, { defaultValue: s.description }) : s.description,
    typeLabel: t(s.type === 'Curso' ? 'study_type_course' : 'study_type_article', {
      defaultValue: s.type,
    }),
  }));
}
