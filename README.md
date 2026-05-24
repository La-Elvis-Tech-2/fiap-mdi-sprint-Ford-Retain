# 🚗 Ford Retain

> Solução mobile de fidelização pós-venda para aumentar o VIN Share na América do Sul

---

## 📋 Sobre o Projeto

### O Desafio

O **Ford Retain** foi desenvolvido para o **Desafio 02 — Impulsionando o VIN Share na América do Sul com Soluções Inteligentes**, proposto pela Ford dentro da Sprint da FIAP.

O **VIN Share** representa a porcentagem de veículos Ford que utilizam a rede oficial de concessionárias para manutenções. Reter clientes no pós-venda é um dos maiores desafios da Ford: clientes que saem da rede oficial perdem benefícios de garantia, e a Ford perde receita e relacionamento de longo prazo.

### Por que escolhemos esse desafio?

Identificamos que o problema não é falta de serviço — é **falta de conexão entre o cliente e a rede**. O cliente esquece de revisar, não sabe qual concessionária fica mais perto, não sente que é recompensado por ser fiel. Um app mobile resolve exatamente isso: está sempre no bolso do cliente, pode lembrar proativamente e pode recompensar cada visita à rede.

### Funcionalidades implementadas

| Tela | Funcionalidades |
|---|---|
| **Home** | KPIs em tempo real (pontos, VIN Share, revisões na rede, nível), gráfico de tendência de pontuação semanal, alertas críticos, modal de nova revisão, busca e notificações |
| **Agendar** | Lista de concessionárias Ford com distância, avaliação e status, seletor de tipo de serviço com pontos por categoria, calendário horizontal de 7 dias, grade de horários disponíveis, modal de confirmação com resumo, modal de sucesso com pontos ganhos |
| **Veículo** | Hero card com dados completos do veículo e VIN, edição inline de quilometragem com atualização em tempo real da barra de progresso, mapa de saúde (6 sistemas), ring de VIN Share reativo, histórico de serviços com badge Rede Ford vs Fora da rede, documentos (garantia e IPVA), modal de edição completa |
| **Comparador IA** | Comparação de dois veículos via IA (Groq + LLaMA 3), análise de uso urbano vs off-road, insight personalizado, +10 pts por comparação |

---

## 👥 Integrantes do Grupo

| Nome completo | RM |
|---|---|
| Leonardo Rocha Scarpitta | RM555460 |
| Gustavo Morais Ildefonso | RM554972 |
| Murilo Justi Rodrigues | RM554512 |
| Vitor Alves Titus Eskes | RM555137 |

---

## ▶️ Como Rodar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) versão 18 ou superior
- [Expo CLI](https://docs.expo.dev/get-started/installation/) instalado globalmente
- Aplicativo **Expo Go** no celular ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)) **ou** emulador configurado
- Chave de API Groq — crie gratuitamente em [console.groq.com](https://console.groq.com)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/fiap-mdi-sprint-ford-Retain.git

# 2. Entre na pasta do projeto
cd fiap-mdi-sprint-ford-Retain

# 3. Instale as dependências
npm install

# 4. Configure a chave da API Groq
# Abra o arquivo src/services/groq.js e substitua:
# const GROQ_API_KEY = 'gsk_SUA_CHAVE_AQUI';
# pela sua chave gerada em console.groq.com

# 5. Inicie o projeto
npx expo start
```

Após iniciar, escaneie o QR code com o **Expo Go** no celular ou pressione `a` para abrir no emulador Android / `i` para iOS.

### Dependências principais

```json
{
  "expo": "~51.0.0",
  "react-native": "0.74.0",
  "react-native-safe-area-context": "^4.10.0",
  "react-native-svg": "^15.0.0"
}
```

---

## 📱 Demonstração Visual

### 🎥 Vídeo de Apresentação

[![Assistir apresentação do Ford Retain](https://img.shields.io/badge/▶%20Assistir%20Apresentação-Ford%20Retain-0F172A?style=for-the-badge&logo=googledrive&logoColor=white)](https://drive.google.com/file/d/1te1OK2jt7K6O2pNwqDCVzd_LV_9TsBL0/view?usp=sharing)

---

### 🖼️ Telas do app

#### Home
<img width="300" height="600" alt="Home" src="https://github.com/user-attachments/assets/e1eed908-3e95-4e78-9f6e-590560f2df9a" />

#### Comparador IA
<img width="300" height="600" alt="Comparador IA" src="https://github.com/user-attachments/assets/7032d8b0-2eb2-4ec5-b79c-b1aa70813c98" />

#### Agendamento
<img width="300" height="600" alt="Agendamento" src="https://github.com/user-attachments/assets/8028a450-0d01-430d-90e5-1caa80ea5dd7" />

#### Meu Veículo
<img width="300" height="600" alt="Meu Veículo" src="https://github.com/user-attachments/assets/2412d1b4-3463-41d7-9e37-f874c0bbcc72" />

---

## 🏗️ Decisões Técnicas

### Stack

| Tecnologia | Justificativa |
|---|---|
| **React Native + Expo** | Stack trabalhada ao longo do semestre; entrega nativa em iOS e Android a partir de uma única base de código; Expo elimina configurações nativas complexas |
| **react-native-svg** | Permite ícones inline em SVG sem carregamento de fontes externas, garantindo performance e consistência visual |
| **Groq API (LLaMA 3)** | Resposta em menos de 2 segundos; plano gratuito generoso para protótipo; modelo capaz de análises automotivas em português |

### Estrutura do projeto

```
ford-Retain/
├── App.js                        # Raiz: navegação por estado + AppProvider
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js         # Dashboard principal
│   │   ├── ScheduleScreen.js     # Agendamento na rede Ford
│   │   ├── VehicleScreen.js      # Perfil e saúde do veículo
│   │   └── CompareScreen.js      # Comparador IA
│   ├── components/
│   │   ├── Icon.js               # Ícones SVG inline (Feather style)
│   │   ├── TabBar.js             # Barra de navegação customizada
│   │   └── Toast.js              # Feedback visual de ações
│   ├── services/
│   │   ├── AppContext.js         # Estado global (pontos, VIN Share, revisões)
│   │   └── groq.js               # Integração com API Groq
│   └── theme.js                  # Tokens de design (Colors, Radius, Shadow)
```

### Navegação

Optamos por **navegação via estado local** no `App.js` em vez de bibliotecas como React Navigation. Um objeto `screens` mapeia a aba ativa para o componente correspondente, e uma função `navigate` é passada como prop para telas que precisam mudar de aba programaticamente — por exemplo, o botão "Agendar revisão" nos Lembretes abre diretamente a tela de Agendamento.

Essa decisão reduz dependências, elimina o overhead de configuração de navigators e é suficiente para a arquitetura flat de abas do app.

### Gerenciamento de estado

O `AppContext` centraliza todo o estado compartilhado entre telas:

- `points` + `pointsHistory` — sistema de gamificação
- `networkServices` / `totalServices` — cálculo do VIN Share
- `activities` — feed de alertas e ações recentes
- `revisions` — revisões agendadas que alimentam o histórico do veículo

Funções como `addRevision` incrementam automaticamente `networkServices` e `totalServices`, mantendo o VIN Share sempre consistente em todas as telas sem prop drilling.

### Integrações

**Groq API**
```
Usuário digita dois veículos
        ↓
callGroq() — POST para api.groq.com/openai/v1/chat/completions
        ↓
Modelo: llama-3.1-8b-instant
        ↓
Resposta em < 2s → exibida na tela + +10 pts adicionados
```

### Componente Icon

Todos os ícones são SVG inline no arquivo `Icon.js`, sem dependência de fontes ou assets externos. Cada ícone é um conjunto de paths Feather renderizados via `react-native-svg`, garantindo que o app funcione offline e que os ícones sejam perfeitamente nítidos em qualquer densidade de tela.

---

## 🔭 Próximos Passos

Com mais tempo de desenvolvimento, o grupo implementaria:

- **Integração com a API oficial da rede Ford** — substituindo os dados mock de concessionárias por dados reais de localização e disponibilidade
- **Notificações push nativas** — alertas por KM via conexão OBD2 Bluetooth ou integração com o computador de bordo do veículo
- **Autenticação real** — login com CPF/email vinculado ao cadastro Ford, permitindo histórico persistente entre dispositivos
- **Programa de recompensas resgatável** — cupons de desconto gerados digitalmente e validados na concessionária via QR code
- **Dashboard para a concessionária** — visão do lado B: gestor da concessionária acompanha agendamentos, taxa de retorno e VIN Share da sua unidade
- **Modo offline** — cache local com AsyncStorage para que o app funcione sem internet e sincronize quando reconectar

---

## 📄 Licença

Projeto desenvolvido para fins acadêmicos — FIAP 2026.
