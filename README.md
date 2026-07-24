#  Automação E2E - Front-ServeRest com Playwright

Projeto de automação de testes End-to-End (E2E) desenvolvido para a aplicação **Front-ServeRest**, utilizando **Playwright** com **TypeScript** e arquitetura **Page Object Model (POM)**.

O objetivo deste projeto é validar os principais fluxos da aplicação por meio de testes automatizados, aplicando boas práticas de organização, reutilização de código e manutenção da suíte de testes.

---

##  Sobre o Projeto

Este projeto contempla a automação dos principais cenários da aplicação Front-ServeRest, cobrindo funcionalidades como:

- Login de usuários
- Cadastro de usuários
- Navegação na Home
- Lista de Compras (Carrinho)
- Painel Administrativo
- Cadastro e exclusão de produtos

A estrutura foi desenvolvida utilizando o padrão **Page Object Model (POM)** para separar regras de negócio, elementos e casos de teste, tornando o projeto escalável e de fácil manutenção.

---

##  Tecnologias Utilizadas

<div align="center">

| Tecnologia | Descrição |
|------------|-----------|
| Playwright | Framework de automação Web |
| TypeScript | Linguagem principal |
| Node.js | Ambiente de execução |
| Git | Controle de versão |
| GitHub | Hospedagem do projeto |

</div>

---

##  Estrutura do Projeto

```text
front-serverest-e2e/
│
├── pages/
│   ├── AdminPage.ts
│   ├── CartPage.ts
│   ├── HomePage.ts
│   ├── LoginPage.ts
│   └── RegisterPage.ts
│
├── tests/
│   ├── admin.spec.ts
│   ├── cart.spec.ts
│   ├── home.spec.ts
│   ├── login.spec.ts
│   └── register.spec.ts
│
├── playwright.config.ts
├── package.json
└── README.md
```

---

#  Casos de Teste Automatizados

## US001 - Login

- ✅ Login com sucesso (Cliente)
- ✅ Login com sucesso (Administrador)
- ✅ Login com senha inválida
- ✅ Login com e-mail inexistente
- ✅ Login com e-mail inválido

---

##  US002 - Cadastro de Usuário

- ✅ Cadastro com perfil Administrador
- ✅ Cadastro como usuário comum
- ✅ Validação de nome inválido
- ✅ Validação de e-mail já cadastrado

---

##  US003 - Home

- ✅ Carregamento da vitrine
- ✅ Pesquisa de produto existente
- ✅ Pesquisa de produto inexistente
- ✅ Adicionar produto ao carrinho
- ✅ Logout da aplicação

---

##  US004 - Lista de Compras

- ✅ Visualização dos produtos
- ✅ Incremento de quantidade
- ✅ Decremento de quantidade

---

##  US005 - Painel Administrativo

- ✅ Acesso ao painel
- ✅ Cadastro de produto
- ✅ Validação de produto duplicado
- ✅ Exclusão de produto

---

#  Pré-requisitos

Antes de executar o projeto, tenha instalado:

- Node.js (18+)
- Git
- VS Code (recomendado)

---

#  Instalação

Clone o repositório:

```bash
git clone https://github.com/jojonobre/front-serverest-e2e.git
```

Entre na pasta:

```bash
cd front-serverest-e2e
```

Instale as dependências:

```bash
npm install
```

Instale os navegadores do Playwright:

```bash
npx playwright install
```

---

#  Executando os Testes

### Executar todos os testes

```bash
npx playwright test
```

---

### Executar em modo UI

```bash
npx playwright test --ui
```

---

### Executar visualizando o navegador

```bash
npx playwright test --headed
```

---

### Executar uma suíte específica

Exemplo:

```bash
npx playwright test tests/admin.spec.ts --project=chromium --headed
```

---

#  Relatórios

Após a execução, visualize o relatório HTML:

```bash
npx playwright show-report
```

---

#  Boas Práticas Aplicadas

- ✔️ Page Object Model (POM)
- ✔️ Reutilização de código
- ✔️ Organização por funcionalidades
- ✔️ Separação entre páginas e testes
- ✔️ Código tipado com TypeScript
- ✔️ Estrutura escalável para novos cenários

---

#  Próximas Melhorias

- [ ] Fixtures customizadas
- [ ] Massa de dados dinâmica
- [ ] Integração com GitHub Actions (CI)
- [ ] Geração de relatórios Allure
- [ ] Execução paralela otimizada
- [ ] Testes cross-browser completos
- [ ] Integração com API para preparação de dados

---

##  Autora

**Joyce Maria de Oliveira**

Estudante de Ciência da Computação • QA Analyst

Focada em Automação de Testes, Qualidade de Software e Aprendizado Contínuo.

---

⭐ Se este projeto foi útil ou interessante para você, deixe uma estrela no repositório.
