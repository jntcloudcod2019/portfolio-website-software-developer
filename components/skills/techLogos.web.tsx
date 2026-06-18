import React from 'react';
import { FaAws, FaMicrosoft } from 'react-icons/fa6';
import {
  SiCss,
  SiDatadog,
  SiDocker,
  SiDotnet,
  SiGrafana,
  SiHtml5,
  SiJavascript,
  SiMinio,
  SiMysql,
  SiNextdotjs,
  SiPostgresql,
  SiRabbitmq,
  SiRailway,
  SiReact,
  SiSharp,
} from 'react-icons/si';

import { skills, type SkillItem } from '@/content/skills';
import type { LogoItem } from './LogoLoop.web';

const iconMap: Record<SkillItem['iconKey'], React.ReactNode> = {
  csharp: <SiSharp />,
  react: <SiReact />,
  reactnative: <SiReact />,
  nextjs: <SiNextdotjs />,
  javascript: <SiJavascript />,
  css: <SiCss />,
  html: <SiHtml5 />,
  dotnet: <SiDotnet />,
  rabbitmq: <SiRabbitmq />,
  aws: <FaAws />,
  azure: <FaMicrosoft />,
  railway: <SiRailway />,
  docker: <SiDocker />,
  postgresql: <SiPostgresql />,
  mysql: <SiMysql />,
  sqlserver: <SiDotnet />,
  grafana: <SiGrafana />,
  datadog: <SiDatadog />,
  minio: <SiMinio />,
};

export function buildTechLogos(): LogoItem[] {
  return skills.map((skill) => ({
    node: iconMap[skill.iconKey],
    title: skill.title,
    href: skill.href,
    ariaLabel: skill.title,
  }));
}
