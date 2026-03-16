# MediasSite

> Interface web para a [MediasAPI](https://github.com/GustavoDaMassa/MediasAPI) — gerenciamento de notas e projeções acadêmicas.

---

## Apresentação

Frontend Angular da MediasAPI. Permite aos usuários gerenciar disciplinas, criar projeções de notas e acompanhar o desempenho acadêmico de forma visual e interativa.

## Principais funcionalidades

- Autenticação com JWT (login, guarda de rotas, renovação de sessão)
- Gerenciamento de disciplinas e métodos de cálculo personalizados
- Criação e visualização de projeções por disciplina
- Lançamento de notas e cálculo automático de média e nota necessária
- Perfil do usuário (atualizar nome, email, excluir conta)
- Internacionalização: Português (BR) e Inglês (US)
- Tema claro e escuro

## Tecnologias

- [Angular](https://angular.dev/) com standalone components
- [Angular Material](https://material.angular.io/) (MD3)
- [ngx-translate](https://github.com/ngx-translate/core) para i18n
- SCSS com suporte a theming dark/light
- Angular Signals para gerenciamento de estado

## Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) v20+
- [MediasAPI](https://github.com/GustavoDaMassa/MediasAPI) rodando em `http://localhost:8080`

### Passos

```bash
# Clonar o repositório
git clone https://github.com/GustavoDaMassa/MediasSite.git
cd MediasSite/medias-frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start
```

Acesse `http://localhost:3000/`. As requisições para `/api` são redirecionadas automaticamente para `http://localhost:8080` via proxy.

### Build de produção

```bash
npm run build
```

Os artefatos são gerados em `dist/`.

## Estrutura do projeto

```
src/
├── app/
│   ├── core/          # Services, guards, interceptors (singleton)
│   ├── shared/        # Componentes e modelos reutilizáveis
│   └── features/      # Módulos por domínio (auth, courses, projections, profile)
├── assets/
│   └── i18n/          # Arquivos de tradução (pt-BR.json, en-US.json)
└── environments/      # Configurações por ambiente
```