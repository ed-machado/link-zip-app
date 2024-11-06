<p align="center">
  <img src="https://drive.google.com/uc?id=1sPNlvKpbmO5qRaC_QFyu4OuLKiT5blOH" alt="LinkZip Logo" width="250"/>
</p>

<p align="center">
  <b>LinkZip é um encurtador de URLs com autenticação de usuários, oferecendo uma interface intuitiva para encurtar, gerenciar e monitorar links.</b>
</p>

## Índice
- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Instruções de Configuração e Execução](#instruções-de-configuração-e-execução)
- [Testando Endpoints](#testando-endpoints)
- [Escalabilidade e Pontos de Melhoria](#escalabilidade-e-pontos-de-melhoria)

## Visão Geral

O projeto LinkZip é estruturado como um monorepo, contendo as seguintes partes principais:

- **Server:** Backend desenvolvido com Express para gerenciar autenticação, URLs, e comunicação com o banco de dados MongoDB.
- **Client:** Interface de usuário em React para encurtamento e gerenciamento de URLs.

## Funcionalidades

- **Encurtamento de URLs:** URLs podem ser encurtadas por qualquer usuário, autenticado ou não. URLs encurtadas por usuários autenticados são salvas para acesso e gerenciamento futuro.
- **Autenticação de Usuário:** Suporte para registro, login, logout e recuperação de senha.
- **Gerenciamento de URLs:** Usuários autenticados podem visualizar, editar, deletar URLs e visualizar contagens de visitas.
- **Feedback do Usuário:** Notificações visuais de sucesso ou erro para todas as operações.

## Pré-requisitos

Certifique-se de ter instalado:

- Docker
- Docker Compose
- Node.js (para desenvolvimento)

## Instruções de Configuração e Execução

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/ed-machado/link-zip-app.git
   cd link-zip-app
   ```
2. **Configuração do `.env` para o servidor:**
   Copie o `.envexemple` na pasta `server/` para `.env` e ajuste conforme necessário.
3. **Execução com Docker Compose:**
   Na raiz do projeto, execute:
   ```bash
   docker-compose up --build
   ```
   - A aplicação estará disponível em `http://localhost:3000` (client) e `http://localhost:5001/api` (backend).
4. **Executando sem Docker (opcional):**
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

## Testando Endpoints

### 1. Autenticação

   - **Registro:** `POST /api/user`
     ```json
     { "fullName": "Seu Nome", "email": "email@example.com", "password": "senha" }
     ```
   - **Login:** `POST /api/user/login`
     ```json
     { "email": "email@example.com", "password": "senha" }
     ```
   - **Logout:** Limpa o `localStorage` no client e redireciona o usuário.

### 2. Gerenciamento de URLs

   - **Encurtar URL:** `POST /api/url` (sem autenticação)
     ```json
     { "originalLink": "https://example.com" }
     ```
   - **Obter URLs do Usuário:** `GET /api/url/user/:userId`
   - **Deletar URL:** `DELETE /api/url/:urlCode`
   - **Atualizar URL:** `PUT /api/url/:urlCode`

## Escalabilidade e Pontos de Melhoria

Para melhorar a escalabilidade e o desempenho do LinkZip, considere:

1. **Autenticação Descentralizada:** Separar a autenticação para um serviço independente, com verificação centralizada de tokens JWT.
2. **Caching:** Utilizar Redis para cache de URLs e tokens, reduzindo o tempo de resposta e aliviando o banco de dados.
3. **Monitoramento e Logging:** Implementar monitoramento (Prometheus, Grafana) e logging centralizado (ELK Stack) para análise de erros e tráfego.
4. **CI/CD e Testes Automatizados:** Configurar pipelines CI/CD para automação do deploy e incluir testes unitários e de integração para garantir confiabilidade.

Essas melhorias aumentarão a performance e a resiliência do LinkZip, especialmente em ambientes de alta demanda.
