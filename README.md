# SIPEL — Catálogo de Produtos

Aplicação web desenvolvida como parte do teste técnico para a vaga de Estágio em Desenvolvimento da SIPEL. O projeto consiste em um frontend Angular que consome a API REST fornecida, permitindo autenticação de usuários e gerenciamento completo de um catálogo de produtos.

---

## Índice

- [Pré-requisitos](#pré-requisitos)
- [Como subir o backend](#como-subir-o-backend)
- [Como instalar e rodar o frontend](#como-instalar-e-rodar-o-frontend)
- [Credenciais de teste](#credenciais-de-teste)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Arquitetura e estrutura de pastas](#arquitetura-e-estrutura-de-pastas)
- [Decisões técnicas](#decisões-técnicas)
- [Funcionalidades implementadas](#funcionalidades-implementadas)

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) v18 ou superior
- [Angular CLI](https://angular.io/cli) v17 ou superior (`npm install -g @angular/cli`)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

---

## Como subir o backend

O backend é fornecido pela SIPEL e sobe via Docker Compose junto com o banco de dados PostgreSQL e o Redis.

```bash
# 1. Clone o repositório do backend
git clone https://github.com/Sipel-Construcoes-LTDA/teste-tecnico-estg-04-2026.git

# 2. Acesse a pasta do backend
cd teste-tecnico-estg-04-2026/backend

# 3. Suba os serviços
docker-compose up -d

# 4. Aguarde alguns segundos e acesse o Swagger
# http://localhost:8080/swagger-ui.html
```

> **Atenção:** Caso a porta `8080` já esteja em uso, ajuste o `docker-compose.yaml` conforme necessário.

---

## Como instalar e rodar o frontend

```bash
# 1. Clone este repositório
git clone <url-deste-repositorio>
cd sipel-frontend

# 2. Instale as dependências
npm install

# 3. Suba o servidor de desenvolvimento
ng serve

# 4. Acesse no browser
# http://localhost:4200
```

> O proxy está configurado para redirecionar chamadas de `/api` para `http://localhost:8080`, resolvendo o CORS em desenvolvimento. O backend precisa estar rodando antes de iniciar o frontend.

---

## Credenciais de teste

```
E-mail:  admin@sipel.com
Senha:   password
```

---

## Tecnologias utilizadas

| Tecnologia | Versão | Uso |
|---|---|---|
| Angular | 17+ | Framework principal |
| TypeScript | 5+ | Tipagem estática |
| Tailwind CSS | 3+ | Estilização |
| RxJS | 7+ | Programação reativa e HTTP |
| Angular Router | — | Navegação e proteção de rotas |
| Angular Reactive Forms | — | Formulários com validação |

---

## Arquitetura e estrutura de pastas

O projeto segue uma arquitetura **Feature-based** com três camadas bem definidas:

```
src/app/
├── core/                        # Singleton — existe uma única vez na app
│   ├── guards/
│   │   └── auth.guard.ts        # Proteção de rotas autenticadas
│   ├── interceptors/
│   │   └── auth.interceptor.ts  # Injeção automática do token JWT
│   ├── services/
│   │   ├── auth.service.ts      # Lógica de autenticação
│   │   └── toast.service.ts     # Serviço global de notificações
│   └── models/
│       ├── auth.models.ts       # Interfaces dos DTOs de autenticação
│       └── product.models.ts    # Interfaces dos DTOs de produtos
│
├── shared/                      # Componentes reutilizáveis entre features
│   └── components/
│       ├── loading-spinner/     # Indicador de carregamento
│       ├── toast/               # Notificações de sucesso e erro
│       ├── modal/               # Modal genérico reutilizável
│       └── paginator/           # Navegação entre páginas
│
└── features/                    # Cada funcionalidade isolada
    ├── auth/
    │   └── login/               # Tela de login
    └── products/
        ├── pages/
        │   └── product-list/    # Tela principal de produtos
        ├── components/
        │   ├── product-table/   # Tabela de listagem (componente filho)
        │   └── product-form/    # Formulário reutilizável (criar e editar)
        └── services/
            └── product.service.ts  # Comunicação HTTP de produtos
```

---

## Decisões técnicas

### Reactive Forms em vez de Template-driven Forms

Os formulários foram implementados com **Reactive Forms** porque o estado fica centralizado no TypeScript, o que permite controle total sobre validações, estados (`touched`, `dirty`, `invalid`) e facilita a reutilização de lógica. O `ProductFormComponent`, por exemplo, usa `form.patchValue()` para preencher os dados quando está em modo de edição — isso seria mais complexo com Template-driven.

### AuthInterceptor para injeção automática do token

Em vez de adicionar o header `Authorization: Bearer <token>` manualmente em cada chamada HTTP, foi criado um `HttpInterceptorFn` que intercepta **toda** requisição e injeta o header automaticamente quando há um token salvo. O mesmo interceptor também captura respostas com status `401` e redireciona o usuário para o login, cobrindo o caso de token expirado sem nenhum tratamento adicional nos componentes.

### Token salvo no `localStorage`

O token JWT é salvo no `localStorage` para que persista entre recarregamentos de página. A alternativa seria o `sessionStorage`, que some ao fechar a aba — mais seguro contra ataques XSS em determinados cenários, mas menos conveniente para o fluxo de uso desta aplicação. Como não há dados sensíveis além do token de sessão, o `localStorage` foi considerado adequado.

### Estrutura `core/` `shared/` `features/`

A separação em três camadas garante que cada arquivo tenha um lugar claro e uma responsabilidade única:

- **`core/`** contém tudo que é instanciado uma única vez e serve toda a aplicação (guards, interceptors, services globais).
- **`shared/`** contém componentes puramente visuais e reutilizáveis que não pertencem a nenhuma feature específica.
- **`features/`** isola cada funcionalidade — auth e products não se conhecem, o que facilita manutenção e escalabilidade.

### `ProductFormComponent` reutilizado para criar e editar

Em vez de criar dois componentes de formulário separados, o `ProductFormComponent` aceita um `@Input() product?: ProductDTO`. Se o produto for passado, o formulário é preenchido via `patchValue()` e a operação é de edição. Se não for passado, o formulário fica vazio e a operação é de criação. A decisão de chamar `POST` ou `PUT` fica no componente pai, mantendo o form sem conhecimento do contexto em que está sendo usado.

### Paginação server-side

A listagem consome o endpoint `GET /api/v1/products?page=&size=&sort=id,asc` que retorna apenas os produtos da página solicitada. Isso evita carregar todos os registros de uma vez, tornando a aplicação performática independentemente do volume de dados no banco.

---

## Funcionalidades implementadas

### Requisitos obrigatórios
- [x] Tela de login consumindo `POST /api/v1/auth/login`
- [x] Armazenamento do token JWT e redirecionamento após login
- [x] Proteção de rotas — usuários não autenticados são redirecionados para o login
- [x] Redirecionamento automático ao expirar o token (via interceptor)
- [x] Listagem de produtos com paginação server-side
- [x] Operações de escrita (criar, editar e deletar)

### Diferenciais implementados
- [x] CRUD completo de produtos
- [x] Componentização e organização clara de pastas
- [x] Tratamento de erros de rede, token inválido e campos obrigatórios
- [x] Feedback visual — loading spinner, toasts de sucesso/erro, estado de carregamento nos botões
- [x] Layout responsivo — adaptado para mobile e desktop
- [x] Tipagem adequada com TypeScript — zero `any` no projeto
