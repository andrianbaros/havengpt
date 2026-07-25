# KasepGPT

AI Assistant yang cepat, cerdas, dan responsif — dibuat oleh **Andrian Baros**.

Built with Next.js 16, React 19, dan TailwindCSS v4. Menggunakan Bynara sebagai provider utama dan Cerebras sebagai fallback otomatis.

---

## Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **Primary LLM**: [Bynara](https://bynara.id) (agnes-2.0-flash, mistral-large, mistral-medium-3-5)
- **Fallback LLM**: [Cerebras](https://cloud.cerebras.ai) (gpt-oss-120b)
- **Streaming**: Server-Sent Events via Next.js API Route

---

## Deploy ke Vercel

### 1. Push ke GitHub

```bash
git add .
git commit -m "feat: ready for production"
git push
```

### 2. Import ke Vercel

Buka [vercel.com/new](https://vercel.com/new) → Import repository ini.

### 3. Set Environment Variables

Di Vercel Dashboard → Settings → Environment Variables, tambahkan:

| Variable | Value |
|---|---|
| `BYNARA_API_KEY` | API key dari bynara.id |
| `CEREBRAS_API_KEY` | API key dari cloud.cerebras.ai |

### 4. Deploy

Klik **Deploy**. Vercel akan otomatis build dan deploy.

---

## Development Lokal

```bash
# Clone dan install
git clone https://github.com/username/BotKasepChat.git
cd BotKasepChat
npm install

# Salin env
cp .env.example .env.local
# Isi API keys di .env.local

# Jalankan dev server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

---

## Fitur

- Streaming response real-time
- Multi-model: ganti model langsung dari header
- Auto-failover: jika provider utama gagal, otomatis beralih ke fallback
- Chat history tersimpan di localStorage (tidak ada backend database)
- Markdown rendering: code blocks, tables, lists, inline code
- Syntax highlighting untuk JS, TS, Python, HTML, CSS, SQL, Bash
- Settings: temperature, max tokens
- Responsive: desktop, tablet, mobile

---

## Lisensi

MIT — Dibuat oleh [Andrian Baros](https://github.com/andrianbaros).
