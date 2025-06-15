
# ⚙️ YourTale — Guia de Build e Execução Local

Este guia descreve como configurar, executar e validar o ambiente de desenvolvimento local da plataforma **YourTale**.

---

## 📦 Pré-requisitos

Antes de começar, tenha instalado em sua máquina:

- [Node.js](https://nodejs.org/) (>= 18.x recomendado)
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- Opcional: [Docker](https://www.docker.com/)

---

## 🚀 Passo a Passo

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/SEU_USUARIO/yourtale.git
cd yourtale
```

---

### 2️⃣ Instale as dependências do Frontend e Backend

```bash
# Frontend (Next.js)
cd frontend
npm install
# ou
yarn install

# Backend (NestJS)
cd ../backend
npm install
# ou
yarn install
```

---

### 3️⃣ Configure variáveis de ambiente

Crie um `.env` em **cada projeto**, conforme o exemplo:

```env
# frontend/.env
NEXT_PUBLIC_API_URL=http://localhost:3001

# backend/.env
PORT=3001
OPENAI_API_KEY=YOUR_API_KEY
```

> ⚠️ **Nunca suba `.env` para o repositório.** Use arquivos `.env.example`.

---

### 4️⃣ Execute Frontend e Backend

Execute cada parte em terminais separados:

```bash
# Terminal 1 - Frontend
cd frontend
npm run dev
# ou
yarn dev

# Terminal 2 - Backend
cd backend
npm run start:dev
# ou
yarn start:dev
```

- Frontend (Next.js): [http://localhost:3000](http://localhost:3000)
- Backend (NestJS): [http://localhost:3001](http://localhost:3001)

---

## ✅ Testes locais

Frontend:
```bash
cd frontend
npm test
# ou
yarn test
```

Backend:
```bash
cd backend
npm run test
# ou
yarn test
```

---

## 🗂️ Estrutura de Pastas (resumo)

```plaintext
yourtale/
├── frontend/           # Frontend em Next.js
├── backend/            # Backend em NestJS
├── BUILD.md            # Guia de build
├── CONTRIBUTING.md     # Guia de contribuição
├── README.md           # Introdução geral
└── docs/               # Artefatos AIDesign
└── diagrams/           # Diagramas do Projeto
```

---

## 📌 Observações

- Use **branches organizadas**.
- Mantenha a sincronia com o README e CONTRIBUTING.md.

🚀 **Bons jogos e bom desenvolvimento!**
