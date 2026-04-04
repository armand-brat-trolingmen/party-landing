import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';

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

export function render(url: string): string {
  installServerGuards();

  return ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <AppRoutes />
    </StaticRouter>,
  );
}
