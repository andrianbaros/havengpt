# Haven

A calm and private space to talk, reflect, and organize your thoughts.

[![Live Demo](https://img.shields.io/badge/Demo-Live-blue?style=flat-square)](https://havengpt.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## Live Demo

You can access the live application here: [https://havengpt.vercel.app/](https://havengpt.vercel.app/)

---

## About Haven

Haven is a clean, minimal, and private conversation space designed to help you process your thoughts, reflect on your feelings, and find new perspectives in a calm, non-judgmental environment. 

It is designed to serve as a companion for emotional expression and constructive conversation. Haven is **not** a replacement for professional therapy, counseling, clinical psychiatric treatment, or medical diagnosis. If you are experiencing a crisis or mental health emergency, please reach out to professional services or local emergency contact services.

---

## Features

- **Private by Default**: All chat history is saved directly on your local device.
- **Dual Theme Support**: Premium Royal Blue color scheme available in both Light and Dark modes.
- **Flicker-Free Load**: Native serverless script integrations prevent display flashes on initialization.
- **Responsive Layout**: Designed to work fluidly across desktop, tablet, and mobile browsers.
- **Dynamic Context Routing**: Seamlessly retrieves supportive communication frameworks matching the context of your conversation.
- **Warm & Objective Tone**: Programmed to practice active listening, validation, and cognitive reflection.

---

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS (v4)
- **State Management**: React Context & Hooks
- **Icons**: Lucide React
- **Markdown Rendering**: React Markdown with GFM support
- **Animation**: Framer Motion
- **Storage**: Browser LocalStorage

---

## Privacy

Your privacy is the central priority of this project.

- **Local Storage**: All conversation text, message sequences, and timestamps are saved locally inside your browser's `LocalStorage`.
- **No Permanent Servers**: Haven does not store or log your conversations on a permanent database.
- **Data Deletion**: Your chat history will be permanently lost if you clear your browser cache, delete site data, use Incognito/Private tabs, or switch to a different device.

---

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/andrianbaros/BotKasepChat.git
   cd BotKasepChat
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory. You can copy the template from `.env.example`:
```bash
cp .env.example .env
```

Define the API keys for the model providers:
```env
BYNARA_API_KEY=your_bynara_api_key
CEREBRAS_API_KEY=your_cerebras_api_key
```

### Running Locally

To run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

To compile a production build of the Next.js application:
```bash
npm run build
```

### Deployment

This project is configured to deploy directly to Vercel:
```bash
vercel
```

---

## Project Structure

```text
├── app/                  # Next.js App Router (pages and API routes)
│   ├── api/chat/         # Streaming chat API handler
│   ├── about/            # About page component
│   └── globals.css       # Design tokens & core typography overrides
├── components/           # Reusable UI React components (Sidebar, ChatArea, etc.)
├── context/              # React state providers (Theme, etc.)
├── knowledge/            # Markdown-based counselling knowledge documents
├── lib/                  # Utility services (dynamic system prompt, localStorage wrapper)
└── public/               # Static assets & brand icons
```

---

## Disclaimer

Haven is an experimental tool designed for conversational support and reflection. It does not provide medical, legal, or professional psychological services. If you are dealing with severe distress, trauma, or clinical symptoms, please contact qualified mental health professionals.

---

## Author

Developed by **Andrian Baros**

- **LinkedIn**: [Andrian Baros](https://www.linkedin.com/in/andrian-baros-99a208251/)

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
