import type { LegalDocument, LegalDocumentBlock, LegalDocumentSection } from './types';
import { legalRawDocuments } from './legalRaw';

type LegalDocumentConfig = Pick<LegalDocument, 'path' | 'title' | 'seoTitle' | 'description'> & {
  raw: string;
};

const CHAT_EXPORT_PREFIX = /^\[\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2}\]\s*[^:]+:\s*/u;
const TOP_LEVEL_SECTION_PATTERN = /^\d+\.\s+/u;
const CLAUSE_PATTERN = /^\d+(?:\.\d+)+\.?/u;
const BULLET_PATTERN = /^[■●•▪-]\s*/u;
const SPACED_URL_PATTERN = /h\s*t\s*t\s*p\s*s?\s*:\s*\/\s*\/\s*[-a-z0-9./\s]+/giu;

function normalizeInlineText(value: string) {
  return value
    .replace(SPACED_URL_PATTERN, (match) => match.replace(/\s+/g, ''))
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim();
}

function cleanRawLines(raw: string) {
  return raw
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.replace(CHAT_EXPORT_PREFIX, '').trim())
    .filter((line, index, lines) => {
      if (line.length > 0) {
        return true;
      }

      const previous = lines[index - 1];
      return previous !== '';
    });
}

function createBlocks(raw: string) {
  const blocks: string[][] = [];
  let currentBlock: string[] = [];

  cleanRawLines(raw).forEach((line) => {
    if (!line) {
      if (currentBlock.length > 0) {
        blocks.push(currentBlock);
        currentBlock = [];
      }
      return;
    }

    currentBlock.push(line);
  });

  if (currentBlock.length > 0) {
    blocks.push(currentBlock);
  }

  return blocks;
}

function isTopLevelSectionHeading(line: string) {
  return TOP_LEVEL_SECTION_PATTERN.test(line) && !CLAUSE_PATTERN.test(line);
}

function isBulletLine(line: string) {
  return BULLET_PATTERN.test(line);
}

function toListItem(line: string) {
  return normalizeInlineText(line.replace(BULLET_PATTERN, ''));
}

function toParagraph(lines: string[]) {
  return {
    kind: 'paragraph',
    text: normalizeInlineText(lines.join(' ')),
  } as const satisfies LegalDocumentBlock;
}

function createContentBlocks(lines: string[]) {
  if (lines.length === 0) {
    return [];
  }

  if (lines.every(isBulletLine)) {
    return [
      {
        kind: 'list',
        style: 'unordered',
        items: lines.map(toListItem),
      } as const satisfies LegalDocumentBlock,
    ];
  }

  const [firstLine, ...restLines] = lines;
  const canTurnIntoList =
    restLines.length > 0 && firstLine.endsWith(':') && restLines.every((line) => !isTopLevelSectionHeading(line) && !CLAUSE_PATTERN.test(line));

  if (canTurnIntoList) {
    return [
      toParagraph([firstLine]),
      {
        kind: 'list',
        style: 'unordered',
        items: restLines.map(toListItem),
      } as const satisfies LegalDocumentBlock,
    ];
  }

  return [toParagraph(lines)];
}

function buildLegalDocument(config: LegalDocumentConfig): LegalDocument {
  const normalizedRaw =
    config.path.replace(/\/+$/, '') === '/privacy' ? config.raw.replace('г. Москва 2025 г.', 'г. Москва 2026 г.') : config.raw;
  const blocks = createBlocks(normalizedRaw);
  const intro: LegalDocumentBlock[] = [];
  const sections: LegalDocumentSection[] = [];
  let currentSection: LegalDocumentSection | null = null;
  const normalizedTitle = normalizeInlineText(config.title).toLowerCase();

  blocks.forEach((block, index) => {
    let currentBlock = block;
    const normalizedFirstLine = normalizeInlineText(currentBlock[0]).toLowerCase();

    if (index === 0 && (normalizedFirstLine === normalizedTitle || normalizedFirstLine.startsWith(normalizedTitle))) {
      currentBlock = currentBlock.slice(1);
    }

    if (currentBlock.length === 0) {
      return;
    }

    const firstLine = currentBlock[0];

    if (isTopLevelSectionHeading(firstLine)) {
      currentSection = {
        title: normalizeInlineText(firstLine),
        blocks: [],
      };
      sections.push(currentSection);

      const contentLines = currentBlock.slice(1);

      if (contentLines.length > 0) {
        currentSection.blocks.push(...createContentBlocks(contentLines));
      }

      return;
    }

    const target = currentSection ? currentSection.blocks : intro;
    target.push(...createContentBlocks(currentBlock));
  });

  return {
    path: config.path,
    title: config.title,
    seoTitle: config.seoTitle,
    description: config.description,
    intro,
    sections,
  };
}

export const legalDocuments = {
  privacy: buildLegalDocument({
    path: '/privacy/',
    title: 'Политика конфиденциальности',
    seoTitle: 'Политика конфиденциальности | Праздник каждый день',
    description:
      'Политика конфиденциальности сайта Праздник каждый день: обработка персональных данных, цели сбора информации и права пользователей.',
    raw: legalRawDocuments.privacy,
  }),
  offer: buildLegalDocument({
    path: '/offer/',
    title: 'Договор-оферта',
    seoTitle: 'Договор-оферта | Праздник каждый день',
    description:
      'Договор-оферта Праздник каждый день на оказание услуг по проведению мероприятий: порядок заказа, оплаты, отмены и ответственность сторон.',
    raw: legalRawDocuments.offer,
  }),
  cookies: buildLegalDocument({
    path: '/cookies/',
    title: 'Политика использования cookie',
    seoTitle: 'Политика использования cookie | Праздник каждый день',
    description:
      'Политика использования cookie-файлов сайта Праздник каждый день: категории cookie, цели использования и способы отказа.',
    raw: legalRawDocuments.cookies,
  }),
} as const satisfies Record<'privacy' | 'offer' | 'cookies', LegalDocument>;
