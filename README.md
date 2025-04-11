# Aplicativo e Landing Page de Gerenciamento de Tarefas

## Visão Geral

Sistema completo para gerenciamento de tarefas pessoais e profissionais, com aplicativo mobile e landing page web.

## Funcionalidades Principais

- **Autenticação de Usuários**: Login e cadastro seguros
- **Sistema de Prioridades**: Classificação de tarefas por importância
- **Alertas Sonoros**: Notificações audíveis para tarefas importantes
- **Lembretes**: Notificações 2 dias antes do prazo
- **Destaque de Tarefas**: Tarefas com prazo próximo (<24h) destacadas

## Tecnologias Utilizadas

- React Native (Aplicativo)
- HTML/CSS/JavaScript (Landing Page)
- Expo
- React Navigation
- AsyncStorage para armazenamento local
- Expo Notifications para sistema de lembretes

## Como Instalar e Usar

### Pré-requisitos

1. Node.js instalado
2. Expo CLI instalado globalmente

### Instalação

```bash
npm install -g expo-cli
npm install
npx expo start
```

### Navegação

- **Página de Login**: Acesse com suas credenciais
- **Página de Cadastro**: Crie uma nova conta
- **Gerenciador de Tarefas**: Visualize, adicione e gerencie suas tarefas

### Configurações

- Toque no ícone de engrenagem para acessar configurações
- Ajuste preferências de notificação e temas

## Notificações

O aplicativo enviará:
- Notificações 2 horas antes do prazo
- Alertas sonoros para tarefas prioritárias
- Destaques visuais para prazos próximos

## Desenvolvimento Futuro

- Sincronização com calendário
- Compartilhamento de tarefas
- Versão desktop

---

Desenvolvido com ❤️ para melhorar sua produtividade!