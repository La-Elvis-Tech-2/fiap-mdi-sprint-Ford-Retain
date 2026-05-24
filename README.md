# Ford Connect — React Native (Expo)

App de gamificação e revisões Ford com IA via Groq/Llama 3.

---

## Setup

```bash
cd FordConnect
npm install
npx expo start
```

Escaneie o QR com **Expo Go** (Android) ou câmera (iOS).

---

## Configurar a IA (obrigatório para comparador e revisões)

1. Crie conta gratuita em [console.groq.com](https://console.groq.com)
2. Gere uma API Key
3. Abra `src/services/groq.js` e substitua:
   ```js
   const GROQ_API_KEY = 'gsk_SUA_CHAVE_AQUI';
   ```

---

## Estrutura

```
FordConnect/
├── App.js
├── src/
│   ├── theme/index.js              ← cores, sombras, raios
│   ├── services/
│   │   ├── AppContext.js           ← estado global (pontos, VIN Share, badge)
│   │   └── groq.js                 ← cliente Groq / Llama 3.1
│   ├── components/
│   │   ├── Icon.js                 ← ícones SVG inline (sem font loading)
│   │   ├── TabBar.js               ← navegação inferior com pill ativo
│   │   └── Toast.js                ← notificação animada
│   └── screens/
│       ├── HomeScreen.js           ← dashboard: KPIs, gráfico, alertas
│       ├── CompareScreen.js        ← comparador IA (+10 pts)
│       ├── ServiceScreen.js        ← registro de revisões (+50 pts)
│       └── ProfileScreen.js        ← badge, progresso, menu
```

---

## Badges e pontuação

| Pontos  | Badge              | Recompensa               |
|---------|--------------------|--------------------------|
| 0 – 49  | Piloto de Garagem  | Continue pontuando       |
| 50 – 99 | Analista Iniciante | Lavagem grátis           |
| 100–199 | Mecânico Digital   | 10% OFF revisão          |
| 200+    | Motor Expert       | 20% OFF + revisão grátis |

---

## Dependências

| Pacote                        | Versão   | Uso                          |
|-------------------------------|----------|------------------------------|
| expo                          | ~51.0.0  | runtime                      |
| react-native                  | 0.74.5   | framework                    |
| react-native-svg              | 15.2.0   | ícones SVG inline            |
| react-native-safe-area-context| 4.10.5   | safe areas (notch/home bar)  |
| react-native-screens          | ~3.31.1  | otimização de telas          |
