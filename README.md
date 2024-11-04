# LinkZip

LinkZip é um encurtador de URLs com suporte a autenticação de usuários. O sistema permite aos usuários encurtar URLs com e sem autenticação, registrar suas URLs encurtadas para fácil acesso e gerenciar suas URLs por meio de uma interface de usuário. 

### Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Instruções de Configuração e Execução](#instruções-de-configuração-e-execução)
- [Testando Endpoints](#testando-endpoints)
- [Escalabilidade e Pontos de Melhoria](#escalabilidade-e-pontos-de-melhoria)

---

## Visão Geral

Este projeto é um aplicativo monorepo com duas principais partes:
- **Server:** um backend Express para gerenciar autenticação, URLs e comunicação com o banco de dados MongoDB.
- **Client:** uma aplicação React que oferece uma interface de usuário para encurtamento e gerenciamento de URLs.

## Funcionalidades

1. **Encurtamento de URLs**
   - URLs podem ser encurtadas por qualquer usuário, autenticado ou não.
   - URLs encurtadas de usuários autenticados são salvas para gerenciamento futuro.

2. **Autenticação de Usuário**
   - Suporte a registro, login e logout.
   - Recuperação de senha e redefinição de senha.
   
3. **Gerenciamento de URLs**
   - Usuários autenticados podem visualizar, editar e deletar suas URLs encurtadas.
   - Contagem de visitas para cada URL encurtada.

4. **Feedback do Usuário**
   - Notificações visuais com sucesso ou erro para todas as operações.

---

## Pré-requisitos

Antes de configurar o projeto, certifique-se de ter os seguintes itens instalados:
- Docker
- Docker Compose
- Node.js (para o desenvolvimento)

## Instruções de Configuração e Execução

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/ed-machado/link-zip-app.git
   cd linkzip
   ```

2. **Configuração do `.env` para o servidor:**
   
   Crie um arquivo `.env` na pasta `server/` com as seguintes variáveis de ambiente:
   ```dotenv
   PORT=5001
   MONGO_URI=mongodb://mongo:27017/linkzip
   JWT_SECRET=sua_chave_secreta
   ```

3. **Configuração do Docker Compose:**

   O projeto já inclui um arquivo `docker-compose.yml` que configura o MongoDB, o client, e o server. Certifique-se de estar na raiz do projeto e execute:

   ```bash
   docker-compose up --build
   ```

   Isso iniciará a aplicação na URL `http://localhost:3000` (client) e o servidor backend na URL `http://localhost:5001/api`.

4. **Executando sem Docker (opcional):**

   Caso prefira, é possível rodar o client e o server manualmente:

   - **Server:**
     ```bash
     cd server
     npm install
     npm run dev
     ```

   - **Client:**
     ```bash
     cd client
     yarn install
     yarn start
     ```

---

## Testando Endpoints

Após o projeto estar em execução, você pode testar os endpoints usando uma ferramenta como o Postman ou o curl.

### 1. **Autenticação**

   - **Registro de Usuário**
     - **Endpoint:** `POST /api/user`
     - **Payload:**
       ```json
       {
         "fullName": "Seu Nome",
         "email": "email@example.com",
         "password": "senha"
       }
       ```

   - **Login de Usuário**
     - **Endpoint:** `POST /api/user/login`
     - **Payload:**
       ```json
       {
         "email": "email@example.com",
         "password": "senha"
       }
       ```
   - **Logout de Usuário**
     - O logout é gerenciado no client ao limpar o `localStorage` e redirecionar o usuário para a página de login.

### 2. **Gerenciamento de URLs**

   - **Encurtar URL**
     - **Endpoint (sem autenticação):** `POST /api/url`
     - **Payload:**
       ```json
       {
         "originalLink": "https://example.com"
       }
       ```
     - **Endpoint (com autenticação):** `POST /api/url`
       - Adicione o campo `"userId": "<user-id>"` no payload.

   - **Obter URLs do Usuário**
     - **Endpoint:** `GET /api/url/user/:userId`
     - **Autorização:** JWT Token

   - **Deletar URL**
     - **Endpoint:** `DELETE /api/url/:urlCode`
     - **Autorização:** JWT Token

   - **Atualizar URL**
     - **Endpoint:** `PUT /api/url/:urlCode`
     - **Autorização:** JWT Token

---

## Escalabilidade e Pontos de Melhoria

Para escalar o LinkZip horizontalmente, os seguintes pontos devem ser considerados:

1. **Autenticação**
   - Migrar a autenticação para um serviço separado, com tokens JWT sendo validados em um serviço central para suportar múltiplas instâncias do server.

2. **Caching**
   - Implementar caching com Redis para armazenar URLs de alta demanda e melhorar a velocidade de resposta.
   - Cachear também tokens de autenticação para validação rápida e evitar consultas frequentes ao banco de dados.

3. **Monitoramento e Logging**
   - Configurar monitoramento com ferramentas como Prometheus e Grafana para monitorar a saúde e o desempenho do sistema.
   - Integrar um sistema de logging centralizado, como ELK Stack (Elasticsearch, Logstash, Kibana), para coletar e analisar logs de erro e tráfego.

4. **CI/CD e Testes**
   - Automatizar o deploy com pipelines de CI/CD para permitir atualizações rápidas e seguras.
   - Adicionar testes unitários e de integração, cobrindo casos de autenticação, gerenciamento de URLs, e resposta de erros para maior confiabilidade do sistema.

Esses ajustes ajudarão a manter a performance e a disponibilidade do LinkZip conforme o uso da aplicação crescer.
