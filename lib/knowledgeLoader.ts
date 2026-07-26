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

  // 1. Match counseling topics (root files)
  const counselingMatches: string[] = [];
  COUNSELING_MAPPINGS.forEach(mapping => {
    const hasKeyword = mapping.keywords.some(kw => normalizedMsg.includes(kw));
    if (hasKeyword) counselingMatches.push(mapping.file);
  });

  // 2. Score & match knowledge pack topics (subfolders) — take top 3 by score
  const knowledgePackMatches = KNOWLEDGE_PACK_MAPPINGS
    .map(mapping => ({ file: mapping.file, score: scoreMapping(mapping, normalizedMsg) }))
    .filter(m => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(m => m.file);

  // 3. Load core counseling modules (always included)
  const coreFiles = ['personality.md', 'response_style.md', 'counseling.md', 'active_listening.md', 'empathy.md'];
  let dynamicPrompt = `${BASE_PROMPT}\n\n`;
  dynamicPrompt += `--- \n\n## PANDUAN UTAMA KELAYAKAN KONSELI:\n`;
  coreFiles.forEach(file => {
    const content = readKnowledgeFile(file);
    if (content) dynamicPrompt += `\n${content}\n`;
  });

  // 4. Load matched counseling modules (max 3)
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

  // 5. Load matched knowledge pack modules (max 3 by score)
  if (knowledgePackMatches.length > 0) {
    dynamicPrompt += `\n\n--- \n\n## KNOWLEDGE PACK — KONTEKS TOPIK PERCAKAPAN:\n`;
    knowledgePackMatches.forEach(file => {
      const content = readKnowledgeFile(file);
      if (content) dynamicPrompt += `\n${content}\n`;
    });
  }

  // 6. Append living/weekly context (always appended if files exist, lightweight)
  const weeklyContent = loadLivingWeekly();
  if (weeklyContent) {
    dynamicPrompt += `\n\n--- \n\n## LIVING KNOWLEDGE — KONTEKS MINGGUAN:\n\n${weeklyContent}`;
  }

  return dynamicPrompt.trim();
}
