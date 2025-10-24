🔑 **CONFIGURAÇÃO DA CHAVE DA OPENAI**

Para ativar o chat por voz em tempo real com IA, você precisa adicionar sua chave da OpenAI:

## Passo 1: Obter Chave da OpenAI
1. Vá para https://platform.openai.com/api-keys
2. Faça login na sua conta OpenAI
3. Clique em "Create new secret key"
4. Copie a chave (começa com `sk-`)

## Passo 2: Configurar no Projeto
1. Abra o arquivo `.env.local` na raiz do projeto
2. Cole sua chave na linha:
```
OPENAI_API_KEY=sk-sua-chave-aqui
```

## Passo 3: Reiniciar o Servidor
```bash
npm run dev
```

## Verificar Configuração
Acesse: http://localhost:3000/api/llm/stream para verificar se a API está funcionando.

⚠️ **IMPORTANTE:**
- Mantenha sua chave segura e nunca a compartilhe
- O arquivo `.env.local` já está no `.gitignore` para sua segurança
- A chave só funciona do lado do servidor (backend)

✅ **Após configurar, o sistema terá:**
- Respostas reais da OpenAI GPT-4
- Latência ultra-baixa (< 500ms)
- Streaming de texto em tempo real
- Terapia TCC profissional
- Detecção automática de crise
