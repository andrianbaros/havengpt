import fs from 'fs';
import path from 'path';
import { SYSTEM_PROMPT as BASE_PROMPT } from './systemPrompt';

// Mapping topics to markdown files and their triggering keywords
const TOPIC_MAPPINGS = [
  {
    file: 'crisis.md',
    keywords: ['bunuh diri', 'suicide', 'sayat', 'iris', 'menyakiti diri', 'self harm', 'sh', 'akhiri hidup', 'gantung', 'racun', 'ingin mati']
  },
  {
    file: 'safety.md',
    keywords: ['depresi berat', 'obat penenang', 'antidepresan', 'diagnosis', 'sakit jiwa', 'gila', 'halusinasi']
  },
  {
    file: 'anxiety.md',
    keywords: ['cemas', 'khawatir', 'takut', 'gelisah', 'anxiety', 'panic', 'panik', 'deg-degan', 'was-was']
  },
  {
    file: 'overthinking.md',
    keywords: ['overthink', 'mikir', 'pikiran berputar', 'berisik', 'ragu', 'kebisingan otak']
  },
  {
    file: 'depression.md',
    keywords: ['hampa', 'nangis', 'air mata', 'lelah mental', 'hancur', 'kecewa berat', 'tidak ada energi']
  },
  {
    file: 'self_esteem.md',
    keywords: ['percaya diri', 'minder', 'tidak berguna', 'gagal', 'bodoh', 'membandingkan diri', 'rasa rendah diri']
  },
  {
    file: 'relationships.md',
    keywords: ['pacar', 'putus', 'selingkuh', 'cinta', 'mantan', 'suami', 'istri', 'hubungan', 'ditinggal', 'pdkt']
  },
  {
    file: 'communication.md',
    keywords: ['bicara jujur', 'ngomong', 'komunikasi', 'asertif', 'mengatakan', 'salah paham', 'bicara baik-baik']
  },
  {
    file: 'conflict_resolution.md',
    keywords: ['konflik', 'marah', 'berantem', 'ribut', 'debat', 'musuh', 'kesal', 'benci', 'bertengkar']
  },
  {
    file: 'grief.md',
    keywords: ['meninggal', 'wafat', 'kehilangan orang', 'grief', 'berduka', 'rindu almarhum', 'tutup usia']
  },
  {
    file: 'stress.md',
    keywords: ['stres', 'stress', 'kuliah', 'kerja', 'kantor', 'tugas menumpuk', 'deadline', 'pusing', 'burnout']
  },
  {
    file: 'habits.md',
    keywords: ['kebiasaan', 'prokrastinasi', 'tunda', 'malas', 'fokus', 'belajar', 'disiplin', 'rutinitas', 'tindakan']
  },
  {
    file: 'islam.md',
    keywords: ['islam', 'allah', 'tuhan', 'sholat', 'ibadah', 'hadits', 'quran', 'takdir', 'tawakal', 'sabar', 'dosa', 'spiritual', 'ustad', 'syukur']
  }
];

// Helper to read markdown file securely
function readKnowledgeFile(fileName: string): string {
  try {
    const filePath = path.join(process.cwd(), 'knowledge', fileName);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8');
    }
  } catch (err) {
    console.error(`[KasepGPT] Error reading knowledge file ${fileName}:`, err);
  }
  return '';
}

// Helper to extract examples based on matched topics
function getMatchedExamples(matchedFiles: string[]): string {
  try {
    const examplesPath = path.join(process.cwd(), 'knowledge', 'examples', 'counseling_examples.md');
    if (!fs.existsSync(examplesPath)) return '';
    const content = fs.readFileSync(examplesPath, 'utf-8');

    // Split examples by section header (##)
    const sections = content.split('\n## ');
    const matchedSections: string[] = [];

    // Map files to matches
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
      'habits.md': '10. Kehilangan Motivasi'
    };

    matchedFiles.forEach(file => {
      const sectionTitle = fileToSectionMap[file];
      if (sectionTitle) {
        const found = sections.find(s => s.toLowerCase().startsWith(sectionTitle.toLowerCase()));
        if (found) {
          matchedSections.push(`## ${found}`);
        }
      }
    });

    if (matchedSections.length > 0) {
      return `\n\n### CONTOH RESPONS DIALOG YANG RELEVAN:\n\n${matchedSections.join('\n')}`;
    }
  } catch (err) {
    console.error('[KasepGPT] Error reading counseling examples:', err);
  }
  return '';
}

export function getDynamicSystemPrompt(userMessage: string): string {
  const normalizedMsg = userMessage.toLowerCase();
  const matchedFiles: string[] = [];

  // 1. Topic Routing
  TOPIC_MAPPINGS.forEach(mapping => {
    const hasKeyword = mapping.keywords.some(keyword => normalizedMsg.includes(keyword));
    if (hasKeyword) {
      matchedFiles.push(mapping.file);
    }
  });

  // Always load global guidelines
  const coreFiles = [
    'personality.md',
    'response_style.md',
    'counseling.md',
    'active_listening.md',
    'empathy.md'
  ];

  // 2. Load core modules
  let dynamicPrompt = `${BASE_PROMPT}\n\n`;
  dynamicPrompt += `--- \n\n## PANDUAN UTAMA KELAYAKAN KONSELI:\n`;
  coreFiles.forEach(file => {
    const content = readKnowledgeFile(file);
    if (content) {
      dynamicPrompt += `\n${content}\n`;
    }
  });

  // 3. Load dynamic matched modules (Max 3 to keep prompt token size optimal)
  const finalMatches = matchedFiles.slice(0, 3);
  if (finalMatches.length > 0) {
    dynamicPrompt += `\n\n--- \n\n## MODUL KNOWLEDGE RELEVAN DENGAN TOPIK USER:\n`;
    finalMatches.forEach(file => {
      const content = readKnowledgeFile(file);
      if (content) {
        dynamicPrompt += `\n${content}\n`;
      }
    });

    // 4. Load matching conversation examples
    const examples = getMatchedExamples(finalMatches);
    if (examples) {
      dynamicPrompt += examples;
    }
  }

  return dynamicPrompt.trim();
}
