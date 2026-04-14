import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

function lovableSsgPostbuildPlugin() {
  return {
    name: 'lovable-ssg-postbuild',
    apply: 'build' as const,
    closeBundle() {
      const projectRoot = __dirname;
      const prerenderScript = resolve(projectRoot, 'prerender.js');

      execFileSync(process.execPath, [prerenderScript], {
        cwd: projectRoot,
        env: {
          ...process.env,
          LOVABLE_SSG: 'true',
        },
        stdio: 'inherit',
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), lovableSsgPostbuildPlugin()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:8787',
          changeOrigin: true,
        },
      },
    },
  };
});
