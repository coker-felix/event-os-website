import { defineConfig, loadEnv } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig(({ mode }) => {
  // Invented data (see src/lib/mocks.ts) is a build-time switch: on while
  // developing and testing, off in a production build unless explicitly
  // enabled. As a literal, the bundler can drop all the mock code when off.
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const mocks = mode !== 'production' || env.VITE_ENABLE_MOCKS === 'true'
  return {
    resolve: { tsconfigPaths: true },
    define: { __MOCKS_ENABLED__: JSON.stringify(mocks) },
    plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact()],
  }
})

export default config
