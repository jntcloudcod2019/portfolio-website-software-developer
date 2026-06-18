# Portfolio — Engenheiro de Software

Protótipo de portfólio profissional com **Expo** (React Native + Web), navegação por seções em tela cheia, carrossel de tecnologias na web (LogoLoop / React Bits) e páginas de detalhe de projetos com contador de likes em memória.

## Requisitos

- Node.js 18+
- npm

## Como rodar

```bash
npm install
npm start
```

Depois pressione:

- `w` — Web
- `i` — iOS Simulator
- `a` — Android Emulator

Ou diretamente:

```bash
npm run web
```

## Estrutura

| Pasta / arquivo | Descrição |
|-----------------|-----------|
| [`content/portfolio.ts`](content/portfolio.ts) | Nome, frase, bio e contatos |
| [`content/projects.ts`](content/projects.ts) | Projetos (imagem, vídeo, descrição) |
| [`content/studies.ts`](content/studies.ts) | Estudos e artigos |
| [`content/skills.ts`](content/skills.ts) | Lista de tecnologias |
| [`components/skills/LogoLoop.web.tsx`](components/skills/LogoLoop.web.tsx) | Carrossel animado (somente web) |
| [`app/index.tsx`](app/index.tsx) | Página principal com 5 seções |
| [`app/project/[id].tsx`](app/project/[id].tsx) | Detalhe do projeto + likes |

## Seções

1. **Sobre** — tagline e biografia
2. **Projetos** — cards com foto; toque abre detalhe
3. **Estudos e Artigos** — links externos
4. **Habilidades** — LogoLoop na web; grid estático no mobile
5. **Contato** — e-mail, telefone, LinkedIn, GitHub

## Personalização

Edite os arquivos em `content/` com seus dados reais (e-mail, telefone, URLs, textos e imagens dos projetos).

## Likes

O contador de curtidas é **em memória** (sessão atual). Recarregar a página zera os valores — adequado para protótipo.

## Stack

- Expo SDK 56 + Expo Router
- TypeScript
- NativeWind / Tailwind (web + LogoLoop)
- react-icons (web)
- expo-av (vídeo nativo)
