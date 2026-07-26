import fs from 'fs';
import path from 'path';
import { SYSTEM_PROMPT as BASE_PROMPT } from './systemPrompt';

// ─── EXISTING COUNSELING TOPIC MAPPINGS (root knowledge/) ───────────────────
// These files live in knowledge/ root (existing behaviour unchanged)
const COUNSELING_MAPPINGS = [
  {
    file: 'crisis.md',
    keywords: ['bunuh diri', 'suicide', 'sayat', 'iris', 'menyakiti diri', 'self harm', 'sh', 'akhiri hidup', 'gantung', 'racun', 'ingin mati'],
  },
  {
    file: 'safety.md',
    keywords: ['depresi berat', 'obat penenang', 'antidepresan', 'diagnosis', 'sakit jiwa', 'gila', 'halusinasi'],
  },
  {
    file: 'anxiety.md',
    keywords: ['cemas', 'khawatir', 'takut', 'gelisah', 'anxiety', 'panic', 'panik', 'deg-degan', 'was-was'],
  },
  {
    file: 'overthinking.md',
    keywords: ['overthink', 'mikir', 'pikiran berputar', 'berisik', 'ragu', 'kebisingan otak'],
  },
  {
    file: 'depression.md',
    keywords: ['hampa', 'nangis', 'air mata', 'lelah mental', 'hancur', 'kecewa berat', 'tidak ada energi'],
  },
  {
    file: 'self_esteem.md',
    keywords: ['percaya diri', 'minder', 'tidak berguna', 'gagal', 'bodoh', 'membandingkan diri', 'rasa rendah diri'],
  },
  {
    file: 'relationships.md',
    keywords: ['pacar', 'putus', 'selingkuh', 'cinta', 'mantan', 'suami', 'istri', 'hubungan', 'ditinggal', 'pdkt'],
  },
  {
    file: 'communication.md',
    keywords: ['bicara jujur', 'ngomong', 'komunikasi', 'asertif', 'mengatakan', 'salah paham', 'bicara baik-baik'],
  },
  {
    file: 'conflict_resolution.md',
    keywords: ['konflik', 'marah', 'berantem', 'ribut', 'debat', 'musuh', 'kesal', 'benci', 'bertengkar'],
  },
  {
    file: 'grief.md',
    keywords: ['meninggal', 'wafat', 'kehilangan orang', 'grief', 'berduka', 'rindu almarhum', 'tutup usia'],
  },
  {
    file: 'stress.md',
    keywords: ['stres', 'stress', 'kuliah', 'kerja', 'kantor', 'tugas menumpuk', 'deadline', 'pusing', 'burnout'],
  },
  {
    file: 'habits.md',
    keywords: ['kebiasaan', 'prokrastinasi', 'tunda', 'malas', 'fokus', 'belajar', 'disiplin', 'rutinitas', 'tindakan'],
  },
  {
    file: 'islam.md',
    keywords: ['islam', 'allah', 'tuhan', 'sholat', 'ibadah', 'hadits', 'quran', 'takdir', 'tawakal', 'sabar', 'dosa', 'spiritual', 'ustad', 'syukur'],
  },
];

// ─── KNOWLEDGE PACK TOPIC MAPPINGS (subfolders) ──────────────────────────────
// These files live in knowledge/<subfolder>/<file>.md
const KNOWLEDGE_PACK_MAPPINGS = [
  // Sports
  {
    file: 'sports/football.md',
    keywords: ['sepak bola', 'football', 'soccer', 'gol', 'liga', 'premier league', 'la liga', 'bundesliga', 'piala dunia', 'world cup', 'champions league', 'bola', 'timnas', 'striker', 'offside', 'penalty', 'messi', 'ronaldo'],
  },
  {
    file: 'sports/basketball.md',
    keywords: ['basket', 'basketball', 'nba', 'slam dunk', 'three pointer', 'dribble', 'rebound', 'free throw', 'point guard', 'lebron', 'curry', 'jordan', 'bola basket'],
  },
  {
    file: 'sports/formula1.md',
    keywords: ['formula 1', 'f1', 'formula one', 'grand prix', 'circuit', 'pit stop', 'pole position', 'lap time', 'verstappen', 'hamilton', 'ferrari', 'red bull', 'mercedes', 'balap mobil'],
  },
  {
    file: 'sports/motogp.md',
    keywords: ['motogp', 'moto gp', 'motogp race', 'marc marquez', 'valentino rossi', 'ducati', 'yamaha', 'honda', 'circuit motogp', 'balap motor', 'superbike'],
  },
  {
    file: 'sports/esports.md',
    keywords: ['esports', 'e-sports', 'gaming', 'mobile legends', 'valorant', 'dota', 'pubg', 'free fire', 'wild rift', 'pro player', 'tournament', 'mpl', 'worlds', 'gamer profesional'],
  },
  // Technology
  {
    file: 'technology/artificial-intelligence.md',
    keywords: ['artificial intelligence', 'kecerdasan buatan', 'machine learning', 'deep learning', 'neural network', 'chatgpt', 'openai', 'ai', 'llm', 'model bahasa', 'generative ai', 'model ai', 'robot cerdas'],
  },
  {
    file: 'technology/cybersecurity.md',
    keywords: ['cybersecurity', 'keamanan siber', 'hacker', 'phishing', 'malware', 'ransomware', 'virus', 'firewall', 'enkripsi', 'data breach', 'password', 'vpn', 'keamanan data'],
  },
  // Coding
  {
    file: 'coding/programming.md',
    keywords: ['programming', 'pemrograman', 'coding', 'kode', 'bahasa pemrograman', 'python', 'javascript', 'java', 'c++', 'algoritma', 'debug', 'variabel', 'fungsi', 'belajar coding', 'developer'],
  },
  {
    file: 'coding/web-development.md',
    keywords: ['web development', 'website', 'html', 'css', 'javascript', 'react', 'nextjs', 'vue', 'frontend', 'backend', 'fullstack', 'api', 'web app', 'ui', 'ux', 'ngoding web'],
  },
  {
    file: 'coding/mobile-development.md',
    keywords: ['mobile development', 'android', 'ios', 'aplikasi mobile', 'flutter', 'react native', 'kotlin', 'swift', 'app store', 'google play', 'buat aplikasi hp'],
  },
  // Science
  {
    file: 'science/science.md',
    keywords: ['sains', 'ilmu pengetahuan', 'fisika', 'kimia', 'biologi', 'riset', 'eksperimen', 'teori', 'hipotesis', 'science', 'ilmiah', 'penemuan'],
  },
  {
    file: 'science/astronomy.md',
    keywords: ['astronomi', 'luar angkasa', 'bintang', 'planet', 'galaksi', 'black hole', 'lubang hitam', 'tata surya', 'nasa', 'teleskop', 'antariksa', 'asteroid', 'komet', 'bulan', 'matahari'],
  },
  {
    file: 'science/mathematics.md',
    keywords: ['matematika', 'math', 'aljabar', 'geometri', 'kalkulus', 'statistik', 'rumus', 'persamaan', 'bilangan', 'hitung', 'trigonometri', 'pecahan'],
  },
  // Lifestyle
  {
    file: 'lifestyle/health.md',
    keywords: ['kesehatan', 'sehat', 'sakit', 'penyakit', 'dokter', 'obat', 'gejala', 'imun', 'tidur', 'istirahat', 'medis', 'rumah sakit', 'pola hidup sehat'],
  },
  {
    file: 'lifestyle/nutrition.md',
    keywords: ['nutrisi', 'gizi', 'kalori', 'protein', 'karbohidrat', 'lemak', 'vitamin', 'mineral', 'diet', 'makan sehat', 'makanan bergizi', 'suplemen'],
  },
  {
    file: 'lifestyle/fitness.md',
    keywords: ['fitness', 'olahraga', 'gym', 'latihan', 'workout', 'squat', 'push up', 'lari', 'cardio', 'otot', 'berat badan', 'diet olahraga', 'kebugaran'],
  },
  {
    file: 'lifestyle/travel.md',
    keywords: ['travel', 'wisata', 'liburan', 'destinasi', 'tiket', 'hotel', 'backpacker', 'itinerary', 'jalan-jalan', 'paspor', 'visa', 'touring', 'rekreasi'],
  },
  {
    file: 'lifestyle/cooking.md',
    keywords: ['memasak', 'masak', 'resep', 'bumbu', 'kuliner', 'masakan', 'bahan makanan', 'dapur', 'tumis', 'goreng', 'rebus', 'kue', 'camilan', 'makanan'],
  },
  {
    file: 'lifestyle/pets.md',
    keywords: ['hewan peliharaan', 'kucing', 'anjing', 'ikan hias', 'hamster', 'burung', 'peliharaan', 'adopsi hewan', 'vaksin hewan', 'pet', 'rawat hewan', 'grooming'],
  },
  // Finance
  {
    file: 'finance/finance.md',
    keywords: ['keuangan', 'finansial', 'tabungan', 'menabung', 'pengeluaran', 'pemasukan', 'anggaran', 'budgeting', 'utang', 'pinjaman', 'cicilan', 'uang', 'gaji'],
  },
  {
    file: 'finance/investing.md',
    keywords: ['investasi', 'invest', 'saham', 'reksa dana', 'obligasi', 'return', 'portofolio', 'dividen', 'bursa efek', 'idx', 'modal', 'aset', 'nilai investasi'],
  },
  {
    file: 'finance/cryptocurrency.md',
    keywords: ['kripto', 'crypto', 'cryptocurrency', 'bitcoin', 'ethereum', 'blockchain', 'altcoin', 'token', 'defi', 'nft', 'wallet kripto', 'exchange', 'trading kripto'],
  },
  // World
  {
    file: 'world/business.md',
    keywords: ['bisnis', 'usaha', 'perusahaan', 'produk', 'jasa', 'pelanggan', 'marketing', 'penjualan', 'brand', 'omzet', 'profit', 'strategi bisnis'],
  },
  {
    file: 'world/startup.md',
    keywords: ['startup', 'founder', 'co-founder', 'venture capital', 'seed funding', 'pitch deck', 'mvp', 'pivot', 'unicorn', 'tech startup', 'wirausaha', 'entrepreneur'],
  },
  {
    file: 'world/economics.md',
    keywords: ['ekonomi', 'inflasi', 'deflasi', 'gdp', 'pdb', 'resesi', 'pertumbuhan ekonomi', 'kebijakan moneter', 'bank sentral', 'pasar modal', 'ekspor', 'impor'],
  },
  {
    file: 'world/education.md',
    keywords: ['pendidikan', 'sekolah', 'kuliah', 'universitas', 'belajar', 'kurikulum', 'guru', 'dosen', 'beasiswa', 'nilai', 'ujian', 'skripsi', 'pendidikan indonesia'],
  },
  {
    file: 'world/geography.md',
    keywords: ['geografi', 'peta', 'benua', 'negara', 'ibu kota', 'lautan', 'pegunungan', 'iklim', 'batas wilayah', 'koordinat', 'topografi'],
  },
  {
    file: 'world/history.md',
    keywords: ['sejarah', 'perang dunia', 'revolusi', 'kerajaan', 'dinasti', 'penjajahan', 'kolonial', 'tokoh sejarah', 'peristiwa sejarah', 'peradaban', 'abad'],
  },
  {
    file: 'world/politics.md',
    keywords: ['politik', 'pemilu', 'presiden', 'partai', 'demokrasi', 'parlemen', 'dpr', 'kebijakan', 'pemerintah', 'legislatif', 'eksekutif', 'oposisi'],
  },
  {
    file: 'world/law.md',
    keywords: ['hukum', 'undang-undang', 'peraturan', 'pengadilan', 'hakim', 'jaksa', 'pengacara', 'pasal', 'pidana', 'perdata', 'konstitusi', 'hak', 'kewajiban'],
  },
  {
    file: 'world/environment.md',
    keywords: ['lingkungan', 'pemanasan global', 'perubahan iklim', 'emisi', 'karbon', 'daur ulang', 'sampah', 'polusi', 'deforestasi', 'energi terbarukan', 'ekosistem', 'go green'],
  },
  {
    file: 'world/indonesia.md',
    keywords: ['indonesia', 'nusantara', 'pancasila', 'bhinneka', 'jakarta', 'bali', 'jawa', 'sumatra', 'batik', 'wayang', 'gamelan', 'budaya indonesia', 'bahasa indonesia', 'sumpah pemuda'],
  },
  // Psychology & Philosophy
  {
    file: 'psychology/psychology.md',
    keywords: ['psikologi', 'perilaku', 'kognitif', 'emosi', 'mental', 'kepribadian', 'introvert', 'ekstrovert', 'trauma', 'psikologis', 'pikiran bawah sadar', 'motivasi'],
  },
  {
    file: 'psychology/relationships-general.md',
    keywords: ['pertemanan', 'teman', 'sahabat', 'keluarga', 'orang tua', 'saudara', 'sosial', 'hubungan pertemanan', 'toxic relationship', 'batas sehat', 'supportive'],
  },
  {
    file: 'psychology/philosophy.md',
    keywords: ['filsafat', 'filosofi', 'makna hidup', 'eksistensi', 'stoic', 'stoikisme', 'plato', 'aristoteles', 'nietzsche', 'moral', 'etika', 'kebenaran', 'hakikat'],
  },
  // Religion
  {
    file: 'religion/religion.md',
    keywords: ['agama', 'spiritualitas', 'kristen', 'katholik', 'hindu', 'buddha', 'konghucu', 'kepercayaan', 'tuhan', 'doa', 'meditasi', 'karma', 'reinkarnasi', 'gereja', 'vihara', 'pura'],
  },
  // Entertainment
  {
    file: 'entertainment/movies.md',
    keywords: ['film', 'movie', 'bioskop', 'sinema', 'sutradara', 'aktor', 'aktris', 'oscar', 'genre film', 'horror', 'action', 'romance', 'nonton', 'box office', 'series', 'netflix'],
  },
  {
    file: 'entertainment/anime.md',
    keywords: ['anime', 'manga', 'one piece', 'naruto', 'attack on titan', 'jujutsu', 'demon slayer', 'isekai', 'shonen', 'seinen', 'waifu', 'cosplay', 'otaku', 'crunchyroll'],
  },
  {
    file: 'entertainment/music.md',
    keywords: ['musik', 'lagu', 'genre musik', 'pop', 'rock', 'jazz', 'hip hop', 'rnb', 'kpop', 'k-pop', 'playlist', 'lirik', 'konser', 'musisi', 'band', 'spotify'],
  },
  {
    file: 'entertainment/books.md',
    keywords: ['buku', 'novel', 'literasi', 'membaca', 'penulis', 'fiksi', 'non-fiksi', 'perpustakaan', 'best seller', 'self-help book', 'e-book', 'biografi', 'memoir'],
  },
];

type TopicMapping = {
  file: string;
  keywords: string[];
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function readKnowledgeFile(relativePath: string): string {
  try {
    const filePath = path.join(process.cwd(), 'knowledge', relativePath);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8');
    }
  } catch (err) {
    console.error(`[Haven] Error reading knowledge file ${relativePath}:`, err);
  }
  return '';
}

/** Load all files from living/weekly/ automatically */
function loadLivingWeekly(): string {
  const weeklyDir = path.join(process.cwd(), 'knowledge', 'living', 'weekly');
  if (!fs.existsSync(weeklyDir)) return '';
  try {
    const files = fs.readdirSync(weeklyDir).filter(f => f.endsWith('.md'));
    const contents: string[] = [];
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(weeklyDir, file), 'utf-8');
        if (content.trim()) contents.push(content);
      } catch {
        // skip unreadable files
      }
    }
    return contents.join('\n\n');
  } catch (err) {
    console.error('[Haven] Error loading weekly knowledge:', err);
    return '';
  }
}

// ─── LATEST KNOWLEDGE MAPPINGS (knowledge/latest/) ───────────────────────────
// These files contain up-to-date facts about the world (2026).
// PRIORITY: latest/ is always loaded FIRST when matched, before category files.
const LATEST_MAPPINGS = [
  {
    file: 'latest/football-2026.md',
    keywords: [
      'piala dunia 2026', 'world cup 2026', 'fifa 2026', 'juara piala dunia', 'champion world cup',
      'piala dunia fifa', 'worldcup', 'world cup', 'piala dunia',
    ],
  },
  {
    file: 'latest/basketball-2026.md',
    keywords: [
      'nba 2026', 'nba finals 2026', 'juara nba', 'champion nba', 'nba champion',
      'nba season 2026', 'basketball 2026',
    ],
  },
  {
    file: 'latest/formula1-2026.md',
    keywords: [
      'f1 2026', 'formula 1 2026', 'formula one 2026', 'juara f1', 'champion f1',
      'grand prix 2026', 'verstappen 2026', 'hamilton 2026', 'norris 2026',
    ],
  },
  {
    file: 'latest/motogp-2026.md',
    keywords: [
      'motogp 2026', 'moto gp 2026', 'juara motogp', 'champion motogp',
      'bagnaia 2026', 'martin 2026', 'marquez 2026',
    ],
  },
  {
    file: 'latest/technology-2026.md',
    keywords: [
      'gpt-5', 'gpt5', 'claude 4', 'gemini 3', 'llama 4', 'grok 4', 'model ai terbaru',
      'ai terbaru', 'teknologi 2026', 'tech 2026', 'openai 2026', 'anthropic 2026',
    ],
  },
  {
    file: 'latest/gaming-2026.md',
    keywords: [
      'game 2026', 'esports 2026', 'gaming 2026', 'mpl 2026', 'worlds 2026',
      'vct 2026', 'mobile legends 2026', 'valorant 2026', 'gta vi',
    ],
  },
  {
    file: 'latest/movies-2026.md',
    keywords: [
      'film 2026', 'movie 2026', 'oscar 2026', 'academy awards 2026', 'box office 2026',
      'avengers secret wars', 'avatar 3', 'squid game season 3', 'anime 2026',
      'one piece 2026', 'chainsaw man 2', 'solo leveling 2',
    ],
  },
  {
    file: 'latest/economics-2026.md',
    keywords: [
      'ekonomi 2026', 'bitcoin 2026', 'crypto 2026', 'kripto 2026', 'saham 2026',
      'ihsg 2026', 'inflasi 2026', 'resesi 2026', 'the fed 2026', 'harga emas 2026',
    ],
  },
  {
    file: 'latest/indonesia-2026.md',
    keywords: [
      'indonesia 2026', 'prabowo 2026', 'ikn 2026', 'nusantara 2026',
      'timnas indonesia 2026', 'ekonomi indonesia 2026', 'presiden indonesia',
    ],
  },
];

function scoreMapping(mapping: TopicMapping, normalizedMsg: string): number {
  return mapping.keywords.filter(kw => normalizedMsg.includes(kw)).length;
}

function getMatchedExamples(matchedFiles: string[]): string {
  try {
    const examplesPath = path.join(process.cwd(), 'knowledge', 'examples', 'counseling_examples.md');
    if (!fs.existsSync(examplesPath)) return '';
    const content = fs.readFileSync(examplesPath, 'utf-8');
    const sections = content.split('\n## ');
    const matchedSections: string[] = [];
    const fileToSectionMap: Record<string, string> = {
      'overthinking.md': '1. Overthinking',
      'relationships.md': '2. Putus Cinta',
      'conflict_resolution.md': '3. Konflik Keluarga',
      'grief.md': '4. Kehilangan',
      'stress.md': '5. Burnout',
      'loneliness.md': '6. Kesepian',
      'self_esteem.md': '7. Krisis Identitas',
      'anxiety.md': '8. Kecemasan',
      'depression.md': '9. Rasa Bersalah',
      'habits.md': '10. Kehilangan Motivasi',
    };
    matchedFiles.forEach(file => {
      const sectionTitle = fileToSectionMap[file];
      if (sectionTitle) {
        const found = sections.find(s => s.toLowerCase().startsWith(sectionTitle.toLowerCase()));
        if (found) matchedSections.push(`## ${found}`);
      }
    });
    if (matchedSections.length > 0) {
      return `\n\n### CONTOH RESPONS DIALOG YANG RELEVAN:\n\n${matchedSections.join('\n')}`;
    }
  } catch (err) {
    console.error('[Haven] Error reading counseling examples:', err);
  }
  return '';
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export function getDynamicSystemPrompt(userMessage: string): string {
  const normalizedMsg = userMessage.toLowerCase();

  // ── PRIORITY 1: Latest knowledge (knowledge/latest/) ─────────────────────
  // Score-based: load top 2 latest files most relevant to the message
  const latestMatches = LATEST_MAPPINGS
    .map(mapping => ({ file: mapping.file, score: scoreMapping(mapping, normalizedMsg) }))
    .filter(m => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(m => m.file);

  // ── PRIORITY 2: Counseling topics (knowledge/ root) ──────────────────────
  const counselingMatches: string[] = [];
  COUNSELING_MAPPINGS.forEach(mapping => {
    const hasKeyword = mapping.keywords.some(kw => normalizedMsg.includes(kw));
    if (hasKeyword) counselingMatches.push(mapping.file);
  });

  // ── PRIORITY 3: Knowledge pack topics (subfolders) ───────────────────────
  // Take top 3 by score, but reduce to top 2 if latest already loaded to save tokens
  const maxPack = latestMatches.length > 0 ? 2 : 3;
  const knowledgePackMatches = KNOWLEDGE_PACK_MAPPINGS
    .map(mapping => ({ file: mapping.file, score: scoreMapping(mapping, normalizedMsg) }))
    .filter(m => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxPack)
    .map(m => m.file);

  // ── CORE: Always-included counseling guidelines ───────────────────────────
  const coreFiles = ['personality.md', 'response_style.md', 'counseling.md', 'active_listening.md', 'empathy.md'];
  let dynamicPrompt = `${BASE_PROMPT}\n\n`;
  dynamicPrompt += `--- \n\n## PANDUAN UTAMA KELAYAKAN KONSELI:\n`;
  coreFiles.forEach(file => {
    const content = readKnowledgeFile(file);
    if (content) dynamicPrompt += `\n${content}\n`;
  });

  // ── PRIORITY 1: Inject latest/ knowledge first ────────────────────────────
  if (latestMatches.length > 0) {
    dynamicPrompt += `\n\n--- \n\n## LATEST KNOWLEDGE — FAKTA TERKINI 2026 (PRIORITAS UTAMA):\n`;
    dynamicPrompt += `> INSTRUKSI: Gunakan data di bawah ini sebagai sumber utama jawaban. Data ini lebih akurat dari pengetahuan model.\n`;
    latestMatches.forEach(file => {
      const content = readKnowledgeFile(file);
      if (content) dynamicPrompt += `\n${content}\n`;
    });
  }

  // ── PRIORITY 2: Counseling modules ───────────────────────────────────────
  const finalCounseling = counselingMatches.slice(0, 3);
  if (finalCounseling.length > 0) {
    dynamicPrompt += `\n\n--- \n\n## MODUL KNOWLEDGE RELEVAN DENGAN TOPIK USER:\n`;
    finalCounseling.forEach(file => {
      const content = readKnowledgeFile(file);
      if (content) dynamicPrompt += `\n${content}\n`;
    });
    const examples = getMatchedExamples(finalCounseling);
    if (examples) dynamicPrompt += examples;
  }

  // ── PRIORITY 3: Knowledge pack (category subfolders) ─────────────────────
  if (knowledgePackMatches.length > 0) {
    dynamicPrompt += `\n\n--- \n\n## KNOWLEDGE PACK — KONTEKS TOPIK PERCAKAPAN:\n`;
    knowledgePackMatches.forEach(file => {
      const content = readKnowledgeFile(file);
      if (content) dynamicPrompt += `\n${content}\n`;
    });
  }

  // ── LIVING WEEKLY: Only if no latest file was matched ────────────────────
  if (latestMatches.length === 0) {
    const weeklyContent = loadLivingWeekly();
    if (weeklyContent) {
      dynamicPrompt += `\n\n--- \n\n## LIVING KNOWLEDGE — KONTEKS MINGGUAN:\n\n${weeklyContent}`;
    }
  }

  return dynamicPrompt.trim();
}
