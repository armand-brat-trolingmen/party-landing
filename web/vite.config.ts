import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function lovableSsgPostbuildPlugin() {
  return {
    name: 'lovable-ssg-postbuild',
    apply: 'build' as const,
    closeBundle() {
      const projectRoot = __dirname
      const prerenderScript = resolve(projectRoot, 'prerender.js')

      execFileSync(process.execPath, [prerenderScript], {
        cwd: projectRoot,
        env: {
          ...process.env,
          LOVABLE_SSG: 'true',
        },
        stdio: 'inherit',
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), lovableSsgPostbuildPlugin()],
})
