# dashTeacher

**dashTeacher** é uma plataforma web desenvolvida para facilitar a gestão de turmas, alunos. 
Construído com [Vue 3](https://vuejs.org/), [Vuetify 3](https://vuetifyjs.com/), [Pinia](https://pinia.vuejs.org/) e [Vite](https://vitejs.dev/), o sistema oferece uma experiência moderna, responsiva e intuitiva para administradores e professores.

## 🚀 Visão Geral

O dashTeacher foi criado para centralizar e simplificar o controle de:

- **Turmas e horários**: Crie, edite e visualize turmas, níveis e horários de aulas.
- **Alunos**: Cadastre, edite e gerencie perfis de alunos, incluindo informações de saúde e experiência.
- **Agendamentos**: Realize o agendamento de alunos em turmas de acordo com disponibilidade e status de pagamento.
- **Pagamentos**: Controle pagamentos pendentes, pagos e vencidos, com confirmação e agendamento direto pelo sistema.
- **Perfis**: Gerencie o perfil do usuário administrador e personalize preferências.

## ✨ Funcionalidades

- **Dashboard intuitivo**: Visualização clara das turmas, alunos e status de pagamentos.
- **Filtros inteligentes**: Filtre turmas por nível e alunos por status de pagamento.
- **Arraste e solte**: Realocação de alunos entre turmas de forma visual e prática.
- **Notificações e feedbacks**: Snackbars e alertas para informar ações realizadas.
- **Tutoriais integrados**: Ajuda interativa para novos usuários em pontos-chave do sistema.
- **Responsividade**: Interface adaptada para desktop e dispositivos móveis.

## 🛠️ Tecnologias Utilizadas

- **Vue 3** — Framework progressivo para construção de interfaces.
- **Vuetify 3** — Biblioteca de componentes UI baseada em Material Design.
- **Pinia** — Gerenciamento de estado moderno para Vue.
- **Vite** — Ferramenta de build e desenvolvimento ultrarrápida.
- **Axios** — Requisições HTTP para integração com API REST.
- **Express** — Servidor Node.js para servir a aplicação em produção.

## 📦 Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/RafaelOlive26sp/dashTeacher_fit.git
cd dashTeacher_fit
npm install
```

## ▶️ Executando em Desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse em [http://localhost:3000](http://localhost:3000).

## 🏗️ Build para Produção

Para gerar os arquivos otimizados para produção:

```bash
npm run build
```

Para servir a aplicação em produção (após o build):

```bash
npm run start
```
## 🧪 Sinta-se à vontade para testar a aplicação

Para testar as funcionalidades do sistema, utilize as seguintes credenciais:

**E-mail:** admin@example.com  
**Senha:** password  

> **Nota:** Estas credenciais são exclusivamente para um ambiente de teste dedicado e não devem ser usadas em produção.


## 📚 Estrutura de Pastas

- `src/components/` — Componentes Vue reutilizáveis (tabelas, diálogos, cards, etc).
- `src/pages/` — Páginas principais do sistema (Login, Dashboard, etc).
- `src/layouts/` — Layouts globais e templates.
- `src/services/` — Serviços de integração com a API.
- `src/stores/` — Stores Pinia para gerenciamento de estado.
- `src/plugins/` — Plugins globais (Vuetify, Pinia, Router).
- `src/styles/` — Estilos globais e configurações de tema.

## 🔒 Autenticação

O sistema utiliza autenticação baseada em token JWT, armazenando o token em cookies seguros e localStorage. O acesso às rotas protegidas é controlado pelo [`useAuthStore`](src/stores/auth.js).

## 👤 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📄 Licença

MIT

---

Desenvolvido por [Rafael Oliveira](https://github.com/RafaelOlive26sp) com Vue, Vuetify e paixão por tecnologia e fitness.