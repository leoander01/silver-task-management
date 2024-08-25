# SILVER Task Management System

## Descrição
O **SILVER Task Management System** é uma aplicação desenvolvida com NestJS e PostgreSQL que permite aos usuários gerenciar tarefas, organizá-las em projetos e listas, compartilhar com outros usuários com diferentes níveis de acesso, e acompanhar o progresso das tarefas.

## Funcionalidades
- **Criar Tarefas**: Os usuários podem criar tarefas com título, descrição, data de vencimento e prioridade.
- **Organizar Tarefas**: As tarefas podem ser organizadas em projetos e listas.
- **Compartilhar Tarefas**: Compartilhe tarefas com outros usuários e defina níveis de acesso (visualização, edição, proprietário).
- **Acompanhar Progresso**: Marque tarefas como concluídas e acompanhe o progresso.

## Tecnologias Utilizadas
- **Node.js** com **NestJS**: Estrutura do lado do servidor.
- **TypeORM**: ORM utilizado para interação com o banco de dados.
- **PostgreSQL**: Banco de dados relacional utilizado no projeto.
- **JWT**: Para autenticação e autorização.
- **Docker**: Para ambiente de desenvolvimento consistente e fácil configuração do PostgreSQL.

## Instalação e Configuração
1. **Clone o repositório**:
    ```bash
    git clone https://github.com/leoander01/silver-task-management.git
    cd silver-task-management
    ```
    
2. **Instale as dependências**:
    ```bash
    npm install
    ```
    
3. **Configure as variáveis de ambiente no arquivo .development.env**:
    ```bash
    DATABASE_HOST=localhost
    DATABASE_PORT=5432
    DATABASE_USER=postgres
    DATABASE_PASSWORD=sua-senha
    DATABASE_NAME=silver_task_management
    JWT_SECRET=sua-chave-secreta
    PORT=3001
    ```

4. **Execute o Docker Compose para iniciar o banco de dados**:
    ```bash
    docker-compose up -d
    ```
    
5. **Inicie a aplicação**:
    ```bash
    npm run start:dev
    ```

6. **Swagger**:
Com a aplicação iniciada, acesse `http://localhost:3001/api` e veja o swagger en funcionamento

## Endpoints Principais
* **/users**: Gerenciamento de usuários (CRUD)
* **/auth/login**: Autenticação de usuários e geração de JWT
* **/auth/register**: Criação de um novo usuário
* **/tasks**: Gerenciamento de tarefas (CRUD)
* **/tasks/share**: Compartilhamento de tarefas com outros usuários
