import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';

type StorageRecord = Record<string, string>;

function createMemoryStorage(): Storage {
  let store: StorageRecord = {};

  return {
    get length() {
      return Object.keys(store).length;
    },
    clear() {
      store = {};
    },
    getItem(key: string) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    key(index: number) {
      return Object.keys(store)[index] ?? null;
    },
    removeItem(key: string) {
      delete store[key];
    },
    setItem(key: string, value: string) {
      store[key] = String(value);
    },
  };
}

function installServerGuards() {
  const target = globalThis as typeof globalThis & {
    document?: Document;
    localStorage?: Storage;
    sessionStorage?: Storage;
    window?: Window;
  };

  if (typeof target.window === 'undefined') {
    Object.defineProperty(target, 'window', {
      configurable: true,
      value: undefined,
      writable: true,
    });
  }

  if (typeof target.document === 'undefined') {
    Object.defineProperty(target, 'document', {
      configurable: true,
      value: undefined,
      writable: true,
    });
  }

  if (typeof target.localStorage === 'undefined') {
    Object.defineProperty(target, 'localStorage', {
      configurable: true,
      value: createMemoryStorage(),
      writable: true,
    });
  }

  if (typeof target.sessionStorage === 'undefined') {
    Object.defineProperty(target, 'sessionStorage', {
      configurable: true,
      value: createMemoryStorage(),
      writable: true,
    });
  }
}

installServerGuards();

const { AppRoutes } = await import('./AppRoutes');

type HelmetStrings = {
  title: string;
  meta: string;
  link: string;
  script: string;
  htmlAttributes: string;
  bodyAttributes: string;
};

type RenderResult = {
  appHtml: string;
  helmet: HelmetStrings;
};

type HelmetContextShape = {
  helmet?: HelmetServerState | null;
};

function extractTagGroup(
  source: string,
  tagName: 'title' | 'meta' | 'link' | 'script' | 'htmlAttributes' | 'bodyAttributes',
) {
  if (tagName === 'htmlAttributes' || tagName === 'bodyAttributes') {
    return '';
  }

  const tagPattern =
    tagName === 'title'
      ? /<title\b[\s\S]*?<\/title>/gi
      : tagName === 'script'
        ? /<script\b[\s\S]*?<\/script>/gi
        : new RegExp(`<${tagName}\\b[\\s\\S]*?/>`, 'gi');

  return source.match(tagPattern)?.join('') ?? '';
}

function extractHoistedHeadHtml(renderedHtml: string) {
  let remaining = renderedHtml.trimStart();
  const headParts: string[] = [];
  const hoistedTagPattern =
    /^(<(?:title|meta|link|style|base)\b[\s\S]*?(?:<\/(?:title|style)>|\/>))/i;

  while (true) {
    const match = remaining.match(hoistedTagPattern);
    if (!match) {
      break;
    }

    headParts.push(match[1]);
    remaining = remaining.slice(match[1].length).trimStart();
  }

  return {
    headHtml: headParts.join(''),
    bodyHtml: remaining,
  };
}

function toHelmetStrings(helmet: HelmetServerState | null | undefined, hoistedHeadHtml: string): HelmetStrings {
  const title = helmet?.title?.toString() || extractTagGroup(hoistedHeadHtml, 'title');
  const meta = helmet?.meta?.toString() || extractTagGroup(hoistedHeadHtml, 'meta');
  const link = helmet?.link?.toString() || extractTagGroup(hoistedHeadHtml, 'link');
  const script = helmet?.script?.toString() || extractTagGroup(hoistedHeadHtml, 'script');

  return {
    title,
    meta,
    link,
    script,
    htmlAttributes: helmet?.htmlAttributes?.toString() ?? '',
    bodyAttributes: helmet?.bodyAttributes?.toString() ?? '',
  };
}

export function render(url: string): RenderResult {
  installServerGuards();
  const helmetContext: HelmetContextShape = {};

  const renderedHtml = ReactDOMServer.renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </HelmetProvider>,
  );

  const { headHtml, bodyHtml } = extractHoistedHeadHtml(renderedHtml);
  const helmet = toHelmetStrings(helmetContext.helmet, headHtml);

  return {
    appHtml: bodyHtml,
    helmet,
  };
}
