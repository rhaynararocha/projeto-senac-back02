// index.js — ponto de entrada da aplicação
// responsabilidade: subir o servidor Express, registrar middlewares globais
// e montar as rotas dos recursos.

// 1) dotenv precisa ser carregado ANTES de qualquer coisa que use process.env
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'node:path';

import usuariosRoutes from './src/routes/usuariosRoutes.js';
import tarefasRoutes from './src/routes/tarefasRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// ────────────────────────────────────────────────────────────────────────────
// Middlewares globais
// ────────────────────────────────────────────────────────────────────────────

// helmet: adiciona cabeçalhos HTTP de segurança (X-Frame-Options,
// Strict-Transport-Security, X-Content-Type-Options etc.) — UC3 Bloco C.
app.use(helmet());

// CORS: libera chamadas vindas de outros domínios (ex.: front no Live Server
// em http://127.0.0.1:5500). Em produção, restrinja a origin de verdade.
const corsOptions = {
  origin: ['https://projeto-senac-front02.vercel.app','http://127.0.0.1:5500','https://tarefas-carlos-site.vercel.app','https://tarefas-juliana-site.vercel.app','https://tarefas-rafael-front.vercel.app','https://projeto-senac-frontend.vercel.app', 'http://localhost:5500','http://localhost:8080', 'http://127.0.0.1:8080', 'https://projeto-senac-front.vercel.app'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// parser nativo do Express para JSON no corpo das requisições
app.use(express.json());

// disponibiliza as imagens de perfil salvas localmente
app.use('/uploads', express.static(path.resolve('uploads')));

// ────────────────────────────────────────────────────────────────────────────
// Rotas
// ────────────────────────────────────────────────────────────────────────────

// cada grupo de rotas é montado sob um prefixo
// /usuarios cobre: cadastro, login, perfil e o CRUD de usuários.
app.use('/usuarios', usuariosRoutes);
app.use('/tarefas', tarefasRoutes);  // CRUD de tarefas (protegido por JWT)

// rota raiz só para health-check rápido no navegador
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    recursos: [
      'POST /usuarios',
      'POST /usuarios/login',
      'GET  /usuarios/perfil',
      '/usuarios',
      '/tarefas'
    ]
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Tratamento de erros — fallback genérico (não vaza stacktrace ao cliente)
// ────────────────────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[erro nao tratado]', err);
  res.status(500).json({ mensagem: 'Erro interno do servidor.' });
});

// ────────────────────────────────────────────────────────────────────────────
// Sobe o servidor
// ────────────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
