import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { execSync } from 'child_process'

const commitDate = execSync('git log -1 --format=%cd --date=format:"%b \'%y"').toString().trim()

// https://vite.dev/config/
export default defineConfig({
  define: {
    __LAST_UPDATED__: JSON.stringify(commitDate)
  },
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
