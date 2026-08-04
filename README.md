<div align="center">

# Automação E2E & API - ServeRest com Playwright

Projeto de automação de testes de Interface (UI) e Integração (API) desenvolvido para a aplicação **ServeRest**, utilizando **Playwright** com **TypeScript**, geração dinâmica de massa com **Faker** e arquitetura **Page Object Model (POM)**.

---

**Objetivo:** Validar os principais fluxos funcionais e regras de negócio da aplicação, garantindo regressão ágil, alta estabilidade e limpeza automática de ambiente pós-execução (*Teardown* via API).

</div>

---

# Sobre o Projeto

Este projeto engloba a validação automatizada de ponta a ponta dos módulos principais da aplicação ServeRest, contemplando:

- **Autenticação e Login** (`US001`)
- **Cadastro de Usuários** (`US002`)
- **Vitrine e Busca de Produtos** (`US003`)
- **Visualização de Lista de Compras** (`US004`)
- **Painel Administrativo & Gestão de Produtos** (`US005`)

A estrutura foi desenvolvida aplicando o padrão **Page Object Model (POM)** para separação clara entre seletores, ações e especificações de teste, além de rotinas de **setup** e **cleanup via API** para garantir a independência de cada cenário de teste.

---

# Resumo Executivo & Métricas de Execução

| Camada de Teste | Total Executado | Sucesso (Passed) | Falhas (Failed) | Taxa de Sucesso | Tempo Total |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Testes de API** | 11 | 11 | 0 | **100,0%** | ~0.2 min |
| **Testes de UI** | 16 | 15 | 1 | **93,8%** | ~1.4 min |
| **TOTAL** | **27** | **26** | **1** | **96,2%** | **~1.6 min** |

> **Observação sobre a falha (BUG-001):** A única falha registrada na suíte de UI refere-se ao **CT008 (Cadastro)**, onde a aplicação permite cadastrar usuários com nomes compostos exclusivamente por caracteres especiais e/ou números sem exibir a validação esperada no frontend.

---

# Tecnologias Utilizadas

<div align="center">

| Tecnologia | Descrição |
|------------|-----------|
| **Playwright** | Framework principal para testes Web e API |
| **TypeScript** | Linguagem tipada para maior confiabilidade |
| **Faker JS** | Geração dinâmica e aleatória de massa de dados |
| **Node.js** | Ambiente de execução |
| **Docker** | Containerização da suíte de testes |
| **Git / GitHub** | Controle de versão e hospedagem |

</div>

---

# Mapeamento dos Casos de Teste (26 Cenários)

## US001 - Login / Autenticação (UI & API)

- ✅ `CT001` - Login com sucesso (Usuário Cliente)
- ✅ `CT002` - Login com senha inválida
- ✅ `CT003` - Login com e-mail não cadastrado
- ✅ `CT004` - Login com e-mail em formato inválido (Validação HTML5)

## US002 - Cadastro de Usuário (UI & API)

- ✅ `CT006` - Cadastro de Administrador com sucesso
- ✅ `CT007` - Cadastro de Cliente com sucesso
- ❌ `CT008` - Cadastro com nome inválido (BUG-001)
- ✅ `CT010` - Cadastro com e-mail já utilizado

## US003 - Home e Busca de Produtos (UI & API)

- ✅ `CT009` - Pesquisar produto existente
- ✅ `CT010` - Pesquisar produto inexistente
- ✅ `CT011` - Adicionar produto à lista de compras

## US005 - Painel Administrativo / Produtos (UI & API)

- ✅ `CT025` - Carregamento do painel administrativo
- ✅ `CT026` - Cadastro de novo produto
- ✅ `CT027` - Cadastro de produto com nome duplicado
- ✅ `CT028` - Listagem de produtos
- ✅ `CT029` - Remoção de produto existente
- ✅ `CT030` - Cadastro de novo usuário administrador
- ✅ `CT031` - Restrição de acesso às rotas administrativas via URL

---

# Pré-requisitos

Antes de executar a suíte, certifique-se de possuir:

- Node.js (18 ou superior)
- Git
- Docker *(opcional)*
- Visual Studio Code
- Extensão do Faker no VS Code

---

#  Instalação e Configuração

## 1. Clone o repositório

```bash
git clone https://github.com/jojonobre/front-serverest-e2e.git
```

## 2. Acesse a pasta

```bash
cd front-serverest-e2e
```

## 3. Instale as dependências

```bash
npm install
```

## 4. Instale os navegadores do Playwright

```bash
npx playwright install
```

## 5. Instale o Faker
```bash
npm install @faker-js/faker --save-dev
```
---

# Executando os Testes

## Executar toda a suíte

```bash
npx playwright test
```

## Executar em modo Headed

```bash
npx playwright test --headed
```

## Executar no UI Mode

```bash
npx playwright test --ui
```

## Executar apenas uma suíte

```bash
npx playwright test tests/login.spec.ts --project=chromium
```

## Executar apenas testes de API

```bash
npx playwright test tests/api
```

## Executar apenas testes de UI

```bash
npx playwright test tests/ui
```

---

#  Executando via Docker

## Construir a imagem

```bash
docker build -t front-serverest-e2e .
```

## Executar o container

```bash
docker run --rm front-serverest-e2e
```

---

# Relatórios

Após a execução dos testes, visualize o relatório HTML:

```bash
npx playwright show-report
```

O Playwright também gera automaticamente:

-  HTML Report
-  Trace Viewer
-  Screenshots em caso de falha
-  Vídeos das execuções (quando configurado)

---

#  Boas Práticas Aplicadas

### Page Object Model (POM)

Separação entre elementos da interface, ações e testes, facilitando manutenção e reutilização.

### Massa Dinâmica com Faker

Criação automática de usuários e produtos únicos durante cada execução.

### Setup & Teardown via API

Criação e remoção automática dos dados utilizados nos testes, garantindo independência entre cenários.

### Testes Híbridos (UI + API)

Validação simultânea da interface e das respostas HTTP da API.

### Containerização

Execução padronizada através do Docker, facilitando integração contínua (CI/CD).

### Código Reutilizável

Organização em utilitários, fixtures e Page Objects para reduzir duplicação de código.

---

# Funcionalidades Validadas

- Login
- Logout
- Cadastro de usuários
- Validação de regras de negócio
- Busca de produtos
- Cadastro de produtos
- Exclusão de produtos
- Controle de acesso
- Validações da API
- Limpeza automática de dados

---

<div align="center">

### Joyce Maria 💜

Estudante de Ciência da Computação • QA Analyst Intern

<a href="https://github.com/jojonobre" target="_blank">
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
</a>
<a href="https://www.linkedin.com/in/joyce-maria-86250231a/" target="_blank">
  <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
</a>

</div>
